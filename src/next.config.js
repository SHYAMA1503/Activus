//src>>next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://activus-hqg2c8d7gqg7bbhq.eastasia-01.azurewebsites.net/api/:path*',
        },
      ];
    },
  };
  