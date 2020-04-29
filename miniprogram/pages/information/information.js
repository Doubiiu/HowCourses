//logs.js
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    userDB: {

    },
    genderArray: ['男', '女'],
    genderIndex: 0,
    multiArray: [],
    multiIndex: [0, 0],
    currentSchool: "香港中文大学",
  },
  bindGenderChange: function (e) {
    this.setData({
      genderIndex: e.detail.value,
      'userDB.gender': this.data.genderArray[this.data.genderIndex]
    });
  },
  bindMultiPickerChange(e) {
    this.setData({
      multiIndex: e.detail.value,
      'userDB.school': this.data.multiArray[1][this.data.multiIndex[1]].name
    });
  },
  bindMultiPickerColumnChange(e) {
    var that = this;
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,

    };
    data.multiIndex[e.detail.column] = e.detail.value
    if (e.detail.column == 0) {
      data.multiIndex = [e.detail.value, 0];
    } else if (e.detail.column == 2) {
      data.multiIndex = [data.multiIndex[0], e.detail.value];
    }
    var temp = this.data.provinces;
    data.multiArray[0] = temp;
    if ((temp[data.multiIndex[0]].school).length > 0) {

      data.multiArray[1] = temp[data.multiIndex[0]].school;
    } else {

      data.multiArray[1] = [];
    }
    this.setData(data);
    this.setData({
      currentSchool: data.multiArray[1][data.multiIndex[1]].name
    });
    app.globalData.schoolName = this.data.currentSchool;
  },
  //事件处理函数
  inputNname: function (e) {
    this.setData({
      'userDB.nickname': e.detail.value
    })
  },
  inputAge: function (e) {
    this.setData({
      'userDB.age': e.detail.value
    })
  },
  inputEmail: function (e) {
    this.setData({
      'userDB.email': e.detail.value
    })
  },
  inputMajor: function (e) {
    this.setData({
      'userDB.major': e.detail.value
    })
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      'userDB.desc': e.detail.value
    })
  },
  saveUserInfo: util.throttle(function (e) {
    if (!this.data.userDB.age.match(/^[0-9]+$/)) {
      wx.showToast({
        title: '年龄输入有误',
        icon: 'none',
        image: '../../images/reject.png',
        duration: 2000
      })
      return;
    };
    if (!this.data.userDB.email.match(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/)) {
      wx.showToast({
        title: '邮箱输入有误',
        icon: 'none',
        image: '../../images/reject.png',
        duration: 2000

      })
      return;
    }

    console.log('save!')
    wx.showLoading({
      title: '保存中...',
    })
    var that = this
    const db = wx.cloud.database({});
    db.collection('users').doc(app.globalData.uid).update({
      data: {
        nickname: that.data.userDB.nickname,
        age: that.data.userDB.age,
        email: that.data.userDB.email,
        gender: that.data.userDB.gender,
        school: that.data.userDB.school,
        major: that.data.userDB.major,
        desc: that.data.userDB.desc,
      },
      success(res) {
        wx.hideLoading();
        console.log('success change personal info')
        app.globalData.userDB = that.data.userDB
        wx.navigateBack({

        })
      },
      fail(err) {
        console.log('Fail update', err)
        wx.hideLoading();
      }
    })
  }, 1500),
  onLoad: function () {

    var that = this
    //调用应用实例的方法获取全局数据
    this.setData({
      userDB: app.globalData.userDB
    });
    //获取学校信息
    const db = wx.cloud.database()
    db.collection('schools').doc('5cecf4116b901daebb43f8c0').get({
      success: res => {
        wx.hideLoading();
        if (res.data) {

          var temp = res.data.schoolList;

          that.setData({
            provinces: temp,
            multiArray: [temp, temp[31].school],
            multiIndex: [31, 1]
          })
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error(err)
      }
    })

  },
})