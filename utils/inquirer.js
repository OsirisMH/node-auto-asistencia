const inquirer = require('inquirer');

const confirmar = async( mensaje ) => {
    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message: mensaje
        }
    ];

    const { ok } = await inquirer.prompt( pregunta );
    return ok;
}

module.exports = {confirmar}