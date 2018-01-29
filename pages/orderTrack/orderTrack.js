const app = getApp();
const QQMapWX = require('../../require/qqmap-wx-jssdk.min.js');
var qqmapsdk;
var that;
Page({
  data: {
    userInfo: {},
    userId: null,
    loginState: false,
    orderSn:"",
    orderTrackInfo:{},
    orderState:"",
    markers: [],
    position: {},
    circles: {},
    deliverPhonecall:"",

    // historyList: [
    //   {
    //     "time": "2017-09-01 20:00",
    //     "decription": "百江公司接入订单",
    //   },
    //   {
    //     "time": "2017-09-01 20:10",
    //     "decription": "骑手已经接单，联系方式：15005146555",
    //   },
    //   {
    //     "time": "2017-09-01 20:50",
    //     "decription": "骑手已取瓶，派送中...",
    //   },
    //   {
    //     "time": "2017-09-01 21:00",
    //     "decription": "煤气瓶已送达。",
    //   },]
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单跟踪'
    })
    var that = this;
    var orderSn = JSON.parse(options.orderSn);
    that.setData({
      orderSn: orderSn
    });

    that.checkOrderHistory_request();
    that.showLocationInfo();

  },
  // 页面显示（一个页面只会调用一次）
  onShow: function () {
    var app = getApp();
    // if (app.globalData.loginState) {
    //   that.setData({
    //     loginState: true,
    //     userInfo: app.globalData.userInfo,
    //     userId: app.globalData.userId
    //   });
    // }
    //如果没有登录就跳转到登录页面
    // if ((!app.globalData.loginState) && (app.globalData.userId == null)) {
    //   wx.navigateTo({
    //     url: '../login/login',
    //   })
    // } else {
    //   wx.navigateTo({
    //     url: '../index/index',
    //   })
    // }
  },

//载入位置信息
showLocationInfo:function(){
  // var tempPosition = {};
  // var tempDeliveryPosition = {};
  // var _this = this;

  // wx.getLocation({
  //   type: 'wgs84',
  //   success: function (res) {
  //     tempPosition.latitude = res.latitude;
  //     tempPosition.longitude = res.longitude;
  //     tempPosition.speed = res.speed;
  //     tempPosition.accuracy = res.accuracy;
  //     _this.setData({
  //       position: tempPosition,
  //       markers: [{
  //         id: "1",
  //         latitude: res.latitude,
  //         longitude: res.longitude,
  //         width: 50,
  //         height: 50,
  //         title: "我家"
  //       }, {
  //         id: "2",
  //         latitude: res.latitude + 0.002,
  //         longitude: res.longitude + 0.002,
  //         iconPath: "../../images/icon/delivery.png",
  //         width: 50,
  //         height: 50,
  //         title: "配送车"
  //       }],
  //       circles: [{
  //         latitude: res.latitude,
  //         longitude: res.longitude,
  //         color: '#FF0000DD',
  //         fillColor: '#7cb5ec88',
  //         radius: 100,
  //         strokeWidth: 2
  //       }]
  //     })
  //   },
  //   fail: function () {
  //     wx.openSetting({
  //       success: (res) => {
  //         /*
  //          * res.authSetting = {
  //          *   "scope.userInfo": true,
  //          *   "scope.userLocation": true
  //          * }
  //          */
  //       }
  //     })
  //     console.log("failed location");
  //   }
  // })
var that = this;
  console.log(that.data.position);
  var tempLatitude = that.data.position.latitude;
  var tempLongitude = that.data.position.longitude;
  wx.getLocation({
      //当前经纬度
      latitude: tempLatitude,
      longitude: tempLongitude,
      scale:15,
    //成功打印信息
    success: function (res) {
      console.log(res)
          that.setData({
        // position: tempPosition,
        markers: [ {
          id: "1",
          latitude: tempLatitude + 0.002,
          longitude: tempLongitude + 0.002,
          iconPath: "../../images/icon/delivery.png",
          width: 50,
          height: 50,
          title: "配送车"
        }],
        circles: [{
          latitude: tempLatitude,
          longitude: tempLongitude,
          color: '#FF0000DD',
          fillColor: '#7cb5ec88',
          radius: 50,
          strokeWidth: 2
        }]
      })

    },
    //失败打印信息
    fail: function (err) {
      console.log(err)
    },
    //完成打印信息
    complete: function (info) {
      console.log(info)
    },
  })
},
  //请求订单跟踪
  checkOrderHistory_request: function () {
    console.log("请求订单跟踪信息");
    var that = this;
    var orderState = "";
    var position={};
    var deliverPhonecall="";
    wx.request({
      url: 'http://118.31.77.228:8006/api/Orders',
      data: {
        orderSn: that.data.orderSn
      },
      method: "GET",
      complete: function (res) {
        console.log(res.data);
        if (res.statusCode == 200) {
          if (res.data.items[0].orderStatus == 0) {
            orderState = "待配送"
          }
          else if (res.data.items[0].orderStatus == 1) {
            orderState = "派送中"
          }
          else if (res.data.items[0].orderStatus == 2) {
            orderState = "已签收"
          }
          else if (res.data.items[0].orderStatus == 3) {
            orderState = "订单结束"
          }
          else {
            orderState = "作废"
          }

          // position.longitude = res.data.items[0].dispatcher.userPosition.longitude;
          // position.latitude = res.data.items[0].dispatcher.userPosition.latitude;
          if (res.data.items[0].dispatcher!=null)
          {
            position.longitude = res.data.items[0].dispatcher.userPosition.longitude;
            position.latitude = res.data.items[0].dispatcher.userPosition.latitude;
            //deliverPhonecall = res.data.items[0].dispatcher.mobilePhone
          }
         
          

          that.setData({
            orderTrackInfo: res.data,
            orderState: orderState,
            position: position,
            // deliverPhonecall: deliverPhonecall
          })
          console.log(that.data.position);
          console.log(that.data.orderTrackInfo);
          that.showLocationInfo();
          
        }
      }
    });
  },

  makeAcall: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.deliverPhonecall
    })
  },
  call95007: function (e) {
    wx.makePhoneCall({
      phoneNumber: "95007"
    })
  }
})