const { API_KEY, yandexBaseURL } = require('./constants');

/** Helper class */
module.exports = class Helper {
    constructor() { }

    countWord(data, wordToCount) {
        let count = 0;
        const searchString = wordToCount;
        const searchStrLen = searchString.length;
        let startIndex = 0;
        let index;

        while ((index = data.indexOf(searchString, startIndex)) > -1) {
            count++;
            startIndex = index + searchStrLen
        }

        return count;
    }

    countFrequncy(data) {
        const wordCount = {};
        // splitting string into array so it makes it easy to count
        const words = data.split(' ');

        // Looping through array to count frequency
        words.forEach((word) => {
            // Ignoring empty spaces
            if (!(word == '')) {
                if (!wordCount[word]) {
                    wordCount[word] = 0;
                }
                wordCount[word]++;
            }
        })


        // sort descending, sort and return top 10
        const wordObj = Object.entries(wordCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => ({ [k]: v }));
        return wordObj;
    }

    generateUrlKey(arr) {
        // arr.flatMap(Object.keys)
        return Object.keys(Object.assign({}, ...arr));
    }

    createURL(text) {
        return `${yandexBaseURL}?key=${API_KEY}&lang=en-ru&text=${text}`
    }

    promisifyRequests(urlArr, httpHandler) {
        const requests = urlArr.map((keyWord) => {
            return httpHandler.getHTTPs(this.createURL(keyWord), true /** getParsed */);
        });
        return requests;
    }

    serializeData(data, freqMap, urlKeys) {
        const finalArray = data.map((wordRes, i) => {
            return this.formattedData(wordRes, freqMap, urlKeys, i);
        })
        return finalArray;
    }

    // Would have been easier with proper interface, yandex does not give one
    formattedData(wordRes, freqMap, urlKeys, index) {
        const wordDetail = {};
        const def = wordRes['def'];
        const firstEle = def[0];
        let text, syn, pos;
        if (firstEle) {
            text = firstEle['text'];
            if (firstEle['tr'] && firstEle['tr'][0]) {
                syn = firstEle['tr'][0]['syn'];
            } else {
                syn = 'not found';
            }
            pos = def[0]['pos']
        } else {
            text = urlKeys[index];
            syn = 'not found'
            pos = 'not found'
        }



        wordDetail['Word'] = text;
        wordDetail['Output'] = {
            'Count': freqMap[text],
            'Synonyms': syn || 'not found',
            'POS': pos || 'not found'
        }
        return wordDetail;
    }

    stringify(obj) {
        return JSON.stringify(obj);
    }
}