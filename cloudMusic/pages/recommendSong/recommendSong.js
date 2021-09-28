import PubSub from 'pubsub-js'
import require from '../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendSong:[],
    index:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth()  + 1
    })
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: ()=>{
          wx.reLaunch({
            url: '/pages/login/login.wxml',
          });          
        },
      });
    }
    //获取每日推荐的歌曲
    this.getRecommendSong()

    //订阅来自songDetail的信息
    PubSub.subscribe('switchType',(msg,type) => {
      let index = this.data.index
      if(type == "pre") {
        (index == 0) && (index = this.data.recommendSong.length)
        index--
      } else {
        (index == this.data.recommendSong.length - 1) && (index = -1)
        index++
      }

      this.setData({
        index
      })
    
    let musicId = this.data.recommendSong[index].id
    //将获取到的musicId传给songDetail
    PubSub.publish('musicId',musicId)
    })
  },

  async getRecommendSong() {
    let recommendSong = await require('/recommend/songs')
    this.setData({
      recommendSong:recommendSong.recommend
    })
  },
  toSongDetail(e) {
    let songId = e.currentTarget.id
    let index = e.currentTarget.dataset.index
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + songId,
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