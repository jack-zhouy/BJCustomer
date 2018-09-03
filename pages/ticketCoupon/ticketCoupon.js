var util = require("../../utils/util.js");
var that;
Page({
  data: {
    //全局状态信息
    userInfo: {},
    userId: null,
    loginState: false,
    ticketsList: [], 
    ticketHide:false,
    couponHide:false,
  },

  onLoad: function (options) {
    that = this;

    //判断是查看资料还是修改资料模式
    var model = options.model;
    if (model == 'checkTicket') {
      wx.setNavigationBarTitle({
        title: '我的气票',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      that.setData({
        couponHide: true,
      });
      that.checkTicketRequest();
    }
    else if (model == 'checkCoupon'){
      wx.setNavigationBarTitle({
        title: '我的优惠券',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      that.setData({
        ticketHide: true,
      });
      that.checkCouponRequest();
    }

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var app = getApp();
    if (app.globalData.loginState) {
      that.setData({
        loginState: true,
        userInfo: app.globalData.userInfo,
        userId: app.globalData.userId
      });
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.checkTicketRequest();
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
//查询气票客户名下的气票
  checkTicketRequest:function(){
    var that = this;
    var app = getApp();
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/Ticket",
      method: "GET",
      data: {
        customerUserId: app.globalData.userId,
        useStatus: 0 
      },
      complete: function (res) {
        if (res.statusCode == 200) {
      
          that.setData({
            ticketsList: res.data.items,
            loading: true
          })
        }
        else
        {
          console.log(res.statusCode);
        }
      }
    });
  },

  //查询气票客户名下的优惠券
  checkCouponRequest: function () {
    var that = this;
    var app = getApp();
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/Coupon",
      method: "GET",
      data: {
        customerUserId: app.globalData.userId,
        useStatus: 0
      },
      complete: function (res) {
        if (res.statusCode == 200) {
         
          that.setData({
            ticketsList: res.data.items,
            loading: true
          })

        }
        else {
          console.log(res.statusCode);
        }
      }
    });
  },
})