// pages/contact/contact.js
const app = getApp();
Page({
  data:{
    message: '',
    tel: ''
  },
  onLoad:function(options){
    var _this = this;
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  makePhoneCall: function(){
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: `95007`
    })
  }
})