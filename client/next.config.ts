import type { NextConfig, Redirect } from "next";

const nextConfig: NextConfig = {
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/snippets",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
