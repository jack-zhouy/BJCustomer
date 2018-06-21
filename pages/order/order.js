Page({
  //数据源
  data: {
    //订单状态
    ordersStatusDescription: ["待派送", "派送中", "已签收", "已结束","作废"], 
  //全部订单列表1
    ordersList: [], 
    // loading: false,
    loading: true,
    limit: 6,
    windowHeight: 0,
    scrollTop: 100,
    orderState:"",
    len: 0,
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.requestData();
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },

//获取的订单
  requestData: function () {
    var that = this
    //查询所有订单
      wx.request({
      url: getApp().GlobalConfig.baseUrl +"/api/Orders", 
      data: {
        userId: getApp().globalData.userId,
        orderBy:"id desc"
      },
      method:'GET',
      success: function(res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
     
        that.setData({
          ordersList: res.data.items,
          loading: true,
          len: res.data.items.length,
        })

      },
      fail: function()
      {
         console.log("failed");
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
    var that = this;
    wx.setNavigationBarTitle({
      title: '所有订单'
    })
    this.requestData();
  },
  // 页面显示（一个页面只会调用一次）
  onShow: function () {
    var app = getApp();
    //如果没有登录就跳转到登录页面
    if ((!app.globalData.loginState) && (app.globalData.userId == null)) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },
  // 页面初次渲染完成（每次打开页面都会调用一次）
  onReady: function () {

  },
  // 页面隐藏（当navigateTo或底部tab切换时调用）
  onHide: function () {

  },
  // 页面关闭（当redirectTo或navigateBack的时候调用）
  onUnload: function () {

  },
  showDetail: function (e) {
    var order = e.currentTarget.dataset.order;

    wx.navigateTo({
      url: '../detail/detail?order=' + JSON.stringify(order),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },

})