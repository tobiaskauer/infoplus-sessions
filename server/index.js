const express = require('express')
const app = express()
const mongoose = require('mongoose')
const mongoSanitize = require('express-mongo-sanitize')
const cors = require('cors')
const bodyParser = require('body-parser')
const VisitorRoutes = require('./routes/visitor.route')
const http = require('http');
const https = require('https');
const fs = require('fs');
var morgan = require('morgan')

app.use(morgan('common', {
  stream: fs.createWriteStream('./access.log', {flags: 'a'})
}))
  

require('dotenv').config();

app.use(cors())
app.use(bodyParser.json())
app.use(mongoSanitize({replaceWith: '_'}))
app.use('/api/visitor', VisitorRoutes)

const credentials = {} 
const ENVIRONMENT = process.env.ENVIRONMENT || 'local';
if(ENVIRONMENT == "STAGING" || ENVIRONMENT == "PRODUCTION") {
  const CREDDIR = process.env.CREDDIR
  
  const privateKey = fs.readFileSync(CREDDIR+'privkey.pem', 'utf8');
  const certificate = fs.readFileSync(CREDDIR+'cert.pem', 'utf8');
  const ca = fs.readFileSync(CREDDIR+'chain.pem', 'utf8');

	credentials.key = privateKey,
	credentials.cert = certificate,
	credentials.ca = ca
}


mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,


    })
    .then(() => console.log('MongoDB database Connected...'))
    .catch((err) => console.log(err))


const PORT = process.env.PORT || 8443;
if(credentials.cert) {
  var httpsServer = https.createServer(credentials, app);
  httpsServer.listen(PORT);
  console.log(`HTTPS is running on port ${PORT}.`);
} else {
    var httpServer = http.createServer(app);
    httpServer.listen(PORT);
    console.log(`HTTP is running on port ${PORT}.`);
}

