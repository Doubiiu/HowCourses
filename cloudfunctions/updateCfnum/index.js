// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'test1-5jtvp'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  await db.collection('courses').doc(event.id).update({
    data: {
      focusCount: _.inc(1)
    },
    success(res) {

    },
    fail(err) {

    }
  })

}