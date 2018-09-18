// pages/theaterList/theaterList.js
var util = require('../../utils/util.js');
var theater = require('../../utils/theater.js');
var weekday = util.getWeek(12);
var app = getApp();
Page({
  data: {
    activeIndex: 0,
    weekday: weekday,
    currentCity: '',
    theater: {}
  },
  onLoad: function (options) {
    var id = options.id;
    var city = options.city;
  
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var id = options.id;
    // 电影详细信息
    var url = app.globalData.doubanBase + app.globalData.subject + id;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'json' }, // 设置请求的 header
      success: function (res) {
        var data = res.data;
        console.log(data)
        var readyData = {};
        var genres = "";
        var separate = " / ";
        for (let k in data.genres) {
          genres += data.genres[k] + separate;
        }
        genres = genres.substring(0, genres.length - separate.length);
        var countries = "国家：";
        for (let g in data.countries) {
          countries += data.countries[g] + separate;
        }
        countries = countries.substring(0, countries.length - separate.length);
        readyData["movie"] = {
          id: data.id,
          title: data.title,
          images: data.images,
          commentsCount: data.comments_count,
          countries: countries,
          genres: genres,                           //艺术类型
          rating: data.rating.average,     
          date: data.pubdates[0],
        };
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
    // 电影院
    var url = 'http://m.maoyan.com/cinemas.json';
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'json' }, // 设置请求的 header
      success: function (res) {
        var data = res.data.data;
        //猫眼api突然关闭不能用，下面数据为模拟数据
        data = theater.theater;
    
        var readyData = {}
 
        for (var i in data)
        {
          readyData[i] = new Array(i);
          for (var j in data[i]){
            readyData[i][j] = {
              nm: data[i][j].nm,
              price: (j%2)*10+29.9,
              addr: data[i][j].addr,
              tips: { blue: ['座', '退', '改签'], orang: ['小吃', '折扣卡'] },
              times:'10:25|11:20|12:05',
              ka: "开卡购票首单更优惠",
              hui: "3部影片特惠"
           }
          }
        }
        that.setData({ theater: readyData});
      },
      fail: function () {
        console.log("fail");
      },
      complete: function () {
        console.log("complete");
        wx.hideToast();
      }
    })
  },
  selDate: function (ev) {
    var theater = this.data.theater
    this.setData({
      activeIndex: ev.target.id,
      theater: theater
    })
  }
})