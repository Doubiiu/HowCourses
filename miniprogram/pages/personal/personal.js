//logs.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    feed: [],
    feed_length: 0,
    person: '',
    focused: false
  },
  //事件处理函数
  focus: function () {
    console.log('focus_button')
    var that = this;


    if (that.data.focused == false) {
      app.globalData.userDB.focusUser.push({
        uavatar: that.data.person.avatar,
        uid: that.data.person._openid,
        uname: that.data.person.nickname,
        ushcool: that.data.person.school,
      })
      const dbf = wx.cloud.database({});
      dbf.collection('users').doc(app.globalData.uid).update({
        data: {
          focusUser: app.globalData.userDB.focusUser
        },
        success(res) {
          console.log('success update personal focus user')
          that.onLoad();
        },
        fail(err) {
          console.log('Fail update user', err)
        }
      })
    }
  },
  onLoad: function () {
    var that = this
    var pid = wx.getStorageSync('personId')
    const dbu = wx.cloud.database({})
    dbu.collection('users').where({
      _openid: pid
    }).get({
      success(res){
        console.log('person success',res.data[0])

        that.setData({
          person: res.data[0]
        })
        that.setData({
          'person.regTime': res.data[0].regTime.toLocaleDateString(),
        })
      },
      fail(err){
        console.log('person fail')
      }
    })

    //获取创作：
    const db = wx.cloud.database({});
    db.collection('comments').where({
      _openid: pid
    }).get({
      success(res) {
        console.log('get personal comment!', res.data)
        that.setData({
          feed: res.data,
          feed_length: res.data.length
        })
      },
      fail(err) {

      }
    })

    //获取我关注的人列表
    var arr = app.globalData.userDB.focusUser;
    console.log('arr:', arr)
    for (var index in arr) {
      if (arr[index].uid == pid) {
        console.log('has focused!')
        that.setData({
          focused: true
        })
      }
    }
   
  },
})