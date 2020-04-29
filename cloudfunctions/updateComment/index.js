// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('comments').doc(event.id).update({
    data: {
      child: event.data,
      cNum: event.data.length
    },
    success(res) {

    },
    fail(err) {
      
    }
  })

}