const HTTPRequestHandler = require('./HTTPHandler');
const FileHandler = require('./FileHandler');
const CommandArgsHandler = require('./CommandArgsHandler');
const Helper = require('./Helper');

const { bigTextUrl, FILE_NAME } = require('./constants');

// Entry class
class Main {
    FILE_DIR = `${__dirname}/${FILE_NAME}`;
    userWordToCount = '';
    // Count of word passed by user
    countedUserWord = '';
    // Will have top 10 words with freq in array form
    freqMapOfWords = [];
    // Will have top 10 words with freq in Object form
    freqMap = {};
    urlKeys = [];

    constructor(commandHandler, httpHandler, fileHandler) {
        this.commandHandler = commandHandler;
        this.httpHandler = httpHandler;
        this.fileHandler = fileHandler;
        // Tightly coupling helper class as it is ad-hoc class and won't satisfy any particular contract
        this.helper = new Helper();
    }

    run() {
        const isValid = this.commandHandler.validateArgs();
        if (isValid) {
            this.userWordToCount = this.commandHandler.getUserSearchWord();
            this.fetchFileData().then((data) => {
                // save to file
                this.saveToFile(data);
            });
        } else {
            throw new Error('Invalid argument, available commands are ["word"]. Use word=yourArgs');
        }
    }

    fetchFileData() {
        return new Promise((resolve, reject) => {
            this.httpHandler.getRequest(bigTextUrl, false /**getParsed */).
                then((res) => {
                    resolve(res);
                }).catch((e) => {
                    reject(e);
                })
        })
    }

    saveToFile(data) {
        // This is a sync operation as we will read from local later for other calculations
        console.log('Data loaded... Writing to local files synchronously');
        this.fileHandler.writeFileSync(FILE_NAME, data);
        console.log('Written to file successfully');

        // Once reading from file is complete, count the word
        this.readFileToCountUserGivenWord().then((res) => {
            // Once File is completed reading, do the job
            this.countWord(res);
            this.countTopTenWords(res);
            this.doDictOperation();
        });
    }

    countWord(fileData) {
        console.log(`Counting occurences of user given word ${this.userWordToCount}`);
        this.countedUserWord = this.helper.countWord(fileData, this.userWordToCount);
        console.log(`Counted word: ${this.userWordToCount} :  ${this.countedUserWord}`);
    }

    countTopTenWords(fileData) {
        console.log(`Counting top 10 words in document by frequency`);
        this.freqMapOfWords = this.helper.countFrequncy(fileData);
        this.freqMap = Object.assign({}, ...this.freqMapOfWords);
        console.log(`Counted top 10 words : ${JSON.stringify(this.freqMapOfWords)} `);
    }

    // Returns a placeholder promise for file reading(sort of caching)
    readFileToCountUserGivenWord() {
        let wordCountPromise = null;
        if (this.userWordToCount && !wordCountPromise) {
            wordCountPromise = this.fileHandler.readFileAsync(this.FILE_DIR, "UTF-8")
        }
        return wordCountPromise;
    }

    doDictOperation() {
        this.urlKeys = this.helper.generateUrlKey(this.freqMapOfWords);
        const promisifyRequests = this.helper.promisifyRequests(this.urlKeys, this.httpHandler);
        this.getResponsesOfAllRequests(promisifyRequests).then((res) => {
            const serialized = this.serializeData(res);
            this.fileHandler.writeFileSync('final.json', serialized);
            console.log('Done all,Exiting...');
        });
    }

    serializeData(res) {
        const serializedData = this.helper.serializeData(res, this.freqMap, this.urlKeys);
        const stringifiedData = this.helper.stringify(serializedData);
        return stringifiedData;
    }

    getResponsesOfAllRequests(requests) {
        // send promisifed requests to get settled data
        return this.httpHandler.getAllSettled(requests);
    }
}

// These handlers will satisfy certain contracts(interfaces) in real scenarios,
// So they can be replaced with some handlers doing same job
const commandHandler = new CommandArgsHandler(process.argv);
const httpHandler = new HTTPRequestHandler();
const fileHandler = new FileHandler();
const main = new Main(commandHandler, httpHandler, fileHandler);
main.run();