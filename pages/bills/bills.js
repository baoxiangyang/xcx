//获取应用实例
const app = getApp(),
  {postRequest, validator} = require('../../utils/util.js');
Page({
  data: {
    total: 100,
    createBill: false,
    tips: '',
    money: '',
    typeValue: '',
    detail: ''
  }, 
  postRequest,
  validator,
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
    //校验通过发送请求
    this.postRequest('/bill/createBill', data, '发送中');
  },
  onLoad: function (data) {
    this.setData({
      roomId: data.roomId
    });
  }
});

