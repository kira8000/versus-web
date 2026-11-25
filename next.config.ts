import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Protótipo antigo (um index.html com o save no localStorage desta origem): segue em /legado/.
  async rewrites() {
    return [{ source: '/legado', destination: '/legado/index.html' }];
  },
};

export default nextConfig;
