const cron = require('node-cron');
const moment = require('moment');
const puppeteer = require('puppeteer');
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

const example = async () => {
  try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const h1 = await page.$('h1');
    const title = await (await h1.getProperty('innerText')).jsonValue();
    console.log(title);
    await browser.close();
  }
  catch(e){
        console.log(e);
  }
};
// const self = require('./models/Attendance');


// cron.schedule('15 15-18 * * 1,2,3,4,5', () => {
//     const d = new Date();
// 	console.log(d);
// });


(async () => {
    console.log('Aplicación iniciada...');
    await example();
    console.log('Aplicación finalizada...')
})();

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