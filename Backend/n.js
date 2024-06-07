const net = require('net');

const ports = [587, 465, 25];
const host = 'smtp.gmail.com';

ports.forEach(port => {
    const client = new net.Socket();
    client.connect(port, host, () => {
        console.log(`Connected to ${host} on port ${port}`);
        client.destroy();
    });

    client.on('error', (err) => {
        console.error(`Connection error on port ${port}:`, err);
    });
});
