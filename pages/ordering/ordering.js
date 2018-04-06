var util = require("../../utils/util.js");

//获取应用实例
const app = getApp();
var that;
Page({
  data: {
    submitBtnTxt: "提交订气",
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
  
    orderDetailList:[],
    amount: 0,
    goodsInfo:{},
    userId_value: "",
    goodsTypeCode:"",
    phone:"",
    index: 0,
    addressBoolean: false,
    address_value:"",
    address_value1: "",
    address_value2: "",
    location : {},
    payStatus:"",
    cartData: {},
    cartObjects: [],

    //支付方式radio数据
    payMethodItems: [
      { name: '微信支付', value: '微信支付', checked: 'true'},
      { name: '气到付款', value: '气到付款', checked: 'false'},
    ],
    //区别支付方式true:在线微信支付,false:气到付款
    payMethodBoolean: "",

    deliverTimeTypes:[
      "立即送气",
      "预约送气"
    ],
    deliveryTimeType: "",
    timePickerShow:false,
    date:"",
    time:"",
    reserveDate:"",
    reserveTime:"",
 
    orderId:"",
  },
  // 页面初始化
  onLoad: function () {
    that = this;
    var currentDate  =  util.formatTime(new  Date()); 
    that.data.reserveDate = currentDate.substring(0, 4) + '-' + currentDate.substring(5, 7) + '-' + currentDate.substring(8, 10);
    that.data.reserveTime = String(parseInt(currentDate.substring(11, 13)) + 1) + ':' + currentDate.substring(14, 16);

    that.setData({
      reserveDate: that.data.reserveDate,
      reserveTime: that.data.reserveTime,
      date: that.data.reserveDate,
      time: that.data.reserveTime,
    });
    console.log(currentDate);
    console.log(that.data.reserveDate);
    console.log(that.data.reserveTime);
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
        app.globalData.address.county + app.globalData.address.detail,
        address_value1: app.globalData.address.province + app.globalData.address.city + 
        app.globalData.address.county,
        address_value2: app.globalData.address.detail
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
      url: getApp().GlobalConfig.baseUrl + "/api/Goods",
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
            goodsInfo:res.data.items[0],
            //amount: res.data.items[0].price
          })
          console.log(that.data.originalGoodsTypeArray);
          console.log(that.data.goodsTypeArray);
        }
      }
    });
  },
//选择支付方式radio触发函数
  payMethodRadioChange: function (e) { 
    var that = this;
    console.log(e.detail.value);
    this.setData({
      payMethodBoolean: e.detail.value
    })
    console.log(that.data.payMethodBoolean);
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
    console.log(that.data.deliveryTimeType);
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
    orderDetail.quantity = 0;
    //orderDetail.quantity = 1;
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
  //验证是否选择支付方式
  checkChoosePayMethod: function (){
    //var payMethod = param.payMethod.trim();
    if (that.data.payMethodBoolean.length > 0)
    {
      return true;
    }
    else {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '请选择支付方式'
    });
    return false;
    }
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
    var that = this;
    var flag = this.checkRecvName(param) && this.checkRecvPhone(param) && this.checkChoosePayMethod();
    //var flag = this.checkRecvName(param) && this.checkRecvPhone(param) && that.data.payMethodBoolean;
    console.log(flag);
    var payStatus = "";
    if(flag)
    {
      this.setregistData1();
      setTimeout(function () {
        that.setregistData2();
        that.NewOrder_request(param);
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
  //请求创建新订单
  NewOrder_request: function (param) {
    console.log("NewOrder_request in");
    var that = this;
    var app = getApp();
    var orderInfo = {};
    console.log("提交订单");
    orderInfo.callInPhone = that.data.phone;
    
    if (that.data.payMethodBoolean == "true")
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
    
    if (that.data.deliveryTimeType == "立即送气")
    {
      orderInfo.reserveTime = that.data.reserveDate + " " + that.data.reserveTime + ":00";
    }
    else if (that.data.deliveryTimeType == "预约送气")
    {
      //if ((that.data.date.length > 0) || (that.data.time.length > 0)) {
        orderInfo.reserveTime = that.data.date + " " + that.data.time + ":00";
      //}
    }


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

    
    //将购物车的数据转换成订单详情
    orderInfo.orderDetailList = [];

    var cartObjects = that.data.cartObjects;
    for (var i = 0; i < cartObjects.length; i++) {
      
      var orderDetail = {};
          //添加商品  
          var good = { code: cartObjects[i].good.code, name: cartObjects[i].good.name }
          orderDetail.goods = good;
          orderDetail.originalPrice = cartObjects[i].good.price;
          orderDetail.dealPrice = cartObjects[i].good.price;
          orderDetail.quantity = cartObjects[i].quantity;
          orderDetail.subtotal = orderDetail.quantity * orderDetail.dealPrice;
          orderInfo.orderDetailList.push(orderDetail);
        }
    console.log(orderInfo.orderDetailList );
    //end

    orderInfo.orderAmount = that.data.amount;

    //支付状态
    orderInfo.payStatus = "PSUnpaid";

    orderInfo = JSON.stringify(orderInfo);
    console.log(orderInfo);
    var orderId;
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/Orders", //仅为示例，并非真实的接口地址
      data: orderInfo,
      method: "POST",

      complete: function (res) {
        if (res.statusCode == 201) {
          console.log(res);
          orderId = res.header.Location;
          orderId = orderId.substring(37)
          that.setData({
            orderId: orderId,
          })
          console.log(that.data.orderId);
          console.log('提交成功')
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000,
            success: function () {
                    
            if (that.data.payMethodBoolean == "true"){
              console.log(" 调用微信支付");
              that.payoff(that.data.orderId);
            }
            else{
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 1500); 
            }
          }  
        });
        return;

        }
        // if (res == null || res.statusCode == 409) 
        else{
          console.error('提交请求失败')
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '提交失败,请检查输入项'
          });
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

  //计算订单总价
  amount: function () {
    var that = this;
    //var cartObjects = that.data.orderDetailList;
    var cartObjects = that.data.cartObjects;
    var amount = 0;
    var quantity = 0;
    cartObjects.forEach(function (item, index) {
        //amount += item.quantity * item.dealPrice;
        amount += item.quantity * item.good.price;
        quantity += item.quantity;   
    });
    that.setData({
      amount: amount,
      quantity: quantity
    });
    console.log(that.data.amount);
    console.log(that.data.quantity);

  },

  //发起微信支付
  payoff: function (orderId) {
    var that = this;
    var totalAmount = that.data.amount;
    wx.login({
      success: function (res) {
        that.payOnline(res.code, totalAmount, orderId);
      }
    });
  },
  //调后台的支付接口
  payOnline: function (userCode, totalFee, orderId) {
    var that = this;
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/pay/microApp",
     // url: 'https://www.yunnanbaijiang.com:8009/api/pay/microApp',
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        orderIndex: orderId,
        userCode: userCode,
        totalFee: totalFee
      },
      success: function (res) {
        console.log(res);
        that.requestPayment(res.data);

      }
    })
  },
  //小程序端启动支付
  requestPayment: function (obj) {
    var that = this;
    var payStatus = "";
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        //that.editOrder_request();
        wx.showToast({
          title: '微信支付成功',
          icon: 'success',
          duration: 1500
        });

        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          })
        }, 2000); 
      },
      'fail': function (res) {
        console.log(res);
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '微信支付失败'
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          })
        }, 2000); 
      }
    })
  },

  editOrder_request:function () {
    var that = this;
    var app = getApp();
    console.log("修改订单信息");
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/Orders" + that.data.orderId,
      data: {
        payStatus: "PSPaied"
      },
      method: 'PUT',
      success: function (res) {
        if (res.statusCode == 200) {
          console.log("修改成功");
        }
        else if (res.statusCode == 404) {
          console.error("修改订单不存在");        
        }
      },
      fail: function () {
        console.error("修改订单失败");
      }
    })   
  },


