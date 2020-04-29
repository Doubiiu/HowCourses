//logs.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    feed: [],
    feed_length: 0,
    userDB: '',


  },
  //事件处理函数
  toInformation: function () {
    wx.navigateTo({
      url: '/pages/information/information'
    })
  },

  onLoad: function () {
    
    var that = this
    this.setData({
      userDB: app.globalData.userDB,
    })
    const db = wx.cloud.database({});
    db.collection('comments').where({
      _openid: app.globalData.openid
    }).get({
      success(res){
        console.log('get My comment!',res.data)
        that.setData({
          feed: res.data,
          feed_length: res.data.length
        })
      },
      fail(err){

      }
    })
    
  },
  onShow() {
    this.onLoad()
  },
})