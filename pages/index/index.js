//获取应用实例
const app = getApp();

var user_login_state = getApp().globalData.loginState; 

Page({
  data:{
    logoSrc: '',
    avatarUrl: '',
    nickName: '',
    openid: '',
    timer: '',
    city:'',
    swiper:{
      "autoplay": true,
      "indicatorDots": true
    },
    lunboList: [
      {
      "title": "advert1",
      "picurl": "../../images/advert/baijiang1.jpg",
    },
    {
      "title": "advert2",
      "picurl": "../../images/advert/baijiang2.jpg",
    },],
    bannerUrlList: [],
    navList: [
      {
        "title": "我要订气",
        "picurl": "../../images/icon/dingqi.jpg",
        "gotoUrl": "../ordering/ordering",
      },
      {
        "title": "我的订单",
        "picurl": "../../images/icon/dingdan.jpg",
        "gotoUrl": "../order/order",
      },
      {
        "title": "我要报修",
        "picurl": "../../images/icon/baoxiu.jpg",
        "gotoUrl": "../repair/repair",
 
      },
      // {
      //   "title": "我要优惠",
      //   "picurl": "../../images/icon/youhui.jpg",

      // },
    ],
    classList: [
      // {
      //   "title": "百江商城",
      //   "picurl": "../../images/icon/gas.jpg",
      //   "gotoUrl": "../store/store",
      // },
      // {
      //   "title": "电影",
      //   "picurl": "../../images/icon/film.jpg",
      //   "gotoUrl": ""
      // },
      // {
      //   "title": "外卖",
      //   "picurl": "../../images/icon/food.jpg",
      //   "gotoUrl": "",
      // },
      // {
      //   "title": "火车订票",
      //   "picurl": "../../images/icon/train.jpg",
      //   "gotoUrl": ""
      // },
      // {
      //   "title": "生活缴费",
      //   "picurl": "../../images/icon/water.jpg",
      // },
      // {
      //   "title": "医院挂号",
      //   "picurl": "../../images/icon/hospital.jpg",
      //   "gotoUrl": ""
      // },
      // {
      //   "title": "手机充值",
      //   "picurl": "../../images/icon/phone.jpg",
      //   "gotoUrl": ""
      // },
      // {
      //   "title": "共享单车",
      //   "picurl": "../../images/icon/bike.jpg",
      //   "gotoUrl": ""
      // }
    ]
  },
  onLoad:function(options){
    wx.showNavigationBarLoading();
    var _this = this;
    wx.showShareMenu({
      withShareTicket: true
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        var speed = res.speed;
        var accuracy = res.accuracy;

        _this.loadCity(longitude, latitude);
    }
    });
  },
  onReady:function(){
    wx.hideNavigationBarLoading();
  },
  onShow:function(){
  },
  onHide:function(){
  },
  onUnload:function(){
  },
  onPullDownRefresh: function(){
    
  },
  loadCity: function (longitude, latitude) {
    var _this = this;
    wx.request({
      url: 'http://api.map.baidu.com/geocoder/v2/?ak=fYFsXh8emmB2WzYKG7HZnK9gW94r7mD8&location=' + latitude + ',' + longitude + '&output=json',
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // success 
        var citys = res.data.result.formatted_address;
        _this.setData({ city: citys });
        wx.setNavigationBarTitle({
          title: '当前位置:' + citys
        });
        
      },
      fail: function () {
        // fail 
      },
      complete: function () {
        // complete 
      }
    })
  } 
})