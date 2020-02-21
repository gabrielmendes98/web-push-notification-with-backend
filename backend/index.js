const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const webpush = require('web-push'); //requiring the web-push module

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 4000;

app.get('/', (req, res) => res.send('Hello World!'));

const vapidKeys = {
  publicKey:
    'BHKuwXUU8cj7PBFbT3s2W8vlWMjI5KoaHvLK-kcerMxBQzzh4EGJGoQV6R-RyVh0M5VMYslZrVIdQPlg6qwlmtc',
  privateKey: 'GlHGELT_5G6PMV8Z3pakbeZwwTdGp9FClMxpiC0bUEY'
};

//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:myuserid@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const dummyDb = { subscription: null }; //dummy in memory store

const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription;
};
// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
  const subscription = req.body;
  await saveToDatabase(subscription); //Method to save the subscription to Database
  res.json({ message: 'success' });
});

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend = '') => {
  webpush.sendNotification(subscription, dataToSend);
};

//route to test send notification
app.get('/send-notification', (req, res) => {
  const subscription = dummyDb.subscription; //get subscription from your databse here.
  const message = 'Hello World from OnYou';
  const title = 'OnYou'
  const payload = {title: title, message: message}
  sendNotification(subscription, JSON.stringify(payload));
  res.json({ message: 'message sent' });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
