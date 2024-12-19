const mqtt = require('mqtt');
const mongoose = require('mongoose');

// Adafruit IO credentials
const aioUsername = "Darshan_11";
const aioKey = "aio_mtTG07jaRXvmmoarjGvsk6rAZsNr";
const MONGO_URI = "mongodb://localhost:27017/mqttData";

// MQTT connection options
const options = {
  username: aioUsername,
  password: aioKey,
//   keepalive: 60,
};

// Topic
const topic = `Darshan_11/feeds/amps`;

// MongoDB connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Mongoose Schema and Model
const EnergyDataSchema = new mongoose.Schema({
  kWh: Number,
  timestamp: { type: Date, default: Date.now },
});

const EnergyData = mongoose.model('EnergyData', EnergyDataSchema);

// MQTT connection
const client = mqtt.connect("mqtt://io.adafruit.com", options);

// Variables for kWh calculation
let cumulativeEnergy = 0; // Total energy in kWh
let lastTimestamp = Date.now(); // To calculate elapsed time

client.on('connect', () => {
  console.log('Connected to Adafruit IO');
  client.subscribe(`Darshan_11/feeds/amps`, (err) => {
    if (!err) console.log(`Subscribed to ${topic}`);
    else console.error(`Failed to subscribe to ${topic}:`, err);
  });
});

client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const { volts, amps } = data;

    // if (!volts || !amps) {
    //   console.error("Invalid data received, missing volts or amps:", data);
    //   return;
    // }

    const currentTimestamp = Date.now();
    const deltaTime = (currentTimestamp - lastTimestamp) / 1000; // Time in seconds
    lastTimestamp = currentTimestamp;

    // Calculate power in watts (P = V × I)
    const power = volts * amps;

    // Calculate energy in kWh (Energy = (P × Time) / 3600)
    const energy = (power * deltaTime) / 3600;

    // Update cumulative energy
    cumulativeEnergy += energy;

    console.log(`Power: ${power.toFixed(2)} W, Energy: ${energy.toFixed(4)} kWh, Cumulative Energy: ${cumulativeEnergy.toFixed(4)} kWh`);

    // Save cumulative kWh to MongoDB
    const energyData = new EnergyData({ kWh: cumulativeEnergy });
    energyData
      .save()
      .then(() => console.log(`Saved kWh data: ${cumulativeEnergy.toFixed(4)} kWh`))
      .catch((err) => console.error("Error saving data:", err));
  } catch (err) {
    console.error("Error parsing message:", err);
  }
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});

client.on('close', () => {
  console.log('Disconnected from Adafruit IO');
});
