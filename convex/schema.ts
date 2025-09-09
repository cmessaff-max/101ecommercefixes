import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const applicationTables = {
  emailSubscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    accessGranted: v.boolean(),
  }).index("by_email", ["email"]),
  
  auditApplications: defineTable({
    name: v.string(),
    brand: v.string(),
    storeUrl: v.string(),
    monthlyAdSpend: v.string(),
    email: v.string(),
    submittedAt: v.number(),
    status: v.string(),
  }).index("by_email", ["email"]),
};

// Create a more permissive users table that includes the createdAt field
const customAuthTables = {
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    createdAt: v.optional(v.number()), // Add this field to handle existing data
  })
    .index("email", ["email"])
    .index("phone", ["phone"]),
};

export default defineSchema({
  ...customAuthTables,
  ...applicationTables,
});
