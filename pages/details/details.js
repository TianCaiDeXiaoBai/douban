// pages / details / details.wxml
var util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    showAllDesc: false,
    isFilmFavorite: false,
    movie: {}
  },
  onLoad: function (options, params) {
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
        var directorsAndCasts = [];
        for (let i in data.directors) {
          directorsAndCasts.push(data.directors[i]);
        }
        for (let j in data.casts) {
          directorsAndCasts.push(data.casts[j]);
        }
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
        var popularComments = [];
        popularComments = data.popular_comments.slice(0)

        readyData["movie"] = {
          id: data.id,
          title: data.title,
          images: data.images,
          director: data.directors,
          casts: data.casts,
          directorsAndCasts: directorsAndCasts,
          collectCount: data.collect_count,
          commentsCount: data.comments_count,
          wishCount: data.wish_count,
          reviewsCount: data.reviews_count,
          countries: countries,
          doCount: data.do_count,
          genres: genres,
          originalTitle: "原名：" + data.original_title,
          rating: data.rating,
          ratingsCount: data.ratings_count + "人",
          subtype: data.subtype,
          summary: data.summary,
          shareUrl: data.share_url,
          year: data.year,
          popularComments: popularComments
        };
        that.setData(readyData);
        // 判断是否收藏
        wx.getStorage({
          key: 'film_favorite',
          success: function (res) {
            console.log("film_favorite : ok")
            console.log(res)
            console.log(data)
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].id == data.id) {
                that.setData({
                  isFilmFavorite: true
                })
              }
            }
          }
        })
        that.setHistory(data);
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
  /** 查看海报 */
  bindPoster: function (event) {
    var posterUrl = event.currentTarget.dataset.posterUrl;
    wx.navigateTo({
      url: '/pages/details/moviePoster/moviePoster?posterUrl=' + posterUrl
    });
  },
  /** 展开简介   */
  handleExtensiontap: function (event) {
    var readyData = {
      "showAllDesc": true
    };
    this.setData(readyData);
  },
  /** 用户点击想看 */
  handleWishtap: function (event) {
    wx.showModal({
      title: '提示',
      content: '一起去看吧',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      },
      showCancel: false
    });
  },
  /** 用户点击看过 */
  handleDotap: function (event) {
    var id = event.currentTarget.dataset.id; //电影id
    var typeId = event.currentTarget.id;       //控件id
    wx.navigateTo({
      url: '/pages/details/giveRating/giveRating?id=' + id + '&&typeId=' + typeId
    });
  },
  /** 查看影人信息 */
  handleCelebrity: function (event) {
    var id = event.currentTarget.dataset.id;
    var avatar = event.currentTarget.dataset.avatar;
    wx.redirectTo({
      url: '/pages/details/celebrity/celebrity?id=' + id + "&&avatar=" + avatar
    });
  },
  // 更多段评论
  moreComments: function () {
    var id = this.data.movie.id;
    wx.navigateTo({
      url: '../comments/comments?id=' + id
    })
  },
  setHistory: function (data) {
    // 存储浏览历史
    var date = util.getDate()
    var time = util.getTime()
    var film_history = []
    wx.getStorage({
      key: 'film_history',
      success: function (res) {
        film_history = res.data
        console.log('----获取缓存----')
        console.log(res.data)
        // 当前的数据
        var now_data = {
          time: time,
          data: data
        }
        // 今天的数据，没有时插入
        var sub_data = {
          date: date,
          films: []
        }
        sub_data.films.push(now_data)
        if (film_history.length == 0) { // 判断是否为空
          film_history.push(sub_data)
        } else if ((film_history[0].date = date)) { //判断第一个是否为今天
          console.log(film_history[0].films.length)
          for (var i = 0; i < film_history[0].films.length; i++) {
            // 如果存在则删除，添加最新的
            if (film_history[0].films[i].data.id == data.id) {
              film_history[0].films.splice(i, 1)
            }
          }
          film_history[0].films.push(now_data)
        } else { // 不为今天(昨天)插入今天的数据
          film_history.push(sub_data)
        }
        wx.setStorage({
          key: 'film_history',
          data: film_history,
          success: function (res) {

          }
        })
        console.log(film_history)
      },
      fail: function (res) {
      }
    })
  },
  favoriteFilm: function () {
    var that = this
    // 判断原来是否收藏，是则删除，否则添加
    wx.getStorage({
      key: 'film_favorite',
      success: function (res) {
        var film_favorite = res.data
        if (that.data.isFilmFavorite) {
          // 删除
          for (var i = 0; i < film_favorite.length; i++) {
            if (film_favorite[i].id == that.data.movie.id) {
              film_favorite.splice(i, 1)
              that.setData({
                isFilmFavorite: false
              })
            }
          }
          wx.setStorage({
            key: 'film_favorite',
            data: film_favorite,
            success: function (res) {
              console.log(res)
              console.log('----设置成功----')
            }
          })
        } else {
          // 添加
          film_favorite.push(that.data.movie)
          wx.setStorage({
            key: 'film_favorite',
            data: film_favorite,
            success: function (res) {
              that.setData({
                isFilmFavorite: true
              })
            }
          })
        }
      }
    })
  }
})