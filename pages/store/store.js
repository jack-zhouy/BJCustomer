var that;
// 最大行数
var max_row_height = 5;
// 行高
var cart_offset = 90;
// 底部栏偏移量
var food_row_height = 49;
Page({
  //数据源

  data: {
    goods:[],
    loading: false,
    limit: 6,
    windowHeight: 0,
    scrollTop: 100,
    cartData: {},
    cartObjects: [],
    amount: 0,
    maskVisual: 'hidden',
  },

  requestData: function (a) {
    var that = this
    wx.request({
      url: 'http://118.31.77.228:8006/api/goods', //仅为示例，并非真实的接口地址
      data: {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 数据从逻辑层发送到视图层，同时改变对应的 this.data 的值
        that.setData({
          goods: res.data.items,
          loading: true
        })
      },
      fail: function () {
        console.log("failed");
      }
    })
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  // 页面初始化
  onLoad: function () {
    that = this;
    console.log("ok");
    this.requestData();
  },
  // 页面显示（一个页面只会调用一次）
  onShow: function () {
  },
  // 页面初次渲染完成（每次打开页面都会调用一次）
  onReady: function () {
  },
  // 页面隐藏（当navigateTo或底部tab切换时调用）
  onHide: function () {
  },
  // 页面关闭（当redirectTo或navigateBack的时候调用）
  onUnload: function () {
  },
  // 下拉加载
  onPullDownRefresh: function (e) {
    var limit = this.data.limit + 6
    this.setData({
      limit: limit
    })
    this.requestData();
  },
  checkout: function () {
    // 将对象序列化
    var result;
    var cartObjects = [];
    that.data.cartObjects.forEach(function (item, index) {
      result += item.good.goodName;
      result += item.good.price;
      result += ";";
      var cart = {
        goodName: item.good.goodName,
        price: item.good.price,
        quantity: item.quantity
      };
      cartObjects.push(cart);
    });
    // 页面显示（一个页面只会调用一次）  
      var app = getApp();
      //如果没有登录就跳转到登录页面
      if ((!app.globalData.loginState) && (app.globalData.userId == null)) {
        wx.navigateTo({
          url: '../login/login',
        })
      } else {
        wx.navigateTo({
          url: '../../pages/checkout/checkout?quantity=' + that.data.quantity + '&amount=' + that.data.amount + '&express_fee=' + that.data.express_fee + '&carts=' + JSON.stringify(cartObjects)
        })
      }
  },
  add: function (e) {
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
  subtract: function (e) {
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
  cartToArray: function (good) {
    // 需要判断购物车数据中是否已经包含了原商品，从而决定新添加还是仅修改它的数量
    var cartData = that.data.cartData;
    var cartObjects = that.data.cartObjects;
    for (var i = 0; i < cartObjects.length; i++) {
      if (cartObjects[i].good.id == good.id) {
        // 如果是undefined，那么就是通过点减号被删完了
        if (cartData[good.id] == undefined) {
          cartObjects.splice(i, 1);
        } else {
          cartObjects[i].quantity = cartData[good.id];
        }
        that.setData({
          cartObjects: cartObjects
        });
        // 成功找到直接返回，不再执行添加
        that.amount();
        return;
      }
    }
      // 添加商品到数组
      var cart = {};
      cart.good = good;
      cart.quantity = cartData[good.id];
      cartObjects.push(cart);
      that.setData({
        cartObjects: cartObjects
      });
      // 因为请求网络是异步的，因此汇总在此，上同
      that.amount();
  },
  cascadeToggle: function () {
    //切换购物车开与关
    if (that.data.maskVisual == 'show') {
      that.cascadeDismiss();
    } else {
      that.cascadePopup();
    }
  },
  cascadePopup: function () {
    // 购物车打开动画
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-in-out',
    });
    that.animation = animation;
    // scrollHeight为商品列表本身的高度
    var scrollHeight = (that.data.cartObjects.length <= max_row_height ? that.data.cartObjects.length : max_row_height) * food_row_height;
    // cartHeight为整个购物车的高度，也就是包含了标题栏与底部栏的高度
    var cartHeight = scrollHeight + cart_offset;
    animation.translateY(- cartHeight).step();
    that.setData({
      animationData: that.animation.export(),
      maskVisual: 'show',
      scrollHeight: scrollHeight,
      cartHeight: cartHeight
    });
    // 遮罩渐变动画
    var animationMask = wx.createAnimation({
      duration: 150,
      timingFunction: 'linear',
    });
    that.animationMask = animationMask;
    animationMask.opacity(0.8).step();
    that.setData({
      animationMask: that.animationMask.export(),
    });
  },
  cascadeDismiss: function () {
    // 购物车关闭动画
    that.animation.translateY(that.data.cartHeight).step();
    that.setData({
      animationData: that.animation.export()
    });
    // 遮罩渐变动画
    that.animationMask.opacity(0).step();
    that.setData({
      animationMask: that.animationMask.export(),
    });
    // 隐藏遮罩层
    that.setData({
      maskVisual: 'hidden'
    });
  },
  amount: function () {
    var cartObjects = that.data.cartObjects;
    var amount = 0;
    var quantity = 0;
    cartObjects.forEach(function (item, index) {
      amount += item.quantity * item.good.price;
      quantity += item.quantity;
    });
    that.setData({
      amount: amount,
      quantity: quantity
    });
  },

})