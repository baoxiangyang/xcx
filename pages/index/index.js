//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    createShow: false,
    addShow: false,
    tips: '',
    addTips: '',
    initValue: '',
    roomList: [{name:'5016'}],
  },
  //显示隐藏 创建房间
  createRoom: function() {
    this.setData({
      createShow: !this.data.createShow
    });
  },
  //显示输入口令遮罩
  addRoom: function(){
    this.setData({
      addShow: !this.data.addShow
    });
  },
  //点击遮罩空白区
  closeMask: function(event){
    if (event.target.id == 'roomMask'){
      this.setData({
        createShow: false
      });
    } else if (event.target.id == 'addMask'){
      this.setData({
        addShow: false
      });
    }
  },
  //创建房间提交
  createSubmit: function(event){
    let data = event.detail.value;
    if (!data.name || !data.password){
      this.setData({
        tips: '名称或口令不能为空'
      });
      return;
    }
    if(data.length > 10){
      this.setData({
        tips: '名称不能超过10个字符'
      });
      return;
    }
    if (data.length > 10) {
      this.setData({
        tips: '口令不能超过10个字符'
      });
      return;
    }
    if (data.length > 10) {
      this.setData({
        tips: '描述不能超过200个字符'
      });
      return;
    }
    this.setData({
      tips: '',
      createShow: false,
      roomList: this.data.roomList.concat([data]),
      initValue: ''
    });
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
