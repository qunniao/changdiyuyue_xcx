// pages/field/field.js
var util = require('../../utils/dataweek.js');
var ajax = require('../../utils/commen.js').ajax;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',           //nav标题
    field_title: '',     //页面顶部标题
    dataweek: [],        //日期列表
    field_pri_list: [],  //时间段列表
    infor_but: true,
    locationhlist: [],
    name: '',       //用户名
    tal: '',        //手机号
    inforfield: '', //获取场馆名
    loctionfield:'',//获取片场名
    pianchangId:0,//片场id
    fieldtime: '',  //获取日期时间
    infortime: '',  //获取时段时间
    inforpri: 0,    //获取该时间段的价格
    scene: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0],       //每天的剩余场次
    id: '',
    inforpid:'',
    onepricelist:[],
    changetimes:'', //选中的日期
    typeid:'',
    pianchangdatelist:[],
    checkedcheck:1,
    checkedtimes:'',
    getvids:'',
    changevids:1,
    timecontents:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    // var periodTimePOList = JSON.parse(options.periodTimePOList);
    let timestime = util.formatDate(new Date());
    wx.setNavigationBarTitle({
      title: options.name
    })
    that.setData({
      field_title: options.name,
      inforfield: options.name,
      id: options.vid,
      typeid :options.vid,
      checkedtimes:timestime,
      // field_pri_list: periodTimePOList,
      // scene: periodTimePOList.length
    })
    // 获取场数表
    wx.request({
      url: 'https://back.zhanchengwlkj.com/atxca/sport/queryVenueALL',
      data: {
        type: that.data.typeid
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lreses) {
        if (lreses.data.code == 200) {
          let changescene = 0;
          let allchangescene = that.data.scene;
          for (let x = 0; x < lreses.data.data.content.length; x++) {
            changescene += lreses.data.data.content[x].periodTimePOList.length
          }
          for (let y = 0; y < allchangescene.length; y++) {
            allchangescene[y] = changescene;
          }
          that.setData({
            locationhlist: lreses.data.data.content,
            scene: allchangescene
          })
          
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      }
    });  
    that.getdataweek();
    that.getSurplus("");
  },

  //获取时间和价格
  gettimeprice:function(){
    let that = this;
    wx.request({
      url: 'https://back.zhanchengwlkj.com/atxca/order/querDateNum',
      data: {
        times: '' + that.data.fieldtime,
        vid: that.data.getvids
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lres) {
        let timecontentdata = that.data.timecontents;
        if (lres.data.code == 200) {
          for (let x = 0; x < timecontentdata.length; x++) {
            timecontentdata[x]['change'] = 1
          }
          for (let x = 0; x < timecontentdata.length; x++) {
            for (let y = 0; y < lres.data.data.length; y++) {
              if (timecontentdata[x].pid == lres.data.data[y].pid) {
                timecontentdata[x]['change'] = 2
              }
            }
          }
          that.setData({
            field_pri_list: timecontentdata
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
  //点击片场，获取时间和价格

  clicklocation: function(e){
    var that = this;
    var pianchangname = e.currentTarget.dataset.location;
    that.setData({
      loctionfield: pianchangname
    })
   
    //获取当前片场的时间段列表
    // console.log("选中片场 loctionfield：" + that.data.loctionfield);
    for (let i = 0; i < that.data.pianchangdatelist.length; i++) {
      if (that.data.pianchangdatelist[i]['vName'] == that.data.loctionfield){
        // console.log("找到了选中片场");
        that.setData({
          loctionfield: that.data.pianchangdatelist[i].vName,
          pianchangId: that.data.pianchangdatelist[i].vid,
          field_pri_list: that.data.pianchangdatelist[i].timePOList
        })
       
      }
    }
    
  },

  // 点击日期，获取预约时间
  clickdatastime: function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    let time = that.data.dataweek[index].date;
  //  that.getSurplus(index, time)
    let changtime = that.data.dataweek[index].dateName;
    that.setData({
      fieldtime: time,
      changetimes:changtime,
      checkedtimes:time,
    })
   // that.getPriTime();
    that.getSurplus(time);
/*
    if (that.data.changevids == 2){
      that.gettimeprice();
    }

    var that = this;
    //标记
    wx.request({
      url: 'https://back.zhanchengwlkj.com/atxca/yuyue/findYuYueDateCount',
      data: {
        type: that.data.typeid
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lres) {
        if (lres.code == 200) {
          that.setData({
            changetimes: lresss.payload[0].dateName,
            dataweek: lresss.payload,
          })
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          })
        }
      }
    });
    */
  },
  //点击提交预约申请
  but_apply: function(){
    let that = this;
    if (that.data.inforfield == ''){
      wx.showToast({
        title: '请填写场馆名',
        icon: 'none'
      })
    }
    if (that.data.loctionfield == ''){
      wx.showToast({
        title: '请选择片场',
        icon: 'none'
      })
    }
    if (that.data.fieldtime == ''){
      wx.showToast({
        title: '请选择预约时间',
        icon: 'none'
      })
    }
    if(that.data.infortime == ''){
      wx.showToast({
        title: '请选择预约时段',
        icon: 'none'
      })
    }
    if (that.data.inforfield != '' && that.data.fieldtime != '' && that.data.infortime != ''){
      that.setData({
        infor_but: false
      })
    }
  },
  infor_but_m: function(){
    let that = this;
    that.setData({
      infor_but: true
    })
  },

  checkboxChange(e) {
    const items = this.data.field_pri_list
    const values = e.detail.value
    let allprice = 0;
    let alltime =[];
    let allpid =[];
    let onepricelists =[];
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].checked = false
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].pid == values[j]) {
          allprice += items[i].price
          alltime.push(items[i].betTime)
          items[i].checked = true
          allpid.push(items[i].pid)
          onepricelists.push(items[i].price)
          break
        }
      }
    }
    this.setData({
      field_pri_list:items,
      inforpri:allprice,
      infortime:alltime,
      inforpid:allpid,
      onepricelist:onepricelists
    })
  },
  //获取姓名
  urername: function(e){
    var that = this;
    let val = e.detail.value
    that.setData({
      name: val
    })
  },
  //获取手机号
  usertal: function(e){
    var that = this;
    let val = e.detail.value
    that.setData({
      tal: val
    })
  },
  //判断用户名或手机号是否为空
  confirm: function(e){
    let that = this;
    let phonechecked = 0;
    if(that.data.name == ''){
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
      })
    }
    if(that.data.tal == ''){
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
    }
    if (!(/^1[34578]\d{9}$/.test(that.data.tal))) {
      wx.showToast({
        title: '手机号码输入有误',
        icon: 'none'
      })
      phonechecked = 0;
    }else{
      phonechecked = 1
    }
    if (that.data.name != '' && that.data.tal != '' && phonechecked == 1){
      let _this = this;
      _this.setData({
        checkedcheck: 2
      })

      
      var pids="";
      for (let i = 0; i < that.data.inforpid.length; i++) {
        pids += that.data.inforpid[i]+",";
      }
      console.log("pids:" + pids + "   vid:" + that.data.typeid + " openid:" + wx.getStorageSync('openid'));
      //提交订单数据到后台

      wx.request({
        url: 'https://back.zhanchengwlkj.com/atxca/yuyue/createOrder',
        data: {
          reserveTime: that.data.fieldtime,
          phone: that.data.tal,
          name: that.data.name,
          pids: pids,
          vid: that.data.pianchangId,
          openid: wx.getStorageSync('openid')
        },
        method: 'post',
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        success: function (datass) {
          if (datass.data.code == 200) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          } else {
            wx.showToast({
              title: datass.data.msg,
              icon: 'none'
            })
          }
          _this.setData({
            checkedcheck: 1
          })
        }
      });
    }
  },
  //获取近30天的日期
  getdataweek(){
    /*
    var that = this;
    let time = util.formatDate(new Date());
    let dateweek = util.getDates(30, time);
    this.setData({
      changetimes:dateweek[0].time,
      fieldtime:time,
      dataweek: dateweek
    })
*/
    
    var that = this;
    console.log("获取30天日期 id:" + that.data.typeid);
    //标记
    wx.request({
      url: 'https://back.zhanchengwlkj.com/atxca/yuyue/findYuYueDateCount',
      data: {
        id: that.data.typeid
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lres) {
        console.log("获取30天日期:");
        console.log("lres");
        if (lres.data.code == 200) {
          that.setData({
            changetimes: lres.data.payload[0].dateName,
            dataweek: lres.data.payload,
            fieldtime: lres.data.payload[0].date
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
  //获取当日剩余
  getSurplus(time){
    // 获取剩余场数
    
    let that = this;
    //先把上一个日期片场列表清空
    that.setData({
      pianchangdatelist: [],
      field_pri_list:[]
    })

    //标记
    wx.request({
      url: 'https://back.zhanchengwlkj.com/atxca/yuyue/findYuYuePianChangList',
      data: {
        id: that.data.typeid,
        date: time
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lres) {
        console.log("getSurplus:");
        console.log(lres);
        if (lres.data.code == 200) {
          that.setData({
            pianchangdatelist: lres.data.payload,
            loctionfield: lres.data.payload[0].vName,
            pianchangId: lres.data.payload[0].vid,
            field_pri_list: lres.data.payload[0].timePOList
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
  // 时间和价格
  getPriTime() {
    let that = this;
    // 获取场数表
    wx.request({
      url: 'https://back.zhanchengwlkj.com/atxca/sport/queryVenueALL',
      data: {
        type: that.data.typeid
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (lreses) {
        if (lreses.data.code == 200) {
          that.setData({
            locationhlist: lreses.data.data.content,
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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