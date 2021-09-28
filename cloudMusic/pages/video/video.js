import require from '../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    navId:'',
    videoList:[],
    videoId:'',
    videoUpdateTime:[],//记录视频播放的时间位置
    isRefresh:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList()
  },

  //获取导航数据
  async getVideoGroupList() {
    let result = await require('/video/group/list')
    this.setData({
      videoGroupList:result.data.slice(0,14),
      navId:result.data[0].id
    })
    //在获取导航栏数据之后再进行获取视频列表的数据，确保上面的异步任务执行完防止navId为空
    this.getVideoList(this.data.navId)
  },

  //切换导航栏
  changeNav(e) {
    let navId = e.target.id;
    this.setData({
      navId,
      videoList:[]
    })
    //显示消息加载框
    wx.showLoading({
      title: '正在加载'
    })
    this.getVideoList(this.data.navId)
  },

  //获取视频的列表
  async getVideoList(navId) {
    let result = await require('/video/group',{id:navId})
    // 关闭消息提示框
     wx.hideLoading();
    let index = 0
    let videoList = result.datas.map(item => {
      item.id = index++
      return item
    }) 
    //当请求结束后，我们需要关掉下拉刷新的效果
    this.setData({
      videoList,
      isRefresh:false
    })
  },

  //点击播放的回调
  handlePlay(e) {
    let vid = e.currentTarget.id
    // this.vid !== vid && this.videoContext && this.videoContext.stop() 
    // this.vid = vid
    
    // //根据vid创造一个videoContext实例
    this.videoContext = wx.createVideoContext(vid)

    //播放视频之前，看下videoUpdateTime中是否有这个视频，如果有，则继续播放，如果没有，则直接播放
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.find(item => item.vid == vid) 
    if(videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.setData({
      videoId:vid
    })
  },

  //监听视频播放进度的回调
  handleUpdate(e) {
    //根据当前视频进度创造一个时间对象
    let videoTimeObj = {vid:e.currentTarget.id,currentTime:e.detail.currentTime}
    let{videoUpdateTime} = this.data
    //如果原先时间数组存在该对象，我们就直接修改当前的currentTime，如果不存在，就push到这个数组中
    let videoItem = videoUpdateTime.find(item => item.vid == videoTimeObj.vid)
    if(videoItem) {
      videoItem.currentTime = videoTimeObj.currentTime
    } else{
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },

  //当视频播放结束后，移除掉当前视频在videoUpdateTime数组中的位置
  handleEnded(e) {
    let{videoUpdateTime} = this.data
    //根据id拿到当前video的索引值
    let index = videoUpdateTime.findIndex(item => item.vid == e.target.id)
    videoUpdateTime.splice(index,1)
    this.setData({
      videoUpdateTime
    })
  },
  //跳转到搜索页
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  //下拉刷新的回调函数
  handleRefresh(){
    this.getVideoList(this.data.navId)
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
    this.getVideoList(this.data.navId)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ( ) {
  }
})