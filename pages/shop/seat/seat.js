// pages/shop/seat/seat.js
var theater = require('../../../utils/theater')

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
Page({
  data: {
    shop: {},
    map: [],
    seats:[],
    willChange: false,
    hasSelected: false,
    limt: 0,
    totalPrice: 0
  },
  onLoad: function (options) {
    var shop = JSON.parse(options.shop);
    this.setData({
      shop: shop,
      map: theater.seatdata.seat
    })

  },
  onReady: function () {
    var columnArr = []
    var map = this.data.map
    for (var i = 1; i <= map.length; i++) {
      columnArr.push(i)
    }
    this.setData({
      columnArr: columnArr
    })
  },
  onShow: function () {
  },
  scrollstart: function (ev) {
    this.sX = ev.changedTouches[0].clientX
    this.sY = ev.changedTouches[0].clientY
    this.setData({
      willChange: true
    })
    console.log(ev)
  },
  scrollmove: function (ev) {
    var mX = ev.changedTouches[0].clientX
    var mY = ev.changedTouches[0].clientY
    var deltaX = (mX - this.sX) / 2
    var deltaY = (mY - this.sY) / 2
    this.setData({


      deltaX: deltaX,
      deltaY: deltaY
    })
  },
  scrollend: function (ev) {
    var eX = ev.changedTouches[0].clientX
    var eY = ev.changedTouches[0].clientY
    console.log(ev)
    this.setData({
      willChange: false
    })
  },
  selectSeat: function (ev) {
    var ver = ev.currentTarget.dataset.ver
    var hor = ev.currentTarget.dataset.hor
    var map = this.data.map
    var price = this.data.shop.session.price
    var seats = []
    var cStr = ''
    var limt = this.data.limt
    if (limt < 4) {
      limt++
      map[ver][hor] = 2
      for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map[i].length; j++) {
          if (map[i][j] === 2) {
            cStr = formatNumber(i + 1) + '排' + (j + 1) + '座'
            seats.push(cStr)
          }
        }
      }
      var totalPrice = this.accMul((seats.length), price)
      this.setData({
        limt: limt,
        totalPrice: totalPrice,
        map: map,
        seats: seats
      })
    }
    else {
      wx.showToast({
        title: '最多选4个座位',
        icon: 'success',
        duration: 2000
      })
    }
  },
  cancelSeat: function (ev) {
    var ver = ev.currentTarget.dataset.ver
    var hor = ev.currentTarget.dataset.hor
    var cStr = ''
    var seats = []
    var limt= this.data.limt
    limt--;
    var map = this.data.map
    var price = this.data.shop.session.price
    map[ver][hor] = 1
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        if (map[i][j] === 2) {
          cStr = formatNumber(i + 1) + '排' + (j + 1) + '座'
          seats.push(cStr)
        }
      }
    }
    var totalPrice = this.accMul((seats.length) , price)
    this.setData({
      limt: limt,
      totalPrice: totalPrice,
      map: map,
      seats: seats
    })
  },
  confirmSeat:function()
  {
    var price = this.data.totalPrice
    var content = this.data.shop.movieTitle 
    var seats = this.data.seats
    for (let i in seats){
      content = content +'\r\n'+ seats[i]
    }
    content += "\r\n总计"+price+"元";
    wx.showModal({
      title: '提交订单',
      content: content,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../book/book?totalPrice='+price,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // js中浮点型运算有bug，自定义乘法
  accMul: function (arg1, arg2) {
    var m = 0, s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) { }
    try {
      m += s2.split(".")[1].length
    } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m
    )
  }
})