const express = require('express')
const app = express()
const cors = require('cors')

const db = require('./config/connection')
const routes = require('./routes')

const PORT = 5500;

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
