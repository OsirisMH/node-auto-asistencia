const axios = require('axios').default;
require('dotenv').config()

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

const sendMessage = async (className, type, user) => {
    try {
        const classNameTag = `${ ( className ) ? `<b>${ className }</b>\n` : '' }`
        const userTag = `\n<a href="tg://user?id=${ user.id }">${ user.name }</a>`;

        const message = `${ classNameTag }${ type.message }${ userTag }`;

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
        console.log(`Notificación enviada`);

    } catch( e ){
        console.log(`Ha ocurrido un error con la petición: ${e}`)
    }
}

module.exports = {
    sendMessage
}
