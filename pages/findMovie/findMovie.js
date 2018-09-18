// findMovie/findMovie.js
var app = getApp();

Page({
  data: {
    categoryTitle: "豆瓣 Top250",
    top250: {},               // 豆瓣Top250
    weekly: {},               // 口碑榜
    newMovie: {},             //  新片榜
    usBox: {}                 // 票房榜
  },
  onLoad: function () {
    var newMovieURL = app.globalData.doubanBase + app.globalData.newMovies;
    this.getMovieListData(newMovieURL, "newMovie", "新片榜单");
    var weeklyURL = app.globalData.doubanBase + app.globalData.weekly;
    this.getMovieListData(weeklyURL, "weekly", "本周口碑榜");
    var top250URL = app.globalData.doubanBase + app.globalData.top250;
    this.getMovieListData(top250URL, "top250", "豆瓣 Top250");
    var usBoxURL = app.globalData.doubanBase + app.globalData.usBox+ "?start=0&&count=4";
    this.getMovieListData(usBoxURL, "usBox", "北美票房榜");
    console.log(this.data);
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
  /** 获取电影列表 */
  getMovieListData: function (url, settedKey, categoryTitle) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    var that = this;
    // 请求电影数据
    wx.request({
      url: url,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "content-type": "json"
      }, // 设置请求的 header
      success: function (res) {
        // 组装电影数据
        var data = res.data;
        console.log(data);
        that.processMovieListData(data, settedKey, categoryTitle);
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.hideToast();
      }
    })
  },
  /** 组装电影数据 */
  processMovieListData: function (data, settedKey, categoryTitle) {
    var movies = [];
    var idx = 0;
    for (let index in data.subjects) {
      if ((settedKey != "newMovie") && (idx > 3)){
        break;
      }
      idx++;
      var subject ={};
      if ((settedKey == "usBox") || (settedKey == "weekly") ){ 
        subject = data.subjects[index].subject;
      }
      else{
        subject = data.subjects[index];        
      }
      
      var temp = {
        idx: idx,
        id: subject.id,
        title: subject.title,
        rating: subject.rating,
        collect_count: subject.collect_count,
        images: subject.images,
        subtype: subject.subtype,
        directors: subject.directors,
        casts: subject.casts,
        year: subject.year,
      };
      movies.push(temp);
    }

    var readyData = {};
    readyData[settedKey] = {
      categoryType: settedKey,
      categoryTitle: categoryTitle,
      movies: movies
    };
    this.setData(readyData);
  },
  /** 滑动Swiper */
  swiperBind: function (e) {
    
    this.setData({ categoryTitle: e.detail.currentItemId})
  },

  /** 搜索电影 */
  bindSearchNavigate: function (event) {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  /** 跳转到榜单列表 */
  bindTopicGrid: function (event) {
    var typeId = event.currentTarget.dataset.typeId;
    var typeTitle = event.currentTarget.dataset.typeTitle;
    console.log("....");
    console.log(event);
    wx.navigateTo({
      url: '/pages/topicMovieList/topicMovieList?typeId=' + typeId + "&&typeTitle=" + typeTitle
    });
  },
  /** 跳转到电影详情 */
  bindMovieDetail: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../details/details?id=' + id
    });
  }
})