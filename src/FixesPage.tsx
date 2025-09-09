import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

interface FixesPageProps {
  onNavigateHome: () => void;
}

type Difficulty = "Easy Fix" | "Medium Fix" | "Hard Fix";
type Channel = "Landing Page" | "Paid Ads" | "Email" | "Marketing";
type Progress = "Pending" | "In Progress" | "Done";

interface Fix {
  id: number;
  difficulty: Difficulty;
  channel: Channel;
  problem: string;
  solution: string;
  example: string;
  progress: Progress;
}

const fixes: Fix[] = [
  // Easy Fixes (1-34)
  { id: 1, difficulty: "Easy Fix", channel: "Landing Page", problem: "Hero headline lacks a clear promise", solution: "Rewrite the H1 to state a single, specific benefit and outcome. Keep it under ~12 words and pair it with 1 action-focused CTA.", example: "Change 'Quality skincare' to 'Clearer skin in 14 days. Start your plan.'", progress: "Pending" },
  { id: 2, difficulty: "Easy Fix", channel: "Landing Page", problem: "No primary CTA above the fold", solution: "Place one high-contrast button near the H1 and make it sticky on mobile. Remove competing CTAs in the hero.", example: "Add 'Shop Best Sellers' button next to the headline and hide secondary links on mobile.", progress: "Pending" },
  { id: 3, difficulty: "Easy Fix", channel: "Landing Page", problem: "Crowded hero with sliders and multiple messages", solution: "Remove carousels and keep a single static hero. Use one image that shows the product outcome.", example: "Replace a 3-slide carousel with one lifestyle shot that matches the ad promise.", progress: "Pending" },
  { id: 4, difficulty: "Easy Fix", channel: "Landing Page", problem: "Complex navigation confuses visitors", solution: "Simplify your main menu to 5-7 categories maximum. Use clear, descriptive labels and organize products logically by customer intent.", example: "Change 'Apparel & Accessories' to 'Men's Clothing' and 'Women's Clothing'", progress: "Pending" },
  { id: 5, difficulty: "Easy Fix", channel: "Landing Page", problem: "Missing or weak call-to-action buttons", solution: "Use action-oriented text like 'Get Yours Now' or 'Start Saving Today' instead of generic 'Submit'. Make buttons stand out with contrasting colors.", example: "Change 'Learn More' to 'Get 50% Off Today' with bright orange button", progress: "Pending" },
  { id: 6, difficulty: "Easy Fix", channel: "Landing Page", problem: "No clear value proposition on homepage", solution: "Add a compelling headline that clearly states what you sell and the main benefit. Place it above the fold where visitors see it immediately.", example: "'Get Professional Photos in 24 Hours - No Studio Required'", progress: "Pending" },
  { id: 7, difficulty: "Easy Fix", channel: "Landing Page", problem: "Missing contact information reduces trust", solution: "Display phone number, email, and physical address in header or footer. Add 'Contact Us' page with multiple ways to reach you.", example: "Add '📞 1-800-HELP-NOW' in top navigation bar", progress: "Pending" },
  { id: 8, difficulty: "Easy Fix", channel: "Landing Page", problem: "Poor mobile experience", solution: "Ensure all buttons are thumb-friendly (44px minimum), text is readable without zooming, and forms work smoothly on mobile devices.", example: "Increase 'Buy Now' button size from 32px to 48px height on mobile", progress: "Pending" },
  { id: 9, difficulty: "Easy Fix", channel: "Landing Page", problem: "No urgency or scarcity messaging", solution: "Add time-limited offers, stock counters, or deadline messaging to create urgency without being pushy.", example: "'Only 3 left in stock' or '48-hour flash sale ends soon'", progress: "Pending" },
  { id: 10, difficulty: "Easy Fix", channel: "Landing Page", problem: "Unclear return policy", solution: "Prominently display your return policy and guarantee. Make it easy to find and understand to reduce purchase anxiety.", example: "'30-day money-back guarantee - no questions asked'", progress: "Pending" },
  { id: 11, difficulty: "Easy Fix", channel: "Paid Ads", problem: "Ad copy doesn't match landing page", solution: "Ensure your ad headline and key messaging appear on the landing page. Maintain consistent tone, offers, and visual elements.", example: "If ad says '50% off winter coats', landing page headline should mention the same offer", progress: "Pending" },
  { id: 12, difficulty: "Easy Fix", channel: "Paid Ads", problem: "Generic ad headlines don't stand out", solution: "Use specific numbers, benefits, and emotional triggers. Test different angles like savings, convenience, or status.", example: "Change 'Great Shoes' to 'Comfortable Shoes That Don't Hurt After 12 Hours'", progress: "Pending" },
  { id: 13, difficulty: "Easy Fix", channel: "Paid Ads", problem: "No clear call-to-action in ads", solution: "Include specific action words and create urgency. Tell people exactly what to do next.", example: "'Shop Now - Free Shipping Ends Tonight' instead of 'Learn More'", progress: "Pending" },
  { id: 14, difficulty: "Easy Fix", channel: "Paid Ads", problem: "Not using ad extensions", solution: "Add sitelink extensions, callout extensions, and structured snippets to take up more space and provide more information.", example: "Add sitelinks for 'Free Shipping', 'Size Guide', 'Reviews' below main ad", progress: "Pending" },
  { id: 15, difficulty: "Easy Fix", channel: "Paid Ads", problem: "Poor quality images in visual ads", solution: "Use high-resolution, well-lit product photos with clean backgrounds. Show products in use when possible.", example: "Replace white background product shot with lifestyle image of person wearing the item", progress: "Pending" },
  { id: 16, difficulty: "Easy Fix", channel: "Email", problem: "Generic subject lines get ignored", solution: "Personalize subject lines with names, locations, or past purchases. Create curiosity and urgency.", example: "'Sarah, your cart is about to expire' instead of 'Complete your purchase'", progress: "Pending" },
  { id: 17, difficulty: "Easy Fix", channel: "Email", problem: "No welcome email series", solution: "Set up automated welcome emails introducing your brand, sharing your story, and providing value immediately after signup.", example: "Send 3-email series: Welcome + discount, Brand story, Best sellers", progress: "Pending" },
  { id: 18, difficulty: "Easy Fix", channel: "Email", problem: "Emails not mobile-optimized", solution: "Use single-column layouts, large buttons (44px+), and readable font sizes (16px+) for mobile devices.", example: "Stack product images vertically instead of side-by-side on mobile", progress: "Pending" },
  { id: 19, difficulty: "Easy Fix", channel: "Email", problem: "No clear unsubscribe option", solution: "Make unsubscribe link easy to find in footer. Consider offering frequency options instead of complete removal.", example: "Add 'Update preferences' link next to unsubscribe option", progress: "Pending" },
  { id: 20, difficulty: "Easy Fix", channel: "Email", problem: "Boring email design", solution: "Use your brand colors, include product images, and create visual hierarchy with headers and spacing.", example: "Add colorful header with logo and use product photos instead of text-only descriptions", progress: "Pending" },
  { id: 21, difficulty: "Easy Fix", channel: "Marketing", problem: "No social media presence", solution: "Create business profiles on platforms where your customers spend time. Post regularly and engage with followers.", example: "Set up Instagram business account and post 3 times per week", progress: "Pending" },
  { id: 22, difficulty: "Easy Fix", channel: "Marketing", problem: "Not collecting email addresses", solution: "Add email signup forms with incentives like discounts or free guides. Place them strategically throughout your site.", example: "Offer '10% off first order' popup after 30 seconds on site", progress: "Pending" },
  { id: 23, difficulty: "Easy Fix", channel: "Marketing", problem: "No customer testimonials", solution: "Reach out to happy customers for reviews and testimonials. Offer small incentives for detailed feedback.", example: "Email recent buyers: 'Share a photo for 15% off your next order'", progress: "Pending" },
  { id: 24, difficulty: "Easy Fix", channel: "Marketing", problem: "Missing Google My Business listing", solution: "Claim and optimize your Google My Business profile with photos, hours, and customer reviews.", example: "Add 10 high-quality photos of your products and storefront", progress: "Pending" },
  { id: 25, difficulty: "Easy Fix", channel: "Marketing", problem: "No referral program", solution: "Create simple referral system where customers get rewards for bringing friends. Make sharing easy.", example: "'Give $10, Get $10' - friends get discount, referrer gets store credit", progress: "Pending" },
  { id: 26, difficulty: "Easy Fix", channel: "Landing Page", problem: "Checkout process too long", solution: "Reduce checkout to 2-3 steps maximum. Remove unnecessary form fields and offer guest checkout option.", example: "Combine shipping and payment into one page instead of separate steps", progress: "Pending" },
  { id: 27, difficulty: "Easy Fix", channel: "Landing Page", problem: "No product videos", solution: "Add short videos showing products in use. Even simple phone videos can increase conversions significantly.", example: "30-second video showing how easy it is to assemble your furniture", progress: "Pending" },
  { id: 28, difficulty: "Easy Fix", channel: "Landing Page", problem: "Weak product descriptions", solution: "Focus on benefits over features. Explain how the product solves problems or improves the customer's life.", example: "Instead of '100% cotton', write 'Stays soft and comfortable all day long'", progress: "Pending" },
  { id: 29, difficulty: "Easy Fix", channel: "Landing Page", problem: "No size guides or specifications", solution: "Provide detailed size charts, dimensions, and specifications to reduce returns and increase confidence.", example: "Add interactive size guide with 'Find My Size' tool", progress: "Pending" },
  { id: 30, difficulty: "Easy Fix", channel: "Landing Page", problem: "Hidden shipping costs", solution: "Display shipping costs upfront or offer free shipping threshold. Surprise costs cause cart abandonment.", example: "'Free shipping on orders over $50' prominently displayed", progress: "Pending" },
  { id: 31, difficulty: "Easy Fix", channel: "Paid Ads", problem: "Not tracking conversions properly", solution: "Set up conversion tracking for purchases, email signups, and other key actions. Use this data to optimize campaigns.", example: "Install Facebook Pixel and Google Analytics conversion tracking", progress: "Pending" },
  { id: 32, difficulty: "Easy Fix", channel: "Email", problem: "No abandoned cart emails", solution: "Set up automated emails to recover abandoned carts. Send 2-3 emails over a week with different approaches.", example: "Email 1: Reminder, Email 2: Social proof, Email 3: Discount offer", progress: "Pending" },
  { id: 33, difficulty: "Easy Fix", channel: "Marketing", problem: "Not asking for reviews", solution: "Follow up with customers after purchase to request reviews. Make the process simple with direct links.", example: "Send email 7 days after delivery: 'How did we do? Leave a review'", progress: "Pending" },
  { id: 34, difficulty: "Easy Fix", channel: "Landing Page", problem: "No FAQ section", solution: "Create comprehensive FAQ addressing common concerns about shipping, returns, sizing, and product details.", example: "Add expandable FAQ section covering top 10 customer questions", progress: "Pending" },

  // Medium Fixes (35-67)
  { id: 35, difficulty: "Medium Fix", channel: "Landing Page", problem: "No exit-intent popups to capture leaving visitors", solution: "Implement exit-intent technology to show targeted offers when users are about to leave. Test different offers like discounts, free shipping, or lead magnets.", example: "Show '10% off + free shipping' popup when mouse moves toward browser close button", progress: "Pending" },
  { id: 36, difficulty: "Medium Fix", channel: "Landing Page", problem: "Product descriptions don't address customer concerns", solution: "A/B test benefit-focused vs feature-focused copy. Interview customers to understand their main concerns and address them directly in descriptions.", example: "Test 'Wrinkle-free fabric saves you ironing time' vs 'Made with 65% polyester blend'", progress: "Pending" },
  { id: 37, difficulty: "Medium Fix", channel: "Landing Page", problem: "No live chat support during shopping", solution: "Add live chat widget with proactive messages based on user behavior. Train team to handle common questions quickly.", example: "Trigger chat after 2 minutes on product page: 'Need help choosing the right size?'", progress: "Pending" },
  { id: 38, difficulty: "Medium Fix", channel: "Landing Page", problem: "No urgency or scarcity indicators", solution: "Show real inventory levels, recent purchases, or time-limited offers. Use social proof to create urgency without being pushy.", example: "'3 people bought this in the last hour' or 'Only 7 left at this price'", progress: "Pending" },
  { id: 39, difficulty: "Medium Fix", channel: "Landing Page", problem: "Poor search functionality", solution: "Implement smart search with autocomplete, typo tolerance, and filters. Show popular searches and no-results recommendations.", example: "Add search suggestions dropdown and 'Did you mean...' for misspellings", progress: "Pending" },
  { id: 40, difficulty: "Medium Fix", channel: "Paid Ads", problem: "Not using retargeting campaigns", solution: "Set up retargeting for website visitors, cart abandoners, and past customers. Create different ad sets for each audience with relevant messaging.", example: "Show 'Complete your purchase' ads to cart abandoners with 10% discount", progress: "Pending" },
  { id: 41, difficulty: "Medium Fix", channel: "Paid Ads", problem: "Ad creative gets stale quickly", solution: "Create ad creative testing schedule. Rotate new images, videos, and copy every 2-3 weeks to prevent ad fatigue.", example: "Test 5 different product angles: lifestyle, close-up, comparison, in-use, packaging", progress: "Pending" },
  { id: 42, difficulty: "Medium Fix", channel: "Paid Ads", problem: "Not optimizing for mobile users", solution: "Create mobile-specific ad creative with vertical formats. Ensure landing pages load fast and are thumb-friendly.", example: "Use 9:16 video format for Instagram Stories and TikTok ads", progress: "Pending" },
  { id: 43, difficulty: "Medium Fix", channel: "Paid Ads", problem: "Poor audience targeting", solution: "Create detailed buyer personas and use platform targeting options. Test lookalike audiences based on your best customers.", example: "Target 'parents aged 25-40 interested in organic food' instead of broad 'parents'", progress: "Pending" },
  { id: 44, difficulty: "Medium Fix", channel: "Email", problem: "No segmentation strategy", solution: "Segment email list by purchase history, engagement level, and demographics. Send targeted campaigns to each segment.", example: "Send VIP offers to customers who spent $500+, different content to new subscribers", progress: "Pending" },
  { id: 45, difficulty: "Medium Fix", channel: "Email", problem: "Low email deliverability", solution: "Clean email list regularly, use double opt-in, and monitor sender reputation. Avoid spam trigger words and maintain good engagement rates.", example: "Remove subscribers who haven't opened emails in 6 months", progress: "Pending" },
  { id: 46, difficulty: "Medium Fix", channel: "Email", problem: "No post-purchase email sequence", solution: "Create automated sequence for order confirmation, shipping updates, delivery confirmation, and follow-up for reviews.", example: "5-email sequence: Confirmation, Shipped, Delivered, How-to guide, Review request", progress: "Pending" },
  { id: 47, difficulty: "Medium Fix", channel: "Email", problem: "Generic email content", solution: "Personalize emails with customer names, purchase history, and browsing behavior. Create dynamic content based on preferences.", example: "Show recommended products based on previous purchases in weekly newsletter", progress: "Pending" },
  { id: 48, difficulty: "Medium Fix", channel: "Marketing", problem: "No content marketing strategy", solution: "Create valuable blog content, how-to guides, and videos that help customers. Focus on SEO and sharing on social media.", example: "Weekly blog posts about 'How to style [your product]' with customer photos", progress: "Pending" },
  { id: 49, difficulty: "Medium Fix", channel: "Marketing", problem: "Not leveraging user-generated content", solution: "Encourage customers to share photos using your products. Create branded hashtags and feature customer content on your site.", example: "Create #MyBrandStyle hashtag and feature customer photos on homepage", progress: "Pending" },
  { id: 50, difficulty: "Medium Fix", channel: "Marketing", problem: "No influencer partnerships", solution: "Partner with micro-influencers in your niche. Focus on engagement rates over follower count for better ROI.", example: "Partner with 10 fitness micro-influencers (10K-100K followers) for workout gear", progress: "Pending" },
  { id: 51, difficulty: "Medium Fix", channel: "Landing Page", problem: "No product comparison tools", solution: "Create comparison charts or tools to help customers choose between similar products. Highlight key differences and benefits.", example: "Side-by-side comparison table for different mattress firmness levels", progress: "Pending" },
  { id: 52, difficulty: "Medium Fix", channel: "Landing Page", problem: "Weak homepage design", solution: "Redesign homepage to clearly communicate value proposition, showcase best products, and guide visitors to key actions.", example: "Add hero section with main benefit, featured products grid, and customer testimonials", progress: "Pending" },
  { id: 53, difficulty: "Medium Fix", channel: "Landing Page", problem: "No social proof on product pages", solution: "Add customer photos, video testimonials, and detailed reviews to product pages. Show real people using your products.", example: "Display customer photos wearing the clothing item in different settings", progress: "Pending" },
  { id: 54, difficulty: "Medium Fix", channel: "Paid Ads", problem: "Not testing different ad formats", solution: "Test carousel ads, video ads, collection ads, and single image ads. Different formats work better for different products and audiences.", example: "Test video ads showing product in use vs static lifestyle images", progress: "Pending" },
  { id: 55, difficulty: "Medium Fix", channel: "Email", problem: "No win-back campaigns", solution: "Create automated campaigns to re-engage inactive subscribers and customers. Offer special incentives to return.", example: "'We miss you' email series with increasing discounts: 10%, 15%, 20% off", progress: "Pending" },
  { id: 56, difficulty: "Medium Fix", channel: "Marketing", problem: "No loyalty program", solution: "Create points-based or tier-based loyalty program to encourage repeat purchases and increase customer lifetime value.", example: "Earn 1 point per $1 spent, 100 points = $10 off next order", progress: "Pending" },
  { id: 57, difficulty: "Medium Fix", channel: "Landing Page", problem: "Poor category page organization", solution: "Organize products logically with clear filters and sorting options. Use high-quality category images and descriptions.", example: "Add filters for size, color, price range, and customer rating on category pages", progress: "Pending" },
  { id: 58, difficulty: "Medium Fix", channel: "Paid Ads", problem: "Not using video content", solution: "Create product demonstration videos, customer testimonials, and behind-the-scenes content for ad campaigns.", example: "15-second product demo video showing key features and benefits", progress: "Pending" },
  { id: 59, difficulty: "Medium Fix", channel: "Email", problem: "No birthday or anniversary campaigns", solution: "Collect customer birthdays and purchase anniversaries to send personalized offers and build emotional connection.", example: "Send birthday email with 25% off coupon and personalized product recommendations", progress: "Pending" },
  { id: 60, difficulty: "Medium Fix", channel: "Marketing", problem: "Not optimizing for local search", solution: "Optimize for local SEO with location-based keywords, local business listings, and location pages if applicable.", example: "Create 'Best [product] in [city]' content and optimize Google My Business", progress: "Pending" },
  { id: 61, difficulty: "Medium Fix", channel: "Landing Page", problem: "No product bundling options", solution: "Create product bundles and packages that increase average order value. Show savings compared to individual purchases.", example: "'Complete skincare routine' bundle saves $25 vs buying items separately", progress: "Pending" },
  { id: 62, difficulty: "Medium Fix", channel: "Paid Ads", problem: "Not optimizing ad scheduling", solution: "Analyze when your customers are most active and adjust ad scheduling accordingly. Increase bids during peak hours.", example: "Increase ad spend 20% during 7-9 PM when conversion rates are highest", progress: "Pending" },
  { id: 63, difficulty: "Medium Fix", channel: "Email", problem: "No cross-sell campaigns", solution: "Send targeted emails suggesting complementary products based on purchase history and browsing behavior.", example: "Bought running shoes? Get email about running socks and fitness tracker", progress: "Pending" },
  { id: 64, difficulty: "Medium Fix", channel: "Marketing", problem: "No seasonal campaigns", solution: "Plan marketing campaigns around holidays, seasons, and industry events. Create themed content and promotions.", example: "Back-to-school campaign for office supplies with student discounts", progress: "Pending" },
  { id: 65, difficulty: "Medium Fix", channel: "Landing Page", problem: "No wishlist functionality", solution: "Add wishlist feature to let customers save products for later. Send reminder emails about saved items.", example: "Heart icon on products to save to wishlist, email reminders after 3 days", progress: "Pending" },
  { id: 66, difficulty: "Medium Fix", channel: "Paid Ads", problem: "Not using customer data for targeting", solution: "Upload customer email lists for lookalike audiences and exclusion targeting. Use purchase data to create custom audiences.", example: "Create lookalike audience based on customers who spent $200+ in last 90 days", progress: "Pending" },
  { id: 67, difficulty: "Medium Fix", channel: "Marketing", problem: "No partnership opportunities", solution: "Partner with complementary businesses for cross-promotion, joint campaigns, or affiliate programs.", example: "Partner with interior designers to promote home decor products", progress: "Pending" },

  // Hard Fixes (68-101)
  { id: 68, difficulty: "Hard Fix", channel: "Landing Page", problem: "No AI-powered product recommendations", solution: "Implement machine learning algorithms to show personalized product recommendations based on browsing history, purchase patterns, and similar customer behavior.", example: "Amazon-style 'Customers who bought this also bought' with 35% higher conversion rates", progress: "Pending" },
  { id: 69, difficulty: "Hard Fix", channel: "Landing Page", problem: "Generic checkout experience for all customers", solution: "Build custom checkout flows based on customer segments, purchase history, and behavior patterns. Optimize each step for different user types.", example: "VIP customers get one-click checkout, new customers get guided experience with trust signals", progress: "Pending" },
  { id: 70, difficulty: "Hard Fix", channel: "Marketing", problem: "No advanced customer segmentation", solution: "Create behavioral-based customer segments using RFM analysis (Recency, Frequency, Monetary). Develop targeted strategies for each segment.", example: "Champions (high RFM) get exclusive previews, At-risk customers get win-back campaigns", progress: "Pending" },
  { id: 71, difficulty: "Hard Fix", channel: "Marketing", problem: "No predictive analytics for customer behavior", solution: "Implement predictive models to forecast customer lifetime value, churn probability, and next purchase timing.", example: "Identify customers 80% likely to churn and trigger retention campaigns automatically", progress: "Pending" },
  { id: 72, difficulty: "Hard Fix", channel: "Paid Ads", problem: "Manual bid management inefficiency", solution: "Implement automated bidding strategies using machine learning. Set up dynamic bid adjustments based on device, location, time, and audience.", example: "Automated bidding increases ROAS by 23% while reducing manual work by 80%", progress: "Pending" },
  { id: 73, difficulty: "Hard Fix", channel: "Email", problem: "Static email content for all subscribers", solution: "Create dynamic email content that changes based on recipient behavior, preferences, and real-time data like weather or inventory.", example: "Email shows different products based on browsing history and current weather in recipient's location", progress: "Pending" },
  { id: 74, difficulty: "Hard Fix", channel: "Landing Page", problem: "No real-time personalization", solution: "Implement real-time website personalization showing different content, offers, and products based on visitor behavior and characteristics.", example: "First-time visitors see social proof, returning visitors see new arrivals, VIPs see exclusive offers", progress: "Pending" },
  { id: 75, difficulty: "Hard Fix", channel: "Marketing", problem: "No omnichannel customer experience", solution: "Create seamless experience across all touchpoints - website, email, social media, ads, and customer service. Unify customer data and messaging.", example: "Customer sees same personalized recommendations on website, email, and retargeting ads", progress: "Pending" },
  { id: 76, difficulty: "Hard Fix", channel: "Paid Ads", problem: "No advanced attribution modeling", solution: "Implement multi-touch attribution to understand the full customer journey and optimize budget allocation across channels.", example: "Discover that YouTube ads don't convert directly but influence 40% of Facebook conversions", progress: "Pending" },
  { id: 77, difficulty: "Hard Fix", channel: "Landing Page", problem: "No progressive web app features", solution: "Convert website to Progressive Web App (PWA) for faster loading, offline functionality, and app-like experience on mobile.", example: "PWA reduces bounce rate by 42% and increases mobile conversions by 36%", progress: "Pending" },
  { id: 78, difficulty: "Hard Fix", channel: "Email", problem: "No advanced automation workflows", solution: "Build complex automation workflows with multiple triggers, conditions, and paths based on customer behavior and data.", example: "15-step workflow: Welcome → Browse behavior → Purchase → Post-purchase → Loyalty → Win-back", progress: "Pending" },
  { id: 79, difficulty: "Hard Fix", channel: "Marketing", problem: "No voice search optimization", solution: "Optimize content and SEO for voice search queries. Focus on conversational keywords and featured snippet optimization.", example: "Optimize for 'What's the best running shoe for beginners' instead of 'best running shoes'", progress: "Pending" },
  { id: 80, difficulty: "Hard Fix", channel: "Landing Page", problem: "No advanced A/B testing program", solution: "Implement multivariate testing and statistical significance tracking. Test multiple elements simultaneously and measure long-term impact.", example: "Test 16 combinations of headline, CTA, and image simultaneously with proper statistical analysis", progress: "Pending" },
  { id: 81, difficulty: "Hard Fix", channel: "Paid Ads", problem: "No creative automation at scale", solution: "Build systems to automatically generate and test ad creative variations using templates, dynamic content, and AI tools.", example: "Generate 100 ad variations automatically by combining product images, headlines, and CTAs", progress: "Pending" },
  { id: 82, difficulty: "Hard Fix", channel: "Marketing", problem: "No customer lifetime value optimization", solution: "Build comprehensive CLV models and optimize all marketing activities to maximize long-term customer value rather than short-term conversions.", example: "Shift budget from acquisition to retention, increasing CLV by 45% while reducing CAC", progress: "Pending" },
  { id: 83, difficulty: "Hard Fix", channel: "Landing Page", problem: "No advanced search and discovery", solution: "Implement AI-powered search with natural language processing, visual search, and intelligent filters based on user intent.", example: "Visual search allows customers to upload photos and find similar products instantly", progress: "Pending" },
  { id: 84, difficulty: "Hard Fix", channel: "Email", problem: "No predictive send time optimization", solution: "Use machine learning to determine optimal send times for each individual subscriber based on their engagement patterns.", example: "Send emails when each subscriber is most likely to open, increasing open rates by 28%", progress: "Pending" },
  { id: 85, difficulty: "Hard Fix", channel: "Marketing", problem: "No advanced competitive intelligence", solution: "Implement automated competitive monitoring for pricing, promotions, content, and ad strategies. React quickly to market changes.", example: "Automatically adjust prices when competitors change theirs, maintaining optimal margin and competitiveness", progress: "Pending" },
  { id: 86, difficulty: "Hard Fix", channel: "Paid Ads", problem: "No cross-platform campaign optimization", solution: "Build unified campaign management across all platforms with shared learnings and budget optimization based on performance.", example: "Automatically shift budget from Facebook to Google when Google performs better for specific products", progress: "Pending" },
  { id: 87, difficulty: "Hard Fix", channel: "Landing Page", problem: "No advanced inventory management integration", solution: "Connect inventory levels to marketing campaigns, automatically adjusting ad spend and promotions based on stock levels.", example: "Reduce ad spend for low-stock items and increase promotion for overstocked products", progress: "Pending" },
  { id: 88, difficulty: "Hard Fix", channel: "Marketing", problem: "No advanced customer journey mapping", solution: "Map complete customer journeys with all touchpoints and optimize each interaction for maximum impact on conversion and retention.", example: "Identify that customers who watch product videos are 3x more likely to purchase within 30 days", progress: "Pending" },
  { id: 89, difficulty: "Hard Fix", channel: "Email", problem: "No advanced deliverability optimization", solution: "Implement sophisticated email deliverability monitoring with IP warming, domain reputation management, and engagement-based sending.", example: "Maintain 98%+ inbox placement rate through advanced reputation management", progress: "Pending" },
  { id: 90, difficulty: "Hard Fix", channel: "Paid Ads", problem: "No advanced audience modeling", solution: "Build custom audience models using first-party data, lookalike modeling, and behavioral prediction algorithms.", example: "Create 'High-Intent Shoppers' audience with 5x higher conversion rate than standard targeting", progress: "Pending" },
  { id: 91, difficulty: "Hard Fix", channel: "Landing Page", problem: "No advanced conversion rate optimization", solution: "Implement comprehensive CRO program with heat mapping, user session recording, and advanced statistical testing.", example: "Systematic CRO program increases conversion rate from 2.1% to 4.7% over 12 months", progress: "Pending" },
  { id: 92, difficulty: "Hard Fix", channel: "Marketing", problem: "No advanced retention modeling", solution: "Build predictive models to identify at-risk customers and automatically trigger personalized retention campaigns.", example: "Reduce churn rate by 35% through predictive retention campaigns triggered by behavior changes", progress: "Pending" },
  { id: 93, difficulty: "Hard Fix", channel: "Email", problem: "No advanced content optimization", solution: "Use AI to optimize email content, subject lines, and send times based on individual subscriber preferences and behavior.", example: "AI-generated subject lines increase open rates by 41% compared to manually written ones", progress: "Pending" },
  { id: 94, difficulty: "Hard Fix", channel: "Paid Ads", problem: "No advanced creative testing framework", solution: "Build systematic creative testing framework with automated performance analysis and creative element optimization.", example: "Test 500+ creative variations monthly with automated winner identification and scaling", progress: "Pending" },
  { id: 95, difficulty: "Hard Fix", channel: "Landing Page", problem: "No advanced personalization engine", solution: "Build comprehensive personalization engine that adapts entire website experience based on visitor characteristics and behavior.", example: "Personalized experiences increase conversion rates by 67% and average order value by 23%", progress: "Pending" },
  { id: 96, difficulty: "Hard Fix", channel: "Marketing", problem: "No advanced attribution and measurement", solution: "Implement advanced measurement framework with incrementality testing, media mix modeling, and unified attribution.", example: "Discover true impact of each channel and optimize budget allocation for 31% better ROAS", progress: "Pending" },
  { id: 97, difficulty: "Hard Fix", channel: "Email", problem: "No advanced lifecycle marketing", solution: "Build sophisticated lifecycle marketing program with predictive modeling and automated journey optimization.", example: "Automated lifecycle campaigns generate 45% of total email revenue with minimal manual work", progress: "Pending" },
  { id: 98, difficulty: "Hard Fix", channel: "Paid Ads", problem: "No advanced bid optimization", solution: "Implement custom bidding algorithms that consider profit margins, inventory levels, and customer lifetime value.", example: "Custom bidding increases profit per conversion by 52% while maintaining volume", progress: "Pending" },
  { id: 99, difficulty: "Hard Fix", channel: "Landing Page", problem: "No advanced mobile optimization", solution: "Build mobile-first experience with progressive enhancement, AMP pages, and mobile-specific conversion optimization.", example: "Mobile-optimized experience increases mobile conversion rate from 1.2% to 3.8%", progress: "Pending" },
  { id: 100, difficulty: "Hard Fix", channel: "Marketing", problem: "No advanced data integration", solution: "Build unified data platform connecting all marketing tools, customer data, and business systems for complete visibility.", example: "Unified data platform enables real-time decision making and increases marketing efficiency by 40%", progress: "Pending" },
  { id: 101, difficulty: "Hard Fix", channel: "Marketing", problem: "No advanced marketing automation", solution: "Implement enterprise-level marketing automation with AI-driven campaign optimization and cross-channel orchestration.", example: "Advanced automation increases marketing qualified leads by 78% while reducing manual work by 85%", progress: "Pending" }
];

