const app = getApp(),
  { postRequest, formatTime } = require('../../utils/util.js');
Page({
  data: {
    statementId: '',
    viewPosition: ''
  },
  getStatementInfo: function(id){
    console.log(id)
  },
  onLoad: function (query) {
    this.setData({
      statementId: query.statementId
    });
    this.getStatementInfo(query.statementId);
  },
  onPullDownRefresh: function () {
    
  }
})