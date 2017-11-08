const app = getApp();
const QQMapWX = require('../../require/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
    data:{
        markers:[],
        position:{},
        circles:{},
        historyList: [
          {
            "time": "2017-09-01 20:00",
            "decription": "百江公司接入订单",
          },
          {
            "time": "2017-09-01 20:10",
            "decription": "骑手已经接单，联系方式：15005146555",
          },
          {
            "time": "2017-09-01 20:50",
            "decription": "骑手已取瓶，派送中...",
          },
          {
            "time": "2017-09-01 21:00",
            "decription": "煤气瓶已送达。",
          },]
    },
    onLoad: function(options){
      var tempPosition = {};
      var tempDeliveryPosition = {};
      var _this = this;

        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            tempPosition.latitude = res.latitude;
            tempPosition.longitude = res.longitude;
            tempPosition.speed = res.speed;
            tempPosition.accuracy = res.accuracy;
            _this.setData({
              position: tempPosition,
              markers: [{
                id: "1",
                latitude: res.latitude,
                longitude: res.longitude,
                width: 50,
                height: 50,
                title: "我家"
              }, {
                id: "2",
                latitude: res.latitude+0.002,
                longitude: res.longitude+0.002,
                iconPath: "../../images/icon/delivery.png",
                width: 50,
                height: 50,
                title: "配送车"
              }],
              circles: [{
                latitude: res.latitude,
                longitude: res.longitude,
                color: '#FF0000DD',
                fillColor: '#7cb5ec88',
                radius: 100,
                strokeWidth: 2
              }]
            })
          },
          fail: function()
          {
            wx.openSetting({
              success: (res) => {
                /*
                 * res.authSetting = {
                 *   "scope.userInfo": true,
                 *   "scope.userLocation": true
                 * }
                 */
              }
            })
            console.log("failed location");
          }
          
        })
    },
    // 页面显示（一个页面只会调用一次）
    onShow: function () {
      var app = getApp();
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
})