export default function FixesPage({ onNavigateHome }: FixesPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [channelFilter, setChannelFilter] = useState<string>("All");
  const [progressFilter, setProgressFilter] = useState<string>("All");
  const [expandedFix, setExpandedFix] = useState<number | null>(null);
  const [fixProgress, setFixProgress] = useState<Record<number, Progress>>({});
  const [showAuditForm, setShowAuditForm] = useState(false);
  const [auditForm, setAuditForm] = useState({
    name: "",
    brand: "",
    storeUrl: "",
    monthlyAdSpend: "",
    email: ""
  });

  const submitAuditApplication = useMutation(api.audit.submitApplication);

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('fixProgress');
    if (savedProgress) {
      setFixProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('fixProgress', JSON.stringify(fixProgress));
  }, [fixProgress]);

  const updateProgress = (fixId: number, progress: Progress) => {
    setFixProgress(prev => ({ ...prev, [fixId]: progress }));
  };

  const filteredFixes = useMemo(() => {
    return fixes.filter(fix => {
      const matchesSearch = searchTerm === "" || 
        fix.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fix.solution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fix.example.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDifficulty = difficultyFilter === "All" || fix.difficulty === difficultyFilter;
      const matchesChannel = channelFilter === "All" || fix.channel === channelFilter;
      
      const currentProgress = fixProgress[fix.id] || "Pending";
      const matchesProgress = progressFilter === "All" || currentProgress === progressFilter;
      
      return matchesSearch && matchesDifficulty && matchesChannel && matchesProgress;
    });
  }, [searchTerm, difficultyFilter, channelFilter, progressFilter, fixProgress]);

  const completedCount = Object.values(fixProgress).filter(p => p === "Done").length;
  const inProgressCount = Object.values(fixProgress).filter(p => p === "In Progress").length;

  // Calculate completed fixes by difficulty
  const completedByDifficulty = useMemo(() => {
    const completed = Object.entries(fixProgress)
      .filter(([_, progress]) => progress === "Done")
      .map(([fixId, _]) => parseInt(fixId));
    
    return {
      easy: completed.filter(id => {
        const fix = fixes.find(f => f.id === id);
        return fix?.difficulty === "Easy Fix";
      }).length,
      medium: completed.filter(id => {
        const fix = fixes.find(f => f.id === id);
        return fix?.difficulty === "Medium Fix";
      }).length,
      hard: completed.filter(id => {
        const fix = fixes.find(f => f.id === id);
        return fix?.difficulty === "Hard Fix";
      }).length
    };
  }, [fixProgress]);

  const resetFilters = () => {
    setSearchTerm("");
    setDifficultyFilter("All");
    setChannelFilter("All");
    setProgressFilter("All");
  };



  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitAuditApplication(auditForm);
      toast.success("Application submitted! We'll be in touch soon.");
      setAuditForm({ name: "", brand: "", storeUrl: "", monthlyAdSpend: "", email: "" });
      setShowAuditForm(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050610', fontFamily: 'Poppins, sans-serif' }}>
      <style>{`
        @keyframes continuous-pulse {
          0%, 100% {
            box-shadow: 0 0 16px rgba(255, 0, 127, 0.5);
            filter: brightness(1);
            transform: scaleX(1);
          }
          50% {
            box-shadow: 0 0 24px rgba(255, 0, 127, 0.7), 0 0 36px rgba(160, 32, 240, 0.4);
            filter: brightness(1.1);
            transform: scaleX(1.002);
          }
        }
        
        .progress-bar-fill {
          transition: width 1200ms cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: left center;
        }
      `}</style>
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-sm border-b shadow-sm" style={{ backgroundColor: 'rgba(5, 6, 16, 0.95)', borderColor: '#12141C' }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={onNavigateHome}
              className="font-bold text-2xl tracking-wider cursor-pointer hover:opacity-80 transition-opacity" 
              style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '0.1em' }}
            >
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                CesarMessa
              </span>
            </button>
            <div className="flex items-center space-x-4">
              <button 
                onClick={onNavigateHome}
                className="text-gray-400 hover:text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
              >
                ← Back to Home
              </button>
              <button 
                onClick={() => setShowAuditForm(true)}
                className="text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #FF007F, #FF2BA4)' }}
              >
                Free Audit
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #050610 0%, #0F1226 50%, #02011A 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-medium text-white mb-6 leading-tight">
            Turn <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent text-6xl md:text-7xl">Traffic</span> Into <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent text-6xl md:text-7xl">Sales</span> with <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">101 Fixes</span>
          </h1>
          <h2 className="text-xl md:text-2xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Filter by difficulty and channel, track your progress, and bookmark this hub so you can ship faster.
          </h2>
          <p className="text-gray-400 mb-12">
            💡 Tip: Press Ctrl+D or Cmd+D to bookmark this page.
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{completedCount}/101 completed</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-5 shadow-inner">
              <div 
                className="progress-bar-fill h-5 rounded-full transform"
                style={{ 
                  width: `${(completedCount / 101) * 100}%`,
                  background: 'linear-gradient(135deg, #FF007F, #A020F0)',
                  boxShadow: completedCount > 0 ? '0 0 16px rgba(255, 0, 127, 0.5)' : 'none',
                  animation: completedCount > 0 ? 'continuous-pulse 3s ease-in-out infinite' : 'none'
                }}
              />
            </div>

            {/* Difficulty Breakdown */}
            <div className="flex justify-center items-center space-x-8 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00FF88' }}></div>
                <span className="text-sm text-gray-300">
                  Easy: <span className="font-semibold text-white">{completedByDifficulty.easy}/34</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFB800' }}></div>
                <span className="text-sm text-gray-300">
                  Medium: <span className="font-semibold text-white">{completedByDifficulty.medium}/33</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF007F' }}></div>
                <span className="text-sm text-gray-300">
                  Hard: <span className="font-semibold text-white">{completedByDifficulty.hard}/34</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8" style={{ backgroundColor: '#0F1226' }}>
        <div className="max-w-6xl mx-auto px-4">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search fixes by problem, solution, or example..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
              style={{ 
                backgroundColor: '#12141C', 
                borderColor: '#8A2BE2'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Difficulty:</span>
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                style={{ backgroundColor: '#12141C', borderColor: '#8A2BE2' }}
              >
                <option value="All">All</option>
                <option value="Easy Fix">Easy Fix</option>
                <option value="Medium Fix">Medium Fix</option>
                <option value="Hard Fix">Hard Fix</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Channel:</span>
              <select
                value={channelFilter}
                onChange={(e) => setChannelFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                style={{ backgroundColor: '#12141C', borderColor: '#8A2BE2' }}
              >
                <option value="All">All</option>
                <option value="Landing Page">Landing Page</option>
                <option value="Paid Ads">Paid Ads</option>
                <option value="Email">Email</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Progress:</span>
              <select
                value={progressFilter}
                onChange={(e) => setProgressFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                style={{ backgroundColor: '#12141C', borderColor: '#8A2BE2' }}
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg border text-gray-400 hover:text-white hover:border-pink-500 transition-colors text-sm"
              style={{ borderColor: '#8A2BE2' }}
            >
              Reset
            </button>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400">
              {filteredFixes.length} fixes found
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>✅ {completedCount} Done</span>
              <span>🔄 {inProgressCount} In Progress</span>
              <span>⏳ {101 - completedCount - inProgressCount} Pending</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fixes List */}
      <section className="py-8" style={{ backgroundColor: '#02011A' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-4">
            {filteredFixes.map((fix) => {
              const currentProgress = fixProgress[fix.id] || "Pending";
              const isExpanded = expandedFix === fix.id;
              
              return (
                <div
                  key={fix.id}
                  className="rounded-xl p-6 border transition-all duration-200 hover:border-pink-500"
                  style={{ 
                    background: 'linear-gradient(135deg, #12141C, #0E1125)', 
                    borderColor: currentProgress === "Done" ? '#00FF88' : currentProgress === "In Progress" ? '#FFB800' : '#8A2BE2'
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl font-bold text-pink-400">#{fix.id}</span>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: fix.difficulty === "Easy Fix" ? '#00FF8820' : fix.difficulty === "Medium Fix" ? '#FFB80020' : '#FF007F20',
                            color: fix.difficulty === "Easy Fix" ? '#00FF88' : fix.difficulty === "Medium Fix" ? '#FFB800' : '#FF007F'
                          }}
                        >
                          {fix.difficulty}
                        </span>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#A020F020', color: '#A020F0' }}
                        >
                          {fix.channel}
                        </span>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: currentProgress === "Done" ? '#00FF8820' : currentProgress === "In Progress" ? '#FFB80020' : '#8A2BE220',
                            color: currentProgress === "Done" ? '#00FF88' : currentProgress === "In Progress" ? '#FFB800' : '#8A2BE2'
                          }}
                        >
                          {currentProgress}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{fix.problem}</h3>
                      
                      {isExpanded && (
                        <div className="space-y-3 mt-4">
                          <div>
                            <h4 className="text-pink-400 font-medium mb-2">Solution:</h4>
                            <p className="text-gray-300 leading-relaxed">{fix.solution}</p>
                          </div>
                          <div>
                            <h4 className="text-purple-400 font-medium mb-2">Example:</h4>
                            <p className="text-gray-300 leading-relaxed italic">{fix.example}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 ml-4">
                      <select
                        value={currentProgress}
                        onChange={(e) => updateProgress(fix.id, e.target.value as Progress)}
                        className="px-3 py-2 rounded-lg border text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                        style={{ backgroundColor: '#050610', borderColor: '#8A2BE2' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                      
                      
                      <button
                        onClick={() => setExpandedFix(isExpanded ? null : fix.id)}
                        className="p-2 rounded-lg border hover:border-pink-500 transition-colors"
                        style={{ borderColor: '#8A2BE2' }}
                        title={isExpanded ? "Collapse" : "Expand details"}
                      >
                        <span className="text-gray-400 hover:text-white">
                          {isExpanded ? '−' : '+'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #02011A 0%, #0F1226 50%, #050610 100%)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">Need help implementing these fixes?</h3>
          <p className="text-xl text-gray-300 mb-8">
            I select 3 companies weekly for a free ecommerce audit covering offer, lead magnet, landing page, paid ads, and email sequence. Apply below.
          </p>
          
          <button
            onClick={() => setShowAuditForm(true)}
            className="text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transform transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #FF007F, #A020F0)' }}
          >
            Apply for Free Audit
          </button>
        </div>
      </section>

      {/* Audit Form Modal */}
      {showAuditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-xl p-8 max-w-md w-full" style={{ background: 'linear-gradient(135deg, #12141C, #0E1125)' }}>
            <h3 className="text-2xl font-bold text-white mb-6">Apply for Free Audit</h3>
            <form onSubmit={handleAuditSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={auditForm.name}
                onChange={(e) => setAuditForm({...auditForm, name: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                style={{ backgroundColor: '#050610', borderColor: '#8A2BE2' }}
              />
              <input
                type="text"
                placeholder="Brand Name"
                value={auditForm.brand}
                onChange={(e) => setAuditForm({...auditForm, brand: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                style={{ backgroundColor: '#050610', borderColor: '#8A2BE2' }}
              />
              <input
                type="text"
                placeholder="Store URL (e.g., mystore.com or https://mystore.com)"
                value={auditForm.storeUrl}
                onChange={(e) => setAuditForm({...auditForm, storeUrl: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                style={{ backgroundColor: '#050610', borderColor: '#8A2BE2' }}
              />
              <select
                value={auditForm.monthlyAdSpend}
                onChange={(e) => setAuditForm({...auditForm, monthlyAdSpend: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                style={{ backgroundColor: '#050610', borderColor: '#8A2BE2' }}
              >
                <option value="">Monthly Ad Spend</option>
                <option value="$0 to $2,000">$0 to $2,000</option>
                <option value="$2,001 to $5,000">$2,001 to $5,000</option>
                <option value="$5,001 to $10,000">$5,001 to $10,000</option>
                <option value="$10,001 and above">$10,001 and above</option>
              </select>
              <input
                type="email"
                placeholder="Email Address"
                value={auditForm.email}
                onChange={(e) => setAuditForm({...auditForm, email: e.target.value})}
                required
                className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400"
                style={{ backgroundColor: '#050610', borderColor: '#8A2BE2' }}
              />
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAuditForm(false)}
                  className="flex-1 px-4 py-3 rounded-lg border text-gray-400 hover:text-white hover:border-pink-500 transition-colors"
                  style={{ borderColor: '#8A2BE2' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 text-white px-4 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #FF007F, #A020F0)' }}
                >
                  Apply Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
