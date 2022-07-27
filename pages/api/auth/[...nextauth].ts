/* import { NextApiHandler } from 'next'; */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../db";
import type { NextAuthOptions } from "next-auth";
import fetch from "node-fetch";

export const authOptions: NextAuthOptions = {
  theme: {
    colorScheme: "auto",
    brandColor: "#F43F5F",
    logo: "https://" + process.env.NEXT_PUBLIC_VERCEL_URL + "/images/logo.svg",
  },

  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const res = await fetch(
          "https://webhook.site/f0fe38df-dd11-4871-a66b-880e409bbff3",
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        console.log(user);
        console.log(res.ok);

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.user = token;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
