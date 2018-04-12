Page({
  //数据源
  data: {
    //配送工已抢到的订单
    bottleList: [],
    loading: true,
    limit: 6,
    windowHeight: 0,
    scrollTop: 100,
    bottleStatus: ""
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.myBottle_request();
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

  myBottle_request: function (a) {
    var that = this;
    var app = getApp();
    console.log("后台查询我的气瓶");
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/GasCylinder",
      data: {
        liableUserId: app.globalData.userId
      },
      method: 'GET',
      success: function (res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        console.log(res.data);
        that.setData({
          bottleList: res.data.items,
          loading: true
        })
        console.log("bottleList:");
        console.log(that.data.bottleList);
      },
      fail: function () {
        console.error("failed");
      }
    })

    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  // 页面初始化
  onLoad: function () {

  },
  onShow: function () {
    var that = this;
    var app = getApp();
    //如果没有登录就跳转到登录页面
    if (!app.globalData.loginState) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
      this.myBottle_request();
    }
    

  },
  onReady: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
})