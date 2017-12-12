//获取应用实例
const app = getApp();
var that;
Page({
  data: {
    submitBtnTxt: "提交",
    submitBtnBgBgColor: "#0099FF",
    btnLoading: false,
    submitDisabled: false,

    userId_value:"",

    repairTypeArray: ['瓶身漏气', '角阀漏气', '减/中压阀漏气', '接头漏气', '接头漏气', 
    '胶管漏气', '灶具漏气', '不明原因漏气', '红火/黑火', '灶打不着火', '灶具火小', '灶具堵',
     '角阀关不紧', '更换配件', '瓶口滑丝', '免费更换配件', '气出不来'],
     repairTypeIndex: 0,
  },
  // 页面初始化
  onLoad: function () {
    that = this;
    //console.log("ok");
    // this.requestData();
  },
  // 页面初次渲染完成（每次打开页面都会调用一次）
  onReady: function () {
  },
  // 页面显示（一个页面只会调用一次）
  onShow: function () {
    var app = getApp();
    if (app.globalData.loginState) {
      that.setData({
        //loginState: true,
        //userInfo: app.globalData.userInfo,
        userId_value: app.globalData.userId
      });
    } 
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
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindrepairTypePickerChange_: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      repairTypeIndex: e.detail.value
    })
  },
  checkPhone: function (param) {
    var phone = param.phone.trim();
    if (phone.length > 0) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的联系电话'
      });
      return false;
    }
  },

  form_RepairSubmit: function (e) {
    var param = e.detail.value;
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var flag = this.checkPhone(param);
    var that = this;
    if (flag) {
      this.setregistData1();
      setTimeout(function () {
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1500
        });
        that.setregistData2();
        that.redirectTo(param);
      }, 2000);
    }
  },

  setregistData1: function () {
    this.setData({
      submitBtnTxt: "提交中",
      submitDisabled: !this.data.submitDisabled,
      submitBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },

  setregistData2: function () {
    this.setData({
      submitBtnTxt: "提交",
      submitDisabled: !this.data.submitDisabled,
      submitBtnBgBgColor: "#0099FF",
      btnLoading: !this.data.btnLoading
    });
  },

  redirectTo: function (param) {
    //需要将param转换为字符串
    param = JSON.stringify(param);
    // wx.redirectTo({
    //   url: '../main/index?param=' + param//参数只能是字符串形式，不能为json对象
    // })
    console.log("param");
    console.log(param);
    wx.request({
      url: 'http://118.31.77.228:8006/api/goods', //仅为示例，并非真实的接口地址
      data: param,
      method: "POST",

      complete: function (res) {
        console.log(res);
        if (res == null || res.data == null) {
          console.error('网络请求失败')
          wx.showModal({
            title: '提交失败',
            showCancel: false
          })
          return;
        }
      }
    })
  },
})