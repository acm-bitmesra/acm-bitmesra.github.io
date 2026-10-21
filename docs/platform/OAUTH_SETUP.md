# ACM BIT Mesra OAuth & Integration Setup Guide

---

## 1. Google OAuth Setup (University Identity Login)

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a project for **ACM BIT Mesra**.
3. Navigate to **APIs & Services** > **OAuth consent screen**:
   - User Type: **Internal** (if Google Workspace organization-wide) or **External** with test users.
   - App Name: `ACM BIT Mesra Student Platform`
   - Scopes: `openid`, `email`, `profile`.
4. Navigate to **Credentials** > **Create Credentials** > **OAuth client ID**:
   - Application type: **Web application**
   - Name: `ACM BIT Mesra Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000`
     - `https://acmbitm.campsy.app`
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://acmbitm.campsy.app/api/auth/callback/google`
5. Copy `Client ID` to `GOOGLE_CLIENT_ID` and `Client Secret` to `GOOGLE_CLIENT_SECRET`.

---

## 2. GitHub OAuth Setup (Developer Account Linking)

> [!IMPORTANT]
> GitHub OAuth is **not** used to sign in to the website. It is used strictly inside the authenticated Student Dashboard (`/dashboard/settings`) to verify developer ownership and scan open-source contributions.

1. Open [GitHub Developer Settings](https://github.com/settings/developers).
2. Click **New OAuth App**:
   - Application name: `ACM BIT Mesra Developer Portal`
   - Homepage URL: `https://acmbitm.campsy.app`
   - Application description: `Developer verification and contribution evaluation for ACM BIT Mesra students.`
   - **Authorization callback URL**:
     - Development: `http://localhost:3000/api/integrations/github/callback`
     - Production: `https://acmbitm.campsy.app/api/integrations/github/callback`
3. Click **Register application**.
4. Generate a **Client Secret**.
5. Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in your environment or Cloudflare Worker secrets.
6. Minimal requested scopes: `read:user` (or public profile identity).
