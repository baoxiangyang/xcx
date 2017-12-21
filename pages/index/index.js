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
    hasMore: true,
    pageNo: 1,
    findName: ''
  },
  //显示隐藏 创建房间
  createRoom: function() {
    this.setData({
      createShow: !this.data.createShow
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
        addShow: false,
        activeRoomId: '',
        addTips: ''
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
    if(data.name.length < 2){
      this.setData({
        tips: '名称不能少于2个字符'
      });
      return;
    }
    if (data.password.length < 3) {
      this.setData({
        tips: '口令不能少于3个字符'
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
  //点击房间列表
  addRoom: function (event) {
    let roomList = getApp().globalData.userInfo.roomList;
    if (roomList.indexOf(event.target.dataset.roomid) == -1){
      wx.redirectTo({
        url: '/pages/bills/bills?roomId=' + event.target.dataset.roomid
      });
    }else{
      this.setData({
        addShow: !this.data.addShow,
        activeRoomId: event.target.dataset.roomid
      });
    }
  },
  addSubmit: function(event){
    //加入房间
    let password = event.detail.value.password,
      activeRoomId = this.data.activeRoomId;
    if (!password || password.length <3){
      this.setData({
        addTips:'请输入正确的口令'
      });
      return;
    }
    postRequest('/room/joinRoom', { roomid: activeRoomId, password}, true).then(data => {
      if(data.code === 0){
        wx.redirectTo({
          url: '/pages/bills/bills?roomId=' + activeRoomId
        });
      }else{
        this.setData({
          addTips: data.msg
        });
      }
    });
  },
  getList: function(nextPage, searchName){
    let { pageNo, findName, roomList, hasMore} = this.data;
    if (nextPage){
      pageNo += 1;
      //加载到最后一页后停止加载
      if (!hasMore){
        return false;
      }
    }else{
      pageNo = 1;
    }
    if (searchName){
      findName = searchName;
    }
    return postRequest('/room/getRoomList', {name: findName, pageNo: pageNo}, true).then(data => {
      if (data.code === 0) {
        this.setData({
          roomList: nextPage ? roomList.concat(data.roomList) : data.roomList,
          pageNo,
          hasMore: data.roomList.length < 10 ? false: true
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
  searchRoom: function (event){
    this.setData({
      findName: event.detail.value
    });
    this.getList(undefined, event.detail.value);
  },
  onLoad: function () {
    this.getList();
  },
  onPullDownRefresh: function(){
    //下拉刷新
    this.getList().then(() => {
      wx.stopPullDownRefresh();
    },() => {
      wx.stopPullDownRefresh();
    });
  },
  onReachBottom: function(){
    this.getList(true);
  }
});
