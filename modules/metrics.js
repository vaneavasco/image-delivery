const config = require('../config');
const StatsD = require('node-statsd');
const dns = require('dns');

let statsdClient = new StatsD(config.metrics.host, config.metrics.port);
// dns.lookup(config.metrics.host, (err) => {
//     if(err) {
//         statsdClient = new StatsD();
//     }
// });
// statsdClient = new StatsD();

let increment = (stat) => {
    try {
        statsdClient.increment(stat);
    } catch (e) {

    }
};

module.exports = {
    increment
};