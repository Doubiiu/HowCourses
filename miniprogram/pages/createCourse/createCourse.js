// pages/createCourse/createCourse.js
var util = require('../../utils/util.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    courseInfo:{
      _id: 'fake',
      _openid: 'fake',
      depart: '',
      desc: '',
      faculty: '',
      lang: '',
      school: app.globalData.school,
      tags: '',
      title: '',
      unit: '',
      
    }
  },
  //事件处理
  inputTitle: function(e){
    this.setData({
      'courseInfo.title': e.detail.value
    })
  },
  inputDepart: function (e) {
    this.setData({
      'courseInfo.depart': e.detail.value
    })
  },
  inputFaculty: function (e) {
    this.setData({
      'courseInfo.faculty': e.detail.value
    })
  },
  inputLang: function (e) {
    this.setData({
      'courseInfo.lang': e.detail.value
    })
  },
  inputUnit: function (e) {
    this.setData({
      'courseInfo.unit': e.detail.value
    })
  },
  inputTags: function (e) {
    this.setData({
      'courseInfo.tags': e.detail.value
    })
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      'courseInfo.desc': e.detail.value
    })
  },

  saveUserInfo: util.throttle(function(e){
    if (!this.data.courseInfo['unit'].match(/^[0-9]+.[0-9]+$/)) {
      wx.showToast({
        title: '学分输入有误',
        icon: 'none',
        image: '../../images/reject.png',
        duration: 2000
      })
      return;
    }


    for( var index in this.data.courseInfo){
      console.log(this.data.courseInfo)
      console.log('data:', this.data.courseInfo[index])
      if (this.data.courseInfo[index] == null || this.data.courseInfo[index].match(/^[ ]*$/)){
        wx.showToast({
          title: '项均不能为空',
          icon: 'none',
          image: '../../images/reject.png',
          duration: 2000
          
        })
        return;
      }
    }
    wx.showLoading({
      title: '发布中...',
    })
    var that = this;
    
        const db = wx.cloud.database()
        db.collection('courses').add({
          data:{
            
            depart: that.data.courseInfo.depart,
            desc: that.data.courseInfo.desc,
            faculty: that.data.courseInfo.faculty,
            lang: that.data.courseInfo.lang,
            school: that.data.courseInfo.school,
            tags: that.data.courseInfo.tags,
            title: that.data.courseInfo.title,
            unit: that.data.courseInfo.unit,
            userName: app.globalData.userInfo.nickName,
            avatar: app.globalData.userInfo.avatarUrl,
            focusCount: 0,
            comCount: 0,
          },
          success: function (res){
            wx.hideLoading()
            wx.showToast({
              title: '课程添加成功',
            })
            console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            that.setData({
              'courseInfo._id': res._id,
              'courseInfo._openid': app.globalData.openid
            })
            wx.setStorageSync('courseInfo', that.data.courseInfo);
            wx.navigateTo({
              url: '../course-detail/course-detail'
            })
          },
          fail: function(err){
            wx.showToast({
              icon: 'none',
              title: '课程添加失败'
            })
            console.error('[数据库] [新增记录] 失败：', err)
          }
        })

  },1500),

  onLoad: function (options) {
    console.log(app.globalData.schoolName)
    this.setData({
      'courseInfo.school': app.globalData.schoolName,
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