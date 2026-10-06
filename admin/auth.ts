import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { createHmac } from "node:crypto";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (!data?.success || !data?.user?.id || !data?.token) {
            return null;
          }

          return {
            id: String(data.user.id),
            name: data.user.name,
            email: data.user.email,
            image: data.user.image ?? null,
            backendAccessToken: data.token,
          };
        } catch (error) {
          console.error("Credentials login error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Google login
      if (account?.provider === "google") {
        try {
          if (!user.name || !user.email) {
            return false;
          }

          const payload = {
            name: user.name,
            email: user.email,
            image: user.image ?? null,
          };
          const bridgeSecret = process.env.AUTH_BRIDGE_SECRET;
          if (!bridgeSecret || bridgeSecret.length < 32) {
            throw new Error("AUTH_BRIDGE_SECRET is not configured correctly");
          }
          const timestamp = Math.floor(Date.now() / 1000).toString();
          const signature = createHmac("sha256", bridgeSecret)
            .update(`${timestamp}.${JSON.stringify(payload)}`)
            .digest("hex");
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Auth-Timestamp": timestamp,
                "X-Auth-Signature": signature,
              },
              body: JSON.stringify(payload),
            }
          );

          const data = await response.json();

          if (!response.ok || !data?.success || !data?.user?.id) {
            return false;
          }

          user.id = String(data.user.id);
          (
            user as typeof user & { backendAccessToken?: string }
          ).backendAccessToken = data.token;

          return true;
        } catch {
          console.error("Google sign-in could not be completed");
          return false;
        }
      }

      // Credentials provider has already authenticated
      // through /api/public/auth/login.
      return true;
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      const backendAccessToken = (
        user as typeof user & { backendAccessToken?: string } | undefined
      )?.backendAccessToken;
      if (backendAccessToken) {
        token.backendAccessToken = backendAccessToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.id && session.user) {
        (session.user as typeof session.user & { id: string }).id = String(token.id);
      }

      const backendAccessToken = (
        token as typeof token & { backendAccessToken?: string }
      ).backendAccessToken;
      if (backendAccessToken) {
        (session as typeof session & { backendAccessToken?: string })
          .backendAccessToken = backendAccessToken;
      }

      return session;
    },
  },
};