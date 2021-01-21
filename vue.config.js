module.exports = {
    publicPath: '/messanger/',
    configureWebpack: {
      optimization: {
        splitChunks: {
          chunks: 'initial',
        }
      }
    }
  }