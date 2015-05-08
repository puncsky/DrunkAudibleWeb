// Configuration
// ===================================================================================================================

var port = 8080;
var mongodbUri = '';
var siteKeyPath = './sslCertificates/drunkaudible.web.key.pem';
var siteCertPath = './sslCertificates/drunkaudible.web.cert.pem';
var sessionSecret = 'DrunkAudible.Web Secret Session Key';

// Base Setup
// ===================================================================================================================

var express = require('express');
var serveStatic = require('serve-static');
// morgan for logging
var morgan = require('morgan');
var bodyParser = require('body-parser');

// mongoose ORM for mongodb
var mongoose = require('mongoose');
mongoose.connect(mongodbUri);
var mongooseTypes = require("mongoose-types");
// Only load the email type
mongooseTypes.loadTypes(mongoose, "email");

var passport = require('passport');
var session = require('express-session');
var ejs = require('ejs');
var fs = require('fs');

// Set up HTTPS key and certificate
var https = require('https');
var siteKey = fs.readFileSync(siteKeyPath);
var siteCert = fs.readFileSync(siteCertPath);
var httpsOptions = {
    key: siteKey,
    cert: siteCert
};

var app = express();

app.use(morgan('dev'));

app.use(session({
    secret: sessionSecret,
    saveUninitialized: true,
    resave: true
}));
app.set('view engine', 'ejs');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//app.use(express.methodOverride()); // HTTP PUT and DELETE support
app.use(serveStatic(__dirname));
app.use(passport.initialize());

// Load Controllers
// -------------------------------------------------------

var userController = require('./controllers/userController');
var authController = require('./controllers/authController');
var albumController = require('./controllers/albumController');
var clientController = require('./controllers/clientController');
var oauth2Controller = require('./controllers/oauth2Controller');
var episodeController = require('./controllers/episodeController');

// Routers for Our API
// ===================================================================================================================

var router = express.Router();

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// Routers for Controllers
// -------------------------------------------------------

router.route('/users')
    .post(userController.postUsers)
    .get(authController.isAuthenticated, authController.isSuperuser, userController.getUsers);
router.route('/users/superuser/:userId')
    .put(authController.isAuthenticated, authController.isSuperuser, userController.setSuperuser);
router.route('/user')
    .get(authController.isAuthenticated, userController.getUser)
    .put(authController.isAuthenticated, userController.putUser)
    .delete(authController.isAuthenticated, userController.deleteUser);

router.route('/albums')
    .post(authController.isAuthenticated, authController.isSuperuser, albumController.postAlbums)
    .get(authController.isAuthenticated, albumController.getAlbums);
router.route('/albums/:albumId')
    .get(authController.isAuthenticated, albumController.getAlbumByAlbumId)
    .put(authController.isAuthenticated, authController.isSuperuser, albumController.putAlbumByAlbumId)
    .delete(authController.isAuthenticated, authController.isSuperuser, albumController.deleteAlbumByAlbumId);

router.route('/albums/:albumId/episodes')
    .post(authController.isAuthenticated, authController.isSuperuser, episodeController.postAlbumEpisodes)
    .get(authController.isAuthenticated, episodeController.getAlbumEpisodes);

router.route('/clients')
    .post(authController.isAuthenticated, clientController.postClients)
    .get(authController.isAuthenticated, clientController.getClients);

router.route('/oauth2/authorize')
    .get(authController.isAuthenticated, oauth2Controller.authorization)
    .post(authController.isAuthenticated, oauth2Controller.decision);
router.route('/oauth2/token')
    .post(authController.isClientAuthenticated, oauth2Controller.token);

// Register Routes
// -------------------------------------------------------
app.use('/api', router);

// Start the Server
// ===================================================================================================================

https.createServer(httpsOptions, app).listen(port, function() {
    console.log('Express server listening on port ' + port);
});
