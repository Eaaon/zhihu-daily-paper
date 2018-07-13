//index.js
//获取应用实例
const app = getApp()
const MENU_WIDTH_SCALE = 0.7027;
const FAST_SPEED_SECOND = 300;
const FAST_SPEED_DISTANCE = 5;
const FAST_SPEED_EFF_Y = 50;
const util = require('../../utils/util.js')
const http = require('../../utils/http.js')

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    showLoading: true,
    //设置侧划
    ui: {
      windowWidth: 0,
      menuWidth: 0,
      offsetLeft: 0,
      tStart: true
    },
    top_stories: [],
    datalist: [],
    themesData: [],              //侧滑栏的数据
    dataListDateCurrent: 0,      // 当前日期current
    dataListDateCount: 0,      // 请求次数
    hothidden: true,            // 显示加载更多 loading
    /**
      * 滑动面板参数配置
      */
    indicatorDots: true, // 是否显示面板指示点
    autoplay: true,      // 是否自动切换
    interval: 5000,      // 自动切换时间间隔
    duration: 1000       // 滑动动画时长
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    wx.showLoading({
      title: '全力加载中...',
    })
    //请求今天的数据
    http.AJAX("news/latest",function(res){
      var listData =res.data;
      var format = util.getFormatDate(listData.date);
      listData["dateDay"] = format.dateDay;
      var list =that.data.datalist;
      // console.log("aas:"+listData);
      that.setData({
        top_stories: listData.top_stories,     //banner数据
        datalist: list.concat(listData),       //最新的日期数据
        dataListDateCurrent: listData.date,    // 当前日期
        dataListDateCount: 1,
        showLoading: false
      })
      wx.hideLoading(); //隐藏加载
      // console.log("list" + listData.date);
    });
    //请求主题日报数据
    http.AJAX("themes",function(res){
      var themesData = res.data.others;
      that.setData({
        themesData:themesData
      })
    });

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
    try {
      let res = wx.getSystemInfoSync()
      this.windowWidth = res.windowWidth;
      this.data.ui.menuWidth = this.windowWidth * MENU_WIDTH_SCALE;
      this.data.ui.offsetLeft = 0;
      this.data.ui.windowWidth = res.windowWidth;
      this.setData({ ui: this.data.ui })
    } catch (e) {
    }
  },
 
  //请求历史数据,事件处理,自动加载
  scrolltolower: function (e) {
    var that = this;
    // 加载更多 loading
    that.setData({
      hothidden: true
    })
    var currentDate = this.data.dataListDateCurrent;
    // console.log("currentDate"+currentDate);
    //如果加载数据超过10条
    if (this.data.dataListDateCount >= 10) {
      // 加载更多 loading
      that.setData({
        hothidden: false
      });
    } else {
      // 发送请求数据
      http.AJAX("news/before/" + currentDate, function (res) {
        var arr = res.data;
        var format = util.getFormatDate(arr.date);
        arr["dateDay"] = format.dateDay;
        var list = that.data.datalist;// 获取当前数据进行保存
        // 然后重新写入数据
        that.setData({
          datalist: list.concat(arr),                              // 存储数据
          dataListDateCurrent: arr.date,
          dataListDateCount: that.data.dataListDateCount + 1,      // 统计加载次数
        });
      });
    }
  },
  onReady: function () {

  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    var that = this
    that.setData({
      showLoading: true,
    })
    this.onLoad()
  },

  //侧滑事件
  handlerStart(e) {
    let { clientX, clientY } = e.touches[0];
    this.tapStartX = clientX;
    this.tapStartY = clientY;
    this.tapStartTime = e.timeStamp;
    this.startX = clientX;
    this.data.ui.tStart = true;
    this.setData({ ui: this.data.ui })
  }, handlerMove(e) {
    let { clientX } = e.touches[0];
    let { ui } = this.data;
    let offsetX = this.startX - clientX;
    this.startX = clientX;
    ui.offsetLeft -= offsetX;
    if (ui.offsetLeft <= 0) {
      ui.offsetLeft = 0;
    } else if (ui.offsetLeft >= ui.menuWidth) {
      ui.offsetLeft = ui.menuWidth;
    }
    this.setData({ ui: ui })
  },
  handlerCancel(e) {
    // console.log(e);
  },
  handlerEnd(e) {
    this.data.ui.tStart = false;
    this.setData({ ui: this.data.ui })
    let { ui } = this.data;
    let { clientX, clientY } = e.changedTouches[0];
    let endTime = e.timeStamp;
    //快速滑动
    if (endTime - this.tapStartTime <= FAST_SPEED_SECOND) {
      //向左
      if (this.tapStartX - clientX > FAST_SPEED_DISTANCE) {
        ui.offsetLeft = 0;
      } else if (this.tapStartX - clientX < -FAST_SPEED_DISTANCE && Math.abs(this.tapStartY - clientY) < FAST_SPEED_EFF_Y) {
        ui.offsetLeft = ui.menuWidth;
      } else {
        if (ui.offsetLeft >= ui.menuWidth / 2) {
          ui.offsetLeft = ui.menuWidth;
        } else {
          ui.offsetLeft = 0;
        }
      }
    } else {
      if (ui.offsetLeft >= ui.menuWidth / 2) {
        ui.offsetLeft = ui.menuWidth;
      } else {
        ui.offsetLeft = 0;
      }
    }
    this.setData({ ui: ui })
  },
  handlerPageTap(e) {
    let { ui } = this.data;
    if (ui.offsetLeft != 0) {
      ui.offsetLeft = 0;
      this.setData({ ui: ui })
    }
  },
  handlerAvatarTap(e) {
    let { ui } = this.data;
    if (ui.offsetLeft == 0) {
      ui.offsetLeft = ui.menuWidth;
      this.setData({ ui: ui })
    }
  },


  //点击菜单栏
  clickMenu(){

  },
  getUserInfo: function(e) {
    // console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //swiper
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

})
