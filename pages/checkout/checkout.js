// checkout.js
var WxNotificationCenter = require('../../require/WxNotificationCenter.js');
var that;
var address=false;

Page({
  data: {
    AddressData: {}, 
    cartDetail: {},
    psText: " "
  },
  onLoad: function (options) {
    that = this;

    // 注册通知
    //WxNotificationCenter.addNotification("addressSelectedNotification", that.getSelectedAddress, that);
    WxNotificationCenter.addNotification("remarkNotification", that.getRemark, that);
    // 购物车获取参数
    that.setData({
      carts: JSON.parse(options.carts)
      //解析得到对象
    });
    that.setData({
      amount: parseFloat(options.amount),
      quantity: parseInt(options.quantity),
      total: parseFloat(options.amount) 
    });
  },
  selectAddress: function () {
    wx.chooseAddress({
      success: function (res) {

        that.setData({
          AddressData: res,
          address:true
        });
      }
    })
  },
  
  getRemark: function (remark) {
    
    that.setData({
      psText: remark
    });
  },
  naviToRemark: function () {
    wx.navigateTo({
      url: '../remark/remark?remark=' + (that.data.remark || '')
    });
  },
  payment: function () {
    that.data.cartDetail = that.data.carts,
    wx.request({
      url: 'http://118.31.77.228:8006/api/goods', //仅为示例，并非真实的接口地址
      data: that.data,
      method:"POST",
      complete: function (res) {
        that.setData({ 
        });
        if (res == null || res.data == null) {
          wx.showModal({
          title: '订单创建失败',
          showCancel: false
          })
          return;
        };
    wx.showToast({
        title: '成功',
        icon: 'success',
        duration:2000
      });

      }
    })
  }
})