'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"/api/v1"',
  TUI_WS_SERVERURL:'"ws://119.27.179.175:12010"',
  FILE_SERVER_URL: '"http://119.27.179.175:9800"',
  CTI_WS_SERVERURL:'"ws://119.27.184.157:9050/"',
  CTI_MONITOR_WS_SERVERURL:'"ws://119.27.184.157:9052/"',
  SHOW_WECHAT:true
})
