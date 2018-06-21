Page({
  data: {
    registBtnTxt: "提交",
    registBtnBgBgColor: "#0099FF",
    btnLoading: false,
    registDisabled: false,
    order: {},
    carts: {},
    loading: false,
    showGrab: false,
    payMethod:"",
    orderState:"",
    deliveryAddress:"",
    deliveryAddressDetail:"",
  },

  onLoad: function (options) {
    var that = this;
    var order = JSON.parse(options.order);

    console.log(order);
    // if (order.payType.index == 0)
    // {
    //   that.data.payMethod = "在线支付"
    // }
    // else{
    //   that.data.payMethod = "气到付款"
    // }
    if (order.payType!=null)
    {
      that.data.payMethod = order.payType.name;
    }

    if (order.orderStatus == 0) {
      that.data.orderState = "待配送"
    }
    else if (order.orderStatus == 1) {
      that.data.orderState = "派送中"
    }
    else if (order.orderStatus == 2) {
      that.data.orderState = "已签收"
    }
    else if (order.orderStatus == 3) {
      that.data.orderState = "订单结束"
    }
    else {
      that.data.orderState = "作废"
    }

    // that.data.deliveryAddress = order.recvAddr.province + order.recvAddr.city
    //   + order.recvAddr.county + order.recvAddr.detail;
    that.data.deliveryAddress = order.recvAddr.province + order.recvAddr.city
      + order.recvAddr.county ;
    that.data.deliveryAddressDetail = order.recvAddr.detail;

    that.setData({
      order: order,
      loading: true,
      deliveryAddress: that.data.deliveryAddress,
      deliveryAddressDetail: that.data.deliveryAddressDetail,
      payMethod: that.data.payMethod,
      orderState: that.data.orderState
    })

  },

  onReady: function () {
  },
  showMap: function (e) {
    var address = e.currentTarget.dataset.address;
    var that = this;
    that.getLocation(address);
  },
  //逆向地址解析
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
        var strLocation = res.data.geocodes[0].location;
        var searchedAddress = res.data.geocodes[0].formatted_address;
        var location = {};
        location.lng = parseFloat(strLocation.split(',')[0]);
        location.lat = parseFloat(strLocation.split(',')[1]);

        wx.openLocation({
          address: searchedAddress,
          latitude: location.lat,
          longitude: location.lng,
          scale: 15
        })
      },
      fail: function () {
        console.log("逆向地址解析错误");
        // fail 
      },
      complete: function () {
        // complete 
      }
    })
  },

  trackOrder:function(e){
    var that = this;
    var orderSn = that.data.order.orderSn;
    wx.navigateTo({
      url: '../orderTrack/orderTrack?orderSn=' + JSON.stringify(orderSn),
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})