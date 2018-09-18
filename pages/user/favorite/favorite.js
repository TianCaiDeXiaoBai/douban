var filmNullTip = {
      tipText: '亲，找不到电影的收藏',
      actionText: '去逛逛',
      routeUrl: '/pages/findMovie/findMovie'
    }
var personNullTip = {
      tipText: '亲，找不到人物的收藏',
      actionText: '去逛逛',
      routeUrl: '/pages/findMovie/findMovie'
    }
Page({
  data:{
    film_favorite: [],
    person_favorite: [],
    show: 'film_favorite',
    nullTip: filmNullTip
  },
  onLoad:function(options){
    var that = this
    wx.getStorage({
      key: 'film_favorite',
      success: function(res){
        that.setData({
          film_favorite: res.data
        })
      }
    })
    wx.getStorage({
      key: 'person_favorite',
      success: function(res){
        that.setData({
          person_favorite: res.data
        })
      }
    })
    wx.stopPullDownRefresh()
  },
  viewFilmDetail: function(e) {
		var data = e.currentTarget.dataset
		wx.redirectTo({
			url: "/pages/details/details?id=" + data.id
		})
  },
  viewPersonDetail: function(e) {
		var data = e.currentTarget.dataset
		wx.redirectTo({
      url: "/pages/details/celebrity/celebrity?id=" + data.id
		})
  },
  changeViewType: function(e) {
    var data = e.currentTarget.dataset
    this.setData({
      show: data.type,
      nullTip: data.type == 'film_favorite' ? filmNullTip : personNullTip
    })
  }
})