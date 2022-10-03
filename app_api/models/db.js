const mongoose = require('mongoose');
const host = process.env.DB_HOST || '127.0.0.1'
    //const dbURL = `mongodb://${host}/Loc8r`;
const dbURL = "mongodb+srv://martinfb168:pan557333@cluster0.e6gmo.mongodb.net/martinmongodb?retryWrites=true&w=majority";
//const dbURL = "mongodb+srv://Martinmongo:pan557333@cluster0-q9lha.mongodb.net/account_db?retryWrites=true&w=majority";
const readLine = require('readline');

const connect = () => {
    setTimeout(() => mongoose.connect(dbURL, { useNewUrlParser: true}), 1000);//, useCreateIndex: true 
}

mongoose.connection.on('connected', () => {
    console.log('connected');
});

mongoose.connection.on('error', err => {
    console.log('error: ' + err);
    return connect();
});

mongoose.connection.on('disconnected', () => {
    console.log('disconnected');
});

if (process.platform === 'win32') {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', () => {
        process.emit("SIGINT");
    });
}
//mongoose.close()
const gracefulShutdown = (msg, callback) => {
    mongoose.disconnect(() => {
        console.log(`db disconnected through ${msg}`);
        callback();
    });
};

process.once('SIGUSR2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});
connect();
require('./Fmaccount');
require('./User');
require('./Paras');
require('./Pays');
require('./Incomes');
require('./Familys');
require('./opinions')