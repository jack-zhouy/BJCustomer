//获取应用实例
const app = getApp();

Page({
  // 页面显示（一个页面只会调用一次）
  onShow: function () {
    var app = getApp();
    //如果没有登录就跳转到登录页面
    if (!app.globalData.loginState) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },
  bindCheckAccount: function (e) {
    wx.requestPayment({
      'timeStamp': '',
      'nonceStr': '',
      'package': '',
      'signType': 'MD5',
      'paySign': '',
      'success': function (res) {
      },
      'fail': function (res) {
      }
    })
  },
})