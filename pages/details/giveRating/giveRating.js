// pages/details/giveRating/giveRating.js
var count = 0;

Page({
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/images/no-star.png',
    selectedSrc: '/images/full-star.png',
    halfSrc: '/images/half-star.png',
    key: 0,//评分
    text: "写下你的影评吧",
    typeId: "saw"
  },
  onLoad: function (options) {
    this.setData({typeId: options.typeId})
  },
  //点击左边,半颗星
  selectLeft: function (e) {
    var key = e.currentTarget.dataset.key
    if (this.data.key == 0.5 && e.currentTarget.dataset.key == 0.5) {
      //只有一颗星的时候,再次点击,变为0颗
      key = 0;
    }
    count = key
    this.setData({
      key: key
    })
  },
  //点击右边,整颗星
  selectRight: function (e) {
    var key = e.currentTarget.dataset.key
    count = key
    this.setData({
      key: key
    })
  },
  startRating: function (e) {
    wx.showToast({
      title: '评分成功',
      success: function (res) {
        setTimeout(function () {
        wx.navigateBack({
          delta: 1
        })
        }, 1500) //延迟时间 这里是1.5秒  
      }
    })
  }
})