//index.js
//获取应用实例

var ajax = require('../../utils/commen.js').ajax;
const app = getApp()

Page({
  data: {
    catelist: [],   //一级分类菜单
    makefieldlist: [],   //列表数据
    pageNum: 1,
    pageSize: 20,
    type: [1,2,3,4,5],     //type值
    typeid: '',
    changcatenames: '场地',
    newslist: [{ id: 1, title: '预约当日场地的顾客，请提前十分钟办理支付，延迟未能准时付款的订单，电脑系统将自动取消该条预定。由于近期打篮球人员剧增，场地使用频率高，对场地维护成本增加。决定与2020年6月15日起对篮球馆场馆价格进行调整：篮球一号馆250/2小时（半场）,篮球二号馆300/2小时（半场），综合馆篮球：350/（半场）;' }, { id: 2, title: '如遇比赛、或是场地破损、场地漏水等情况，工作人员将致电您，请顾客朋友理解、配合;' }, { id: 3, title: '全民健身中心所有场地最终解释权归全民健身中心所有;' }, { id: 4, title: '可使用支付宝。' }]
  },
  onLoad: function(){
    let that = this;
    wx.login({
      success: function(data){
        console.log("code:"+code);
        var code = data.code;
        wx.request({
          //url: 'https://back.zhanchengwlkj.com/atxca/wxlog/loginUserForWX',
          url: 'https://admin.zjtyj.cn/wxlog/loginUserForWX',
          data: {
            code:code
          },
          method: 'post',
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          success: function (lres) {
            console.log("openid222***:" + lres);
            if (lres.data.code == 200) {
              console.log("openid***:" + lres.data.data.openid);
              wx.setStorageSync('openid',lres.data.data.openid)
            }
          }
        });
      }
    })
    that.getPosiFirsttion();
    that.getPosition();
  },
  // 点击场馆
  clickcate: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = that.data.catelist[index].id;
    var changcatename = that.data.catelist[index].name;
    that.setData({
      changcatenames: changcatename
    })
    wx.request({
      //url: 'https://back.zhanchengwlkj.com/atxca/sport/queryVhouseALL',
      url: 'https://admin.zjtyj.cn/sport/queryVhouseALL',
      data: {
        type: id,
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize,
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (data) {
        if (data.data.code == 200) {
          that.setData({
            makefieldlist: data.data.data.content
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
  // 点击预约 传递数据
  tofield: function (e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    let name = that.data.makefieldlist[index].name;
    let vid = that.data.makefieldlist[index].id;
    let typeid = that.data.makefieldlist[index].type;
    // let periodTimePOList = JSON.stringify(that.data.makefieldlist[index].periodTimePOList);
    wx.navigateTo({
      url: '/pages/field/field?name=' + name + '&vid=' + vid + '&typeid=' + typeid ,
    })
  },
  // 查询场地一级分类信息
  getPosiFirsttion() {
    let that = this;
    ajax('/data/queryTypePO', {}, function (data) {
      if (data.statusCode >= 200 && data.statusCode <= 299) {
        that.setData({
          catelist: data.data.data
        })
      } else {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    }, '')
  },
  // 查询场地信息
  getPosition() {
    let that = this;
    ajax('/sport/queryVhouseALL', {
      pageNum: that.data.pageNum,
      pageSize: that.data.pageSize,
      type: 0
    }, function (data) {
      // console.log(data)
      if (data.statusCode >= 200 && data.statusCode <= 299) {
        that.setData({
          makefieldlist: data.data.data.content
        })
      } else {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
    }, '')
  },
})
