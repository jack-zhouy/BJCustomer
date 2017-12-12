var util = require("../../utils/util.js");

//获取应用实例
const app = getApp();
var that;
Page({
  data: {
    submitBtnTxt: "提交/立即去支付",
    submitBtnBgBgColor: "#0099FF",
    btnLoading: false,
    submitDisabled: false,
    //后台获取商品信息数据
    goodsTypeIndex: 0,
    goodsTypeArray: [],
    originalGoodsTypeArray: [],
    //商品code
    goodsCodeIndex:0,
    goodsCodeArray:[],
    goodsTypeCheckResult:[],
    goods: [],
    cartData: {},
    orderDetailList:[],
    amount: 0,
    
    userId_value: "",
    goodsTypeCode:"",
    phone:"",
    index: 0,
    addressBoolean: false,
    address_value:"",
    location : {},

    //是否立即送气radio数据
    items: [
      { name: '是', value: '是', checked: "true" },
      { name: '否', value: '否', checked:"false" },
    ], 
    //区别是否立即送气true:立即送气,false:预约送气
    immediateDeliveryBoolean: true,
    //支付方式radio数据
    payMethodItems: [
      { name: '在线微信支付', value: '在线微信支付', checked: "true"},
      { name: '气到付款', value: '气到付款', checked: "false"},
    ], 
    //区别支付方式true:在线微信支付,false:气到付款
    payMethodBoolean:true,
    date:"",
    time:"",
  },
  // 页面初始化
  onLoad: function () {
    that = this;
    that.goodsType_request();
  },
  // 页面初次渲染完成（每次打开页面都会调用一次）
  onReady: function () {
  },
  // 页面显示（一个页面只会调用一次）
  onShow: function () {
    var app = getApp();
    //console.log(app.globalData);
    if (app.globalData.loginState) {
      that.setData({
        loginState: true,
        userInfo: app.globalData.userInfo,
        userId_value: app.globalData.userId,
        //goodsTypeCode: app.globalData.typeCode,
        phone: app.globalData.phone,
        address_value: app.globalData.address.province + app.globalData.address.city + 
        app.globalData.address.county + app.globalData.address.detail
      });
      var address = app.globalData.address;
      that.getLocation(that.data.address_value);
    } 

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
 
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //请求后台商品信息
  goodsType_request: function () {
    console.log("请求后台商品信息");
    var that = this;
    wx.request({
      url: 'http://118.31.77.228:8006/api/Goods',
      data: {
        typeCode: "0001"
      },
      method: "GET",
      complete: function (res) {
        if (res.statusCode == 200) {
          console.log(res.data);
          var count = res.data.items.length;
          for (var i = 0; i < count; i++) {
            var tempSource = res.data.items[i].name;
            that.data.goodsTypeArray.push(tempSource);
          }
          that.setData({
            goodsTypeArray: that.data.goodsTypeArray,
            originalGoodsTypeArray: res.data.items,
          })
          console.log(that.data.originalGoodsTypeArray);
          // console.log(that.data.goodsCodeArray);
        }
      }
    });
  },
//选择支付方式radio处触发函数
  payMethodRadioChange: function (e) { 
    this.setData({
      payMethodBoolean: e.detail.value
    })
  },
  //选择订单详情选择器触发函数
  bindGoodsTypeCheckChange: function (e) {
    var that = this;
    var orderDetail = {};
    //添加商品
    var index = e.detail.value;
    var good = that.data.originalGoodsTypeArray[index];
    var goods = { code: good.code, name: good.name}
    orderDetail.goods = goods;
    
    orderDetail.originalPrice = good.price;
    orderDetail.dealPrice = good.price;
    orderDetail.quantity = 1;
    orderDetail.subtotal = orderDetail.quantity * orderDetail.dealPrice;
    
    that.data.orderDetailList.push(orderDetail);
    // console.log(orderDetail);
    console.log(that.data.orderDetailList);
    that.setData({
      orderDetailList: that.data.orderDetailList,
      amount: orderDetail.subtotal
    }); 
  },
  //预约日期选择器
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  //预约时间选择器
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  },
  //验证收货人姓名输入
  checkRecvName: function (param) {
    var recvName = param.recvName.trim();
    if (recvName.length > 0) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入收货人姓名'
      });
      return false;
    }
  },
  //验证收货人联系方式输入
  checkRecvPhone: function (param) {
    var recvPhone = param.recvPhone.trim();
    if (recvPhone.length > 0) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入收货人联系方式'
      });
      return false;
    }
  },
  //提交订气表单
  form_OrderSubmit: function (e) {
    console.log("form_OrderSubmit");
    var param = e.detail.value;
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var flag = this.checkRecvName(param) && this.checkRecvPhone(param)
    var that = this;
    if (flag)
    {
      if (that.data.payMethodBoolean == false){
        this.setregistData1();
        setTimeout(function () {
          that.setregistData2();
          that.NewOrder_request(param);
        }, 2000);
      }
      else{
       // this.setregistData1();
        that.payoff();
      }
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
  // selectAddress: function () {
  //   wx.chooseAddress({
  //     success: function (res) {
  //       that.setData({
  //         AddressData: res,
  //         addressBoolean: true,
  //       });
  //     }
  //   })
  // },
  //请求创建新订单
  NewOrder_request: function (param) {
    var that = this;
    var app = getApp();
    var orderInfo = {};
    orderInfo.callInPhone = that.data.phone;

    if (that.data.payMethodBoolean==true)
    {
      orderInfo.payType = "PTOnLine";
    }
    else
    {
      orderInfo.payType = "PTOffline";
    }

    orderInfo.accessType = "ATWeixin";

    var customerTemp = {};
    customerTemp.userId = that.data.userId_value;
    orderInfo.customer = customerTemp;

    orderInfo.reserveTime = that.data.date + " " + that.data.time + ":00";

    orderInfo.recvLongitude = that.data.location.lng;
    orderInfo.recvLatitude = that.data.location.lat;

    var customerAddressTemp = {};
    customerAddressTemp.province = app.globalData.address.province;
    customerAddressTemp.city = app.globalData.address.city;
    customerAddressTemp.county = app.globalData.address.county;
    customerAddressTemp.detail = app.globalData.address.detail;
    orderInfo.recvAddr = customerAddressTemp;

    orderInfo.recvName = param.recvName;
    orderInfo.recvPhone = param.recvPhone;
    if (param.comment.length > 0){
      orderInfo.comment = param.comment;
    }

    orderInfo.orderDetailList = that.data.orderDetailList;

    orderInfo.orderAmount = that.data.amount;

    orderInfo = JSON.stringify(orderInfo);
    console.log(orderInfo);
    wx.request({
      url: 'http://118.31.77.228:8006/api/Orders', //仅为示例，并非真实的接口地址
      data: orderInfo,
      method: "POST",

      complete: function (res) {
        //console.log(res);
        if (res.statusCode == 201) {
          console.log('提交请求成功')
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          });
          return;
        }
        if (res == null || res.statusCode == 409) {
          console.error('提交请求失败')
          wx.showModal({
            title: '提交请求失败',
            showCancel: false,
            duration: 1500
          })
          return;
        }
      }
    })
  },


  //逆向地址解析获取经纬度
  getLocation: function (address) {
    var that = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/geo?key=a44d27e0bf7b64770dad4664e3ba92b1&address=' + address,
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success
        console.log(res.data);
        var strLocation = res.data.geocodes[0].location;
        var searchedAddress = res.data.geocodes[0].formatted_address;
        var location = {};
        location.lng = parseFloat(strLocation.split(',')[0]);
        location.lat = parseFloat(strLocation.split(',')[1]);
        that.setData({
          location: location
        });
      },
      fail: function () {
        console.error("逆向地址解析错误");
        // fail 
      },
      complete: function () {
        // complete 
      }
    })
  },
