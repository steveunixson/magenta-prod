/*
    Bonobo V2 API Entry point
    This app is lisenced via MIT licence
    Author: Steve Unixson
    copyright © BonoboContact 2018
*/
require('dotenv').config();
const os = require('os');
const fs = require('fs');
const cors = require('cors');
const compress = require('compression');
const formData = require('express-form-data');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const basicAuth = require('express-basic-auth');
const path = require('path');
const swaggerDocument = require('./api/swagger.json');
const log = require('./utils/log')(module);
const config = require('./config/config');
const auth = require('./routers/auth');
const org = require('./routers/org');
const upload = require('./routers/upload');
const status = require('./routers/status');

const yandexKey = process.env.YANDEXTELEPHONY;

const homeDir = os.tmpdir();
const crawlerDir = 'magenta-temp';

if (!fs.existsSync(`${homeDir}/${crawlerDir}/`)) {
  fs.mkdirSync(`${homeDir}/${crawlerDir}/`);
  log.info(`Created directory: ${homeDir}/${crawlerDir}/`);
}

const port = process.env.PORT || 3000;
const baseUrl = config.url;


const app = express();

app.set('view engine', 'pug');
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
const options = {
  uploadDir: `${homeDir}/${crawlerDir}`,
  autoClean: false,
};

// parse data with connect-multiparty.
app.use(formData.parse(options));
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable
app.use(formData.stream());
// union body and files
app.use(formData.union());
/*
    Basic auth is going to be used for service needs such as deleting organization and all its data
    or something like swagger
    Credentials should be strong enough or generated and stored in .env file
    ONLY AT DEPLOYMENT STATE
*/

/**
 * @return {boolean}
 */
function BasicAuthorizer(username, password) {
  return username === process.env.ROOTUSER && password === process.env.ROOTPWD;
}

app.use(status);
app.use(auth);
app.use(upload);
app.use(org);
app.get(`${config.url}/yandex-key`, (req, res) => {
  res.status(200).json({ err: 0, yandex: yandexKey, baseURL: config.url });
});
app.use(express.static(path.join(__dirname, 'public/front')));
app.use(`${baseUrl}/swagger`, basicAuth({ authorizer: BasicAuthorizer, challenge: true, realm: 'Imb4T3st4pp' }), swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  log.info('Calling Bonobo Now Running On :', config.colors.FgMagenta, `${port}`);
});
