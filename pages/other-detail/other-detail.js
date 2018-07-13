
const http = require('../../utils/http.js');
const util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    databody: '',
    article: "",
    title: '',
    comments: [],  // 评论
    showLoading: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '全力加载中...',
    })
    var id = options.id;
    // console.log("id:" + id);
    // 请求内容数据
    http.AJAX("news/" + id, function (res) {
      var arr = res.data;
      var body = arr.body;
      // console.log("111:" + unescape(body.replace(/\\u/g, '%u')));
      // 解码  
      // console.log("测试" + body);
      var title = arr.title;
      // console.log("title：" + title);

      //  var bodys = body.match(/<p>.*?<\/p>/g);
      //  var ss = [];
      //  for (var i = 0, len = bodys.length; i < len; i++) {

      //    ss[i] = /<img.*?>/.test(bodys[i]);

      //    if (ss[i]) {
      //      bodys[i] = bodys[i].match(/(http:|https:).*?\.(jpg|jpeg|gif|png)/);
      //    } else {
      //      bodys[i] = bodys[i].replace(/<p>/g, '')
      //        .replace(/<\/p>/g, '')
      //        .replace(/<strong>/g, '')
      //        .replace(/<\/strong>/g, '')
      //        .replace(/<a.*?\/a>/g, '')
      //        .replace(/&nbsp;/g, ' ')
      //        .replace(/&ldquo;/g, '"')
      //        .replace(/&rdquo;/g, '"');
      //    }
      //  }
      wx.hideLoading();
      // 重新写入数据
      that.setData({
        dataList: arr,
        databody: body,
        title: title,
        showLoading: false
      });
  
      //  console.log("body:" + that.data.databody);
      // console.log("titless:"+that.data.dataList.title);
      WxParse.wxParse('article', 'html', that.data.databody, that, 5);
    });

    // 请求评论
    http.AJAX("story/" + id + "/short-comments", function (res) {

      var arr = res.data.comments;
      //  console.log("arr:"+arr[0].author);
      for (var i = 0, len = arr.length; i < len; i++) {
        arr[i]['times'] = util.getTime(arr[i].time);
      }

      // 重新写入数据
      that.setData({
        comments: arr
      });

    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
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