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

    phone: "",
    name: "",

     //报修类型
     mendTypeIndex: 0,
     mendTypeArray: [],
     originalMendTypeArray: [],
     deliverTimeTypes: [
       "立即报修",
       "预约报修"
     ],
     deliveryTimeType: "立即报修",
     timePickerShow: false,
     date: "",
     time: "",
     reserveDate: "",
     reserveTime: "",
  },
  // 页面初始化
  onLoad: function () {
    that = this;
    var currentDate = util.formatTime(new Date());
    that.data.reserveDate = currentDate.substring(0, 4) + '-' + currentDate.substring(5, 7) + '-' + currentDate.substring(8, 10);
    that.data.reserveTime = String(parseInt(currentDate.substring(11, 13)) + 1) + ':' + currentDate.substring(14, 16);

    that.setData({
      reserveDate: that.data.reserveDate,
      reserveTime: that.data.reserveTime,
      date: that.data.reserveDate,
      time: that.data.reserveTime,
    });
    this.requestMendType();
  },
  // 页面初次渲染完成（每次打开页面都会调用一次）
  onReady: function () {
  },
  // 页面显示（一个页面只会调用一次）
  onShow: function () {
    var app = getApp();
    if (app.globalData.loginState) {
      that.setData({
        userId_value: app.globalData.userId,
        phone: app.globalData.phone,
        name: app.globalData.name,
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
  //查询报修类型
  requestMendType:function(){
    var that = this;
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/MendTypes",
      method: "GET",
      complete: function (res) {
        if (res.statusCode == 200) {
          var count = res.data.items.length;
          for (var i = 0; i < count; i++) {
            var tempType = res.data.items[i].name;
            that.data.mendTypeArray.push(tempType);
          }
          that.setData({
            mendTypeArray: that.data.mendTypeArray,
            originalMendTypeArray: res.data.items
          })
         
        }
      }
    });
  },

  //预约送气/立即送气picker触发函数
  deliverTimeTypesChange: function (e) {
    var that = this;
    var index = e.detail.value;
    var deliveryTimeType = this.data.deliverTimeTypes[index];
    if (index == 0) {
      this.setData({
        timePickerShow: false,
        deliveryTimeType: deliveryTimeType
      })
    } else {
      this.setData({
        timePickerShow: true,
        deliveryTimeType: deliveryTimeType
      })
    }
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindrepairTypePickerChange_: function (e) {
    this.setData({
      mendTypeIndex: e.detail.value
    })
  },
  checkRecvName: function (param) {
    var phone = param.phone.trim();
    if (phone.length > 0) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入联系人'
      });
      return false;
    }
  },
  checkPhone: function (param) {
    var telephone = param.phone.trim();
    if (telephone.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的联系号码'
      });
      return false;
    } else if (telephone.length < 1 || telephone.length > 12) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的联系号码'
      });
      return false;
    } else {
      return true;
    }
  },
//验证是否选择报修时间
checkTime:function(){
  var that = this;
  if (that.data.deliveryTimeType.length == 0)
  {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '请选择报修时间'
    });
    return false;
  } else {
    return true;
  }
},
//验证报修内容是否输入
checkDetail: function (param) {
  var detail = param.detail.trim();
  if (detail.length > 0) {
    return true;
  } else {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '请描述报修内容'
    });
    return false;
  }
},
  form_RepairSubmit: function (e) {
    var param = e.detail.value;
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var flag = this.checkTime() && this.checkDetail(param);
    // var flag = this.checkPhone(param) && this.checkRecvName(param)
    //   && this.checkTime() && this.checkDetail(param);
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
        that.createNewMend(param);
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

  createNewMend: function (param) {
    var that = this;
    var app = getApp();
    var mendInfo = {};
    var customerTemp = {};
    customerTemp.userId = app.globalData.userId;
    mendInfo.customer = customerTemp;

    // mendInfo.recvName = param.contact;
    // mendInfo.recvPhone = param.phone;

    if (param.contact.length == 0) {
      mendInfo.recvName = app.globalData.name;
    }
    else {
      mendInfo.recvName = param.contact;
    }

    if (param.phone.length == 0) {
      mendInfo.recvPhone = app.globalData.phone;
    }
    else {
      mendInfo.recvPhone = param.phone;
    }


    var mendTypeTemp = {};
    mendTypeTemp.code = param.mendType;
    mendInfo.mendType = mendTypeTemp;

    var customerAddressTemp = {};
    customerAddressTemp.province = app.globalData.address.province;
    customerAddressTemp.city = app.globalData.address.city;
    customerAddressTemp.county = app.globalData.address.county;
    customerAddressTemp.detail = app.globalData.address.detail;
    mendInfo.recvAddr = customerAddressTemp;

    if (that.data.deliveryTimeType == "立即报修") {
      mendInfo.reserveTime = that.data.reserveDate + " " + that.data.reserveTime + ":00";
    }
    else if (that.data.deliveryTimeType == "预约报修") {
      mendInfo.reserveTime = that.data.date + " " + that.data.time + ":00";
    }
    mendInfo.detail = param.detail;

    mendInfo = JSON.stringify(mendInfo);
    console.info(mendInfo);

    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/Mend",
       //仅为示例，并非真实的接口地址
      data: mendInfo,
      method: "POST",
      complete: function (res) {
        if (res.statusCode == 201) {
          //console.error('网络请求成功')
          wx.showToast({
            title: '报修单提交成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 1500);
            }
          });
          return;
        }
        else if (res.statusCode == 409) {
          console.error('该报单已存在')
          wx.showModal({
            title: '该报单已存在',
            showCancel: false,
            duration: 1500
          })
          return;
        }
        else if (res.statusCode == 406) {
          console.error('参数错误')
          wx.showModal({
            title: '报修单提交失败，请查看输入项',
            showCancel: false,
            duration: 1500
          })
          return;
        }
      }
    })
  },
})