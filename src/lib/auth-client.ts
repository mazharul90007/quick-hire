import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace("/api/v1", "")
    : "https://quick-hire-server.onrender.com",
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
      status: {
        type: "string",
      },
    },
  },
});
