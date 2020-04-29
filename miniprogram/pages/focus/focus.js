//logs.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    navTab: ["关注的人", "关注的课"],
    currentNavtab: "0",

    fperson: [],
    fperson_length: 0,

    fcourse: [],
    fcourse_length: 0
  },
  //事件处理函数

  toPersonal: function (e) {
    var idx = e.currentTarget.dataset.idx;
    console.log("idx:", idx);

    var pid = this.data.fperson[idx].uid;


    wx.setStorageSync('personId', pid);
    wx.navigateTo({
      url: '../personal/personal',
    })

  },
  toCourse: function (e) {
    var idx = e.currentTarget.dataset.idx;
    console.log("idx:", idx);

    var cid = this.data.fcourse[idx].cid;
    const db = wx.cloud.database({})
    db.collection('courses').doc(cid).get({
      success(res) {
        wx.setStorageSync('courseInfo', res.data);
        wx.navigateTo({
          url: '../course-detail/course-detail',
        })
      },
      fail(err) {
        console.log('error no get')
      }
    })


  },
  onLoad: function () {

    var that = this


    //get focus user:
    that.setData({
      fperson: app.globalData.userDB.focusUser,
      fperson_length: app.globalData.userDB.focusUser.length
    })
    //get focus Course:
    that.setData({
      fcourse: app.globalData.userDB.focusCourse,
      fcourse_length: app.globalData.userDB.focusCourse.length
    })


  },
  switchTab: function (e) {
    this.setData({
      currentNavtab: e.currentTarget.dataset.idx
    });
  },
  onShow() {
    this.onLoad()
  },
})