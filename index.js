const dotenv = require('dotenv').config()
const dayjs = require('dayjs')
const timezone = require('dayjs/plugin/timezone')
const utc = require('dayjs/plugin/utc')
const mysql = require('mysql2/promise')

exports.handler = async (event, context, callback) => {

  // 커넥션을 정의합니다.
  const connection = await mysql.createConnection({
    host: process.env.DB_URL,
    user: process.env.DB_ID,
    password: process.env.DB_PASSWORD,
    database: 'gream'
  })

  // TimeZone 설정
  dayjs.extend(utc)
  dayjs.extend(timezone)

  try {
    const timestamp = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')
    console.log('timestamp', timestamp)
    const [sellResults, sellFields] = await connection.execute(`DELETE FROM tb_sell WHERE deadline_at < ?`, [timestamp])
    const [BuyResults, buyFields] = await connection.execute(`DELETE FROM tb_buy WHERE deadline_at < ?`, [timestamp])

    console.log('sellResults', sellResults)
    console.log('BuyResults', BuyResults)

    return sellResults.affectedRows + BuyResults.affectedRows
  } catch (err) {
    console.log(err)
  }

  return 'Finished!'
}
