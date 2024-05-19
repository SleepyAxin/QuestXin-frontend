const { defineConfig } = require('@vue/cli-service')
const devServerConfig = require('./Proxy.Config.js')

module.exports = defineConfig
({
  transpileDependencies: true,
  publicPath: '/',
  devServer: devServerConfig
})
