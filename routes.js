const userRoutes = require('./api/routes/user');
const interestRoutes = require('./api/routes/interest');

const namespace = '/api/v1';

// routes
const initRoutes = (app) => {
    app.use(`${namespace}/users`, userRoutes);
    app.use(`${namespace}/interest`, interestRoutes);
};


module.exports = initRoutes;