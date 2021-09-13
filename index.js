const cron = require('node-cron');
const moment = require('moment');

// cron.schedule('15 15-18 * * 1,2,3,4,5', () => {
//     const d = new Date();
// 	console.log(d);
// });

console.log('Aplicación iniciada...');

cron.schedule('*/1 23 * * *', () => {
    const date = moment().format('MMMM Do YYYY, h:mm:ss a');
    console.log(date);
});

// (async () => {
//     // await attendance.checkClass();
//     console.log(moment().minute());
// })();

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

// const main = async() => {
//     try {
//         await attendance.initialize();
//         await attendance.login();
//         await attendance.takeAttendance();
//         await attendance.logout();
//     }
//     catch (e) {
//         console.error(e);
//     }

// };