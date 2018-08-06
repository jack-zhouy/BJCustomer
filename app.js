//app.js

App({
  GlobalConfig: {
    baseUrl: 'http://www.yunnanbaijiang.com',
    appid: 'wxb137ebfa3dc90901',
    secret: 'ec3bbfe9300efa39b561ebac0aac5f2d',
    openid: null
  }, 

  //baseUrl: 'http://47.106.71.160',
  getUserInfoEx: function () {
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId

        this.globalData.userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求 
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getUserInfoEx();
         
        }else{
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              // 用户已经同意
              wx.getUserInfo({
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  this.getUserInfoEx();
                }
              })
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userId:null,
    name:null,
    phone:null,
    loginState: false,
    //商品类型
    typecode: "0001",
    address:{},
    //结算类型
    settlementTypeCode:null
  }

})