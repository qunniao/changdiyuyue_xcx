module.exports = {
  ajax,
  websocket
}

/** 请求函数 */
function ajax(url, data, successFun, organization) {
  let basUrl = "https://back.zhanchengwlkj.com/atxca";  //服务器
  // let basUrl = "http://danbrown.mynatapp.cc";  //本地

  let platformToken = wx.getStorageSync("platformToken");
  let systemToken = wx.getStorageSync("systemToken");

  wx.request({
    url: basUrl + url,
    method: "POST",
    data: data,
    header: {
      // "Content-Type": "application/x-www-form-urlencoded",
      'content-type': 'application/json'
    },
    dataType: 'json',
    success: successFun,
    fail: function (res) {
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      })
    },
  })
}

/** websocket请求函数 */
function websocket(url, data, successCallBack, organization) {
  let platformToken = wx.getStorageSync("platformToken");
  let systemToken = wx.getStorageSync("systemToken");
  //创建一个 WebSocket 连接
  wx.connectSocket({
    url: url,
    headers: {},
    method: 'POST',
  })
  // 监听WebSocket 连接打开事件
  wx.onSocketOpen(function (res) {
    console.log(res)
    sendSocketMessage(data);
  })
  //通过 WebSocket 连接发送数据
  function sendSocketMessage(data) {
    wx.sendSocketMessage({
      data: data,
      success: function (res) {
        console.log('发送成功', res)
      },
      fail: function (res) {
        console.log('发送失败', res)
      }
    })
  }
  //监听WebSocket 接受到服务器的消息事件
  wx.onSocketMessage(successCallBack)
  //监听WebSocket 错误事件
  wx.onSocketError(function (res) {
    console.log('websocket连接失败！');
  })
}