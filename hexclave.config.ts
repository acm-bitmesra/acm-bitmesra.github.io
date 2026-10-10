export const config = {
  "apps": {
    "installed": {
      "authentication": {
        "enabled": true
      },
      "teams": {
        "enabled": true
      },
      "rbac": {
        "enabled": true
      },
      "api-keys": {
        "enabled": true
      },
      "payments": {
        "enabled": true
      },
      "emails": {
        "enabled": true
      },
      "data-vault": {
        "enabled": true
      },
      "webhooks": {
        "enabled": true
      },
      "launch-checklist": {
        "enabled": true
      },
      "vercel": {
        "enabled": true
      },
      "clerk-integration": {
        "enabled": true
      },
      "better-auth-integration": {
        "enabled": true
      },
      "workos-integration": {
        "enabled": true
      },
      "analytics": {
        "enabled": true
      }
    }
  },
  "auth": {
    "password": {
      "allowSignIn": true
    },
    "otp": {
      "allowSignIn": true
    },
    "passkey": {
      "allowSignIn": true
    },
    "oauth": {
      "providers": {
        "google": {
          "type": "google",
          "allowSignIn": true,
          "allowConnectedAccounts": true
        },
        "github": {
          "type": "github",
          "allowSignIn": true,
          "allowConnectedAccounts": true
        }
      }
    }
  },
  "emails": {
    "selectedThemeId": "a0172b5d-cff0-463b-83bb-85124697373a"
  }
};
