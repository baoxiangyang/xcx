//index.js
//获取应用实例
const app = getApp(),
  postRequest = require('../../utils/util.js').postRequest;
Page({
  data: {
    createShow: false,
    addShow: false,
    tips: '',
    addTips: '',
    initValue: '',
    roomList: [],
    pageNo: 1,
    findName: ''
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
    if(data.name.length > 10){
      this.setData({
        tips: '名称不能超过10个字符'
      });
      return;
    }
    if (data.password.length > 10) {
      this.setData({
        tips: '口令不能超过10个字符'
      });
      return;
    }
    if (data.describe.length > 200) {
      this.setData({
        tips: '描述不能超过200个字符'
      });
      return;
    }
    let userInfo = app.globalData.userInfo;
    postRequest('/room/createRoom', data, true).then(body => {
      if (body.code === 0){
        userInfo.roomList.push(body._id);
        data._id = body._id;
        this.data.roomList.unshift(data);
        this.setData({
          tips: '',
          createShow: false,
          roomList: this.data.roomList,
          initValue: ''
        });
      }else{
        this.setData({
          tips: body.msg
        });
      }
    });
  },
  getList: function(nextPage){
    let { pageNo, findName, roomList} = this.data;
    if (nextPage){
      pageNo += 1;
    }else{
      pageNo = 1;
    }
    return postRequest('/room/getRoomList', {name: findName, pageNo: pageNo}, true).then(data => {
      if (data.code === 0) {
        this.setData({
          roomList: nextPage ? roomList.concat(data.roomList) : data.roomList,
          pageNo
        });
      }else{
        return Promise.reject(data);
      }
    }).catch(e => {
      wx.showModal({
        title: '失败',
        content: nextPage ? '获取房间失败，请重试' : '获取房间失败，请下拉刷新',
        showCancel: false,
        confirmColor: '#ff0000'
      });
    });
  },
  onLoad: function () {
    this.getList();
  },
  onPullDownRefresh: function(){
    this.getList().then(() => {
      wx.stopPullDownRefresh();
    },() => {
      wx.stopPullDownRefresh();
    });
  }
})
