const nextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: import.meta.dirname,
  turbopack: { root: import.meta.dirname },
  devIndicators: false,
  agentRules: false,
};

export default nextConfig;
