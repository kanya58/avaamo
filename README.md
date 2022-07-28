# AVAAMO ASSIGNMENT

This is a project created for Avaamo assignment

## Installation

Clone or download zip.

## Folder Structure

This project has a simple folder structure, nothing complex.
There are 6 files having 5 different classes and 1 constants file.
Main file is index.js(also entry file).

- **CommandArgsHandler.js** - Contains code for handling arguments passed via commandLine.
- **FileHandler.js** - Contains code for handling `fs module` related code.
- **HTTPHandler.js** - Contains code for handling HTTP related operations, uses core `http module`.
- **Helper.js** - Contains helper code does not conform to any contracts.
- **index.js** - Contains code for main program.
- **constants.js** - Contains certain constants.

## Usage

Does not require any additional library except [nodejs](https://nodejs.org) setup on local
Go to the folder and run

```bash
npm run program word=yourArgs
```

- `npm run program` is a **_package.json_** script. `word=yourArgs` is a parameter you pass to script to search in downloaded document
- Replace `yourArgs` with any word you want to search from the downloaded document.

## How it works

- Initially the arguments passed via command line are validated and stored
- We make http `get` request to url [http://norvig.com/big.txt](http://norvig.com/big.txt).
- The data from the above request is stored in a local file **bigText.txt** synchronously.
- We then read the data and do couple of operations
  1. Count the frequency of the parameter `word` passed by user.
  2. Count the frequency of all the words.
- After calculating frequencies of all words in doc we filter the top 10 words by frequency.
- After filtering top 10 words, we make a http `get` request to [https://dictionary.yandex.net/api/v1/dicservice.json/lookup](https://dictionary.yandex.net/api/v1/dicservice.json/lookup) for all the top 10 words.
- We keep the lang as `en-ru` as I found `en-en` has lesser data to evaluate/analyze.
- We the serialize(convert) the data in required format and store it in another file **final.json** in `JSON` format.

## Outputs

- The 3 main outputs:
  1. User given word search is logged in console while program is running.
  2. The downloaded file **bigText.txt** is created and stored in the same folder.
  3. The final formatted data is stored in **final.json**, which will be created in the same folder.

* Go to the **_final.json_** file to see the final output required.

```txt

## Question statement:
Note - This exercise needs to be taken using Node/Javascript only.
1. Fetch document from given url http://norvig.com/big.txt
2. Analyse the document using asynchronous mechanism, fetched in step 1

a. Find occurrences count of word in document
b. Collect details for top 10 words(order by word Occurrences) from
https://dictionary.yandex.net/api/v1/dicservice.json/lookup, check details of
API given below
i. synonyms/means
ii. part Of Speech/pos

3. Show words list in JSON format for top 10 words.
a. Word: text
b. Output
i. Count of Occurrence in that Particular Document
ii. Synonyms
iii. Pos

API Details
API: https://dictionary.yandex.net/api/v1/dicservice.json/lookup
Documentation:
https://tech.yandex.com/dictionary/doc/dg/reference/lookup-docpage/


```
