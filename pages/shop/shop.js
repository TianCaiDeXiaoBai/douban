// pages/shop/shop.js
var event = require('../../utils/event')
var util = require('../../utils/util')
var shop = require('../../utils/shop')
var config = require('../../config/config')
var threedays = util.getWeek(3)
var app = getApp();
Page({
  data: {
    activeindex: 0,
    activemovie: {},
    threedays: threedays,
    theday: 0,
    movies:[],
    sessions: shop.sessions
  },
  onLoad: function (options) {
   
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var id = options.id;
    var nm = options.nm;
    var addr = options.addr;
    var activeindex = 0;
    // 电影详细信息
 
    var url = app.globalData.doubanBase+app.globalData.inTheaters;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    console.log(url)
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      data: {
        start: 0,
        city: config.city
      },
      header: { 'content-type': 'json' }, // 设置请求的 header
      success: function (res) {
        console.log(res)
        var subjects = res.data.subjects;
        var movies = that.data["movies"] || [];
        console.log(id);
       
        for (let idx in subjects) {
          if (subjects[idx].id == id){
            activeindex = idx;
          }
          var subject = subjects[idx];
          var casts = "";
          var separate = ",";
          for (let j in subject.casts) {
            casts += subject.casts[j].name + separate;
          }
          casts = casts.substring(0, casts.length - separate.length);

    
          var temp = {
            id: subject.id,
            title: subject.title,
            rating: subject.rating,
            images: subject.images,
            genres: subject.genres[0],
            duration: subject.durations[0],
            casts: casts
          };
          movies.push(temp);
        }
        var readyData = {};
        var activemovie = movies[activeindex];
        readyData = {
          activeindex: activeindex,
          activemovie: activemovie,
          id: id,
          nm: nm,
          addr: addr,
          movies: movies
        }
        that.setData(readyData);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.hideToast();
      }
    });
  },
  openMap: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 18
        })
      }
    })
  },
  tapselect: function (e) {
    console.log(e.currentTarget.id)
    var that = this
    var activeindex = Number(e.currentTarget.id)
    this.setData({
      imgUrl: that.data.movies[activeindex].images.medium,
      activeindex: activeindex,
      activemovie: that.data.movies[activeindex]
    })
  },
  selectDate: function (e) {
    var theday = e.currentTarget.id
    this.setData({
      theday: theday
    })
  },
  seat:function(e){
    console.log(e);
    var idx = e.currentTarget.id;
    var data = this.data;
    var theday = data.theday;
    var shop = JSON.stringify({
      nm :data.nm,
      addr: data.addr,
      movieTitle: data.activemovie.title,
      session: data.sessions[theday][idx]
      });
    
    wx.navigateTo({
      url: './seat/seat?shop='+shop,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})