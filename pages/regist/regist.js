var util = require("../../utils/util.js");
var that;
Page({
  data: {
//全局状态信息
    userInfo: {},
    userId: null,
    loginState: false,
    customerInfo: {},

    registBtnTxt: "提交",
    registBtnBgBgColor: "#0099FF",
    btnLoading: false,
    registDisabled: false,
//界面控件显示或隐藏控制
    inputUserIdDisable:false,
    needToBeHidden:false,
    needToBeShown:false,
    LabelNeedToBeHidden:false,
    inputNeedToBeShown:true,
    addSelectNeedToBeShown:false,
    inputDisable:false,
    checkProfileState:false,
    editProfileState:false,
//查询资料显示数据
    userId_value:"",
    name_value:"",
    identity_value:"",
    phone_value:"",
    password_value:"",
    hasCylinder_value:"",
    customerType_value:"",
    customerSource_value:"",
    company_name_value:"",
    address_value:"",
    existedCustomerInfo: {},
//小图标路径
    logIcon0: "../../images/icon_member_selected.png",
    logIcon: "../../images/logIcon.png",
    pwdIcon: "../../images/pwdIcon.png",
    verifiIcon:"../../images/verifiIcon.png",
    logTel: "../../images/telephone.png",
    logAdd: "../../images/icon_home.png",
    customerSourceIcon: "../../images/default-avatar.png",
    companyIcon: "../../images/icon_home_selected.png",
//客户类型、来源选择器数据
    customerTypeIndex: 0,
    customerSourceIndex: 0,
    customerTypeArray: [],
    originalCustomerTypeArray: [],
    customerSourceArray:[],
    originalCustomerSourceArray:[],
//地址数据
    address: false,
    AddressData: {}, 
//是否携带钢瓶radio数据
    items: [
      { name: '是', value: '是', checked:"true"},
      { name: '否', value: '否'},
    ], 
  },
  onLoad: function (options) {
// 页面初始化 options为页面跳转所带来的参数
    that = this;
    that.customerType_request();
    that.customerSource_request(); 
//判断是查看资料还是修改资料模式
    var model = options.model;
    if (model == 'checkProfile') {
      that.checkProfileRequest();
      that.setData({
        inputUserIdDisable: true,
        checkProfileState: true,
        needToBeHidden: true,
        needToBeShown:true,
        inputNeedToBeShown:false,
        addSelectNeedToBeShown:true,
        inputDisable:true,
      })
    }
    else if (model == 'editProfile') {
      that.checkProfileRequest();
      that.setData({
        inputUserIdDisable: true,
        checkProfileState: true,
        editProfileState:true,
        LabelNeedToBeHidden:true,
        needToBeShown: true,
      })
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var app = getApp();
    if (app.globalData.loginState) {
      that.setData({
        loginState: true,
        userInfo: app.globalData.userInfo,
        userId: app.globalData.userId
      });
    }  
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //请求后台客户资料
  checkProfileRequest: function () {
    var that = this;
    var app = getApp();
    var hasCylinder;
    wx.request({
      url: 'http://118.31.77.228:8006/api/customers',
      method: "GET",
      data: {
        userId: app.globalData.userId
      },
      complete: function (res) {  
        if (res.statusCode == 200) {
          if (res.data.items[0].haveCylinder == true) {
            hasCylinder = "是"
          }
          else {
            hasCylinder = "否"
          };

          that.setData({
            userId_value: res.data.items[0].userId,
            name_value: res.data.items[0].name,
            identity_value: res.data.items[0].identity,
            phone_value: res.data.items[0].phone,
            customerType_value: res.data.items[0].customerType.name,
            customerSource_value: res.data.items[0].customerSource.name,
            company_name_value: res.data.items[0].customerCompany.name,
            address_value: res.data.items[0].address.province + res.data.items[0].address.city +
            res.data.items[0].address.county + res.data.items[0].address.detail,
            hasCylinder_value: hasCylinder,
          })
        }
      }
    });
  },
  //请求修改后台客户资料
  editProfileRequest: function (param) {
    var that = this;
    var app = getApp();
    var editCustomerInfo = {};

    if (param.name.length > 0) {
      editCustomerInfo.name = param.name;
    }
    if (param.identity.length > 0) {
      editCustomerInfo.identity = param.identity;
    }
    if (param.password.length > 0) {
      editCustomerInfo.password = param.password;
    }
    if (param.phone.length > 0) {
      editCustomerInfo.phone = param.phone;
    }
    if (param.customerType.length > 0) {
      var customerTypeTemp = {};
      customerTypeTemp.code = param.customerType;
      editCustomerInfo.customerType = customerTypeTemp;
    }
    if (param.customerSource.length > 0) {
      var customerSourceTemp = {};
      customerSourceTemp.code = param.customerSource;
      editCustomerInfo.customerSource = customerSourceTemp;
    }   
    if (param.province!=null){
      var customerAddressTemp = {};
      customerAddressTemp.province = param.province;
      customerAddressTemp.city = param.city;
      customerAddressTemp.county = param.county;
      customerAddressTemp.detail = param.detail;
      editCustomerInfo.address = customerAddressTemp;
    }
    if (param.customerCompany.length > 0) {
      var customerCompanyTemp = {};
      customerCompanyTemp.name = param.customerCompany;
      editCustomerInfo.customerCompany = customerCompanyTemp;
    }
    editCustomerInfo = JSON.stringify(editCustomerInfo);

    wx.request({  
      url: 'http://118.31.77.228:8006/api/customers/' + that.data.userId + '?userId=' + that.data.userId,
      method: "PUT",
      data: editCustomerInfo,
      complete: function (res) {
        
        if (res.statusCode == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },
//请求后台客户类型
customerType_request:function(){
  var that = this;
  wx.request({
    url: 'http://118.31.77.228:8006/api/CustomerType',
    method: "GET",
    complete: function (res) {  
      if (res.statusCode == 200) {
        var count = res.data.items.length;
        for (var i = 0;i < count;i++)
        { 
          var tempType  = res.data.items[i].name;
          that.data.customerTypeArray.push(tempType);
        }
        that.setData({
          customerTypeArray: that.data.customerTypeArray,
          originalCustomerTypeArray: res.data.items
        })
      }
    }
  });
},
//请求后台客户来源
customerSource_request: function () {
  wx.request({
    url: 'http://118.31.77.228:8006/api/CustomerSource',
    method: "GET",
    complete: function (res) {
      if (res.statusCode == 200) {
        var count = res.data.items.length;
        for (var i = 0; i < count; i++) {
          var tempSource = res.data.items[i].name;
          that.data.customerSourceArray.push(tempSource);
        }
        that.setData({
          customerSourceArray: that.data.customerSourceArray,
          originalCustomerSourceArray: res.data.items
        })
      }
    }
  });
},
//监听radio事件
radioChange: function (e) {
},
// 监听picker事件
bindPickerChange: function (e) {
 this.setData({
   customerSourceIndex: e.detail.value
  })
},
// 监听picker事件
bindPickerChange1: function (e) {
    this.setData({
      customerTypeIndex: e.detail.value
    })
  },
//获取地址信息
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
//验证userId输入是否正确
checkUserId: function (param) {
    var inputUserId = param.userId.trim();
    if (inputUserId.length > 0) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请设置登录名'
      });
      return false;
    }
  },
//验证name输入是否正确
checkUserName: function (param) {
    var inputUserName = param.name.trim();
    if (inputUserName.length>0) {
      return true;
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请设置用户名称'
      });
      return false;
    }
  },
//验证phone输入是否正确
checkTelephone: function (param) { 
    var telephone= param.phone.trim();
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
  //验证identity输入是否正确
  checkIdentity: function (param) {
    var identity = param.identity.trim();
    if (identity.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的身份证号'
      });
      return false;
    } else if (identity.length < 1 || identity.length > 19) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的身份证号'
      });
      return false;
    } else {
      return true;
    }
  },
  //验证password输入是否正确
  checkPassword: function (param) {
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
  //验证再次password输入是否正确
  checkPasswordSecond: function (param) {
    var password = param.password.trim();
    var passwordSecond = param.passwordSecond.trim();
    if (passwordSecond.length <= 0) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请第二次输入密码'
      });
      return false;
    }
    else if (password != passwordSecond) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '两次密码不匹配'
      });
      return false;
    } else {
      return true;
    }
  },
  //提交注册信息/修改信息表单
  formSubmit: function (e) {
    var param = e.detail.value;
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var that = this;
    
    if (that.data.editProfileState == false)
    {
      var flag = this.checkUserId(param) && this.checkUserName(param) && this.checkIdentity(param) && this.checkTelephone(param) && this.checkPassword(param) && this.checkPasswordSecond(param);
      if (flag) {
        this.setregistData1();
        setTimeout(function () {
        that.setregistData2();
        that.registRequest(param);
        }, 2000);
      }
    }  
    else{
      this.setregistData1();
      setTimeout(function () {
        that.setregistData2();
        that.editProfileRequest(param);
      }, 2000);   
    }
  },
  setregistData1: function () {
    this.setData({
      registBtnTxt: "提交中",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#999",
      btnLoading: !this.data.btnLoading
    });
  },
  setregistData2: function () {
    this.setData({
      registBtnTxt: "提交",
      registDisabled: !this.data.registDisabled,
      registBtnBgBgColor: "#0099FF",
      btnLoading: !this.data.btnLoading
    });
  },
  //提交向后台注册request
  registRequest: function (param) {
    var customerInfo = {};
    customerInfo.userId = param.userId;
    customerInfo.name = param.name;
    customerInfo.identity = param.identity;
    customerInfo.password = param.password;
    customerInfo.phone = param.phone;

    var customerTypeTemp = {};
    customerTypeTemp.code = param.customerType;
    customerInfo.customerType = customerTypeTemp;

    var customerSourceTemp = {};
    customerSourceTemp.code = param.customerSource;
    customerInfo.customerSource = customerSourceTemp;

    var customerAddressTemp = {};
    customerAddressTemp.province = param.province;
    customerAddressTemp.city = param.city;
    customerAddressTemp.county = param.county;
    customerAddressTemp.detail = param.detail;
    customerInfo.address = customerAddressTemp;

    if (param.customerCompany.length>0)
    {
      var customerCompanyTemp = {};
      customerCompanyTemp.name = param.customerCompany;
      customerInfo.customerCompany = customerCompanyTemp;
    }
    customerInfo = JSON.stringify(customerInfo);
    wx.request({
      url: 'http://118.31.77.228:8006/api/customers', 
      data: customerInfo,
      method: "POST",
      complete: function (res) {
        if (res.statusCode == 201){
          //console.error('网络请求成功')
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          });
          return;
        }

        if (res == null || res.statusCode == 409) {
          console.error('网络请求失败')
          wx.showModal({
            title: '该登录名已被注册',
            showCancel: false,
            duration: 1500
          })
          return;
        }
      }
    })
  }
})