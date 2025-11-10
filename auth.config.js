import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

const googleProvider = Google({
  clientId: process.env.AUTH_GOOGLE_ID,
  clientSecret: process.env.AUTH_GOOGLE_SECRET,
});

const githubProvider = GitHub({
  clientId: process.env.AUTH_GITHUB_ID,
  clientSecret: process.env.AUTH_GITHUB_SECRET,
});

const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

export const authConfig = {
  providers: [googleProvider, githubProvider],
  secret: authSecret,
  pages: {
    signIn: "/signin",
  },
  trustHost: true,
};

