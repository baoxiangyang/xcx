//app.js
const postRequest = require('./utils/util.js').postRequest;
App({
  onLaunch: function () {
    //获取userid
    let userId = wx.getStorageSync('userId');
    this.globalData.userId = userId;

    //判断登录是否有效
    wx.checkSession({
      success: () => {
        if (userId){
          this.userInfo(this.sendData);
        }else{
          this.login();
        }
      },
      fail: () => {
        this.login();
      }
    });
  },
  login: function() {
    // 登录
    wx.login({
      success: res => {
        this.globalData.code = res.code;
        this.userInfo(this.sendData);
      }
    });
  },
  sendData: function() {
    let userId = this.globalData.userId, code = this.globalData.code, _this = this;
    postRequest('/login', {userInfo: this.globalData.userInfo, code, userId}).then(body => {
      if(!body.code){
        delete body.code;
        wx.setStorageSync('userId', body.userId);
        _this.globalData.userInfo = Object.assign(_this.globalData.userInfo, body);
      }
    });
  },
  userInfo: function(callBack){
    wx.getSetting({
      success: res => {
        // 获取用户信息
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              callBack && callBack();
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    // 消费类型
    billType: ['日常用品', '腐败聚会', '生活缴费', '其他']
  }
})