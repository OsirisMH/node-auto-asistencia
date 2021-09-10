const fs = require('fs');
const puppeteer = require('puppeteer');
const moment = require('moment');

const { confirmar } = require('../utils/inquirer');
const { notify } = require('../utils/pushbullet');

require('dotenv').config();

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
        self.browser =  await puppeteer.launch();
        self.page = await self.browser.newPage();
        self.classes = self.getClasses();
    },

    login: async() => {
        try {
            /* Ir a la página de inicio de sesión */
            await self.page.goto(process.env.BASE_URL, { waitUntil: 'networkidle0' });

            /* Introducir el usuario y contraseña */
            await self.page.type('#username', process.env.MODDLE_USERNAME, { delay: 100 });
            await self.page.type('#password', process.env.MODDLE_PASSWORD, { delay: 100 });

            /* Clic en el botón login */
            await self.page.click('#loginbtn');

            /* Verificar si hay algun error */
            await self.page.waitForSelector('#action-menu-toggle-1');
            console.log('Inicio de sesión exitoso');

        } catch(e) {
            let res = await self.page.$('div[class="alert alert-danger"]');
            let errorMessage = await (await res.getProperty('innerText')).jsonValue();
            console.log('No fue posible iniciar sesión');
            console.log(`Error de la página: ${errorMessage}`);
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
            console.log('Sesión cerrada');

            /* Cerrar el navegador */
            await confirmar('Pausa...');
            await self.browser.close();

        } catch(e) {
            console.log('Ha ocurrido un error al intentar cerrar sesión');
            await self.page.deleteCookie({ name: process.env.MOODLE_COOKIE_NAME });
            await confirmar('Pausa...');
            await self.browser.close();
        }
    },

    takeAttendance: async () => {
        /* Dirigirse a la página de toma de asistencia correspondiente */
        // Configurar la clase de acuerdo a la hora
        self.checkSetClass();
        const { urls } = self.classes;
        await self.page.goto(urls[self.currentClass]);

        // Revisar que nos encontremos en la página de asistencia
        await self.page.waitForSelector('.breadcrumb>li:nth-last-child(2)');

        // Revisar el estado de la asistencia
        await self.page.waitForSelector('.generaltable>tbody .statuscol');
        const status = await self.page.$('.generaltable>tbody .statuscol');
        const text = await (await status.getProperty('innerText')).jsonValue();
        if ( text === 'Presente') {
            await notify('La asistencia ya había sido tomada');
        }
        else {
            // Esperar delay en caso de ser necesario
            let minutos = moment().minute();
            while ( minutos < 15 ){
                await self.page.waitForTimeout(60000);
                minutos = moment().minute();
                console.log(minutos);
            }

            // Recargar página
            await self.page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

            // Presionar en Enviar asistencia
            await self.page.waitForSelector('.generaltable>tbody .statuscol>a');
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
            const materia = await self.page.$('.page-header-headings');
            const nombreMateria = await (await materia.getProperty('innerText')).jsonValue();
            await notify(`Asistencia tomada - ${nombreMateria}`);
        }
    },

    checkSetClass: () => {
        const hour = moment().hour();
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

module.exports = self;