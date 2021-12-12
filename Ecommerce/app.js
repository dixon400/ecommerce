const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const expressValidator = require('express-validator');
const config = require('./config/config');
const authRoute = require('./route/auth');
const userRoute = require('./route/user');
const categoryRoute = require('./route/category');
const productRoute = require('./route/product');

mongoose.connect(
    config.MONGO_URI,
    {useNewUrlParser: true,
    useUnifiedTopology: true
    }
  )
  .then(() => console.log('DB Connected'))
   
  mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
  });
  

const port = config.PORT || 8000;
app.use(morgan());
app.use(express.json());
app.use(express.urlencoded());
app.use(session({
    name:'session',
    secret: config.SECRET,
    cookie: {
        maxAge: 2678400000
    }
}));
app.use(expressValidator());
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);

app.listen(port, ()=>{
    console.log(`App is running on port ${port}`)
})