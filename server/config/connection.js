const { connect, connection } = require('mongoose');
require('dotenv').config();

connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/memoryMap', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

module.exports = connection;