//CLUSTER MODE
// process.env.UV_THREADPOOL_SIZE = 1
// const cluster = require('cluster');

// //check if first server
// if (cluster.isMaster) {
//     //initaite another in child mode server
//     cluster.fork();
// } else {
//     const crypto = require('crypto');
//     const express = require('express');
//     const app = express();

//     app.get('/', (req, res) => {
//         crypto.pbkdf2('a', 'b', 10000, 512, 'sha512', () => {
//             res.send('Cluster Testing')
//         })

//     })

//     app.listen(3000);
// }

//PM2
//pm2 start server.js -i 0
//pm2 list
//pm2 monit
//pm2 show server
//pm2 delete server
const crypto = require('crypto');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    crypto.pbkdf2('a', 'b', 10000, 512, 'sha512', () => {
        res.send('Cluster Testing')
    })

})

app.listen(3000);