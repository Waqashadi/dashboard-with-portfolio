import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

 callbacks: {
  async signIn({ user }) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            image: user.image,
          }),
        }
      );

      const data = await res.json();

      if (res.ok && data?.user?.user_id) {
        // Attach the DB ID to user object
        user.id = data.user.user_id.toString();
        return true;
      }

      return false;
    } catch (err) {
      console.error("Sign-in error:", err);
      return false;
    }
  },

  async jwt({ token, user, trigger }) {
    // During initial sign in, 'user' is passed into jwt
    if (user?.id) {
      token.id = user.id;
    }
    return token;
  },

  async session({ session, token }) {
    if (token?.id) {
      session.user = {
        ...(session.user ?? {}),
        id: token.id as string,
      } as typeof session.user;
    }
    return session;
  },
},



});