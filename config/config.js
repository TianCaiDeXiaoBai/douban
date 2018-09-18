/*
备注
city: 城市（在程序载入时获取一次）
count: 返回结果数量
baiduAK: 百度地图AK
apiList: api列表
hotKeyword: 搜索页热门关键词关键词
hotTag: 搜索页热门类型
bannerList: 首页（热映页）轮播图列表列表
skinList: “我的”页面背景列表
shakeSound: 摇一摇音效地址（带url表示远程地址）
shakeWelcomeImg: 摇一摇欢迎图片
*/
var url = 'https://static.sesine.com/wechat-weapp-movie'
var doubanUrl = 'https://douban.uieee.com'
module.exports = {
  urlBase: doubanUrl,
  city: '',
  count: 20,
  baiduAK: 'Y1R5guY8Y2GNRdDpLz7SUeM3QgADAXec',
  apiList: {
    inTheaters: doubanUrl+'/v2/movie/in_theaters',
    comingSoon: doubanUrl+'/v2/movie/coming_soon',
    top250: doubanUrl+'/v2/movie/top250',
    search: {
      byKeyword: doubanUrl+'/v2/movie/search?q=',
      byTag: doubanUrl+'/v2/movie/search?tag='
    },
    detail: url+'/v2/movie/subject/',
    personDetail: doubanUrl+'/v2/movie/celebrity/',
    baiduMap: 'https://api.map.baidu.com/geocoder/v2/'
  },
  skinList: [
    { title: '公路', imgUrl: url + '/images/user_bg_1.jpg' },
    { title: '黑夜森林', imgUrl: url + '/images/user_bg_2.jpg' },
    { title: '鱼与水', imgUrl: url + '/images/user_bg_3.jpg' },
    { title: '山之剪影', imgUrl: url + '/images/user_bg_4.jpg' },
    { title: '火山', imgUrl: url + '/images/user_bg_5.jpg' },
    { title: '科技', imgUrl: url + '/images/user_bg_6.jpg' },
    { title: '沙漠', imgUrl: url + '/images/user_bg_7.jpg' },
    { title: '叶子', imgUrl: url + '/images/user_bg_8.jpg' },
    { title: '早餐', imgUrl: url + '/images/user_bg_9.jpg' },
    { title: '英伦骑车', imgUrl: url + '/images/user_bg_10.jpg' },
    { title: '草原', imgUrl: url + '/images/user_bg_11.jpg' },
    { title: '城市', imgUrl: url + '/images/user_bg_12.jpg' }
  ],
  shakeSound: {
    startUrl: url + '/sound/shake.mp3',
    start: '',
    completeUrl: url + '/sound/shakeComplete.wav',
    complete: ''
  },
  shakeWelcomeImg: url + '/images/shake_welcome.png'
}