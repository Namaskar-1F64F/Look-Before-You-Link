module.exports = {
  async rewrites() {
    return [
      {
        source: "/item",
        destination: "/api/item",
      },
    ];
  },
};
