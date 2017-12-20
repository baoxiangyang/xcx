const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
let oldCookies = wx.getStorageSync('cookies') || '';
function postRequest(url, data, loding){
    loding && wx.showLoading({
      title: '加载中',
      mask: true
    });
  return new Promise((resolve, reject) => {
    wx.request({
      url: `http://127.0.0.1${url}`,
      method: 'POST',
      data,
      header: {
        Cookie: oldCookies
      },
      success: res => {
        let cookies = res.header['Set-Cookie'] || res.header.Cookie;
        if(cookies) {
          oldCookies = cookies;
          wx.setStorage({ key: 'cookies', data: cookies });
        }
        resolve(res.data);
      },
      fail: err => {
        reject(err);
      },
      complete: () =>{
        loding && wx.hideLoading()
      }
    });
  });
}
module.exports = {
  formatTime,
  postRequest
}
