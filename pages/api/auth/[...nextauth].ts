/* import { NextApiHandler } from 'next'; */
import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
/* import CredentialsProvider from "next-auth/providers/credentials"; */
import { prisma } from "../../../db";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";
import { createTransport } from "nodemailer";
/* import bcrypt from "bcrypt"; */

export const authOptions: NextAuthOptions = {
  theme: {
    colorScheme: "light",
    brandColor: "#0EC164",
    logo: "https://" + process.env.NEXT_PUBLIC_VERCEL_URL + "/images/logo.png",
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
      async sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
      }) {
        const { host } = new URL(url);
        // NOTE: You are not required to use `nodemailer`, use whatever you want.
        const transport = createTransport(server);
        const result = await transport.sendMail({
          to: email,
          from: from,
          subject: `Entre em nossa Dashboard`,
          text: text({ url, host }),
          html: html({ url, host }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
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

function html(params: { url: string; host: string }) {
  const { url, host } = params;
  console.log(host);

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = "#0EC164";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Entre em nossa dashboard
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Entrar</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Se você não pediu por esse email basta ignora-lo
      </td>
    </tr>
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Entre em nossa dashboard`;
}

export default NextAuth(authOptions);
