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

    secPass:false,
    customerShown:true,
    radioHidden: true,
//查询资料显示数据
    userId_value:"",
    name_value:"",
    password_value:"",
    identity_value:"",
    phone_value:"",
    password_value:"",
    hasCylinder_value:"",
    customerType_value:"",
    customerSource_value:"",
    settlementType_value:"",
    company_name_value:"",
    address_value:"",
    address_value1: "",
    address_value2: "",
    existedCustomerInfo: {},
//小图标路径
    logIcon0: "../../images/loginName.png",
    logIcon1: "../../images/userName.png",
    idIcon: "../../images/IDNum.png",
    telIcon: "../../images/tel.png",
    bottleCheck: "../../images/bottleCheck.png",
    pwdIcon: "../../images/password.png",
    customerTypeIcon: "../../images/customerType.png",
    customerResourceIcon: "../../images/customerResource.png",
    settlementIcon: "../../images/settlementType.png",
    verifiIcon:"../../images/verifiIcon.png",
    logTel: "../../images/telephone.png",
    logAdd: "../../images/locaton.png",
    companyIcon: "../../images/company.png",
//客户类型、来源选择器数据
    customerTypeIndex: 0,
    customerTypeArray: [],
    originalCustomerTypeArray: [],
    
    customerSourceIndex: 0,
    customerSourceArray:[],
    originalCustomerSourceArray:[],

    settlementTypeIndex: 0,
    settlementTypeArray: [],
    originalSettlementTypeArray: [],
//地址数据
    address: false,
    AddressData: {}, 
//是否携带钢瓶radio数据
    items: [
      { name: '是', value: '是', checked: "true" },
      { name: '否', value: '否'},
    ], 
    hasCylinder: true,
  },
  onLoad: function (options) {
// 页面初始化 options为页面跳转所带来的参数
    that = this;
    that.customerType_request();
    that.customerSource_request(); 
    that.settlementType_request();
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
        secPass:true,
       
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
        customerShown:false,
        radioHidden: false,
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
      url: getApp().GlobalConfig.baseUrl + "/api/customers",
      //url: 'http://118.31.77.228:8006/api/customers',
      method: "GET",
      data: {
        userId: app.globalData.userId
      },
      complete: function (res) {  
        console.info(res.data.items[0]);
        if (res.statusCode == 200) {
          if (res.data.items[0].haveCylinder == true) {
            hasCylinder = "是"
          }
          else {
            hasCylinder = "否"
          };

          for (var i = 0; i < that.data.customerTypeArray.length; i++)
          {
            if (res.data.items[0].customerType.name == that.data.customerTypeArray[i])
            {
              that.setData({
                customerTypeIndex : i
              })
            }
          }

          for (var i = 0; i < that.data.customerSourceArray.length; i++) {
            if (res.data.items[0].customerSource.name == that.data.customerSourceArray[i]) {
              that.setData({
                customerSourceIndex: i
              })
            }
          }

          that.setData({
            userId_value: res.data.items[0].userId,
            name_value: res.data.items[0].name,
            password_value: res.data.items[0].password,
            identity_value: res.data.items[0].identity,
            phone_value: res.data.items[0].phone,
            customerType_value: res.data.items[0].customerType.name,
            customerSource_value: res.data.items[0].customerSource.name,
            
            settlementType_value: res.data.items[0].settlementType.name,

            company_name_value: res.data.items[0].customerCompany.name,
            address_value: res.data.items[0].address.province + res.data.items[0].address.city +
            res.data.items[0].address.county + res.data.items[0].address.detail,
            address_value1: res.data.items[0].address.province + res.data.items[0].address.city +
            res.data.items[0].address.county,
            address_value2:res.data.items[0].address.detail,
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
    // if (param.settlementType.length > 0) {
    //   var settlementTypeTemp = {};
    //   settlementTypeTemp.code = param.settlementType;
    //   editCustomerInfo.settlementType = settlementTypeTemp;
    // } 

    editCustomerInfo.haveCylinder = that.data.hasCylinder;

    var settlementTypeTemp = {};
    settlementTypeTemp.code = "00001";
    editCustomerInfo.settlementType = settlementTypeTemp;

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
    console.info(editCustomerInfo);

    wx.request({  
      url: getApp().GlobalConfig.baseUrl + "/api/customers/" + that.data.userId + '?userId=' + that.data.userId,
      method: "PUT",
      data: editCustomerInfo,
      complete: function (res) {
        if (res.statusCode == 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500,
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: '../index/index',
                })
              }, 1500);
            },
          });
        }
      }
    });
  },
