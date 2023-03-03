const morgan = require('morgan');
const bodyParser = require('body-parser');

initCommonMiddleware = (app,express) => {
// show message when user open the api
app.get('/', (req, res) => {
    res.send('Welcome to the API');
});


app.use(morgan('dev')); // using morgan to check which api is called
app.use(express.json()); // using express to parse json data
app.use(bodyParser.urlencoded({extended: false})); // using body-parser to parse url encoded data
app.use(bodyParser.json()); // using body-parser to parse json data

// set headers to allow cross origin resource sharing
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
}

module.exports = initCommonMiddleware;