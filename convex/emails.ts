import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribeEmail = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const existingSubscriber = await ctx.db
      .query("emailSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingSubscriber) {
      // Update access granted for existing user
      await ctx.db.patch(existingSubscriber._id, {
        accessGranted: true,
      });
      
      return {
        success: true,
        isNew: false,
        hasAccess: true
      };
    }

    // Create new subscriber with immediate access
    await ctx.db.insert("emailSubscribers", {
      email: args.email,
      subscribedAt: Date.now(),
      accessGranted: true,
    });

    return {
      success: true,
      isNew: true,
      hasAccess: true
    };
  },
});

export const checkEmailAccess = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    if (!args.email) return { hasAccess: false, exists: false };
    
    const subscriber = await ctx.db
      .query("emailSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    return {
      hasAccess: subscriber?.accessGranted || false,
      exists: !!subscriber
    };
  },
});
