# Automatización de la toma de asistencia

## Tecnologías y paqueted usados

- Node
- moment
- Puppeteer
- dotenv
- axios
- Telegram api & bot

## Uso:

### Para correr la aplicación es necesario primer configurar los enlaces de la asistencia en vista 1.

**Comandos:**

- npm start o node app

**Ejemplo:** https://url.com.mx/pag/tab/mod/attendance/view.php?id=21184&view=1
<br><b>Notese el view=1 al final</b>

### En las variables de entorno debe configurar la información del usuario de acuerdo a la estructura del JSON

**Ejemplo:** 
- BASE_URL=https://url.com.mx/pag/tab/login/index.php
- MOODLE_COOKIE_NAME=cookies_name
- MOODLE_USERNAME=usuario
- MODDLE_USER_PASSWORD=contra
- SCHEDULE='0 15 15,16,17,18,19 * * *' **(Si tienes dudas, busca la documentación de cron)**