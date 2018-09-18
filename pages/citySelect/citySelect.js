// citySelect/citySelect.js

var city = require('../../utils/city')
var config = require('../../config/config')
Page({
  data: {
    position: '',
    recent: [],
    li: [],
    scrollId: ''
  },
  onLoad: function (opt) {
  
    this.setData({
      position: config.city,
      li: city
    })
  },
  selcity: function (ev) {
    console.log(ev)
    var tar = ev.target.dataset.set;
    if (tar) {
      config.city = tar;
      wx.navigateBack();
    }
  },

  scrollto: function (ev) {
    var tar = ev.target.dataset.to
    if (tar) {
      this.setData({
        scrollId: tar
      })
    }
  }
})