import config from './config'
export default (url,data={},method='GET') => {
  return new Promise((resolve,reject) => {
    wx.request({
      url:config.host + url,
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC') !== -1) : ''
      },
      success:(res) =>{
        resolve(res.data)
        if(data.isLogin) {
          wx.setStorageSync('cookies', res.cookies);
        }
      },
      fail:(err) => {
        reject(err)
      }
    })
  })
}