//获取应用实例
const app = getApp(),
  { postRequest, validator, formatTime} = require('../../utils/util.js');
Page({
  data: {
    total: 100,
    billList: [],
    createBill: false,
    tips: '',
    money: '',
    typeValue: '',
    detail: '',
    hasMore: true,
    pageNo: 1,
    loading: false,
    viewPosition: ''
  }, 
  postRequest,
  validator,
  formatTime,
  billType: app.globalData.billType,
  billMask() {
    // 显示隐藏表单
    this.setData({
      createBill: !this.data.createBill
    })
  },
  showBillType() {
    // 显示分类选项
    wx.showActionSheet({
      itemList: this.billType,
      success: (res) => {
        this.setData({
          typeValue: this.billType[res.tapIndex],
          typeId: res.tapIndex
        });
      }
    });
  },
  closeMask: function (event) {
    // 关闭表单
    if (event.target.id == 'addBillMask') {
      this.setData({
        createBill: false
      });
    }
  },
  addSubmit: function(event) {
    //参数校验
    let data = event.detail.value,
      isvalidator = this.validator(data, {
      money: [{ required: true, message: '请输入正确的金额' }, { money: true, message: '请输入正确的金额'}],
      type: { required: true, message: '请选择类型'},
      detail: [{ required: true, message: '请输入详细' }, { maxLength: 200, message:'详细内容不能大于200个字符'}]
    });
    if (isvalidator){
      this.setData({
        tips: isvalidator[0].message
      });
      return;
    }
    data.room = this.data.roomId;
    data.type = this.data.typeId;
    let { money, detail, type} = data;
    //校验通过发送请求
    this.postRequest('/bill/createBill', data, '发送中').then(result => {
      let { avatarUrl, nickName } = getApp().globalData.userInfo;
      //创建订单成功
      let createData = {
        _id: result._id,
        time: this.formatTime(Date.now()),
        money,
        detail,
        type,
        creater: {avatarUrl, nickName}
      };
      this.setData({
        billList: this.data.billList.concat(createData),
        tips: '',
        money: '',
        detail: '',
        typeValue: '',
        viewPosition: 'id_' + result._id,
        createBill: false
      });
    });
  },
  getBills(roomid) {
    //获取未结算订单信息
    let { pageNo, roomId = roomid, billList, loading, hasMore} = this.data;
    if (loading || !hasMore){
      return false;
    }
    this.setData({
      loading: true
    });
    wx.showNavigationBarLoading()
    return this.postRequest('/room/findNoSettlements', {pageNo, roomId}).then(data => {
      if(data.code === 0){
        let bills = data.billList;
        bills.forEach(function(item){
          item.time = formatTime(item.time);
        });
        //将获取到的数组 添加到已有数组的前面
        Array.prototype.unshift.apply(billList, bills);
        this.setData({
          billList,
          total: data.total,
          viewPosition: 'id_' + bills[bills.length -1]._id,
          pageNo: pageNo + 1,
          hasMore: bills.length == 10 ? true : false
        })
      }
      return data.name
    }).finally(() => {
      this.setData({
        loading: false
      });
      wx.hideNavigationBarLoading()
    })
  },
  onLoad: function (data) {
    this.setData({
      roomId: data.roomId
    });
    this.getBills(data.roomId).then((title => {
      wx.setNavigationBarTitle({
        title
      });
    }))
  }
});

