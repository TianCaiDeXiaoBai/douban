// pages/movie/movie-detail/celebrity/celebrity.js
var util = require('../../../utils/util.js')
var app = getApp();
Page({
  showAllDesc: false,
  data: {
    avatar: ""
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var id = options.id;
    var avatar = options.avatar;
    var isPersonFavorite = this.data.isPersonFavorite;
    var url = app.globalData.doubanBase + app.globalData.celebrity + id;
    var that = this;

    that.setData({ "avatar": avatar });
    that.getCelebrityData(url);

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  /** 展开简介   */
  handleExtensiontap: function (event) {
    var readyData = {
      "showAllDesc": true
    };
    this.setData(readyData);
  },
  /** 获取影人信息 */
  getCelebrityData: function (url) {
    var that = this;
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
        console.log(data);
        that.processCelebrityData(data);
        // 判断是否收藏
        wx.getStorage({
          key: 'person_favorite',
          success: function (res) {
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].id == data.id) {
                that.setData({ "isPersonFavorite": true });
              }
            }
          }
        })
        that.setHistory(data);
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
  /** 组装影人数据 */
  processCelebrityData: function (data) {
    var movies = [];
    for (let idx in data.works) {
      var subject = data.works[idx].subject;
      movies.push(subject);
    }
    var separate = " ";
    var professions = "";
    for (let i in subject.professions) {
      directors += subject.directors[i].name + separate;
    }
    professions = professions.substring(0, professions.length - separate.length);
    var temp = {
      id: data.id,
      avatars: data.avatars,
      bornPlace: data.born_place,
      birthday: data.birthday,
      professions: professions,
      gender: data.gender,
      name: data.name,
      name_en: data.name_en,
      summary: data.summary,
      movie: movies
    };
    var readyData = {};
    readyData["celebrity"] = temp;
    this.setData(readyData);
  },
  /** 跳转电影详情页 */
  bindMovieDetail: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.redirectTo({
      url: '/pages/details/details?id=' + id
    });
  },
  /** 查看海报 */
  bindPoster: function (event) {
    var posterUrl = event.currentTarget.dataset.posterUrl;
    wx.navigateTo({
      url: '/pages/details/moviePoster/moviePoster?posterUrl=' + posterUrl
    });
  },
  /*设置浏览历史*/
  setHistory: function(data){
    // 存储浏览历史
    var date = util.getDate()
    var time = util.getTime()
    var person_history = []
    wx.getStorage({
      key: 'person_history',
      success: function (res) {
        person_history = res.data
        // 当前的数据
        var now_data = {
          time: time,
          data: data
        }
        // 今天的数据，没有时插入
        var sub_data = {
          date: date,
          persons: []
        }
        sub_data.persons.push(now_data)
        if (person_history.length == 0) { // 判断是否为空
          person_history.push(sub_data)
        } else if ((person_history[0].date = date)) { //判断第一个是否为今天

          for (var i = 0; i < person_history[0].persons.length; i++) {
            // 如果存在则删除，添加最新的
            if (person_history[0].persons[i].data.id == data.id) {
              person_history[0].persons.splice(i, 1)
            }
          }
          person_history[0].persons.push(now_data)
        } else { // 不为今天(昨天)插入今天的数据
          person_history.push(sub_data)
        }
        wx.setStorage({
          key: 'person_history',
          data: person_history,
          success: function (res) {

          }
        })
        console.log(person_history)
      },
      fail: function (res) {
  
      }
    })
  },
  favoritePerson: function () {
    var that = this
    // 判断原来是否收藏，是则删除，否则添加
    wx.getStorage({
      key: 'person_favorite',
      success: function (res) {
        var person_favorite = res.data
        if (that.data.isPersonFavorite) {
          // 删除
          for (var i = 0; i < person_favorite.length; i++) {
            if (person_favorite[i].id == that.data.celebrity.id) {
              person_favorite.splice(i, 1)
              that.setData({
                isPersonFavorite: false
              })
            }
          }
          wx.setStorage({
            key: 'person_favorite',
            data: person_favorite,
            success: function (res) {
            }
          })
        } else {
          // 添加
          person_favorite.push(that.data.celebrity)
          wx.setStorage({
            key: 'person_favorite',
            data: person_favorite,
            success: function (res) {
              that.setData({
                isPersonFavorite: true
              })
            }
          })
        }
      }
    })
  } 
})