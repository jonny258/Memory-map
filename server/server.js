const express = require('express')
const app = express()
const path = require("path");

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

if (process.env.NODE_ENV === "production") {
    // Serve any static files
    app.use(express.static(path.join(__dirname, "../client/dist")));
  
    // Handle React routing, return all requests to React app
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });
  }

app.use(routes);

db.once('open', () => {
    console.log('MongoDB connected')
    app.listen(PORT, ()=> {
        console.log(`API server running on port ${PORT}!`);
    })
})
