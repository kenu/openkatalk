// app.js
import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { Sequelize } from 'sequelize'

const app = express()
const PORT = process.env.PORT || 3000

app.set('view engine', 'ejs')

// 데이터베이스 연결 설정
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    timezone: 'Asia/Seoul',
  }
)

// 모델 정의
class Info extends Sequelize.Model {}
Info.init(
  {
    kakaoLink: { type: Sequelize.STRING, unique: true },
    theme: Sequelize.STRING,
    sourceAddress: Sequelize.STRING,
  },
  { sequelize, modelName: 'info' }
)

// 미들웨어 설정
app.use(express.json())
app.use(cors())

// 라우트 설정
app.get('/', async (req, res) => {
  try {
    sequelize.sync()
    const infos = await Info.findAll()
    res.send(infos)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

app.get('/chatrooms', async (req, res) => {
  try {
    const infos = await Info.findAll()
    res.render('infos', { infos })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

app.get('/form', (req, res) => {
  res.render('form')
})

app.post('/info', async (req, res) => {
  try {
    const { kakaoLink, theme, sourceAddress } = req.body
    const info = await Info.create({ kakaoLink, theme, sourceAddress })
    res.status(201).json(info)
  } catch (error) {
    console.error(error)
    res.status(400).send('Bad request')
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
