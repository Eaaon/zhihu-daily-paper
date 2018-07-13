const http =require("../../utils/http.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    navTitle:'',
    showLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this;
    wx.showLoading({
      title: '全力加载中...',
    })
    var id = options.id;
    var title =options.title;
    that.setData({
      navTitle:title
    })
    // console.log(id);
    http.AJAX("theme/" + id,function(res){
        that.setData({
          dataList:res.data
        })
        // console.log(that.data.dataList.image)
        wx.hideLoading();
        that.setData({
          showLoading: false
        })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navTitle,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})