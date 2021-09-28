import require from '../../utils/require'
import debounce from '../../utils/debounce'
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    placeHolderContent:'',
    hotSong:[],
    searchContent:'',//搜索内容
    searchList:[],//模糊返回的搜索列表
    historyList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取初始数据
    this.getInitData()

    //获取热搜歌榜单
    this.getHotSong()

    //给输入框获取数据设置防抖函数
    this.getDetail = debounce(this.getSearchList)

    //获取本地历史记录
    this.getSearchHistory()
  },

  //刷新后，获取本地历史记录的函数
  getSearchHistory() {
    let historyList = wx.getStorageSync('searchHistory');
    if(historyList) {
      this.setData({
        historyList
      })
    }
  },
  
  async getInitData() {
    let placeHolder = await require('/search/default')
    this.setData({
      placeHolderContent:placeHolder.data.realkeyword
    })
  }, 
  async getHotSong() {
    let songData = await require('/search/hot/detail')
    this.setData({
      hotSong:songData.data
    })
  },

  //收集用户输入的数据
  handleInputChange(e) {
    let searchContent = e.detail.value.trim()
    this.setData({
      searchContent
    })
    this.getDetail()
  },

  //获取模糊的返回数据
  async getSearchList() {
    if(!this.data.searchContent) {
      this.setData({
        searchList:[]
      })
      return
    }
    let {searchContent,historyList} = this.data
    let searchList = await require('/search',{keywords:searchContent,limit:10})
    this.setData({
      searchList:searchList.result.songs
    })

     historyList = this.data.historyList
    if(historyList.indexOf(searchContent) != -1) {
      historyList.splice(historyList.indexOf(searchContent),1)
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList
    })

    wx.setStorageSync('searchHistory', historyList);
  },

  //取消搜索
  clearSearchContent() {
    this.setData({
      searchList:[],
      searchContent:''
    })
  },

  //清空历史记录
  deleteHistory() {
    wx.showModal({
      content: '确认清空历史记录吗',
      cancelColor: '#000000',
      confirmColor: '#00000',
      success: (result) => {
        if(result.confirm){
          this.setData({
            historyList:[]
          })
          wx.removeStorageSync('searchHistory');
        }
      },
    });
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