
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

module.exports=parser;