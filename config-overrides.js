module.exports = function override(config) {
  
const fallback = config.resolve.fallback || {};
Object.assign(fallback, {
  crypto: require.resolve("crypto-browserify"),
  stream: require.resolve("stream-browserify"),
  buffer: require.resolve("buffer/"),
  vm: require.resolve("vm-browserify"),
  assert: require.resolve("assert/"),
  util: require.resolve("util/"),
  os: require.resolve("os-browserify/browser"),
  url: require.resolve("url/"),
    http: require.resolve("stream-http"),
    net:false,
});
//  config.plugins = (config.plugins || []).concat([
//     new webpack.ProvidePlugin({
//       Buffer: ['buffer', 'Buffer'],
//     }),
//   ]);
config.resolve.fallback = fallback;  
return config; 
};
 