//数量增加
   add_new: function (e) {
     var that = this;
    // 所点商品id
    var good = e.currentTarget.dataset.good;
    var goodId = e.currentTarget.dataset.good.id;
    //读取目前购物车数据
    var cartData = that.data.cartData;
    // 获取当前商品数量
    var goodCount = cartData[goodId] ? cartData[goodId] : 0;
    // 自增1后存回
    cartData[goodId] = ++goodCount;
    // 设值到data数据中
    that.setData({
      cartData: cartData
    });
    // 转换成购物车数据为数组
    that.cartToArray(good);
  },
  //数量减少
  subtract_new: function (e) {
    // 所点商品id
    var good = e.currentTarget.dataset.good;
    var goodId = e.currentTarget.dataset.good.id;
    // 读取目前购物车数据
    var cartData = that.data.cartData;
    // 获取当前商品数量
    var goodCount = cartData[goodId];
    // 自减1
    --goodCount;
    // 减到零了就直接移除
    if (goodCount == 0) {
      delete cartData[goodId]
    } else {
      cartData[goodId] = goodCount;
    }
    // 设值到data数据中
    that.setData({
      cartData: cartData
    });
    // 转换成购物车数据为数组
    that.cartToArray(good);
  },
  //加入购物车
  cartToArray: function (good) {
    var that = this;
    // 需要判断购物车数据中是否已经包含了原商品，从而决定新添加还是仅修改它的数量
    var cartData = that.data.cartData;
    var cartObjects = that.data.cartObjects;
    var orderDetail = {};
    for (var i = 0; i < cartObjects.length; i++) {
      if (cartObjects[i].good.id == good.id) {
        // 如果是undefined，那么就是通过点减号被删完了
        if (cartData[good.id] == undefined) {
          cartObjects.splice(i, 1);
        } else {
          cartObjects[i].quantity = cartData[good.id];
        }
        that.setData({
          cartObjects: cartObjects,
          orderDetailList: that.data.orderDetailList
        });
        // 成功找到直接返回，不再执行添加

        that.amount();
        return;
      }
    }
    // 添加商品到数组
    var cart = {};
    cart.good = good;
    console.log(good);
    cart.quantity = cartData[good.id];
    cartObjects.push(cart);
    that.setData({
      cartObjects: cartObjects,
      orderDetailList: that.data.orderDetailList
    });
    // 因为请求网络是异步的，因此汇总在此，上同
    that.amount();
  },

})