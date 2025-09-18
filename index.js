const WebSocket = require("ws");
const fs = require("fs");

const phones = [
  "09693215491",
  "09690602638",
  "09690602638",
  "09668737128"
];

const rawData = fs.readFileSync("emojis.json", "utf8");
const texts = JSON.parse(rawData).texts;

phones.forEach((phoneNumber) => {
  const wsUrl = `ws://157.230.248.156:3100/chat?phone=${phoneNumber}`;
  const ws = new WebSocket(wsUrl);

  ws.on("open", () => {
    console.log(`Connected ✅ ${phoneNumber}`);
    let count = 0;
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
    }, 300);
  });

  ws.on("message", (data) => {
    console.log(`[${phoneNumber}] Received: ${data.toString()}`);
  });

  ws.on("close", () => {
    console.log(`[${phoneNumber}] Connection closed ❌`);
  });

  ws.on("error", (err) => {
    console.error(`[${phoneNumber}] Error:`, err.message);
  });
});
