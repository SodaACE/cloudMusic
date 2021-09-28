import require from '../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //获取登陆的数据
  handerInput(e) {
    let value = e.detail.value
    let type = e.target.id
    this.setData({
      [type]:value
    })
  },

  async login() {
      //对登录的数据进行前端验证
    let{phone,password} = this.data
    //1.手机号不能为空
    if(!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon:'error'
      })
      return;
    }

    //2.手机号必须符合格式
    let phoneReg = /^1[3-9]\d{9}$/
    if(!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon:'error'
      })
      return;
    }

    //3.密码不能为空
    if(!password) {
      wx.showToast({
        title: '密码不能为空',
        icon:'error'
      })
    return;
    }

    //对登录进行后端验证
    let result = await require('/login/cellphone',{phone,password,isLogin:true})
    if(result.code === 200) {
      wx.showToast({
        title:'登录成功'
      })
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      wx.reLaunch({
        url: '/pages/personal/personal'
      })
    } else if(result.code === 502) {
      wx.showToast({
        title:'密码错误',
        icon:'error'
      })
    } else if(result.code === 400) {
      wx.showToast({
        title:'手机号错误',
        icon:'error'
      })
    } else {
      wx.showToast({
        title:'登录错误，请重新登录',
        icon:'error'
      })
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