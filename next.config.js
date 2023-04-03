module.exports = {
  async rewrites() {
    return [
      {
        source: "/favicon.ico",
        destination: "/",
      },
    ];
  },
};
