#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "Ulala";
const char* password = "qwertyuiop";

// GANTI IP INI SESUAI LAPTOP ANDA
const char* serverName = "https://iot-rouge-chi.vercel.app/api/sensor";

// Definisi 3 Pin Sensor (Gunakan Pin ADC1 agar aman saat WiFi on)
#define pinSoil1 32
#define pinSoil2 33
#define pinSoil3 34

void setup() {
  Serial.begin(9600);
  pinMode(pinSoil1, INPUT);
  pinMode(pinSoil2, INPUT);
  pinMode(pinSoil3, INPUT);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");
}

int getPercentage(int pin) {
  int val = analogRead(pin);
  // Mapping: 4095 (Kering), 1100 (Basah) -> Sesuaikan jika perlu kalibrasi
  int percent = map(val, 4095, 1100, 0, 100);
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;
  return percent;
}

void loop() {
  if(WiFi.status()== WL_CONNECTED){
    HTTPClient http;

    // Baca ke-3 sensor
    int s1 = getPercentage(pinSoil1);
    int s2 = getPercentage(pinSoil2);
    int s3 = getPercentage(pinSoil3);

    Serial.printf("S1: %d%% | S2: %d%% | S3: %d%%\n", s1, s2, s3);

    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    // Buat JSON String: {"s1": 50, "s2": 60, "s3": 70}
    String httpRequestData = "{\"s1\":" + String(s1) + 
                             ", \"s2\":" + String(s2) + 
                             ", \"s3\":" + String(s3) + "}";

    int httpResponseCode = http.POST(httpRequestData);
    
    // Cek error
    if (httpResponseCode > 0) {
      Serial.print("Response: "); Serial.println(httpResponseCode);
    } else {
      Serial.print("Error sending POST: "); Serial.println(httpResponseCode);
    }
    http.end();
  }
  delay(2000);
}