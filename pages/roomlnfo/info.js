const app = getApp(),
  { postRequest, formatTime} = require('../../utils/util.js');
Page({
  data: {
    roomId: '',
    roomInfo: {},
    statementList: [],
    isCreater: false,
    isManage: false
  },
  getRoomInfo: function(postData){
    //获取房间信息
    wx.showNavigationBarLoading();
    postData = postData ? postData : { roomId: this.data.roomId};
    return postRequest('/room/info', postData).then(data => {
      if(data.code === 0 && data.data){
        let info = data.data;
        info.totalMoney = (info.money + info.noMoney).toFixed(2);
        info.noMoney = info.noMoney.toFixed(2);
        info.time = formatTime(info.time, {showYear:true});
        let userInfo = getApp().globalData.userInfo
        this.setData({
          roomInfo: info,
          isCreater: userInfo.userId == info.creater._id
        });
      }else{
        wx.showModal({
          title: '失败',
          content: data.code === 0 ? '房间不存在，请更换房间' : '获取信息失败，请重试',
          confirmColor: '#ff0000'
        });
      }
    }).finally(result => {
      wx.hideNavigationBarLoading();
    });
  },
  getStatementList: function (postData){
    //获取结算订单列表
    postData = postData ? postData : { roomId: this.data.roomId };
    postData.limit = 3;
    postRequest('/statement/list', postData).then((data) => {
      if (data.code === 0) {
        let list = data.data;
        list.forEach(item => {
          item.time = formatTime(item.time, { showYear: true });
        });
        this.setData({
          statementList: list
        })
      }
    });
  },
  setManage: function(){
    //创建者显示提出开关
    this.setData({
      isManage: !this.data.isManage
    })
  },
  deleteUser: function(event){
    //创建者踢出成员
    let {noSettlements} = this.data.roomInfo,
      userid = event.target.dataset.userid;
    if (noSettlements.length){
      wx.showModal({
        title: '提示',
        content: '还有未结算订单，请先结算订单',
        success: res => {
          if (res.confirm){
            wx.redirectTo({
              url: '../bills/bills?roomId=' + this.data.roomId
            });
          }
        }
      });
    }else{
      wx.showModal({
        title: '提示',
        content: '确认踢出该成员？',
        success: res => {
          if (res.confirm) {
            //踢出成员
            postRequest('/room/deleteUser', {userid}, '踢出中').then(data => {
              console.log(data);
            })
          }
        }
      });
    }
  },
  onLoad: function(query){
    this.setData({
      roomId: query.roomId
    });
    this.getRoomInfo(query);
    this.getStatementList(query)
  },
  onPullDownRefresh: function(){
    //下拉刷新
    this.getRoomInfo().finally(() => {
      wx.stopPullDownRefresh();
    });
    this.getStatementList();
  }
});