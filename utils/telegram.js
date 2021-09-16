const axios = require('axios').default;
require('dotenv').config();

const sendMessage = async (message) => {
    return axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${message}`)
    .then( res => console.log(`Mensaje enviado`))
    .catch(e => console.log(`Ha ocurrido un error con la petición: ${e}`))
}

module.exports = {
    sendMessage
}
