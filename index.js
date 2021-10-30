const moment = require('moment');
require('colors');

const { job } = require('./utils/cronJob');

// const main = async(user) => {
//     console.log(`Ejecución iniciada (${ moment().tz('America/Chihuahua').format('MMMM Do YYYY, h:mm:ss a') })...\n`);
//     await takeAttendance(osiris);
//     await takeAttendance(adrian);
//     console.log(`Ejecución finalizada (${ moment().tz('America/Chihuahua').format('MMMM Do YYYY, h:mm:ss a') })...`);
// }; //PRODUCTION

//? -----------------------------------------------------------------------

const main = async(user) => {
    console.log(`Ejecución iniciada (${ moment().tz('America/Chihuahua').format('MMMM Do YYYY, h:mm:ss a') })...`);
    console.log( `Próxima ejecución: ${job.nextDate().format('h:mm:ss a')}\n` );
    job.start();
};

main();