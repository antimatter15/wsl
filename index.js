#!/usr/bin/env node

const getPort = require('get-port');
const WebSocket = require('ws');
const argv = require('yargs')
    .describe('binary', 'Pipe contents as binary websockets')
    .boolean('binary')
    .describe('port', 'Listen on particular port')
    .default('port', 43110)
    .argv

var buffer = [],
    wss = null,
    stdinClosed = false;

getPort({ port: parseInt(argv.port) }).then(port => {
    wss = new WebSocket.Server({ port: port });
    process.stdout.write('# Broadcasting (' + (argv.binary ? 'binary' : 'utf8') + ') to ws://localhost:' + port + '/\n')

    wss.on('connection', function connection(ws) {
        for(let i = 0; i < buffer.length; i++){
            ws.send(buffer[i])
        }
        if(stdinClosed) ws.close();
    });
})

if(!argv.binary) process.stdin.setEncoding('utf8'); 

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        buffer.push(chunk);
        if(wss) {
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(chunk)
                }
            });
        }
        process.stdout.write(chunk);
    }
});

process.stdin.on('end', () => {
    stdinClosed = true;
    if(buffer.length == 0){
        process.stdout.write('# stdin closed before sending any data\n')
    }
    if(wss){
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.close();
            }
        });    
    }
});
