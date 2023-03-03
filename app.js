const express = require('express');
const app = express();
const {urlError, customError} = require('./errors');
const initCommonMiddleware = require('./api/middlewares/common');
const routes = require('./routes');


// call common middleware function to use common middleware
initCommonMiddleware(app, express);

// call routes function to use routes
routes(app);

// error handling
app.use(urlError);
app.use(customError);


module.exports = app;