import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import { env } from "~/env";
import crypto from "crypto";

const resend = new Resend(env.RESEND_API_KEY);

export const authRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      // Check if user already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await ctx.db.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      });

      // Generate verification token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Save verification token
      await ctx.db.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      // Send verification email
      const verificationUrl = `${env.NEXTAUTH_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

      try {
        await resend.emails.send({
          from: env.FROM_EMAIL,
          to: email,
          subject: "Verify your email address",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Welcome to Panaah!</h2>
              <p>Hello ${name},</p>
              <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
          `,
        });
      } catch (error) {
        console.error("Failed to send verification email:", error);
        // Don't throw error here, user is created but email failed
      }

      return {
        success: true,
        message: "Account created successfully! Please check your email to verify your account.",
        userId: user.id,
      };
    }),

  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { token, email } = input;

      // Find verification token
      const verificationToken = await ctx.db.verificationToken.findUnique({
        where: { token },
      });

      if (!verificationToken) {
        throw new Error("Invalid verification token");
      }

      if (verificationToken.identifier !== email) {
        throw new Error("Token does not match email");
      }

      if (verificationToken.expires < new Date()) {
        throw new Error("Verification token has expired");
      }

      // Update user as verified
      await ctx.db.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      });

      // Delete the verification token
      await ctx.db.verificationToken.delete({
        where: { token },
      });

      return {
        success: true,
        message: "Email verified successfully! You can now sign in.",
      };
    }),

  resendVerification: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const { email } = input;

      // Check if user exists and is not verified
      const user = await ctx.db.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("No account found with this email");
      }

      if (user.emailVerified) {
        throw new Error("Email is already verified");
      }

      // Delete existing verification tokens for this email
      await ctx.db.verificationToken.deleteMany({
        where: { identifier: email },
      });

      // Generate new verification token
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await ctx.db.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires,
        },
      });

      // Send verification email
      const verificationUrl = `${env.NEXTAUTH_URL}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

      try {
        await resend.emails.send({
          from: env.FROM_EMAIL,
          to: email,
          subject: "Verify your email address",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Email Verification</h2>
              <p>Hello ${user.name},</p>
              <p>Please verify your email address to complete your registration.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
            </div>
          `,
        });

        return {
          success: true,
          message: "Verification email sent successfully!",
        };
      } catch (error) {
        console.error("Failed to send verification email:", error);
        throw new Error("Failed to send verification email");
      }
    }),
});