let startY = 0 //记录初始的纵坐标
let moveY = 0 //记录纵坐标的移动的距离
let endY = 0 //
import require from '../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform : 'translateY(0)',
    coverTransition:'',
    userInfo:{},
    recentPlayRecord:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo) {
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
    }
    //获取播放记录
    this.recentPlay(this.data.userInfo.userId)
  },
  //封装获取播放记录的函数
   async recentPlay(userId) {
    let result = await require('/user/record',{uid:userId,type:0})
    let index = 0
    let recentPlayRecord = result.allData.slice(0,10).map(item =>{
      item.id = index++
      return item
    })
    this.setData({
      recentPlayRecord
    })
  },
   handleTouchStart(e) {
     this.setData({
    coverTransition:''      
     })
    startY = e.touches[0].clientY
  },
   handleTouchMove(e) {
    moveY = e.touches[0].clientY
    endY = moveY - startY
    if(endY < 0) return;
    if(endY > 80) {
      endY = 80
    }
    this.setData({
      coverTransform:`translateY(${endY}rpx)`,
    })
  },
   handleTouchEnd(e) {
     this.setData({
        coverTransform:`translateY(${0})`,
        coverTransition:'all .3s linear'
     })
  },
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
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