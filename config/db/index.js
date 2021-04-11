const mongoose = require('mongoose');

async function connect() {
    try{
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connect successfully!')
    } catch (err) {
        console.log('connect fail', err)
    }
}

module.exports = connect;
