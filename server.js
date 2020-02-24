const express = require('express');
var hbs = require('express-handlebars');
var path = require('path')
const mongoose = require('mongoose')
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');


const app = express();

const db = require('./config/keys').MongoURI;
require('./config/passport')(passport);
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(db,{ useUnifiedTopology: true , useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected ... '))
  .catch(err => console.log(err));
const PORT = process.env.PORT || 5000;
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views',
}));
app.use(flash());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

app.use(express.urlencoded({ extended: false }))

app.listen(PORT, console.log(`server started on port ${PORT}`))

