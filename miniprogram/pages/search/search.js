var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    navTab: ["课程", "用户"],
    currentNavtab: "0",
    courseSearchFeed: [],
    courseSearchFeed_length: 0,
    userSearchFeed: [],
    userSearchFeed_length: 0,
  },
  bindQueTap:function(e){
    var idx = e.currentTarget.dataset.idx;
    console.log("idx:", idx);

    var courseInfo = this.data.courseSearchFeed[idx];

    wx.setStorageSync('courseInfo', courseInfo);
    wx.navigateTo({
      url: '../course-detail/course-detail',
    })
  },
  toPersonal:function(e){
    var idx = e.currentTarget.dataset.idx;
    console.log("idx:", idx);

    var pid = this.data.userSearchFeed[idx]._openid;
    if(pid == app.globalData.openid){
      wx.switchTab({
        url: '/pages/mine/mine',
      })
    }
    else {
      wx.setStorageSync('personId', pid);
      wx.navigateTo({
      url: '../personal/personal',
      })
    }
  },
  onLoad: function () {
    var that = this
    var courseSearch = (wx.getStorageSync('courseSearch') || [])
    var courseSearch_length = (wx.getStorageSync('courseSearchLength') || [])
    var userSearch = (wx.getStorageSync('userSearch') || [])
    var userSearch_length = (wx.getStorageSync('userSearchLength') || [])
    console.log('insearch page',courseSearch)
    this.setData({
      courseSearchFeed: courseSearch,
      courseSearchFeed_length: courseSearch_length,
      userSearchFeed: userSearch,
      userSearchFeed_length: userSearch_length,
    });
  },
  switchTab: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
})