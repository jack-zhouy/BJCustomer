var util = require("../../utils/util.js");

//获取应用实例
const app = getApp();
var that;
Page({
  data: {
    submitBtnTxt: "提交",
    submitBtnBgBgColor: "#0099FF",
    btnLoading: false,
    submitDisabled: false,

    array: ['15kg液化气', '20kg液化气', '25kg液化气'],
    objectArray: [
      {
        id: 0,
        name: '15kg液化气'
      },
      {
        id: 1,
        name: '20kg液化气'
      },
      {
        id: 2,
        name: '25kg液化气巴西'
      }
    ],
    index: 0,

    arrayNum: ['1', '2', '3'],
    objectArray: [
      {
        id: 0,
        name: '1'
      },
      {
        id: 1,
        name: '2'
      },
      {
        id: 2,
        name: '3'
      }
    ],
    index: 0,
    addressBoolean: false,
    AddressData: {},  
  },
  
  // 页面显示（一个页面只会调用一次）
  onShow: function () {
    var app = getApp();
    //如果没有登录就跳转到登录页面
    if ((!app.globalData.loginState) && (app.globalData.userId==null)) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
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
  // //用户名输入框事件
  // userNameInput:function (e) {
  //   this.setData({
  //     userName: e.detail.value
  //   })
  // },
  // userNumInput:function (e) {
  //   this.setData({
  //     userNum: e.detail.value
  //   })
  // },
  // userAddInput:function (e) {
  //   this.setData({
  //     userAdd: e.detail.value
  //   })
  // },
  // userTelInput:function (e) {
  //   this.setData({
  //     userTel: e.detail.value
  //   })
  // },

  checkUserName: function (param) {
    var inputUserName = param.name.trim();
    //if (phone.test(inputUserName)) {
    if (inputUserName.length > 0) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的客户名字'
      });
      return false;
    }
  },
  checkUserId: function (param) {
    var userId = param.userId.trim();
    if (userId.length < 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入用户ID'
      });
      return false;
    } 
  },

  form_OrderSubmit: function (e) {
    console.log("form_OrderSubmit");
    var param = e.detail.value;
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var flag = this.checkUserName(param) && this.checkUserId(param)
    var that = this;
     if(flag){
      this.setregistData1();
      setTimeout(function () {
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
  selectAddress: function () {
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          AddressData: res,
          addressBoolean: true,
        });
      }
    })
  },
  redirectTo: function (param) {
    //需要将param转换为字符串
    
    // wx.redirectTo({
    //   url: '../main/index?param=' + param//参数只能是字符串形式，不能为json对象
    // })
    var orderInfo = {
      userId: "",
      name: "",
      goodsType: "",
      quantity: "",
      deliveryDate: "",
      deliveryTime: "",
      address: {
        userName:null,
        telNumber:null,
        province: null,
        city: null,
        county: null,
        detail: null,
      },
      note:"",
    };
    orderInfo.userId = param.userId;
    orderInfo.name = param.name;
    orderInfo.goodsType = param.goodsType;
    orderInfo.quantity = param.quantity;
    orderInfo.deliveryDate = param.deliveryDate;
    orderInfo.deliveryTime = param.deliveryTime;
    orderInfo.address.userName = param.userName;
    orderInfo.address.telNumber = param.telNumber;
    orderInfo.address.province = param.province;
    orderInfo.address.city = param.city;
    orderInfo.address.county = param.county;
    orderInfo.address.detail = param.detail;
    orderInfo = JSON.stringify(orderInfo);
    wx.request({
      url: 'http://118.31.77.228:8006/api/goods', //仅为示例，并非真实的接口地址
      data: orderInfo,
      method: "POST",

      complete: function (res) {
        console.log(res);
        if (res.statusCode == 201) {
          console.error('网络请求成功')
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1500
          });
          return;
        }

        if (res == null || res.statusCode == 409) {
          console.error('网络请求失败')
          wx.showModal({
            title: '用户ID已被注册',
            showCancel: false,
            duration: 1500
          })
          return;
        }
      }
    })
  },
})