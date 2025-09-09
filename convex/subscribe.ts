import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    await ctx.db.insert("subscribers", { email, createdAt: Date.now() });
    return { ok: true };
  }
});
