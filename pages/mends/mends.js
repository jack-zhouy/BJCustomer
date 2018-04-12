var that;
var app = getApp()
Page({
  data: {
    currentTab: 0,
    mendsList:[],
    len:0,
    resultShow:true,
  },

  onLoad: function () {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var app = getApp();
   
    that.searchMyMendPTSuspending();

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
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
    this.searchMyMendPTSuspending();
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      console.log(that.data.currentTab);
      if (that.data.currentTab==0)
      {
        that.searchMyMendPTSuspending();
        that.setData({
          resultShow: true
        })
      }
      else if (that.data.currentTab == 1)
      {
        that.searchMyMendPTHandling();
        that.setData({
          resultShow: true
        })
      }
      else if (that.data.currentTab == 2)
      {
        that.searchMyMendPTSolved();
        that.setData({
          resultShow:false
        })
      }
    }
  },
//查询报修单:待处理
  searchMyMendPTSuspending:function(){
  var that = this;
  var app = getApp();
  wx.request({
    url: getApp().GlobalConfig.baseUrl + "/api/Mend",
    method: "GET",
    data: {
      requestCustomerId: app.globalData.userId,
      processStatus:"PTSuspending"
    },
    complete: function (res) {
      if (res.statusCode == 200) {
        console.log(res.data);
        that.setData({
          mendsList: res.data.items,
          len: res.data.items.length,
          loading: true
        })
        console.log("mendsList:");
        console.log(that.data.mendsList);
        console.log(that.data.len);
      }
      else {
        console.log(res.statusCode);
      }
    }
  });
},

//查询报修单:处理中
  searchMyMendPTHandling: function () {
  var that = this;
  var app = getApp();
  wx.request({
    url: getApp().GlobalConfig.baseUrl + "/api/Mend",
    method: "GET",
    data: {
      requestCustomerId: app.globalData.userId,
      processStatus: "PTHandling"
    },
    complete: function (res) {
      if (res.statusCode == 200) {
        console.log(res.data);
        that.setData({
          mendsList: res.data.items,
          len: res.data.items.length,
          loading: true
        })
        console.log("mendsList:");
        console.log(that.data.mendsList);
        console.log(that.data.len);
      }
      else {
        console.log(res.statusCode);
      }
    }
  });
},
  //查询报修单:已解决
  searchMyMendPTSolved: function () {
    var that = this;
    var app = getApp();
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/Mend",
      method: "GET",
      data: {
        requestCustomerId: app.globalData.userId,
        processStatus: "PTSolved"
      },
      complete: function (res) {
        if (res.statusCode == 200) {
          console.log(res.data);
          that.setData({
            mendsList: res.data.items,
            len: res.data.items.length,
            loading: true
          })
          console.log("mendsList:");
          console.log(that.data.mendsList);
          console.log(that.data.len);
        }
        else {
          console.log(res.statusCode);
        }
      }
    });
  }
})