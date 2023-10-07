const express = require('express')
const mongoose = require('mongoose')
const createError = require('http-errors')
require('dotenv').config()

const {verifyAccessToken} = require('./middleware/jwtHelper')

const url = 'mongodb+srv://hamzawq:PXUsHSIruVbztWtQ@cluster0.zvk1ffv.mongodb.net/?retryWrites=true&w=majority'
const app = express()

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, ssl: true,
  tlsAllowInvalidCertificates: true,})
const conn = mongoose.connection
const PORT = process.env.PORT || 9000

conn.on('open', () => {
    console.log('connected successfully.')
})

app.use(express.json())

app.get('/', verifyAccessToken, async (req, res, next) => {
    
    res.send('Hello from express.')
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})

const userRouter = require('./routes/userRoutes')
app.use('/users', userRouter)

const authRouter = require('./routes/auth')
app.use('/auth', authRouter)

const restuarantRouter = require('./routes/restuarantRoutes')
app.use('/restuarants', restuarantRouter)

const itemRouter = require('./routes/itemRoutes')
app.use('/items', itemRouter)


app.listen(PORT, () => {
    console.log('Server started')
})