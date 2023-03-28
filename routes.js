const userRoutes = require('./api/routes/user');
const reviewRoutes = require('./api/routes/review');
const interestRoutes = require('./api/routes/interest');
const admin = require('./api/routes/admin');

const namespace = '/api/v1';

// routes
const initRoutes = (app) => {
    app.use(`${namespace}/users`, userRoutes);
    app.use(`${namespace}/reviews`, reviewRoutes);
    app.use(`${namespace}/interest`, interestRoutes);
    app.use(`${namespace}/admin`, admin);
};


module.exports = initRoutes;