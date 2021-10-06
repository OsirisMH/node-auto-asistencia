const moment = require('moment');

const types = {
    saved: {
        code: 1,
        status: "ok",
        message: "Ya te tomé la asistencia prro 👍🏼"
    },
    outOfTime: {
        code: 2,
        status: "error",
        message: `Fuera de horario de clases...`
    },
    alreadySaved: {
        code: 3,
        status: "error",
        message: `¡¿Para qué tomas la asistencia?! ¡Dejame hacer mi puto trabajo!`
    },
    disable: {
        code: 4,
        status: "error",
        message: `No se habilitó la asistencia`
    },
    nonExistent: {
        code: 5,
        status: "error",
        message: `No hay asistencia asignada`
    }
};

module.exports = types;