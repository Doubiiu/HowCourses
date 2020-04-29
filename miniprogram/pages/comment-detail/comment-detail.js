// pages/comment-detail/comment-detail.js
var util = require('../../utils/util.js')

var app = getApp()
let isFocusing = false
let rawchild = []
let commenttemp = ''
let formId = 0
Page({

  data: {
    userInfo: {},
    comment: [],


    parentID: "0",
    
    toFromId: "",
    commentdate: "",
    focus: false,
    placeholder: "评论...",
    openid: '',
    content: '',
    reply_length: 0,
  },
  
  toPersonal: function (e){
    if(this.data.comment.anonymity == true){
      wx.showToast({
        title: '该用户已匿名',
        icon: 'none',
        image: '../../images/reject.png',
        duration: 1500
      })
      return;
    }
    else if(this.data.comment._openid == app.globalData.openid){
      wx.switchTab({
        url: '/pages/mine/mine',
      })
    }
    else{
      wx.setStorageSync('personId', this.data.comment._openid)
      wx.navigateTo({
        url: '../personal/personal'
      })
    }
  },
  reply: function (e) {
    var self = this;
    var id = e.target.dataset.id+1;
    var name = e.target.dataset.name;
    
    var toFromId = e.target.dataset.formid;
    var commentdate = e.target.dataset.commentdate;
    formId = e.currentTarget.dataset.formid;
    console.log('formId: change in first', e.currentTarget.dataset.formid)
    isFocusing = true;
    
      self.setData({
        parentID: id,
        placeholder: "回复" + name + ":",
        focus: true,
        toFromId: toFromId,
        commentdate: commentdate
      });
    
       // console.log('toFromId', toFromId);
       // console.log('replay', isFocusing);
  },
  onReplyBlur: function (e) {
    var self = this;
    console.log('onReplyBlur', isFocusing);
    
    console.log('formId: change in second', formId)
    if (!isFocusing) {
      {
        const text = e.detail.value.trim();
        if (text === '') {
          self.setData({
            parentID: "0",
            placeholder: "评论...",
            toFromId: "",
            commentdate: ""
          });
        }

      }
    }
    // console.log(isFocusing);
  },
  onReplyFocus: function (e) {
    var self = this;
    isFocusing = false;
    //console.log('onRepleyFocus', isFocusing);
    if (!self.data.focus) {
      self.setData({ focus: true })
    }


  },
  //提交评论
  

  formSubmit: util.throttle(function (e) {
    wx.showLoading({
      title: '发送中...',
    })
    console.log('formSubmit',formId)
    var self = this;
    var comment = e.detail.value.inputComment;
    var parent = self.data.parentID;
    
    
    var commentdate = self.data.commentdate;
    
    if (comment == null || comment.match(/^[ ]*$/)) {
      wx.showToast({
        title: '内容不能为空',
        icon: 'none',
        image: '../../images/reject.png',
        duration: 1500
      })
      return;
    }
    else {
      //上传回复至数据库
      console.log('redeay to upload')
      if (app.globalData.openid) {
        var name = self.data.userInfo.nickName;
        var author_url = self.data.userInfo.avatarUrl;
        
        var openid = app.globalData.openid;
        var fromUser = self.data.userInfo.nickName;
        var data = {
          child: [],
          author_name: name,
          id : parent,
          content: comment,
          author_url: author_url,
          parent: parent,
          openid: openid,
          date: new Date().toLocaleDateString(),
        };
        console.log('before raw')
        if(parent == 0){
          console.log('parent==0')
          rawchild.push(data);
          console.log('after push 0:', rawchild)
        }
        else if (parent == 1) {
          console.log('parent==1')
          console.log('raw:',rawchild)
          rawchild[formId].child.push(data)
          console.log('after push 1:', rawchild)
        }


        wx.cloud.callFunction({
          // 云函数名称
          name: 'updateComment',
          // 传给云函数的参数
          data: {
            id: self.data.comment._id,
            data: rawchild
          },
          success: function (res) {
            console.log(res)
          },
          fail: console.error
        })


        console.log('after upload')
        
        setTimeout(function () {
          const dbc = wx.cloud.database({})
          dbc.collection('comments').doc(self.data.comment._id).get({
            success(res) {
              console.log('After update:', res)
              self.setData({
                comment: res.data
              })
              wx.setStorageSync('commentForReply', self.data.comment)
              self.setData({
                parentID: "0",
                placeholder: "评论...",
                toFromId: "",
                commentdate: "",
                content: '',
              });
              wx.hideLoading();
              self.onLoad();
            },
            fail(err) {

            }
          })
        }, 2000)
        
        //重新获取comment并刷新


      }
    }
  }, 2000),
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


    //get comment
    that.setData({
      comment: wx.getStorageSync('commentForReply'),
      reply_length: wx.getStorageSync('commentForReply').child.length
    })
    //console.log('that.data.anonymity:',that.data.comment.anonymity)
    rawchild = that.data.comment.child
    console.log('This child: ', rawchild)
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
    this.onLoad();
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