const userRoutes = require('./api/routes/user');

const namespace = '/api/v1';

// routes
const initRoutes = (app) => {
    app.use(`${namespace}/users`, userRoutes);
};


module.exports = initRoutes;