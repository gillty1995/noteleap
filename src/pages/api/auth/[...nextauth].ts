// pages/api/auth/[...nextauth].ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  debug: true,
    events: {
    signIn({ user, account, profile }) {
      console.log("EVENT signIn:", { user, account });
    },
    createUser(user) {
      console.log("EVENT createUser:", user);
    },
  },
  logger: {
    error(code, metadata) { console.error("NEXTAUTH ERROR", code, metadata) },
    warn(code)     { console.warn("NEXTAUTH WARN", code) },
    debug(code)    { console.debug("NEXTAUTH DEBUG", code) },
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    Auth0Provider({
      clientId:     process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer:       process.env.AUTH0_ISSUER!,
    }),
   CredentialsProvider({
      name: "Email",
      credentials: {
        email:    { label: "Email",    type: "text"     },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // make sure both fields are present
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password required");
        }

        // look up the user
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });
        if (!user) {
          throw new Error("User not found");
        }
        if (!user.passwordHash) {
          throw new Error("No password set");
        }

        // verify the password
        const isValid = await verifyPassword(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return { id: user.id, email: user.email, name: user.name, image: user.image };
      },
    }),
  ],
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET, 
     // @ts-expect-error/encryption isn’t in your current types yet
    encryption: true, },
  
    pages: {
    signIn: "/",
    error: "/",  
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  
};

export default NextAuth(authOptions);