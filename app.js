// * Importaciones externas
const moment = require('moment');
require('colors');

// * Importaciones propias
const { job } = require('./utils/cronJob');

//? -----------------------------------------------------------------------
const main = async() => {
    // * Logs
    console.log(`Ejecución iniciada (${ moment().tz('America/Chihuahua').format('MMMM Do YYYY, h:mm:ss a') })...`);
    console.log( `Próxima ejecución: ${job.nextDate().format('h:mm:ss a')}\n` );

    // * Iniciar tarea
    job.start();
};

main();