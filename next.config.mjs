// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

const isProd = process.env.NODE_ENV === 'production';

export default {
  output: 'export',
  basePath: isProd ? '/familytreee' : '',
  assetPrefix: isProd ? '/familytree/' : '',
};


// export default nextConfig