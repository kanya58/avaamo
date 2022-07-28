const fs = require('fs');

/**
 * Class to handle File related operations
 */
module.exports = class FileHandler {
    constructor() { }

    writeFileSync(fileName, data) {
        console.log(`Writing output to file: ${fileName}`);
        fs.writeFileSync(fileName, data)
    }

    /**
     *
     * @param {*} fileName
     * @param {*} encoding
     * @returns Promise<any>
     */
    readFileAsync(fileName, encoding) {
        console.log(`Reading file: ${fileName}`);
        return new Promise((resolve, reject) => {

            fs.readFile(fileName, encoding, (error, data) => {
                if (error) {
                    reject('Error');
                    return;
                }
                resolve(data)
            })
        })
    }
}
