// pages/my/my.js
var ajax = require('../../utils/commen.js').ajax;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "皮卡丘要放电",
    my_photo: '',
    make_none_list_d_name: true,
    make_none_list_d_hos: false,
    tube_list: false,
    history_list: true,
    make_none_list: [],
    make_tube_list:[],
    orderId: '',
    type: [1, 2, 3, 4],  //1,取消,2待审批,3待付款,4预约成功
    make: '取消',
    makeshen: '待审批',
    makefu: '待付款',
    makesuccess: '预约成功',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getOrderlist();
    that.getusername();
    that.tube();
  },
  // 点击待确认预约
  tube:function(){
    var that = this;
    that.setData({
      make_none_list_d_name: true,
      make_none_list_d_hos: false,
      tube_list: false,
      history_list: true
    })
    wx.request({
      url: 'https://back.zhanchengwlkj.com/atxca/yuyue/findOrderListByWaitAndOpenId',
      data: {
        openid: wx.getStorageSync('openid')
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lres) {
        console.log("待到场预约");
        console.log(lres)
        if (lres.data.code == 200) {
          that.setData({
            make_tube_list: lres.data.payload,
          })
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      }
    });
  },
  // 点击待确认预约的取消
  makelistnone: function(e){
    var that = this;
    let index = e.currentTarget.dataset.index;
    let orderId = that.data.make_tube_list[index].orderId;
    that.setData({
      orderId: orderId
    })
    wx.request({
      url: 'https://back.zhanchengwlkj.com/atxca/order/approvedFail',
      data: {
        orderId: that.data.orderId
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lrese) {
        if (lrese.data.code == 200) {
          that.onLoad()
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      }
    });
  },
  // 点击历史预约记录
  history:function(){
    var that = this;
    that.setData({
      make_none_list_d_name: false,
      make_none_list_d_hos: true,
      tube_list: true,
      history_list: false
    })
    
    wx.request({
      url: 'https://back.zhanchengwlkj.com/atxca/yuyue/findOrderListByOpenId',
      data: {
        openid: wx.getStorageSync('openid')
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lresss) {
        if (lresss.data.code==200) {
            that.setData({
              make_none_list: lresss.data.payload,
            })
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      }
    });
  },
  // 上传头像
  mtphoto:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        that.setData({
          my_photo: tempFilePaths
        })
      }
    })
  },
  // 订单处理
  getOrderlist() {
    var that = this;
    wx.request({
      url: 'https://back.zhanchengwlkj.com/atxca/yuyue/findOrderListByWaitAndOpenId',
      data: {
        openid: wx.getStorageSync('openid')
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lres) {
        if (lres.data.code == 200) {
          that.setData({
            make_tube_list: lres.data.payload,
          })
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      }
    });
   
  },
  // 获取用户头像信息
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo;
    console.log("登录信息：");
    console.log(e.detail.userInfo);
    console.log("openid：" + wx.getStorageSync('openid'));
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取用户信息
  getusername() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that =this;
    that.tube();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})