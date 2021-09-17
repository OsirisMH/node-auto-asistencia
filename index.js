const cron = require('node-cron');
const moment = require('moment');
require('dotenv').config();
require('colors');

const { Attendance } = require('./models/Attendance');

const main = async(user) => {
    try {
        const { moddleUsername, moddlePassword } = user;
        
        console.log(`${user.name}`.brightCyan);
        await Attendance.initialize();
        await Attendance.login(moddleUsername, moddlePassword);
        await Attendance.takeAttendance(user);
        await Attendance.logout();
    }
    catch (e) {
        console.error(e);
    }
};


console.log(`Ejecución iniciada (${ moment().tz('America/Chihuahua').format('MMMM Do YYYY, h:mm:ss a') })...\n`);

const { osiris, adrian } = JSON.parse(process.env.USER_DATA);
cron.schedule('15 15,16,17,18,19 * * 1,2,3,4,5', async() => {
    await main( osiris );
    // await main( adrian );
    console.log(`Ejecución finalizada (${ moment().tz('America/Chihuahua').format('MMMM Do YYYY, h:mm:ss a') })...`);
}); // PRODUCTION


// (async() => {
//     await main( osiris );
//     await main( adrian );
//     console.log(`Ejecución finalizada (${ moment().tz('America/Chihuahua').format('MMMM Do YYYY, h:mm:ss a') })...`);
// })(); // DEV