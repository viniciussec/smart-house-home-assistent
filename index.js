
let file = require("./ambient.json");

const fs = require("fs");
let content = JSON.parse(fs.readFileSync("./ambient.json", "utf8"));
content.temperature = 29;
fs.writeFileSync("./ambient.json", JSON.stringify(content));
