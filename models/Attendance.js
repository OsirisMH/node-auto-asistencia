const fs = require('fs');
const puppeteer = require('puppeteer');
const moment = require('moment');
require('dotenv').config();
require('colors');

const { sendMessage } = require('../utils/telegram');

const self = {
    browser: null,
    page: null,
    classes: null,
    currentClass: null,

    getClasses: () => {
        // return JSON.parse('./database/db.json');
        const jsonFile = fs.readFileSync('./database/db.json');
        return JSON.parse(jsonFile);
    },

    initialize: async () => {
        self.classes = self.getClasses();
        self.browser =  await puppeteer.launch({
            args: ['--no-sandbox']
        }); // PRODUCTION
        // self.browser =  await puppeteer.launch({ headless: false }); // DEV
        self.page = await self.browser.newPage();
        console.log('Navegador iniciado!'.brightYellow);
    },

    login: async(user, pass) => {
        try {
            /* Ir a la página de inicio de sesión */
            await self.page.goto(process.env.BASE_URL, { waitUntil: 'networkidle0' });

            /* Introducir el usuario y contraseña */
            await self.page.type('#username', user, { delay: 100 });
            await self.page.type('#password', pass, { delay: 100 });

            /* Clic en el botón login */
            await self.page.click('#loginbtn');

            /* Verificar si hay algun error */
            await self.page.waitForSelector('#action-menu-toggle-1');
            console.log('Inicio de sesión exitoso'.brightGreen);

        } catch(e) {
            let res = await self.page.$('div[class="alert alert-danger"]');
            let errorMessage = await (await res.getProperty('innerText')).jsonValue();
            console.log(`${'Error'.brightRed}: No fue posible iniciar sesión`);
            console.log(`${'Error'.brightRed} de la página: ${errorMessage}`);
        }
    },

    logout: async () => {
        try {
            /* Verificar que exista el botón de salida */
            await self.page.waitForSelector('#action-menu-toggle-1');
            await self.page.click('#action-menu-toggle-1');

            /* Clic en el botón de salir */
            await self.page.waitForSelector('#action-menu-1-menu>a:last-child');
            await self.page.click('#action-menu-1-menu>a:last-child');

            /* Verificar hubo algun error */
            await self.page.waitForSelector(`a[href="${process.env.BASE_URL}"]`)
            console.log('Sesión cerrada correctamente'.brightGreen);

            /* Cerrar el navegador */
            // await confirmar('Pausa...'); // DEV
            await self.page.waitForTimeout(2000);
            await self.browser.close();

        } catch(e) {
            console.log(`${'Error'.brightRed}: No fue posible cerrar sesión de manera tradicional`);
            console.log(`Se forzó el cierre de sesión`.brightYellow);
            await self.page.deleteCookie({ name: process.env.MOODLE_COOKIE_NAME });
            await self.page.waitForTimeout(2000);
            // await confirmar('Pausa...'); // DEV
            await self.browser.close();
        }
        finally {
            console.log('Navegador cerrado!\n'.brightYellow);
        }
    },

    takeAttendance: async ( user ) => {
        /* Dirigirse a la página de toma de asistencia correspondiente */
        try {
            // Configurar la clase de acuerdo a la hora
            const { urls } = self.classes;

            self.checkSetClass();
            if ( !urls[self.currentClass] ){
                console.log(`No hay clases a a las: ${ moment().tz('America/Chihuahua').format('LT') }`);
                await sendMessage(`No hay clases a a las: ${ moment().tz('America/Chihuahua').format('LT') }`, user); // TELEGRAM
                return;
            }

            await self.page.goto(urls[self.currentClass]);
            // await self.page.goto(urls[0]); //DEV

            // Verificar que nos encontremos en la página de asistencia
            await self.page.waitForSelector('.breadcrumb>li:nth-last-child(2)');

            // Verificar el estado de la asistencia
            // Obtener el nombre de la materia
            await self.page.waitForSelector('.page-header-headings');
            const materia = await self.page.$('.page-header-headings');
            const nombreMateria = await (await materia.getProperty('innerText')).jsonValue();
            console.log(`${nombreMateria}`.brightCyan);

            // Verificar que sea posible la toma de asistencia
            const status = await self.page.$('.generaltable>tbody .statuscol');

            if ( status ){ // Caso 1: Es posible tomar la asistencia
                const text = await (await status.getProperty('innerText')).jsonValue();
                if ( text === 'Presente') { // Caso 1.1: Si la asistencia ya ha sido tomada
                    // Notificar al usuario
                    console.log(`${nombreMateria}: La asistencia ya había sido tomada - ${ user.name }`) // Consola
                    await sendMessage(`${nombreMateria} - La asistencia ya había sido tomada`, user); // Telegram
                }
                else { // Caso 1.2: La asistencia no ha sido tomada
                    // Esperar delay en caso de ser necesario
                    let minutos = moment().tz('America/Chihuahua').minute();
                    while ( minutos < 15 ){
                        await self.page.waitForTimeout(60000);
                        minutos = moment().tz('America/Chihuahua').minute();
                        console.log(`${ 15 - minutos }`.brightGreen + ' restantes...'); // Consola
                    }
        
                    // Recargar página
                    await self.page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
        
                    // Verificar que pueda presionarse el boton Enviar asistencia
                    await self.page.waitForSelector('.generaltable>tbody .statuscol');
                    if ((await self.page.$('.generaltable>tbody .statuscol>a'))) { // Si está habilitada la asistencia
                        // Presionar en Enviar asistencia
                        await self.page.click('.generaltable>tbody .statuscol>a');
                        
                        // Seleccionar presente
                        await self.page.waitForSelector('.fcontainer #fgroup_id_statusarray>div:last-child fieldset>div>label input');
                        await self.page.click('.fcontainer #fgroup_id_statusarray>div:last-child fieldset>div>label input');
                        
                        // Enviar peitción
                        await self.page.waitForSelector('#id_submitbutton');
                        await self.page.click('#id_submitbutton');
            
                        // Verificar que se ha concluido el proceso
                        await self.page.waitForSelector('.generaltable>tbody .lastcol');
            
                        // Enviar notificación de la asistencia tomada
                        console.log(`${'Asistencia tomada'.brightGreen}`); // Consola
                        await sendMessage(`${nombreMateria} - Su asistencia ya ha sido tomada`, user); // Telegram
                    }
                    else { // Si no está habilitada la asistencia
                        // Enviar notificación del error
                        console.log(`${'Error'.brightRed}: No fue posible tomar asistencia | No se habilitó la asistencia`); // Consola
                        await sendMessage(`${nombreMateria} - No se habilitó la asistencia`, user); // Telegram
                    }
                }
            }
            else { // Caso 2: No es posible tomar la asistencia (No hay asistencia asignada)
                // Notificar al usuario
                console.log(`${'Error'.brightRed}: No fue posible tomar asistencia | No hay asistencia asignada para la clase`); // Consola
                await sendMessage(`${nombreMateria} - Asistencia inexistente`, user); // Telegram
            }  
        }
        catch(error) {
            console.log(`${'Error'.red}: ${error}`); // Consola
        }
    },

    checkSetClass: () => {
        const hour = moment().tz('America/Chihuahua').hour();
        switch( hour ){
            case 15:
                self.currentClass = 0;
                break;
            case 16:
                self.currentClass = 1;
                break;
            case 17:
                self.currentClass = 2;
                break;
            case 18:
                self.currentClass = 3;
                break;
            case 19:
                self.currentClass = 4;
                break;
        }
    }
}

module.exports = {Attendance: self};