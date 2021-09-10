const axios = require('axios').default;
require('dotenv').config();

const headers = {
    'Access-Token': process.env.PUSHBULLET_API_KEY,
    'Content-Type': 'application/json' 
};

const data = {
    "device_iden": process.env.PUSHBULLET_DEVICE_IDEN,
    "type": "note",
    "title": "Asistencia",
    "body": null
};

const notify = async (message) => {
    return axios.post('https://api.pushbullet.com/v2/pushes', { ...data, "body": message }, { headers })
    .then( res => console.log(`Petición realizada | ${res.status}: ${res.statusText}`))
    .catch(e => console.log(`Ha ocurrido un error con la petición: ${e}`))
}

module.exports = {
    notify
}