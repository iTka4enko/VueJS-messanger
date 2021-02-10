module.exports = {
    publicPath: '/messenger/',
    configureWebpack: {
      optimization: {
        splitChunks: {
          chunks: 'initial',
        }
      }
    }
  }