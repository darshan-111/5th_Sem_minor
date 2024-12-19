const mqtt = require("mqtt");

const aioUsername = "Darshan_11";
const aioKey = "aio_mtTG07jaRXvmmoarjGvsk6rAZsNr";

const client = mqtt.connect("mqtt://io.adafruit.com", {
  username: aioUsername,
  password: aioKey,
});
console.log("connecting to adafruit");
client.on("connect", () => {
  console.log("Connected to Adafruit IO");
  client.subscribe(`Darshan_11/feeds/volts`);
  client.subscribe(`Darshan_11/feeds/amps`);
  client.subscribe(`Darshan_11/throttle`);
  client.subscribe(`Darshan_11/errors`);

});

// client.on("message", (topic, message) => {
//   console.log(`Received ${topic}: ${message.toString()}`);
// });

// const mqtt = require('mqtt');
const mongoose = require('mongoose');

// Adafruit IO credentials
// const AIO_USERNAME = "Darshan_11";
// const AIO_KEY = "aio_mtTG07jaRXvmmoarjGvsk6rAZsNr";

// MongoDB connection string (replace with your MongoDB URI if using a cloud database)
const MONGO_URI = "mongodb://localhost:27017/mqttData";

// MQTT connection options
// const options = {
//   username: AIO_USERNAME,
//   password: AIO_KEY,
// };

// Topics for volts and amps feeds
// const voltsTopic = `Darshan_11/feeds/volts`;
// const ampsTopic = `Darshan_11/feeds/amps`;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define a Mongoose schema and model
const SensorDataSchema = new mongoose.Schema({
  topic: String,
  value: String,
  timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('SensorData', SensorDataSchema);

// Connect to Adafruit IO MQTT broker
// const client = mqtt.connect("mqtt://io.adafruit.com", {
//     username: aioUsername,
//     password: aioKey,
//   });

// client.on('connect', () => {
//   console.log('Connected to Adafruit IO');

//   // Subscribe to feeds
//   client.subscribe(voltsTopic, (err) => {
//     if (!err) console.log(`Subscribed to ${voltsTopic}`);
//     else console.error(`Failed to subscribe to ${voltsTopic}:`, err);
//   });

//   client.subscribe(ampsTopic, (err) => {
//     if (!err) console.log(`Subscribed to ${ampsTopic}`);
//     else console.error(`Failed to subscribe to ${ampsTopic}:`, err);
//   });
// });

// Handle incoming messages
client.on('message', (topic, message) => {
  const dataValue = message.toString();
  console.log(`Received ${topic}: ${dataValue}`);

  // Save data to MongoDB
  const data = new SensorData({ topic, value: dataValue });
  data
    .save()
    .then(() => console.log(`Data saved: ${topic} = ${dataValue}`))
    .catch((err) => console.error('Error saving data:', err));
});

// Handle errors
// client.on('error', (err) => {
//   console.error('MQTT error:', err);
// });

// // Handle client disconnection
// client.on('close', () => {
//   console.log('Disconnected from Adafruit IO');
// });