//数量添加
  add: function (e) {
    var that = this;
    var detail = e.currentTarget.dataset.good;
    var index = e.currentTarget.dataset.index;

    that.data.orderDetailList[index].quantity++;
    that.data.orderDetailList[index].subtotal = that.data.orderDetailList[index].quantity * that.data.orderDetailList[index].dealPrice;
    that.setData({
      orderDetailList: that.data.orderDetailList,
    })
    that.amount();
    return;
  },
//数量减少
  subtract: function (e) {
    var that = this;
    var detail = e.currentTarget.dataset.good;
    var index = e.currentTarget.dataset.index;

    if (that.data.orderDetailList[index].quantity > 1)
    {
      that.data.orderDetailList[index].quantity--;
      that.data.orderDetailList[index].subtotal = that.data.orderDetailList[index].quantity * that.data.orderDetailList[index].dealPrice;
    }
    else
    {
      that.data.orderDetailList.splice(index, 1);
    }
    that.setData({
      orderDetailList: that.data.orderDetailList,
    })
    that.amount();
    return;
  },
  //计算订单总价
  amount: function () {
    var that = this;
    var cartObjects = that.data.orderDetailList;
    var amount = 0;
    var quantity = 0;
    cartObjects.forEach(function (item, index) {
      amount += item.quantity * item.dealPrice;
      quantity += item.quantity;
    });
    that.setData({
      amount: amount,
      quantity: quantity
    });
    console.log(that.data.amount);
  },

  //发起微信支付
  payoff: function (e) {
    var that = this;
    var totalAmount = that.data.amount;
    wx.login({
      success: function (res) {
        that.payOnline(res.code, totalAmount);
      }
    });
  },
  //调后台的支付接口
  payOnline: function (userCode, totalFee) {
    var that = this;
    wx.request({
      url: 'https://www.yunnanbaijiang.com:8009/api/test/Pay/MicroApp',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'orderIndex': "0002",
        'userCode': userCode,
        'totalFree': totalFee
      },
      success: function (res) {
        console.log(res);
        that.requestPayment(res.data);

      }
    })
  },
  //小程序端启动支付
  requestPayment: function (obj) {
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        wx.showToast({
          title: '微信支付成功，提交订单',
          icon: 'success',
          duration: 1500
        });
        that.NewOrder_request(param);
      },
      'fail': function (res) {
        console.log(res);
        wx.showToast({
          title: '微信支付失败，请重新提交订单',
          icon: 'success',
          duration: 1500
        });
      }
    })
  } 

})