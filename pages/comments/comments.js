// pages/comments/comments.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    comments: [],
    nextStart: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 影评
    var id = options.id;
    this.requesetComments(id);
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

  },
  bindscrolltolower: function() {
    console.log("bindscrolltolower");
    console.log(this.data)
    this.requesetComments(this.data.id)
  },
  requesetComments: function(id) {
    var url = app.globalData.doubanBase + app.globalData.subject + id + "/comments";
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: url,
      data: {
        start: that.data.nextStart,
        count: 10
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'json' }, // 设置请求的 header
      success: function (res) {
        var data = res.data;
        console.log(data)
        var readyData = {};
        var comments = [];
        readyData.id = id;
        readyData.nextStart = data.next_start;
        comments = comments.concat(that.data.comments, data.comments);
        readyData.comments = comments;
        that.setData(readyData);
      },
      fail: function () {
        console.log("fail");
      },
      complete: function () {
        console.log("complete");
        wx.hideToast();
      }
    })
  }
})