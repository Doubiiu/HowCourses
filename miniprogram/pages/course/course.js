//index.js

var util = require('../../utils/util.js')
var app = getApp()
var tabbar = 1
Page({
  data: {
    //窗口信息
    buttonTop: (app.globalData.windowHeight * (750 / app.globalData.windowWidth) * 0.8),
    buttonLeft: 625,
    windowHeight: '',
    windowWidth: '',

    //学校信息
    multiArray: [],
    multiIndex: [0, 0],
    currentSchool: "香港中文大学",
    //课程信息
    couseFeed: [],
    couseFeed_length: 0,
    //
    commentFeed: [],
    commentFeed_length: 0,
    
    //search
    searchValue: '',
    


  },
  // function
  createCourse: function(e){
    wx.navigateTo({
      url: '../createCourse/createCourse'
    })
  },
  search(e){
    console.log("search ", this.data.searchValue)
    if (this.data.searchValue == null || this.data.searchValue.match(/^[ ]*$/)) {
        wx.showToast({
          title: '搜索项不能为空',
          icon: 'none',
          image: '../../images/reject.png',
          duration: 1500
        })
        return;
      }
    
    var that = this;
    var key = this.data.searchValue;
    const db = wx.cloud.database({});
    db.collection('courses').where({
      title: db.RegExp({
        regexp: key,
        options: 'i'
      }),
      school: app.globalData.school
    }).get({
      success(res){
        console.log('search course success',res)
        wx.removeStorageSync('courseSearch');
        wx.removeStorageSync('courseSearchLength');
        wx.setStorageSync('courseSearch', res.data);
        wx.setStorageSync('courseSearchLength', res.data.length);
      }
    })

    const dbu = wx.cloud.database({});
    dbu.collection('users').where({
      nickname: dbu.RegExp({
        regexp: key,
        options: 'i'
      }),
      school: app.globalData.school
    }).get({
      success(res) {
        console.log('search user success', res)
        wx.removeStorageSync('userSearch');
        wx.removeStorageSync('userSearchLength');
        wx.setStorageSync('userSearch', res.data);
        wx.setStorageSync('userSearchLength', res.data.length);
      }
    })
    wx.showToast({
      title: "搜索中...",
      icon: 'none',
      duration: 1500,
    })
    setTimeout(function () {
      wx.navigateTo({
        url: '../search/search',
      })
    }, 1500)
    
  },
  searchValueInput: function(e){
    this.setData({
      searchValue: e.detail.value,
    })
  },
  bindPickerChange(e){
    this.setData({
      index: e.detail.value
    })
  },
  bindMultiPickerChange(e){
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    var that = this;
    //console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      
    };
    data.multiIndex[e.detail.column] = e.detail.value
    if(e.detail.column == 0){
      data.multiIndex = [e.detail.value,0];
    }else if(e.detail.column == 2){
      data.multiIndex = [data.multiIndex[0],e.detail.value];
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
    this.getData();
    app.globalData.schoolName = this.data.currentSchool;
  },




  bindQueTap: util.throttle(function (e) {
  
    var idx = e.currentTarget.dataset.idx;
    console.log("idx:",idx);
    
    var courseInfo = this.data.courseFeed[idx];
    
    wx.setStorageSync('courseInfo', courseInfo);
    wx.navigateTo({
      url: '../course-detail/course-detail'
    })
  }, 1500),
  onLoad: function () {
    app.globalData.schoolName = this.data.currentSchool
    var that = this;
    wx.getSystemInfo({

      success: function (res) {
        console.log(res.windowHeight * (750 / res.windowWidth)),
          console.log(app.globalData.windowHeight * (750 / app.globalData.windowWidth)),
        that.setData({
          windowHeight: (res.windowHeight*(750/res.windowWidth)),
          windowWidth: 750
        })
      },
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
          console.log(that.data.provinces)
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error(err)
      }
    })
    this.getData();

  },
  getData: function(){
    wx.showLoading({
      title: 'Loading...',
    })
    var that = this;

    //获取学校课程
    const dbcourse = wx.cloud.database();
    const tableCourse = dbcourse.collection('courses');
    tableCourse.where({
      school: this.data.currentSchool,
    }).get({
      success: function (res) {
        wx.hideLoading();
        console.log("本校课程：", res.data)
        var rawdata = res.data;
        that.setData({
          courseFeed: rawdata,
          courseFeed_length: res.data.length,
        })
        console.log('that data:', that.data.courseFeed)
      },
      fail: function(err) {
        wx.hideLoading();
        console.error(err)
      }
    })
  },
  onShow(){
    this.onLoad()
  },
})
