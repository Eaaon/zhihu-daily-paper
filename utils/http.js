var URL = "https://news-at.zhihu.com/api/4/"
module.exports ={
  AJAX: function(data ='',fn,method='get',header={}){
    wx.request({
      url: URL+data,
      method:method? method:'get',
      data:{},
      header:header ? header :{"Content-Type":"application/json"},
      success:function(res){
        fn(res)
      }
    })
  }
}