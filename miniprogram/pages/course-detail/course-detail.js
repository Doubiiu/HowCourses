// pages/course-detail/course-detail.js
var util = require('../../utils/util.js')

var app = getApp()
Page({

  /**
   * 页面的初始数据
   * //学校，开设院系，描述，语言，学分
   */
  data: {
    userInfo: {},
    course: [],
    course_tag: [],
    commentFeed: [],
    commentFeed_length: 0,
    focused: false
  },
  focus: function(e){
    console.log('focus_button_course')
    var that = this;


    if (that.data.focused == false) {
      app.globalData.userDB.focusCourse.push({
        cid: that.data.course._id,
        cname: that.data.course.title,
      })
      const dbf = wx.cloud.database({});
      dbf.collection('users').doc(app.globalData.uid).update({
        data: {
          focusCourse: app.globalData.userDB.focusCourse
        },
        success(res) {
          console.log('success update personal focus course')
          wx.cloud.callFunction({
            name: 'updateCfnum',
            data: {
              id: that.data.course._id
            },
            success(res) {

            },
            fail(err) {

            }
          })
          that.onLoad();
        },
        fail(err) {
          console.log('Fail update user', err)
        }
      })
    }

  },
  bindItemTap: function (e) {
    var idx = e.currentTarget.dataset.idx;
    console.log("comment detail idx:", idx);

    var commentInfo = this.data.commentFeed[idx];
    wx.setStorageSync('commentForReply', commentInfo)


    wx.navigateTo({
      url: '../comment-detail/comment-detail'
    })
  },
  writeComment: function (e) {
    wx.setStorageSync('courseForCreateComment', this.data.course);

    wx.navigateTo({
      url: '../addComment/addComment',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    
    var courseInfo = (wx.getStorageSync('courseInfo') || [])
    
    that.setData({
      course: courseInfo,
      course_tag: courseInfo.tags.split(","),
    })

    
    console.log('get Comment from course: ', that.data.course._id)
    //get comment from DB
    const db = wx.cloud.database({});
    db.collection('comments').where({
      courseId: that.data.course._id
    }).get({
      success(res){
        console.log('get Comment success')
        that.setData({
          commentFeed: res.data,
          commentFeed_length: res.data.length,
        })
        //日期格式
        // for (var index in that.data.commentFeed){
        //   that.setData({
        //     'commentFeed[index].time': res.data[index].time.toLocaleDateString()
        //   })
        //   console.log('Time: ', that.data.commentFeed[index].time)
        // }

      },
      fail(err){
        console.log('get Comment failed')
      }
    })

    //获取我关注的课列表
    var arr = app.globalData.userDB.focusCourse;
    console.log('arrcourse:', arr)
    for (var index in arr) {
      if (arr[index].cid == that.data.course._id) {
        console.log('has focused!')
        that.setData({
          focused: true
        })
      }
    }



  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        
      })
    })
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

  },
  onShow() {
    this.onLoad()
  },
})