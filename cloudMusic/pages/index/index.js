import require from '../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:{},//轮播图数据
    recommendList:{},//推荐歌曲数据
    topList:[]//排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerListData = await require('/banner',{type:2})
    this.setData({
      bannerList:bannerListData.banners
    })

    let recommendListData = await require('/personalized',{limit:10})
    this.setData({
      recommendList:recommendListData.result
    })

    let index = 0
    let resultArr = []
    while(index < 5) {
      let topListData = await require('/top/list',{idx:index++})
      let topListItem = {name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)}
      resultArr.push(topListItem)
      this.setData({
        topList:resultArr
      })
    }
  },
  recommendNav() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})