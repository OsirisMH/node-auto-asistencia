// * Importaciones externas
const CronJob = require('cron').CronJob;
const moment = require('moment');
require('dotenv').config();

// * Importaciones internas
const { Attendance } = require('../models/Attendance');

// * Configuración de las variables de entorno
const schedule = process.env.SCHEDULE;
const user = process.env.MOODLE_USERNAME;
const password = process.env.MODDLE_USER_PASSWORD;

// * Documentación de las tareas a ejecutar con Cron
// ? Función prinicipal
const takeAttendance = async() => {
    try {
        console.log(`Usuario: ${process.env.USERNAME || 'No identificado'}`.brightCyan);
        
        await Attendance.initialize();
        const isLogged = await Attendance.login(user, password);
        if ( isLogged ){
            await Attendance.takeAttendance();
            await Attendance.logout();
        }
    }
    catch (e) {
        console.error(e);
    }
};

// ? Función ejectutada al completar la tarea
const completedTask = async () => {
    console.log(`\nEjecución finalizada (${ moment().tz('America/Chihuahua').format('MMMM Do YYYY, h:mm:ss a') })...`);
}

// ? Función que verifica si detener la tarea
const mayStopJob = () => {
    const endTime = moment().hour(19).minute(00).second(0).format('k');
    const currentTime = moment().tz('America/Chihuahua').format('k');
    return ( endTime === currentTime ) ? true : false;
}

// ? El CronJob que ejecutará nuestra funcion prinicipal
const job = new CronJob(schedule, async function() {
    
    // Función principal
    await takeAttendance();

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