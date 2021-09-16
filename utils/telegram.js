const axios = require('axios').default;
require('dotenv').config();

// const sendMessage = async (message) => {
//     const instance = axios.create({
//         baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
//         params: {
//             chat_id: process.env.TELEGRAM_CHAT_ID,
//             text: message,
//         },
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });

//     // resp.data
//     instance.post()
//     .then( res => console.log(`Mensaje enviado`))
//     .catch(e => console.log(`Ha ocurrido un error con la petición: ${e}`))
// }

const sendMessage = async (msg = "UwU", user) => {
    try {
        const { name, id } = user;
        const message = `${ msg }\n<a href="tg://user?id=${ id }">${ name }</a>`;

        const instance = axios.create({
            baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
            params: {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'html'
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        await instance.post()
        console.log(`Mensaje enviado`)

    } catch( e ){
        console.log(`Ha ocurrido un error con la petición: ${e}`)
    }
}

module.exports = {
    sendMessage
}
