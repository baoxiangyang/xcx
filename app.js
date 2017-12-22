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
          this.getAuth();
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
        this.getAuth();
      }
    });
  },
  sendData: function() {
    let { userId, code, loginCount } = this.globalData, _this = this;
    loginCount += 1;
    postRequest('/login', {userInfo: this.globalData.userInfo, code, userId}).then(body => {
      if(body.code === 0){
        delete body.code;
        wx.setStorageSync('userId', body.userId);
        _this.globalData.userInfo = Object.assign(_this.globalData.userInfo, body);
      } else{
        if (loginCount < 3){
          _this.login();
        }else{
          wx.showModal({
            title: '失败',
            content: '服务器连接失败，请稍后尝试',
            showCancel: false,
            confirmColor: '#ff0000'
          });
        }
      }
    });
  },
  getAuth: function(callBack){
    wx.getSetting({
      success: res => {
        // 获取用户信息
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getUserInfo();
        }else {
          //发起请求授权
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              this.getUserInfo();
            },
            fail: () => {
              //授权失败，弹出提示
              wx.showModal({
                title: '提示',
                content: '本程序需要获取用户信息，请开启权限',
                confirmText: '去开启',
                success: function (res) {
                  if (res.confirm) {
                    //转跳权限页面，请求用户打开权限
                    wx.openSetting({
                      success: (res) => {
                        this.getUserInfo();
                      }
                    });
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          })
        }
        
      }
    })
  },
  getUserInfo: function(){
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo;
        this.sendData();
      }
    });
  },
  globalData: {
    userInfo: {},
    // 消费类型
    billType: ['日常用品', '腐败聚会', '生活缴费', '其他'],
    loginCount: 0
  }
})