const fs       = require("fs");
const readline = require("readline");
const stream   = require("stream");

let input  = fs.createReadStream('_chat.txt');
let output = new stream;

let rLine = readline.createInterface(input, output);
let list = [];

rLine.on('line', line => {
  // If the line doesn't start with a '[', we assume
  // it's a body break and join it with last line
  if (line[0] !== '[') {
    const lastLineIdx = list.length - 1;
    const lastLine    = list[lastLineIdx];
    list[lastLineIdx] = `${lastLine} ${line}`;
  } else {
    list.push(line);
  }
});

rLine.on('close', () => {
  console.log(convertToJSON(list));
  return list;
});

function convertToJSON(msgList) {
  return msgList.map(msg => {
    let splitMsg = msg.split(/\[(.*?)\]/);
    splitMsg.shift();

    if (splitMsg.length) {
      let datetime = splitMsg[0].split(", ");
      let text     = splitMsg[1].split(/^(.*?):/);
      let author;
      let message;

      if (text.length > 1) {
        text.shift();
        author  = text[0].trim();
        message = text[1].trim();
      } else {
        message = text[0].trim();
      }

      return {
        date: datetime[0],
        time: datetime[1],
        author,
        message
      };
    }
  });
}