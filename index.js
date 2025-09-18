const WebSocket = require("ws");
const fs = require("fs");

// 📌 Random phone generator (09xxxxxxxxx → 11 digits)
function generatePhones(count) {
  const phones = [];
  for (let i = 0; i < count; i++) {
    let number = "09";
    for (let j = 0; j < 9; j++) {
      number += Math.floor(Math.random() * 10);
    }
    phones.push(number);
  }
  return phones;
}

// ✨ 50 ဖုန်းနံပါတ် generate
const phones = generatePhones(50);

// emoji / texts data
const rawData = fs.readFileSync("emojis.json", "utf8");
const texts = JSON.parse(rawData).texts;

// 📡 WebSocket connect for each phone
phones.forEach((phoneNumber) => {
  const wsUrl = `ws://157.230.248.156:3100/chat?phone=${phoneNumber}`;
  const ws = new WebSocket(wsUrl);

  ws.on("open", () => {
    console.log(`✅ Connected: ${phoneNumber}`);
    let count = 0;

    // auto spam every 300ms
    setInterval(() => {
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      const message = {
        type: "chat",
        from: "Ko Hlaing",
        text: randomText,
        timestamp: new Date().toISOString(),
        isVip: false,
      };
      ws.send(JSON.stringify(message));
      console.log(`[${phoneNumber}] Sent ${++count}: ${randomText}`);
    }, 900);
  });

  ws.on("message", (data) => {
    console.log(`[${phoneNumber}] Received: ${data.toString()}`);
  });

  ws.on("close", () => {
    console.log(`❌ Disconnected: ${phoneNumber}`);
  });

  ws.on("error", (err) => {
    console.error(`[${phoneNumber}] Error:`, err.message);
  });
});
