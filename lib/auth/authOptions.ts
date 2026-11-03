import crypto from "crypto";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getPayload } from "payload";
import config from "@payload-config";
import type { User } from "@/payload-types";
import { sendTrackedEmail } from "@/lib/email/sendTrackedEmail";
import { generateWelcomeEmail } from "@/lib/email/templates/welcome";
import { generateAdminNewUserEmail } from "@/lib/email/templates/adminNewUser";
import { generateGoogleLinkedEmail } from "@/lib/email/templates/passwordSecurity";
import { ADMIN_EMAIL } from "@/lib/email/layout";

// Fail fast rather than letting NextAuth fall back to an insecure default session secret.
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is required and must not be empty.");
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const payload = await getPayload({ config });
        try {
          const result = await payload.login({
            collection: "users",
            data: { email: credentials.email, password: credentials.password },
            overrideAccess: true,
          });
          if (!result.user) return null;
          const user = result.user as User;
          return { id: String(user.id), email: user.email, role: user.role ?? "customer" };
        } catch {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;

      const payload = await getPayload({ config });
      const googleId = account.providerAccountId;
      const email = profile?.email || user.email;
      if (!email) return false;
      // Google self-reports whether it has verified this address — only trust it, and only
      // auto-link/auto-create an account, when that flag is true.
      if ((profile as any)?.email_verified === false) return false;

      const byGoogleId = await payload.find({
        collection: "users",
        where: { googleId: { equals: googleId } },
        limit: 1,
        overrideAccess: true,
      });

      if (byGoogleId.docs.length > 0) {
        user.id = String(byGoogleId.docs[0].id);
        (user as any).role = byGoogleId.docs[0].role ?? "customer";
        return true;
      }

      const byEmail = await payload.find({
        collection: "users",
        where: { email: { equals: email.toLowerCase() } },
        limit: 1,
        overrideAccess: true,
      });

      if (byEmail.docs.length > 0) {
        const linked = await payload.update({
          collection: "users",
          id: byEmail.docs[0].id,
          data: { googleId },
          overrideAccess: true,
        });
        user.id = String(linked.id);
        (user as any).role = linked.role ?? "customer";

        const linkedNotice = generateGoogleLinkedEmail();
        void sendTrackedEmail({ to: email, subject: linkedNotice.subject, html: linkedNotice.html });

        return true;
      }

      const nameParts = (profile?.name || "").split(" ");
      const created = await payload.create({
        collection: "users",
        data: {
          email,
          googleId,
          role: "customer",
          authProvider: "google",
          emailVerified: true,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          password: crypto.randomBytes(32).toString("hex"),
        },
        overrideAccess: true,
      });
      user.id = String(created.id);
      (user as any).role = created.role ?? "customer";

      const welcome = generateWelcomeEmail(nameParts[0] || "");
      void sendTrackedEmail({ to: email, subject: welcome.subject, html: welcome.html });
      const adminNotice = generateAdminNewUserEmail({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
        email,
        authProvider: "google",
      });
      void sendTrackedEmail({ to: ADMIN_EMAIL, subject: adminNotice.subject, html: adminNotice.html });

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.payloadUserId = user.id;
        token.role = (user as any).role ?? "customer";

        const payload = await getPayload({ config });
        const parsedId = isNaN(Number(user.id)) ? user.id : Number(user.id);
        const fullUser = await payload
          .findByID({ collection: "users", id: parsedId, overrideAccess: true })
          .catch(() => null);
        if (fullUser) {
          token.firstName = fullUser.firstName || undefined;
          token.lastName = fullUser.lastName || undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.payloadUserId as string;
        session.user.role = token.role as string;
        session.user.firstName = token.firstName as string | undefined;
        session.user.lastName = token.lastName as string | undefined;
      }
      return session;
    },
  },
};
