require('dotenv').config()
const express = require('express');
var request = require('request');
const bodyParser = require('body-parser');
const sdk = require('api')('@writesonic/v2.2#4enbxztlcbti48j');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const accountSid = process.env['TWILIO_ACCOUNT_SID'];
const authToken = process.env['TWILIO_AUTH_TOKEN'];
const client = require('twilio')(accountSid, authToken);
sdk.auth(process.env['CHAT_API_KEY']);

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/incoming', async (req, res) => {
  const twiml = new MessagingResponse();
  console.log("Message received")
  let response;
  await sdk.chatsonic_V2BusinessContentChatsonic_post({
    enable_google_results: true,
    enable_memory: false,
    input_text: req.body.Body
  }, { engine: 'premium' })
    .then(({ data }) => {
      response = data.message;
    })
    .catch(err => {
      response = err;
    });
  console.log(response);
  await twiml.message(response);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  console.log("Message sent! ")
  res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('server started'));
