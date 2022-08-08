/* import { NextApiHandler } from 'next'; */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
/* import CredentialsProvider from "next-auth/providers/credentials"; */
import { prisma } from "../../../db";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";
/* import bcrypt from "bcrypt"; */

export const authOptions: NextAuthOptions = {
  theme: {
    colorScheme: "light",
    brandColor: "#0EC164",
    /* logo: "https://" + process.env.NEXT_PUBLIC_VERCEL_URL + "/images/logo.svg", */
  },

  session: {
    maxAge: 365 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },

  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 365 * 24 * 60 * 60,
    }),
    /*   CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const userAuth = await prisma.user.findUnique({
          where: {
            email: credentials.username,
          },
        });

        const userPassword = userAuth.password;

        const isValid = await bcrypt.compare(
          credentials.password,
          userPassword
        );

        const userData = {
          id: userAuth.id,
          name: userAuth.name,
          email: userAuth.email,
          role: userAuth.role,
          image: userAuth.image,
          carbonPercentage: userAuth.carbonPercentage,
          company_id: userAuth.company_id,
        };

        if (isValid) {
          return userData;
        } else {
          return null;
        }
      },
    }), */
  ],
  adapter: PrismaAdapter(prisma),

  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
  /* callbacks: {
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
  }, */
};

export default NextAuth(authOptions);
