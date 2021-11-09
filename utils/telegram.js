const axios = require('axios').default;
require('dotenv').config()

const gifs = Object.values(JSON.parse(process.env.TELEGRAM_STATUS_GIF));

const telegramAPI = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;
const setURL = ( type ) => {
    switch (type) {
        case 'Message':
            return `${telegramAPI}/sendMessage`;
        case 'Animation':
            return `${telegramAPI}/sendAnimation`;
        case 'Test':
            return `${telegramAPI}/sendMessage`;
        default:
            break;
    }
}

const sendMessage = async (message) => {
    const instance = axios.create({
        baseURL: setURL('Message'),
        params: {
            chat_id: process.env.TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'html'
        },
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return instance.post()
        .then( () => { console.log(`Mensaje enviado`) })
        .catch( (err) => console.log(err.message) );
};

const sendAnimation = async (className = "Prueba", type = {message: "Hola!", code: 5}, user = {id: "1535314254", name: "Osiris Meza" }) => {
    try {
        const classNameTag = `${ ( className ) ? `<b>${ className }</b>\n` : '' }`
        const userTag = `<a href="tg://user?id=${ user.id }">${ user.name }</a>`;
        const gif = gifs[type.code - 1];
        const message = `${ classNameTag }${ type.message } ${ userTag }`;

        const instance = axios.create({
            baseURL: `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendAnimation`,
            params: {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                caption: message,
                parse_mode: 'html',
                animation: gif,
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
};

module.exports = {
    sendMessage,
    sendAnimation
}
