import PubSub from 'pubsub-js'
import moment from 'moment'
import require from '../../utils/require'
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    artist:'',
    songPic:'',
    songName:'',
    musicId:'',
    musicLink:'',
    currentTime:'00:00',
    durationTime:'',
    currentWidth:'0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId
    //获取歌曲详情
    this.getSongDetail(musicId)
    this.setData({
      musicId
    })

     this.backgroundAudioManager = wx.getBackgroundAudioManager()
     this.backgroundAudioManager.onPlay(() => {
       this.changePlay(true)
       appInstance.globalData.musicId = this.data.musicId
     })
     this.backgroundAudioManager.onPause(() => {
       this.changePlay(false)
     })
     this.backgroundAudioManager.onStop(() => {
       this.changePlay(false)
     })
      //监听音乐播放的实时进度
     if(appInstance.globalData.musicId == this.data.musicId) {
      this.setData({
        isPlay:true
      })
      this.loadSong()
     } else {
     }
     //音乐播放结束后，自动播放下一首
    this.backgroundAudioManager.onEnded(() => {
          //发送消息数据给recommend页面
    PubSub.publish('switchType','next')

    //订阅来自recommendSong的消息，获取musicId，然后切换歌曲
    PubSub.subscribe('musicId',(msg,musicId)=>{
      this.getSongDetail(musicId)
      this.playMusic(true,musicId)
      PubSub.unsubscribe()
    })
    })
  },
  loadSong() {
    this.backgroundAudioManager.onTimeUpdate(()=>{
      if(this.data.currentTime = this.data.durationTime) {
        this.data.currentTime = this.data.currentTime
      }
      let {currentTime} = this.data
       currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      let currentWidth = (this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration) * 450
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },

  //点击切歌的回调
  handleSwitch(e) {
    let type = e.currentTarget.id
    
    //关闭当前的音乐
    this.backgroundAudioManager.stop()

    //发送消息数据给recommend页面
    PubSub.publish('switchType',type)

    //订阅来自recommendSong的消息，获取musicId，然后切换歌曲
    PubSub.subscribe('musicId',(msg,musicId)=>{
      this.getSongDetail(musicId)
      this.playMusic(true,musicId)
      PubSub.unsubscribe('musicId')
    })

  },

  //修改播放状态
  changePlay(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
    this.loadSong()
  },
  //封装获取详情的函数
  async getSongDetail(id) {
    let songDetail = await require('/song/detail',{ids:id})
    let durationTime = moment(songDetail.songs[0].dt).format('mm:ss')
    this.setData({
      artist:songDetail.songs[0].ar[0].name,
      songPic:songDetail.songs[0].al.picUrl,
      songName:songDetail.songs[0].name,
      durationTime
    })

    //动态修改页面的标题
    wx.setNavigationBarTitle({
      title: this.data.songName
    })
  },

  //播放-暂停的函数
  handleChangePlay() {
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    let {musicId,musicLink} = this.data
    //点击播放音乐
    this.playMusic(isPlay,musicId,musicLink)
  },

  //封装播放音乐函数
  async playMusic(isPlay,musicId,musicLink) {

    if(isPlay) {
      if(!musicLink) {
        let songUrl = await require('/song/url',{id:musicId})
        musicLink = songUrl.data[0].url
        this.setData({
        musicLink,
        musicId
      })
     }
     this.backgroundAudioManager.src = musicLink
     this.backgroundAudioManager.title = this.data.songName
     this.loadSong()
    } else {
      this.backgroundAudioManager.pause()
    }
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