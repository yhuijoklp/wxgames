// app.js
const config = require('./utils/config');
App({
  ajaxUrl: config.bizlogic.ajaxUrl,
  ajaxImg: config.bizlogic.ajaxImg,
  token: config.bizlogic.token,
  cname: config.bizlogic.cname,
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null
  }
})
