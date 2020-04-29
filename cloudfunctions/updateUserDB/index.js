// 云函数入口文件
const cloud = require('wx-server-sdk')
const _ = db.command
const db = cloud.database()
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return await db.collection('users').where({
    _openid = wxContext.OPENID
  }).update({
    data:{
      age: event.data.age,
      desc: event.data.desc,
      email: event.data.email,
      gender: event.data.gender,
      major: event.data.major,
      nickname: event.data.nickname,
      school: event.data.school,
    },
    success(res){
      console.log(res.data)
    }
  })

}