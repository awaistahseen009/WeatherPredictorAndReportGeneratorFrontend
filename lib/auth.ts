import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

// Environment variable validation
const requiredEnvVars = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

// Check for required environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value && key !== "NEXTAUTH_URL" && key !== "GOOGLE_CLIENT_ID" && key !== "GOOGLE_CLIENT_SECRET") {
    throw new Error(`${key} environment variable is required`);
  }
});

// Check for Google OAuth environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("Google OAuth environment variables not found. Google authentication will be disabled.");
}

// NextAuth configuration
export const authOptions = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials) {
        try {
          // Validate input
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(credentials.email)) {
            console.log("Invalid email format");
            return null;
          }

          // Query database for user
          const userQuery = await db
            .select({
              id: users.id,
              email: users.email,
              name: users.name,
              password: users.password,
              image: users.image,
            })
            .from(users)
            .where(eq(users.email, credentials.email.toLowerCase().trim()))
            .limit(1);

          if (!userQuery || userQuery.length === 0) {
            console.log("User not found");
            return null;
          }

          const user = userQuery[0];

          if (!user.password) {
            console.log("User has no password (OAuth account)");
            return null;
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!passwordMatch) {
            console.log("Invalid password");
            return null;
          }

          console.log("✓ User authenticated successfully");

          // Return user object (password excluded)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      try {
        // Initial sign in
        if (user) {
          token.id = user.id;
          token.name = user.name || null;
          token.email = user.email || null;
          token.picture = user.image || null;
        }

        // OAuth account linking
        if (account) {
          token.accessToken = account.access_token;
          token.provider = account.provider;
        }

        return token;
      } catch (error) {
        console.error("JWT callback error:", error);
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.id as string;
          session.user.name = (token.name as string) || null;
          session.user.email = (token.email as string) || null;
          session.user.image = (token.picture as string) || null;

          // Add custom fields if needed
          session.accessToken = token.accessToken as string;
          session.provider = token.provider as string;
        }

        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    async signIn({ user, account, profile }) {
      try {
        // Allow all sign-ins by default
        if (account?.provider === "credentials") {
          return true;
        }

        // For OAuth providers, you can add additional checks here
        if (account?.provider === "google") {
          // Example: Check if email is verified for Google OAuth
          if (profile?.email_verified !== false) {
            return true;
          }
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },
  },

  events: {
    async signIn(message) {
      console.log("User signed in:", message.user.email);
    },
    async signOut(message) {
      console.log("User signed out");
    },
    async createUser(message) {
      console.log("New user created:", message.user.email);
    },
  },

  // Enable debug messages in development
  debug: process.env.NODE_ENV === "development",

  // Additional security options
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
};

// Initialize NextAuth
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// Export handlers for API routes
export const { GET, POST } = handlers;

// Helper functions for easier usage
export const getServerAuthSession = () => auth();

// Type definitions (if using TypeScript)
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    accessToken?: string;
    provider?: string;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    provider?: string;
  }
}
