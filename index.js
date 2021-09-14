const cron = require('node-cron');
const moment = require('moment');
const { Attendance } = require('./models/Attendance');

const main = async() => {
    try {
        await Attendance.initialize();
        await Attendance.login();
        await Attendance.takeAttendance();
        await Attendance.logout();
    }
    catch (e) {
        console.error(e);
    }
};

// cron.schedule('15 15-18 * * 1,2,3,4,5', () => {
//     const d = new Date();
// 	console.log(d);
// });

// console.log('Aplicación iniciada...');
// if ( moment().day() > 0 && moment().day() < 6) {
//     if ( moment().hour() >= 15 && moment().hour() < 20 ) {
//         cron.schedule('15 15-18 * * 1,2,3,4,5', async() => {
//             await main();
//         });
//     }
//     else {
//         console.log('Fuera de horario escolar...');
//     }
// }
// else {
//     console.log('Fin de semana...');
// }
console.log('Inicio...');
    
cron.schedule('15, 20 15,16,17,18,19 * * 1,2,3,4,5', async() => {
    await main();
    console.log(moment().format('LT'));
});


// cron.schedule('*/30 * * * *', () => {
//     const date = moment().format('MMMM Do YYYY, h:mm:ss a');
//     console.log(date);
//     // main();
// });

// (async() => {

//     try {
//         if ( moment().day() > 0 && moment().day() < 6) {
//             if ( moment().hour() >= 15 && moment().hour() < 20 ) {
//                 await attendance.initialize();
//                 await attendance.login();
//                 await attendance.takeAttendance();
//                 await attendance.logout();
//             }
//             else {
//                 console.log('Fuera de horario escolar...');
//             }
//         }
//         else {
//             console.log('Fin de semana...');
//         }
//     }
//     catch (e) {
//         console.error(e);
//     }

// })();