//app.js
var config = require("config/config.js")
App({
  onLaunch: function () {
    var that = this;
    // 使用设备可视宽高
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.windowWidth = res.windowWidth;
        that.globalData.windowHeight = res.windowHeight;
      }
    });
    // 获取用户信息
    this.getUserInfo()
    //初始化缓存
    this.initStorage()
  },
  getUserInfo: function (cb) {
    var that = this
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(that.globalData.userInfo)
          }
        })
      }
    })
  },
  getCity: function (cb) {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var locationParam = res.latitude + ',' + res.longitude + '1'
        wx.request({
          url: config.apiList.baiduMap,
          data: {
            ak: config.baiduAK,
            location: locationParam,
            output: 'json',
            pois: '1'
          },
          method: 'GET',
          success: function (res) {
            config.city = res.data.result.addressComponent.city.slice(0, -1)
            typeof cb == "function" && cb(res.data.result.addressComponent.city.slice(0, -1))
          },
          fail: function (res) {
            // 重新定位
            that.getCity();
          }
        })
      }
    })
  },
  initStorage: function () {
    wx.getStorageInfo({
      success: function (res) {
        // 判断电影收藏是否存在，没有则创建
        if (!('film_favorite' in res.keys)) {
          wx.setStorage({
            key: 'film_favorite',
            data: []
          })
        }
        // 判断人物收藏是否存在，没有则创建
        if (!('person_favorite' in res.keys)) {
          wx.setStorage({
            key: 'person_favorite',
            data: []
          })
        }
        // 判断电影浏览记录是否存在，没有则创建
        if (!('film_history' in res.keys)) {
          wx.setStorage({
            key: 'film_history',
            data: []
          })
        }
        // 判断人物浏览记录是否存在，没有则创建
        if (!('person_history' in res.keys)) {
          wx.setStorage({
            key: 'person_history',
            data: []
          })
        }
        // 个人信息默认数据
        var personInfo = {
          name: '',
          nickName: '',
          gender: '',
          age: '',
          birthday: '',
          constellation: '',
          company: '',
          school: '',
          tel: '',
          email: '',
          intro: ''
        }
        // 判断个人信息是否存在，没有则创建
        if (!('person_info' in res.keys)) {
          wx.setStorage({
            key: 'person_info',
            data: personInfo
          })
        }
        // 判断相册数据是否存在，没有则创建
        if (!('gallery' in res.keys)) {
          wx.setStorage({
            key: 'gallery',
            data: []
          })
        }
        // 判断背景卡选择数据是否存在，没有则创建
        if (!('skin' in res.keys)) {
          wx.setStorage({
            key: 'skin',
            data: ''
          })
        }
      }
    })
  },
  globalData:{
    userInfo: null,
    windowWidth: 0,
    windowHeight: 0,
    doubanBase: "https://douban.uieee.com",
    inTheaters: "/v2/movie/in_theaters",
    comingSoon: "/v2/movie/coming_soon",
    top250: "/v2/movie/top250",
    weekly: "/v2/movie/weekly",
    usBox: "/v2/movie/us_box",
    newMovies: "/v2/movie/new_movies",
    subject: "/v2/movie/subject/",
    celebrity: "/v2/movie/celebrity/",
    search: "/v2/movie/search?q=",
  }
})