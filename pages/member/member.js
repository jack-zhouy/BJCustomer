var that;

Page({
  data: {
    userInfo: {},
    userId:null,
    loginState: false
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
          //更新本地全局登陆状态
          var app = getApp();
          app.globalData.userId = null,
          app.globalData.loginState = false,
					that.setData({
            loginState: false,
            userId: null
					});
				}
			}
		});
	},

  gotoLogin:function(){
    console.log("gotoLogin");
    wx.redirectTo({
      url: '../login/login',
    })
  }

}) 