// pages/addComment/addComment.js
var util = require('../../utils/util.js')

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseName: '',
    isChecked: false,
    text: '',
    courseId: '',
    couContent: '',
  },
  //执行函数
  //textarea
  bindTextAreaBlur: function(e){
    this.setData({
      text: e.detail.value
    })
  },

  //switch
  changeSwitch: function(e){
    console.log(e.detail.value)
    this.setData({
      isChecked: e.detail.value
    })
  },
  saveUserInfo: util.throttle(function (e) {
    wx.showLoading({
      title: '发布中...',
    })
    var that = this;
    const db = wx.cloud.database({});
    db.collection('comments').add({
      data: {
        anonymity: that.data.isChecked,
        content: that.data.text,
        courseId: that.data.courseId,
        time: new Date().toLocaleDateString(),
        cavatar: app.globalData.userDB.avatar,
        cname: app.globalData.userDB.nickname,
        liked: 0,
        score: 0,
        couName: that.data.courseName,
        couContent: that.data.couContent,
        child: [],
        cNum: 0,
      },
      success(res){
        wx.cloud.callFunction({
          name: 'updateCourse',
          data:{
            id: that.data.courseId
          },
          success(res){

          },
          fail(err){

          }
        })
        wx.hideLoading();
        console.log('add comment success!')
        wx.navigateBack({

        })
      },
      fail(err){
        wx.hideLoading();
      }
    })

  }, 1500),

  onLoad: function (options) {
    var courseForCreateComment = (wx.getStorageSync('courseForCreateComment') || []);
    console.log('in Add comment: course_id:', courseForCreateComment._id)
    this.setData({
      courseName: courseForCreateComment.title,
      courseId: courseForCreateComment._id,
      couContent: courseForCreateComment.desc,

    })
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