import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitApplication = mutation({
  args: {
    name: v.string(),
    brand: v.string(),
    storeUrl: v.string(),
    monthlyAdSpend: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Normalize the URL - add https:// if no protocol is provided
    let normalizedUrl = args.storeUrl.trim();
    if (normalizedUrl && !normalizedUrl.match(/^https?:\/\//)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    await ctx.db.insert("auditApplications", {
      name: args.name,
      brand: args.brand,
      storeUrl: normalizedUrl,
      monthlyAdSpend: args.monthlyAdSpend,
      email: args.email,
      submittedAt: Date.now(),
      status: "pending",
    });

    return { success: true, message: "Application submitted successfully" };
  },
});

export const getAllApplications = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("auditApplications").collect();
  },
});
