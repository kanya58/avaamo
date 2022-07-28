const http = require('http');
const https = require('https');

/**
 * Class to handle HTTP and HTTPS operations
 */
module.exports = class HTTPRequestHandler {
    constructor() { }

    getRequest(url, getParsed, cb) {
        // We return a promise to be sure data is fetched async
        return new Promise((resolve, reject) => {
            http.get(url, (res) => {
                const { statusCode } = res;

                // If error, reject promise with new Error
                if (statusCode !== 200) {
                    reject(new Error(`Status Code: ${statusCode}`));
                }

                // Set encoding
                res.setEncoding('utf8');
                // variable to collect chunck data
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });

                // Once the end is reached, proceed to resolve promise with data
                res.on('end', () => {
                    if (getParsed) {
                        resolve(JSON.parse(rawData));
                    } else {
                        resolve(rawData);
                    }
                    // If passed a cb, call it(maybe used for log purposes)
                    cb ? cb() : null;
                });
            }).on('error', (e) => {
                reject(new Error(`Get Error: ${e.message}`));
            })
        })
    }

    getHTTPs(url, getParsed, cb) {
        // We return a promise to be sure data is fetched async
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                const { statusCode } = res;

                // If error, reject promise with new Error
                if (statusCode !== 200) {
                    reject(new Error(`Status Code: ${statusCode}`));
                }

                // Set encoding
                res.setEncoding('utf8');
                // variable to collect chunck data
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; });

                // Once the end is reached, proceed to resolve promise with data
                res.on('end', () => {
                    if (getParsed) {
                        resolve(JSON.parse(rawData));
                    } else {
                        resolve(rawData);
                    }
                    // If passed a cb, call it(maybe used for log purposes)
                    cb ? cb() : null;
                });
            }).on('error', (e) => {
                reject(new Error(`Get Error: ${e.message}`));
            })
        })
    }

    getAllSettled(requests) {
        let fullfilled = requests.map((p) => {
            return p.then((val) => val).catch(e => e);
        })

        return Promise.all(fullfilled);
    }
}