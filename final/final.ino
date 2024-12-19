#include <ZMPT101B.h>

#include <ACS712.h>

#include <WiFi.h>
#include <PubSubClient.h>
#define SENSITIVITY 500.0f

ACS712 Csensor(32, 3.3 , 4092, 185);
ZMPT101B Vsensor(33, 50);
// WiFi credentials
const char* ssid = "Sagare Home";
const char* password = "Spiritdeecstacy@23";

// Adafruit IO credentials
const char* mqttServer = "io.adafruit.com";
const int mqttPort = 1883;
const char* aio_username = "Darshan_11";
const char* aio_key = "aio_mtTG07jaRXvmmoarjGvsk6rAZsNr";
const char* amps_topic = "Darshan_11/feeds/amps"; // Combined feed 
const char* relayTopic = "Darshan_11/feeds/volts";

WiFiClient espClient;
PubSubClient client(espClient);
const int relayPin = 2;
void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.println(topic);

  String msg = "";
  for (int i = 0; i < length; i++) {
    msg += (char)message[i];
  }
  Serial.println("Message: " + msg);

  if (String(topic) == relayTopic) {
    if (msg == "ON") {
      digitalWrite(relayPin, HIGH); // Turn relay ON
      Serial.println("Relay turned ON");
    } else if (msg == "OFF") {
      digitalWrite(relayPin, LOW); // Turn relay OFF
      Serial.println("Relay turned OFF");
    }
  }
}


void setup() {
  Serial.begin(115200);
  Csensor.autoMidPoint();
  Vsensor.setSensitivity(SENSITIVITY);
  pinMode(relayPin, OUTPUT);
digitalWrite(relayPin, HIGH); // Ensure relay is OFF initially
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  // Configure MQTT
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  reconnect();
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Connecting to MQTT...");
    if (client.connect("ESP32Client", aio_username, aio_key)) {
      Serial.println("Connected to MQTT broker");
      
      // if(client.subscribe("Darshan_11/feeds/volts")){
      //   Serial.println("Subscibed to volts");

      // }

    } else {
      Serial.print("Failed with state ");
      Serial.println(client.state());
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {

    reconnect();
  
  }
  client.loop();

  // Simulate sensor readings
  float volts = Vsensor.getRmsVoltage(2);
  float amps = Csensor.mA_AC_sampling(50,2);
  

  // Create JSON payload
  String payload = "{";
  payload += "\"volts\": " + String(volts, 2) + ",";
  payload += "\"amps\": " + String(amps/1000, 2);
  payload += "}";

  // Publish JSON payload
  if (client.publish(amps_topic, payload.c_str())) {
    Serial.println("Published: " + payload);
  } else {
    Serial.println("Publish failed");
  }

  delay(2000); // Delay to avoid rate limits
}
