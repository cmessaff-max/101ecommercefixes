import { Authenticated, Unauthenticated, useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { useState, useEffect } from "react";
import FixesPage from "./FixesPage";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1BaeOJeP5oIpbumgh5VN4LJZAhjuByTSssxbMlHuyHrI/view?gid=1589637341";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "email-check" | "fixes">("landing");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [bottomEmail, setBottomEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBottomSubmitting, setIsBottomSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const subscribeEmail = useMutation(api.emails.subscribeEmail);
  const checkEmailAccess = useQuery(
    api.emails.checkEmailAccess,
    email ? { email } : "skip"
  );

  useEffect(() => {
    // Trigger animations on page load
    setIsLoaded(true);
  }, []);

  // Auto-redirect returning users with valid email
  useEffect(() => {
    if (currentPage === "email-check" && checkEmailAccess?.hasAccess && email) {
      setCurrentPage("fixes");
    }
  }, [checkEmailAccess, currentPage, email]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const result = await subscribeEmail({ email });
      if (result.success && result.hasAccess) {
        setCurrentPage("fixes");
        if (result.isNew) {
          toast.success("Welcome! You now have access to all 101 fixes.");
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Email submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simplified bottom submit:
  // 1) Try to save the email via Convex (best effort)
  // 2) Always open the Google Sheet so users get access
  const handleBottomEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bottomEmail) return;

    setIsBottomSubmitting(true);

    try {
      try {
        await subscribeEmail({ email: bottomEmail });
      } catch (err) {
        // Non-blocking. We still give access.
        console.warn("Non-blocking email save error:", err);
      }

      toast.success("Opening your 101 Fixes Sheet...");
      // Open in a new tab for a smoother experience
      window.open(SHEET_URL, "_blank", "noopener,noreferrer");
      setBottomEmail("");
    } catch (error) {
      // Even if something unexpected happens, still send them to the Sheet
      console.error("Bottom email submission unexpected error:", error);
      window.open(SHEET_URL, "_blank", "noopener,noreferrer");
    } finally {
      setIsBottomSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUnlockFixes = () => {
    scrollToSection("download");
  };

  // Show fixes page
  if (currentPage === "fixes") {
    return <FixesPage onNavigateHome={() => setCurrentPage("landing")} />;
  }

  // Show email check page
  if (currentPage === "email-check") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#050610" }}>
        <div className="max-w-md w-full mx-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">Access All 101 Fixes</h1>
            <p className="text-gray-300">Enter your email to unlock the complete guide</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400 disabled:opacity-50"
              style={{
                backgroundColor: "#12141C",
                borderColor: "#8A2BE2",
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #FF007F, #A020F0)" }}
            >
              {isSubmitting ? "Checking Access..." : "Get Access"}
            </button>
          </form>

          <button
            onClick={() => setCurrentPage("landing")}
            className="w-full mt-4 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to main page
          </button>
        </div>
        <Toaster position="top-center" />
      </div>
    );
  }

  // Show landing page
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050610", fontFamily: "Poppins, sans-serif" }}>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .hero h1 {
            opacity: 0;
            transform: translateY(16px);
            animation: fadeInUp 420ms cubic-bezier(0.22,1,0.36,1) forwards;
          }

          .hero .subtitle {
            opacity: 0;
            transform: translateY(16px);
            animation: fadeInUp 420ms cubic-bezier(0.22,1,0.36,1) 120ms forwards;
          }

          .btn-primary {
            transition: transform 180ms ease-out, box-shadow 180ms ease-out;
          }

          .btn-primary:hover {
            transform: scale(1.02);
            box-shadow: 0 0 20px rgba(255,43,164,0.45);
          }

          .accordion .content {
            transition: height 280ms cubic-bezier(0.22,1,0.36,1), opacity 280ms cubic-bezier(0.22,1,0.36,1);
          }

          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero h1,
          .hero .subtitle {
            opacity: 0;
            animation: fadeIn 420ms ease forwards;
          }

          .hero .subtitle {
            animation-delay: 120ms;
          }

          @keyframes fadeIn {
            to {
              opacity: 1;
            }
          }
        }
      `}</style>

      {/* Simplified Navigation */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-sm border-b shadow-sm"
        style={{ backgroundColor: "rgba(5, 6, 16, 0.95)", borderColor: "#12141C" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div
              className="font-bold text-2xl tracking-wider"
              style={{ fontFamily: "Orbitron, monospace", letterSpacing: "0.1em" }}
            >
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                CesarMessa
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleUnlockFixes}
                className="btn-primary text-white px-6 py-2.5 rounded-lg font-medium shadow-sm"
                style={{ background: "linear-gradient(135deg, #FF007F, #FF2BA4)" }}
              >
                Get Access
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="hero py-20"
        style={{ background: "linear-gradient(135deg, #050610 0%, #0F1226 50%, #02011A 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1
            className="text-5xl md:text-6xl font-medium text-white mb-8 leading-tight"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
          >
            Steal{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">
              101 <span className="text-6xl md:text-7xl">Proven</span> Fixes
            </span>{" "}
            <span className="text-6xl md:text-7xl">Ecommerce</span> Brands Use to{" "}
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">
              Stop Wasting <span className="text-6xl md:text-7xl">Ad Money</span> and Skyrocket{" "}
              <span className="text-6xl md:text-7xl">Sales</span>
            </span>
          </h1>
          <p
            className="subtitle text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-snug"
            style={{ letterSpacing: "0.025em" }}
          >
            Get immediate access to the 101 Ecommerce Fixes to Boost Conversions. Quick wins and deep strategies top DTC
            operators use to turn paid ads and email sequences into revenue machines.
          </p>

          {/* Bullet Points */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-center p-3 rounded-lg border" style={{ backgroundColor: "#12141C", borderColor: "#8A2BE2" }}>
              <span className="text-gray-300 text-base">Slow pages kill conversions and waste ad spend</span>
            </div>
            <div className="flex items-center justify-center p-3 rounded-lg border" style={{ backgroundColor: "#12141C", borderColor: "#8A2BE2" }}>
              <span className="text-gray-300 text-base">Weak CTAs and messy landing pages hurt sales</span>
            </div>
            <div className="flex items-center justify-center p-3 rounded-lg border" style={{ backgroundColor: "#12141C", borderColor: "#8A2BE2" }}>
              <span className="text-gray-300 text-base">Complicated checkout causes carts to be abandoned</span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleUnlockFixes}
              className="btn-primary text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transform"
              style={{ background: "linear-gradient(135deg, #FF007F, #A020F0)" }}
            >
              Unlock All 101 Fixes
            </button>
          </div>
        </div>
      </section>

      {/* Easy Fixes Section */}
      <section id="easy" className="py-16" style={{ backgroundColor: "#0F1226" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Easy Fixes</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Quick wins you can implement today. These fixes require minimal technical knowledge and can be done in 1-2 days.
            </p>
          </div>

          <div
            className="accordion rounded-xl p-8 border"
            style={{ background: "linear-gradient(135deg, #12141C, #0E1125)", borderColor: "#8A2BE2" }}
          >
            <button onClick={() => toggleSection("easy")} className="toggle w-full flex justify-between items-center text-left">
              <span className="text-xl font-semibold text-white">View Easy Fixes (1-34) - 1-2 days</span>
              <span className="text-2xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                {expandedSection === "easy" ? "−" : "+"}
              </span>
            </button>

            <div
              className="content overflow-hidden"
              style={{
                height: expandedSection === "easy" ? "auto" : "0",
                opacity: expandedSection === "easy" ? "1" : "0",
              }}
            >
              <div className="mt-6 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">1. Add trust badges to checkout</h4>
                    <p className="text-sm text-gray-400">Display security certificates and payment icons</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">2. Optimize page load speed</h4>
                    <p className="text-sm text-gray-400">Compress images and enable browser caching</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">3. Add customer reviews</h4>
                    <p className="text-sm text-gray-400">Display social proof on product pages</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">4. Simplify navigation menu</h4>
                    <p className="text-sm text-gray-400">Reduce menu items to 5-7 main categories</p>
                  </div>
                </div>
                <p className="text-center text-gray-400 mt-4">+ 30 more easy fixes available after email signup</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medium Fixes Section */}
      <section id="medium" className="py-16" style={{ backgroundColor: "#02011A" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Medium Fixes</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Strategic improvements that require some planning and resources. These fixes typically take 1-2 weeks to implement.
            </p>
          </div>

          <div
            className="accordion rounded-xl p-8 border"
            style={{ background: "linear-gradient(135deg, #12141C, #0F1227)", borderColor: "#A020F0" }}
          >
            <button onClick={() => toggleSection("medium")} className="toggle w-full flex justify-between items-center text-left">
              <span className="text-xl font-semibold text-white">View Medium Fixes (35-67) - 1-2 weeks</span>
              <span className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {expandedSection === "medium" ? "−" : "+"}
              </span>
            </button>

            <div
              className="content overflow-hidden"
              style={{
                height: expandedSection === "medium" ? "auto" : "0",
                opacity: expandedSection === "medium" ? "1" : "0",
              }}
            >
              <div className="mt-6 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">35. Implement exit-intent popups</h4>
                    <p className="text-sm text-gray-400">Capture abandoning visitors with targeted offers</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">36. A/B test product descriptions</h4>
                    <p className="text-sm text-gray-400">Test benefit-focused vs feature-focused copy</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">37. Add live chat support</h4>
                    <p className="text-sm text-gray-400">Provide real-time assistance during shopping</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">38. Create urgency with inventory</h4>
                    <p className="text-sm text-gray-400">Show stock levels and recent purchases</p>
                  </div>
                </div>
                <p className="text-center text-gray-400 mt-4">+ 29 more medium fixes available after email signup</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hard Fixes Section */}
      <section id="hard" className="py-16" style={{ backgroundColor: "#0F1226" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Hard Fixes</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Advanced optimizations that require significant investment and expertise. These fixes can take 1-3 months to implement but offer the highest ROI.
            </p>
          </div>

          <div
            className="accordion rounded-xl p-8 border"
            style={{ background: "linear-gradient(135deg, #12141C, #0E1125)", borderColor: "#FF2BA4" }}
          >
            <button onClick={() => toggleSection("hard")} className="toggle w-full flex justify-between items-center text-left">
              <span className="text-xl font-semibold text-white">View Hard Fixes (68-101) - 1-3 months</span>
              <span className="text-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">
                {expandedSection === "hard" ? "−" : "+"}
              </span>
            </button>

            <div
              className="content overflow-hidden"
              style={{
                height: expandedSection === "hard" ? "auto" : "0",
                opacity: expandedSection === "hard" ? "1" : "0",
              }}
            >
              <div className="mt-6 space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">68. Implement AI-powered recommendations</h4>
                    <p className="text-sm text-gray-400">Use machine learning for personalized product suggestions</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">69. Build custom checkout flow</h4>
                    <p className="text-sm text-gray-400">Create optimized, single-page checkout experience</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">70. Advanced segmentation</h4>
                    <p className="text-sm text-gray-400">Create behavioral-based customer segments</p>
                  </div>
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: "#050610", borderColor: "#12141C" }}>
                    <h4 className="font-semibold text-white mb-2">71. Predictive analytics</h4>
                    <p className="text-sm text-gray-400">Forecast customer lifetime value and churn</p>
                  </div>
                </div>
                <p className="text-center text-gray-400 mt-4">+ 30 more advanced fixes available after email signup</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Magnet Section with Inline Email Form */}
      <section
        id="download"
        className="py-20"
        style={{ background: "linear-gradient(135deg, #02011A 0%, #0F1226 50%, #050610 100%)" }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Get Access to All 101 Fixes</h2>
          <p className="text-xl text-gray-300 mb-8">
            Enter your email to unlock the complete Google Sheet with detailed implementation guides and case studies.
          </p>

          {/* Inline Email Form */}
          <form onSubmit={handleBottomEmailSubmit} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              <div className="flex-1">
                <label htmlFor="bottom-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="bottom-email"
                  type="email"
                  value={bottomEmail}
                  onChange={(e) => setBottomEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isBottomSubmitting}
                  className="w-full px-4 py-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400 disabled:opacity-50 text-lg"
                  style={{
                    backgroundColor: "#12141C",
                    borderColor: "#8A2BE2",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={isBottomSubmitting || !bottomEmail.trim()}
                className="btn-primary text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #FF007F, #A020F0)" }}
              >
                {isBottomSubmitting ? "Getting Access..." : "Unlock All 101 Fixes"}
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-400 mt-6">No spam. Direct access to Google Sheet with all fixes.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12" style={{ backgroundColor: "#050610" }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div
                className="font-bold text-xl mb-2"
                style={{ fontFamily: "Orbitron, monospace", letterSpacing: "0.1em" }}
              >
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-300 bg-clip-text text-transparent">
                  CesarMessa
                </span>
              </div>
              <p className="text-gray-400">Helping ecommerce businesses boost conversions</p>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: "linear-gradient(135deg, #FF007F, #A020F0)" }}
                >
                  CM
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Created by Cesar Messa</p>
                  <a
                    href="https://www.linkedin.com/in/cesarmessa/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 hover:text-pink-300 text-xs transition-colors"
                  >
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Toaster position="top-center" />
    </div>
  );
}