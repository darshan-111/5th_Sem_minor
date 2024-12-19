import React, { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

const LiveData = () => {
  const [volts, setVolts] = useState(null);
  const [amps, setAmps] = useState(null);
  const [watts, setWatts] = useState(null);
  const [relayState, setRelayState] = useState(false); // Track relay state
  const relayTopic = `Darshan_11/feeds/volts`;

  const client = useRef(null);
 
    
  const aioUsername = "Darshan_11";
  const aioKey = "aio_mtTG07jaRXvmmoarjGvsk6rAZsNr";
  
  const topic = `Darshan_11/feeds/amps`;

  useEffect(() => {
    // MQTT connection options
    const options = {
      username: aioUsername,
      password: aioKey,
      keepalive: 60,
    };

    // Connect to the Adafruit IO MQTT broker
    // const client.current = mqtt.connect('wss://io.adafruit.com:443', options);
    client.current = mqtt.connect('wss://io.adafruit.com:443', options);

    client.current.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.current.subscribe(topic, (err) => {
        if (!err) {
          console.log(`Subscribed to topic: ${topic}`);
        } else {
          console.error(`Failed to subscribe to topic: ${topic}`, err);
        }
      });
      client.current.subscribe(relayTopic, (err) => {
        if (!err) {
          console.log(`Subscribed to relay topic: ${relayTopic}`);
        } else {
          console.error(`Failed to subscribe to relay topic: ${relayTopic}`, err);
        }
      });

    });

    client.current.on('message', (receivedTopic, message) => {
      if (receivedTopic === topic) {
        try {
          const data = JSON.parse(message.toString());
          setVolts(data.volts);
          setAmps(data.amps);
          setWatts(data.volts * data.amps); // Calculate power
        } catch (err) {
          console.error('Error parsing MQTT message:', err);
        }
      }
      if (receivedTopic === relayTopic) {
        const relayState = message.toString() === 'ON';
        setRelayState(relayState);
      }
    });
   
    client.current.on('error', (err) => {
      console.error('MQTT connection error:', err);
    });

    client.current.on('close', () => {
      console.log('MQTT connection closed');
    });

    // Clean up on component unmount
    return () => {
      client.current.end();
    };
  }, [aioUsername, aioKey, topic]);

  const publishRelayState = (state) => {
    const message = state ? "ON" : "OFF";
    client.current.publish(relayTopic, message, (err) => {
      if (err) console.error('Failed to publish relay state:', err);
      else console.log(`Relay state published: ${message}`);
    });
  };
  const toggleRelay = () => {
    const newState = !relayState;
    setRelayState(newState); // Update UI state
    publishRelayState(newState); // Publish to MQTT
  };
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', border: '2px solid black', height: '40vh' , position: 'absolute', top: '15vh'
      , backgroundColor: 'rgb(47 44 96)'
     }}>
      <h2>Live Sensor Data</h2>
      <div style={{ fontSize: '1.5rem' ,color:'white' , marginTop:"20px" ,    fontFamily: "Nunito Sans", 
    fontsize: '15px',
    fontweight: 'bold'
 }}> 
        <p><strong>Volts:</strong> {volts !== null ? `${volts.toFixed(2)} V` : 'Loading...'}</p>
        <p><strong>Amps:</strong> {amps !== null ? `${amps.toFixed(2)} A` : 'Loading...'}</p>
        <p><strong>Watts:</strong> {watts !== null ? `${watts.toFixed(2)} W` : 'Loading...'}</p>
      </div>
      <button
  onClick={toggleRelay}
  style={{
    padding: '10px 20px',
    fontSize: '1rem',
    marginTop: '30px',
    cursor: 'pointer',
    backgroundColor: relayState ? '#4CAF50' : '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  }}
>
  {relayState ? 'Turn Relay OFF' : 'Turn Relay ON'}
</button>

    </div>
  );
};

export default LiveData;
