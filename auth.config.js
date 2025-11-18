import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { randomUUID } from "crypto";

const googleProvider = Google({
  clientId: process.env.AUTH_GOOGLE_ID,
  clientSecret: process.env.AUTH_GOOGLE_SECRET,
});

const githubProvider = GitHub({
  clientId: process.env.AUTH_GITHUB_ID,
  clientSecret: process.env.AUTH_GITHUB_SECRET,
});

const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
const backendApiBase =
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://10.0.20.95:5173";

function resolveDeviceLabel(userAgent = "") {
  if (!userAgent) return "Web";
  if (/Electron/i.test(userAgent)) return "Desktop App";
  if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) return "Mobile";
  if (/Macintosh|Windows|Linux/i.test(userAgent)) return "Desktop App";
  return "Web";
}

async function registerSessionOnBackend({ sessionId, email, provider, userAgent, ipAddress }) {
  try {
    const response = await fetch(`${backendApiBase}/auth/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        user_email: email,
        provider,
        device: resolveDeviceLabel(userAgent),
        user_agent: userAgent,
        ip_address: ipAddress,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || `Failed to register session (${response.status})`);
    }

    return true;
  } catch (error) {
    console.error("[Auth] Failed to register session", error);
    return false;
  }
}

async function isSessionRevoked(sessionId) {
  try {
    const response = await fetch(`${backendApiBase}/auth/sessions/${sessionId}/status`, {
      method: "GET",
    });

    if (response.status === 404) {
      return true;
    }

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data?.active === false;
  } catch (error) {
    console.error("[Auth] Failed to verify session status", error);
    return false;
  }
}

const credentialsProvider = Credentials({
  name: "Email and Password",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    const email = credentials?.email?.trim();
    const password = credentials?.password?.trim();

    if (!email || !password) {
      throw new Error("MissingCredentials");
    }

    try {
      const response = await fetch(`${backendApiBase}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || "InvalidCredentials");
      }

      const data = await response.json();

      if (!data?.email) {
        throw new Error("InvalidCredentials");
      }

      return {
        id: data.id?.toString() || data.email,
        email: data.email,
        name: data.name,
        image: data.image,
        provider: "credentials",
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "InvalidCredentials";
      throw new Error(message || "InvalidCredentials");
    }
  },
});

async function userExists(email) {
  try {
    const response = await fetch(`${backendApiBase}/api/users/${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      return false;
    }

    if (!response.ok) {
      throw new Error(`Lookup failed with status ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to verify user on backend:", error);
    throw error;
  }
}

async function syncUserWithBackend(user, provider) {
  if (!user?.email) {
    return false;
  }

  try {
    const response = await fetch(`${backendApiBase}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        name: user.name ?? "",
        image: user.image ?? "",
        provider: provider ?? "unknown",
      }),
    });

    if (!response.ok) {
      let errorPayload = null;
      try {
        errorPayload = await response.json();
      } catch {
        errorPayload = await response.text();
      }
      console.error("[Auth] Failed to sync user with backend", {
        status: response.status,
        statusText: response.statusText,
        body: errorPayload,
      });
      return false;
    }

    const payload = await response.json().catch(() => null);
    console.info("[Auth] Synced user with backend", {
      provider,
      email: user.email,
      response: payload,
    });

    return true;
  } catch (error) {
    console.error("Failed to sync user with backend:", error);
    return false;
  }
}

export const authConfig = {
  providers: [credentialsProvider, googleProvider, githubProvider],
  secret: authSecret,
  pages: {
    signIn: "/signin",
  },
  trustHost: true,
  callbacks: {
    async signIn({ user, account }, request) {
      if (!user?.email) {
        return false;
      }

      const providerId = account?.provider || "credentials";

      if (providerId !== "credentials") {
        const req = request ?? {};
        console.info("[Auth] signIn callback", {
          email: user.email,
          provider: providerId,
          url: req?.url,
        });

        try {
          const exists = await userExists(user.email);
          if (!exists) {
            const created = await syncUserWithBackend(user, providerId);
            if (!created) {
              return "/signup?error=RegistrationFailed";
            }
          }
        } catch (error) {
          console.error("Sign-in validation failed:", error);
          return "/signin?error=AuthServerError";
        }
      }

      const userAgent = request?.headers?.get("user-agent") ?? "";
      const ipHeader =
        request?.headers?.get("x-forwarded-for") ||
        request?.headers?.get("x-real-ip") ||
        "";
      const ipAddress = ipHeader.split(",")[0]?.trim() || undefined;

      const sessionId = randomUUID();
      const registered = await registerSessionOnBackend({
        sessionId,
        email: user.email,
        provider: providerId,
        userAgent,
        ipAddress,
      });

      user.sessionId = sessionId;
      user.sessionRegistered = registered;

      return true;
    },
    async jwt({ token, user, account, trigger }) {
      if (trigger === "signIn" && user) {
        token.sessionId = user.sessionId || randomUUID();
        token.sessionRegistered = Boolean(user.sessionRegistered);
        token.provider = account?.provider || token.provider;
        token.email = user.email || token.email;
        // Store JWT tokens from credentials login
        if (user.access_token) {
          token.access_token = user.access_token;
        }
        if (user.refresh_token) {
          token.refresh_token = user.refresh_token;
        }
      }

      if (!token.sessionId) {
        token.sessionId = randomUUID();
      }

      if (account?.provider) {
        token.provider = account.provider;
      }

      if (token.sessionId && token.email && token.sessionRegistered !== false) {
        const revoked = await isSessionRevoked(token.sessionId);
        token.sessionRevoked = revoked;
      }

      if (typeof token.sessionRevoked === "undefined") {
        token.sessionRevoked = false;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.sessionRevoked) {
        return null;
      }
      if (session?.user && token?.provider) {
        session.user.provider = token.provider;
      }
      if (session && token?.sessionId) {
        session.sessionId = token.sessionId;
      }
      // Include JWT tokens in session for IDE usage
      if (token?.access_token) {
        session.access_token = token.access_token;
      }
      if (token?.refresh_token) {
        session.refresh_token = token.refresh_token;
      }
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.sessionId) {
        try {
          await fetch(`${backendApiBase}/auth/sessions/${token.sessionId}/revoke`, {
            method: "POST",
          });
        } catch (error) {
          console.error("[Auth] Failed to revoke session on sign-out", error);
        }
      }
    },
  },
};

