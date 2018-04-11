var util = require("../../utils/util.js");

Page({
  data: {
    loginBtnTxt: "登 录",
    loginBtnBgBgColor: "#0099FF",
    btnLoading: false,
    disabled: false,
    //小图标路径
    pwdIcon: "../../images/pwdIcon.png",
    logIcon: "../../images/logIcon.png",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    var app = getApp();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    var app = getApp();
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //提交login表单
  formSubmit: function (e) {
    var param = e.detail.value;
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var flag = this.checkLoginInfo(param)
    if (flag) {
      this.setLoginData1();
      this.checkUserInfo(param);
    }
  },
  setLoginData1: function () {
    this.setData({
      loginBtnTxt: "登录中",
      disabled: !this.data.disabled,
      loginBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },
  setLoginData2: function () {
    this.setData({
      loginBtnTxt: "登录",
      disabled: !this.data.disabled,
      loginBtnBgBgColor: "#0099FF",
      btnLoading: !this.data.btnLoading
    });
  },
//验证登录输入信息正确性
  checkLoginInfo: function (param) {
    var userid = param.userId.trim();
    var password = param.password.trim();
    if ((password.length <= 0) || (userid.length <= 0)) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入登录名和密码'
      });
      return false;
    } else {
      return true;
    }
  },
  //向后台提交登录userId和password信息
  checkUserInfo: function (param) {
    var userid = param.userId.trim();
    var password = param.password.trim();
    var that = this;
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/customers/login",
      data: {
        userId: userid,
        password: password
      },
      method: 'GET',
      success: function (res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        if (res.statusCode != 200) {
          that.loginFailed();
        } else {
          //存储用户信息   
          var app = getApp();
          app.globalData.loginState = true;
          app.globalData.userId = res.data.userId;
          app.globalData.phone = res.data.phone; 
          app.globalData.address = res.data.address; 
          app.globalData.settlementTypeCode = res.data.settlementType.code;
          that.loginSuc();
         
        }
        
      },
      fail: function () {
        that.loginFailed();
      }
    })
  },
  //跳转页面
  redirectTo: function (param) {
    wx.switchTab({
      url: param
    })
  },
  loginFailed: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '登录名或密码有误，请重新输入'
    });
    this.setLoginData2();
  },
  loginSuc: function () {
    var that = this;
    setTimeout(function () {
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 1500
      });
      that.setLoginData2();
      that.redirectTo("../index/index");
    }, 2000);
  }
})