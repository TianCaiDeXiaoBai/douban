// pages/shop/book/book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payType: [
      {
        name:"wx",
        checked: true,
        value : "微信支付",
        img:"../../../images/wx.png"
      },
      {
        name: "yl",
        checked: false,
        value: "银联支付",
        img: "../../../images/yl.png"
      }
    ],
    totalPrice: 0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var totalPrice = options.totalPrice
    this.setData({ totalPrice: totalPrice})
  },
  confirmPay:function(){
    wx.showToast({
      title: '支付成功',
      icon: 'success',
      duration: 1500,
      success: function(){
        setTimeout(function () {
          wx.navigateBack({
            delta: 10 //返回首页
          })
        }, 1000) //延迟时间 这里是1秒
      }
    })
  }
})