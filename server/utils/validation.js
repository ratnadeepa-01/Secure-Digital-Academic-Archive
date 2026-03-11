const { z } = require("zod");

// Auth Schemas
exports.registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "staff"]).optional().default("student")
});

exports.loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

exports.forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format")
});

exports.resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters")
});

// Assignment Schemas
exports.createAssignmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  subject: z.string().min(2, "Subject is required"),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  })
});

exports.updateAssignmentStatusSchema = z.object({
  status: z.enum(["OPEN", "CLOSED"])
});

// Submission Schemas
exports.reviewSubmissionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
  remarks: z.string().optional()
});

// Personal Document Schemas
exports.uploadDocSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  isPrivate: z.union([z.boolean(), z.string().transform(v => v === 'true')]).optional()
});
