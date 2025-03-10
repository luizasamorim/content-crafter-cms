var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')

require('dotenv').config()

var indexRouter = require('./routes/index')

var app = express()

// view engine setup
var mustacheExpress = require("mustache-express")
var engine = mustacheExpress()
app.engine("mustache", engine)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'mustache')

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const secret = process.env.SECRET || "!@f5#gH$7l"
const session = require("express-session")
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false
}))

app.use('/', indexRouter)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message
//   res.locals.error = req.app.get('env') === 'development' ? err : {}

//   // render the error page
//   res.status(err.status || 500)
//   res.render('error')
// })

module.exports = app
