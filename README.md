This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://10.0.20.95:3000](http://10.0.20.95:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Running with Docker

Build the production image:

```bash
docker build -t assista-main:latest /Users/jestinjoseph/Documents/personal/assista-al/assista-main
```

Run the container with the required authentication environment variables (replace the placeholder values with your secrets):

```bash
docker run -d \
  --name assista-main \
  -p 3000:3000 \
  -e NEXTAUTH_SECRET=$(openssl rand -base64 32) \
  -e NEXTAUTH_URL=http://10.0.20.95:3000 \
  -e AUTH_GOOGLE_ID=your-google-client-id \
  -e AUTH_GOOGLE_SECRET=your-google-client-secret \
  -e AUTH_GITHUB_ID=your-github-client-id \
  -e AUTH_GITHUB_SECRET=your-github-client-secret \
  assista-main:latest
```

You can also place these values in an env file (for example `.env.production`) and pass it with `--env-file`, keeping secrets out of the command history.

If you already maintain a `.env.local` with the same variables, you can reuse it:

```bash
docker run -d \
  --name assista-main \
  -p 3000:3000 \
  --env-file .env.local \
  assista-main:latest
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Authentication Setup

This project uses [NextAuth.js](https://authjs.dev) with Google and GitHub providers.

1. Create OAuth credentials with Google and GitHub (OAuth app, callback URL `http://10.0.20.95:3000/api/auth/callback/{provider}`).
2. Copy the generated client IDs and secrets.
3. Add the following variables to your `.env.local` (use the same values when running the Docker image). `NEXTAUTH_SECRET` is preferred, but `AUTH_SECRET` is also accepted for backward compatibility:

   ```bash
   NEXTAUTH_SECRET=replace-with-random-string
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret
   AUTH_GITHUB_ID=your-github-client-id
   AUTH_GITHUB_SECRET=your-github-client-secret
   ```

   Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`.

4. Restart the dev server so the new environment values are picked up.

When you visit the site you can sign in/out from the header buttons. The default NextAuth sign-in page provides the Google and GitHub options.

## Dashboard and User Sync

- Set `BACKEND_API_URL` (or `NEXT_PUBLIC_API_URL`) so the app can reach the Assista Wiki backend. This is used for all `/api/news` routes as well as the new user syncing flow.
- Sign-in now checks for an existing account in the backend first: users who haven’t registered are redirected to `/signup`, which creates their profile by calling `POST /api/users`. Existing accounts simply refresh metadata on every login.
- Authenticated visitors can access `/dashboard` for profile, settings, and billing management. The dashboard requires a valid session and will redirect unauthenticated users to `/signin`.

## IDE Single Sign-On (SSO)

Follow these steps to let an external IDE reuse the same NextAuth session.

### 1. Prerequisites

- Make sure the env variables above are set.
- Add `NEXTAUTH_URL` to `.env.local` pointing to the deployed URL (e.g. `https://assista.example.com`).
- Enable JWT sessions (already configured in `auth.config.js`).

### 2. Session API endpoint

- The IDE should call `GET /api/auth/session`. This route returns the current NextAuth session if a valid cookie is present; otherwise it responds with `401`.
- `app/api/auth/session/route.js` is the server handler:

```9:23:app/api/auth/session/route.js
import { getServerSession } from "next-auth";
import { authConfig } from "@/auth.config";

export async function GET() {
  const session = await getServerSession(authConfig);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  return Response.json(session);
}
```

### 3. IDE login flow

1. **Silent check** – When the IDE starts, load `https://your-domain/api/auth/session` inside a cookie-aware context (embedded browser/web view).
   - If the response is `200`, parse the JSON and store the session token locally. The user is already signed in.
2. **Fallback** – If the session API returns `401`, open `https://your-domain/signin?callbackUrl=ide://callback` in a browser/web view.
   - After the user completes Google/GitHub auth, NextAuth redirects to the `callbackUrl`.
   - Handle the custom scheme (`ide://callback`) in your IDE, close the browser window, then call the session endpoint again to retrieve the now-authenticated session.

### 4. Storing the session in the IDE

- The session response contains user info and (if you enable JWT strategy) an access token. Save it securely (macOS Keychain, Windows Credential Manager, etc.).
- Attach this token/cookie to subsequent IDE API calls to authorize the user.
- When the token expires or you receive 401s from the API, repeat the login flow.

### 5. Tips

- Use `openssl rand -base64 32` to rotate `AUTH_SECRET` if you deploy to multiple environments.
- For local development, you can set `NEXTAUTH_URL=http://10.0.20.95:3000` so the IDE can test against your dev server.
- If you need refresh tokens for long-lived sessions, customize the `jwt` and `session` callbacks in `auth.config.js` to persist OAuth access tokens.
