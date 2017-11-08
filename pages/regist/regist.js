var util = require("../../utils/util.js");
var that;
Page({
  data: {
    registBtnTxt: "注册",
    registBtnBgBgColor: "#0099FF",
    getSmsCodeBtnTxt: "获取验证码",
    getSmsCodeBtnColor: "#0099FF",
    btnLoading: false,
    registDisabled: false,
    smsCodeDisabled: false,
    inputUserid:'',
    inputUserName: '',
    inputTel1:'',
    inputTel2:'',
    inputAddress:'',
    inputPassword: '',
    logIcon0: "../../images/icon_member_selected.png",
    logIcon: "../../images/logIcon.png",
    pwdIcon: "../../images/pwdIcon.png",
    verifiIcon:"../../images/verifiIcon.png",
    logTel: "../../images/telephone.png",
    logAdd: "../../images/icon_home.png",
    customerSourceIcon: "../../images/default-avatar.png",
    customerSourceArray: ['电视、广播广告', '老客户推荐', '热线咨询', '其他'],
    objectArray: [
      {
        id: 0,
        name: '电视、广播广告'
      },
      {
        id: 1,
        name: '老客户推荐'
      },
      {
        id: 2,
        name: '热线咨询'
      },
      {
        id: 3,
        name: '其他'
      }
    ],
    customerSourceIndex: 0,
    customerTypeArray: ['个人家庭用户', '餐饮用户','企业用户'],
    objectArray: [
      {
        id: 0,
        name: '个人家庭用户'
      },
      {
        id: 1,
        name: '餐饮用户'
      },
      {
        id: 2,
        name: '企业用户'
      }
    ],
    customerTypeIndex:0,
    address: false,
    AddressData: {},  
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    that = this;
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
  bindPickerChange: function (e) {
    // 监听picker事件
    this.setData({
      customerSourceIndex: e.detail.value
    })
  },
  bindPickerChange1: function (e) {
    // 监听picker事件
    this.setData({
      customerTypeIndex: e.detail.value
    })
  },
  selectAddress: function () {
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          AddressData:res,
          address: true,
        });
      }
    })
  },
  checkUserId: function (param) {
    var inputUserId = param.userId.trim();
    if (inputUserId.length > 0) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请设置用户ID'
      });
      return false;
    }
  },
  checkUserName: function (param) {
    var inputUserName = param.name.trim();
    if (inputUserName.length>0) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请设置用户姓名'
      });
      return false;
    }
  },
  checkTelephone1: function (param) { 
    var userName = param.name.trim();
    var telephone1 = param.phone1.trim();
    if (telephone1.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的联系号码1'
      });
      return false;
    } else if (telephone1.length < 1 || telephone1.length > 11) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的联系号码1'
      });
      return false;
    } else {
      return true;
    }
  },
  checkPassword: function (param) {
    var userName = param.name.trim();
    var password = param.password.trim();
    if (password.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请设置密码'
      });
      return false;
    } else if (password.length < 6 || password.length > 20) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '密码长度为6-20位字符'
      });
      return false;
    } else {
      return true;
    }
  },
  formSubmit: function (e) {
    var param = e.detail.value;
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var flag = this.checkUserName(param) && this.checkPassword(param) && this.checkTelephone1(param) && this.checkUserId(param);
    var that = this;
    if (flag) {
      this.setregistData1();
      setTimeout(function () {

        that.setregistData2();
        that.redirectTo(param);
      }, 2000);
    }
  },
  setregistData1: function () {
    this.setData({
      registBtnTxt: "注册中",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },
  setregistData2: function () {
    this.setData({
      registBtnTxt: "注册",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#0099FF",
      btnLoading: !this.data.btnLoading
    });
  },
  redirectTo: function (param) {
    var customerInfo = {
      userId:"",
      name: "",
      password:"",
      phone1:"",
      typeCode:"",
      sourceCode:"",
      address: {
        province: null,
        city: null,
        county:null,
        detail:null,
      }
    };
    customerInfo.userId = param.userId;
    customerInfo.name = param.name;
    customerInfo.password = param.password;
    customerInfo.phone1 = param.phone1;
    customerInfo.typeCode = param.typeCode;
    customerInfo.sourceCode = param.sourceCode;
    customerInfo.address.province = param.province;
    customerInfo.address.city = param.city;
    customerInfo.address.county = param.county;
    customerInfo.address.detail = param.detail;
    customerInfo = JSON.stringify(customerInfo);
    //console.log(customerInfo);
    wx.request({
      url: 'http://118.31.77.228:8006/api/customers', 
      data: customerInfo,
      method: "POST",
      complete: function (res) {
        console.log(res);
        if (res.statusCode == 201){
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
  }
})