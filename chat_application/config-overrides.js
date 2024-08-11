module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};

    Object.assign(fallback, {
        "https": require.resolve("https-browserify") ,
        "querystring": require.resolve("querystring-es3"),
        "http": require.resolve("stream-http"),
        "http": require.resolve("stream-http"),
        "os": require.resolve("os-browserify/browser"),
        "stream": require.resolve("stream-browserify"),
        "path": require.resolve("path-browserify"),
        "querystring": require.resolve("querystring-es3"),
        "crypto": require.resolve("crypto-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        net: false,
        fs: false,
        tls: false,
        "child_process": false,
        "http2": false,

    })
    config.resolve.fallback = fallback
    return config
}