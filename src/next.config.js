//src>>next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://activusserver.onrender.com/api/:path*',
        },
      ];
    },
  };
  