//请求后台客户类型
customerType_request:function(){
  var that = this;
  wx.request({
    url: getApp().GlobalConfig.baseUrl + "/api/CustomerType",
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
    url: getApp().GlobalConfig.baseUrl + "/api/CustomerSource",
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
//请求后台结算类型
settlementType_request: function () {
  wx.request({
    url: getApp().GlobalConfig.baseUrl + "/api/SettlementType",
    method: "GET",
    complete: function (res) {
      if (res.statusCode == 200) {
        var count = res.data.items.length;
        for (var i = 0; i < count; i++) {
          var tempSource = res.data.items[i].name;
          that.data.settlementTypeArray.push(tempSource);
        }
        that.setData({
          settlementTypeArray: that.data.settlementTypeArray,
          originalSettlementTypeArray: res.data.items
        })
        console.info(res.data.items);
      }
    }
  });
},
//监听radio事件
radioChange: function (e) {
  var that = this;
  // console.info(e.detail.value);
  if (e.detail.value){
    this.setData({
      hasCylinder: true
    })
  }
  else
  {
    this.setData({
      hasCylinder: false
    })
  }
  console.info(that.data.hasCylinder)
},
// 监听客户类型picker事件
bindPickerChange: function (e) {
 this.setData({
   customerSourceIndex: e.detail.value
  })
},
// 监听客户来源picker事件
bindPickerChange1: function (e) {
    this.setData({
      customerTypeIndex: e.detail.value
    })
},
// 监听结算类型picker事件
bindPickerChange2: function (e) {
  this.setData({
    settlementTypeIndex: e.detail.value
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
  //验证地址是否有
  checkAddress: function () {
    var that = this;
    var exp = that.data.AddressData.provinceName;
   // console.info(exp);
    if (typeof (exp) == "undefined") {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的地址信息'
      });
      return false;
    }
    else {
      return true;
    }
  },

  //提交注册信息表单
  formSubmit: function (e) {
    var param = e.detail.value;
    this.mysubmit(param);
  },
  mysubmit: function (param) {
    var that = this;
    
    if (that.data.editProfileState == false)
    {
      var flag = this.checkUserId(param) && this.checkUserName(param)
      && this.checkTelephone(param) && this.checkPassword(param) && this.checkPasswordSecond(param) && this.checkAddress();
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
    var that = this;
    var customerInfo = {};
    customerInfo.userId = param.userId;
    customerInfo.name = param.name;
    if (param.identity.length > 0){
      customerInfo.identity = param.identity;
    }
    else
    {
      customerInfo.identity = "未提交";
    }
    
    customerInfo.password = param.password;
    customerInfo.phone = param.phone;

    customerInfo.haveCylinder = false;

    var customerTypeTemp = {};
    customerTypeTemp.code = param.customerType;
    customerInfo.customerType = customerTypeTemp;

    var customerSourceTemp = {};
    customerSourceTemp.code = param.customerSource;
    customerInfo.customerSource = customerSourceTemp;
//只能注册普通用户
    var settlementTypeTemp = {};
    settlementTypeTemp.code = "00001";
    customerInfo.settlementType = settlementTypeTemp;

    var customerAddressTemp = {};
    // customerAddressTemp.province = param.province;
    // customerAddressTemp.city = param.city;
    // customerAddressTemp.county = param.county;
    // customerAddressTemp.detail = param.detail;
    customerAddressTemp.province = that.data.AddressData.provinceName;
    customerAddressTemp.city = that.data.AddressData.cityName;
    customerAddressTemp.county = that.data.AddressData.countyName;
    customerAddressTemp.detail = that.data.AddressData.detailInfo;
    customerInfo.address = customerAddressTemp;
    

    if (param.customerCompany.length>0)
    {
      var customerCompanyTemp = {};
      customerCompanyTemp.name = param.customerCompany;
      customerInfo.customerCompany = customerCompanyTemp;
    }
    customerInfo = JSON.stringify(customerInfo);
    console.info(customerInfo);
    
    wx.request({
      url: getApp().GlobalConfig.baseUrl + "/api/customers",
      data: customerInfo,
      method: "POST",
      complete: function (res) {
        if (res.statusCode == 201){
          wx.showToast({
            title: '提交成功',
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
        if (res == null || res.statusCode == 406) {
          wx.showModal({
            title: '注册失败，请输入全部必填项',
            showCancel: false,
            duration: 1500
          })
          return;
        }
        if (res == null || res.statusCode == 409) {
          //console.error('网络请求失败')
          wx.showModal({
            title: '注册失败，该登录名已被注册',
            showCancel: false,
            duration: 1500
          })
          return;
        }
      }
    })
  }
})