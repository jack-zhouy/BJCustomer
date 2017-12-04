var that;

Page({
  data: {
    userInfo: {},
    userId:null,
    loginState: false,
    customerInfo:{},
  },
	onLoad: function () {
		that = this;
	},
  onShow: function() {
    var app = getApp();
    if (app.globalData.loginState) {
      that.setData({
        loginState: true,
        userInfo: app.globalData.userInfo,
        userId: app.globalData.userId
      });
    }
  },
	logout: function () {
		// 确认退出登录
		wx.showModal({
			title: '确定退出登录',
			success: function (res) {
				if (res.confirm) {
					// 退出操作
          //请求后台的logout-api TODO
          wx.request({
            url: getApp().GlobalConfig.baseUrl + "/api/customers/logout",
            method: 'GET',
            success: function (res) {
              // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
              if (res.statusCode != 200) {
                that.logoutFailed();
              } else {
                //更新本地全局登陆状态
                var app = getApp();
                app.globalData.userId = null,
                  app.globalData.loginState = false,
                  that.setData({
                    loginState: false,
                    userId: null
                  });
              }
            },
            fail: function () {
              that.logoutFailed();
            }
          })
				}
			}
		});
	},
  logoutFailed: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '登出有误'
    });
    console.log("loginout failed");
  },
  gotoLogin:function(){
    console.log("gotoLogin");
    wx.redirectTo({
      url: '../login/login',
    })
  },
  navigateToCheckProfile:function(){
    var app = getApp();
    //如果没有登录就跳转到登录页面
    if ((!app.globalData.loginState) && (app.globalData.userId == null)) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../regist/regist?' + '&model=checkProfile',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  navigateToEditProfile: function () {
    var app = getApp();
    //如果没有登录就跳转到登录页面
    if ((!app.globalData.loginState) && (app.globalData.userId == null)) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../regist/regist?' + '&model=editProfile',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  }
})