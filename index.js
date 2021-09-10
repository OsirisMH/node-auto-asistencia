const cron = require('node-cron');
const attendance = require("./models/attendance");
const moment = require('moment');

// cron.schedule('* * * * * ', () => {
//    console.log('caca') 
// });

// (async () => {
//     // await attendance.checkClass();
//     console.log(moment().minute());
// })();

(async() => {

    try {
        if ( moment().day() > 0 && moment().day() < 6) {
            if ( moment().hour() >= 15 && moment().hour() < 20 ) {
                await attendance.initialize();
                await attendance.login();
                await attendance.takeAttendance();
                await attendance.logout();
            }
            else {
                console.log('Fuera de horario...');
            }
        }
        else {
            console.log('Fuera de horario...');
        }
    }
    catch (e) {
        console.error(e);
    }

})();