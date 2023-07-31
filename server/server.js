const express = require('express')
const app = express()

const session = require('express-session');
const cors = require('cors')

const db = require('./config/connection')
const routes = require('./routes')

const PORT = process.env.PORT || 5500;

//Add in a deploy from build here

app.use(session({
    secret: 't5H1i7Gc$Gy9^sb@9K0E', 
    resave: false,
    saveUninitialized: true
  }));

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', () => {
    console.log('MongoDB connected')
    app.listen(PORT, ()=> {
        console.log(`API server running on port ${PORT}!`);
    })
})
