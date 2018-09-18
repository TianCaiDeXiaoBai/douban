// pages/user/recommendation/recommendation.js
var config = require('../../../config/config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    intheaters: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var typeId = 'intheaters';
    that.getMovieListData(typeId);
  },
  /** 获取电影数据 */
  getMovieListData: function (typeId) {
    var that = this;
    var offset = that.data[typeId].offset || 0;
    var total = that.data[typeId].total || 999;
    if (offset >= total) {
      return;
    }
    var url = that.getURLByTypeId(typeId);
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
        start: offset,
        count: 5,
        city: config.city
      },
      header: { 'content-type': 'json' }, // 设置请求的 header
      success: function (res) {
        console.log(res)
        var subjects = res.data.subjects;
        var movies = that.data[typeId].movies || [];
        var offset = that.data[typeId].offset || 0;
        var total = res.data.total;
        offset += subjects.length;
        for (let idx in subjects) {
          var subject = subjects[idx];
          var directors = "";
          for (let i in subject.directors) {
            directors += subject.directors[i].name;
          }
          var casts = "";
          var separate = " / ";
          for (let j in subject.casts) {
            casts += subject.casts[j].name + separate;
          }
          casts = casts.substring(0, casts.length - separate.length);

          var genres = "";
          for (let k in subject.genres) {
            genres += subject.genres[k] + separate;
          }
          genres = genres.substring(0, genres.length - separate.length);
          var temp = {
            id: subject.id,
            title: subject.title,
            rating: subject.rating,
            collectCount: subject.collect_count,
            images: subject.images,
            subtype: subject.subtype,
            directors: directors,
            genres: genres,
            casts: casts,
            typeId: typeId,
            year: subject.year
          };
          movies.push(temp);
        }
        var readyData = {};
        readyData[typeId] = {
          offset: offset,
          total: total,
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
  /** 通过typeId获取url */
  getURLByTypeId: function (typeId) {
    var url = app.globalData.doubanBase;
    if (typeId == "intheaters") {
      url += app.globalData.inTheaters + '&';
    } else {
      url += app.globalData.comingSoon;
    }
    return url;
  },
  /** 跳转到电影详情 */
  bindMovieDetail: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../details/details?id=' + id
    });
  },
  /** 点击购票按钮 */
  handleTickettap: function (event) {
    var id = event.currentTarget.dataset.id;
    var city = config.city;
    wx.navigateTo({
      url: "../../theaterList/theaterList?id=" + id + "&&city=" + city,
    })
  },
  /** 页面滑动到底部 */
  handleLower: function (event) {
    var typeId = "intheaters";
    this.getMovieListData(typeId);
  },
  /** 页面滑动到顶部 */
  handleUpper: function (event) {
    console.log("handleUpper");
  }
})