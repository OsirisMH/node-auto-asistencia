const CronJob = require('cron').CronJob;
const moment = require('moment');
require('dotenv').config();

const { osiris, adrian } = JSON.parse(process.env.USER_DATA);
const { Attendance } = require('../models/Attendance');

// * Documentación de las tareas a ejecutar con Cron

// ? Función prinicipal
const takeAttendance = async(user) => {
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

// ? Función ejectutada al completar la tarea
const completedTask = () => {
    console.log(`\nEjecución finalizada (${ moment().tz('America/Chihuahua').format('MMMM Do YYYY, h:mm:ss a') })...`);
}

// ? Función que verifica si detener la tarea
const mayStopJob = () => {
    const endTime = moment().hour(20).minute(00).second(0).format('k');
    const currentTime = moment().tz('America/Chihuahua').format('k');
    return ( endTime === currentTime ) ? true : false;
}

// ? El CronJob que ejecutará nuestra funcion prinicipal
const job = new CronJob('0 15 15,16,17,18,19 * * *', async function() {
    
    // Función principal
    // * await (async function(){
    // *  const res = new Promise((resolve) => {
    // *        resolve('Hola mundo');
    // *   });
    // *   console.log(await res);
    // * }()); // DEV

    await takeAttendance(osiris);
    await takeAttendance(adrian);

    // Detener la tarea si se cumple la condición
    if ( mayStopJob() ){
        job.stop();
    }
    else {
        // Indicar próxima ejecución
        console.log( `Próxima ejecución: ${job.nextDate().format('h:mm:ss a')}` );
    }

}, completedTask, false, 'America/Chihuahua');

module.exports = { job };