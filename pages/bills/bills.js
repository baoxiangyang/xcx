//获取应用实例
const app = getApp()

Page({
  data: {
    total: 100,
    createBill: false,
    tips: '',
    money: '',
    typeValue: '',
    detail: ''
  },
  billMask() {
    // 显示隐藏表单
    this.setData({
      createBill: !this.data.createBill
    })
  },
  showBillType() {
    // 显示分类选项
    wx.showActionSheet({
      itemList: app.globalData.billType,
      success: (res) => {
        this.setData({
          typeValue: app.globalData.billType[res.tapIndex]
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
    //提交表单
  },
  onLoad: function () {
  }
})
