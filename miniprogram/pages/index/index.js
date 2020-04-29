//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Explore',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userNo : 0,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  go: function() {
    var that = this;
    wx.cloud.callFunction({
      name: 'getUserID',
      data:{

      },
      success: function (res){
        console.log('go: ',res.result.openid);
        app.globalData.openid = res.result.openid

        //获取用户记录
        const dbuser = wx.cloud.database({});
        const tableUser = dbuser.collection('users');
        tableUser.where({
          _openid: app.globalData.openid,
        }).get({
          success: function (res) {
            
            
            if (res.data[0] == null) {
              console.log('NULL!')
              const db = wx.cloud.database();
              db.collection('users').add({
                data: {
                  avatar: app.globalData.userInfo.avatarUrl,
                  nickname: app.globalData.userInfo.nickName,
                  focusCourse: [],
                  focusUser: [],
                  regTime: new Date(),
                },
                success: function (res) {
                  console.log('[数据库] [新增记录] 成功，记录 _id: ')
                  app.globalData.uid = res._id;
                  app.globalData.userDB = {
                    avatar: app.globalData.userInfo.avatarUrl,
                    nickname: app.globalData.userInfo.nickName,
                    focusCourse: [],
                    focusUser: [],
                    regTime: new Date().toLocaleDateString(),
                  }
                },
                fail: function (err) {
                  console.error('[数据库] [新增记录] 失败：', err)
                }
              })
              
            } else {
              //可以存储获取过来的用户信息
              
              app.globalData.userDB = res.data[0]
              app.globalData.uid = res.data[0]._id;
              app.globalData.userDB.regTime = app.globalData.userDB.regTime.toLocaleDateString();
              
              
              
              
            }
          },
          fail: function (err) {
            console.error(err)
          }

        });

      },
      fail: console.error
    })

    wx.switchTab({
      url: '/pages/course/course',
    })
  },
  onLoad: function () {
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
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
