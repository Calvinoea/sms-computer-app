const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Initialize Nexmo
const nexmo = new Nexmo({

    apiKey: 'eb29c324',
    apiSecret: '0h9lJ7w6ItCYS4UR'

}, { debug: true });



// Initialize app

const app = express();


// Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);


// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Index route
app.get('/', (req, res) => {

    res.render('index');

});

// Catch form submit

app.post('/', (req, res) => {

    // res.send(req.body);
    // console.log(req.body);

    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(

        '', number, text, { type: 'unicode' },
        (err, responseData) => {
            if (err) {
                console.log(err);
            } else {
                console.dir(responseData);
                // Get data from response
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                }
                io.emit('smsStatus', data)
            }
        }

    );

});


// Define port

const port = 3000;

// start server
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

// avaonnrvyyo socket.io(server);
const io = socketio(server);

io.on('connection', (socket) => {

    console.log('Connected');
    io.on('disconnect', () => {

        console.log('Disconnected')

    })
})