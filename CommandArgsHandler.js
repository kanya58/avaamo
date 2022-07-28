/**
 * Class to handle command line arguments
 */
module.exports = class CommandArgsHandler {
    constructor(args) {
        this.args = this.getUserArgs(args)[0];
    }

    getUserArgs(args) {
        return args.slice(2);
    }

    validateArgs() {
        const key = this.args.split('=')[0];
        // Using switch to handle if more params to search, better clarity than if/else
        switch (key) {
            case 'word':
                return true;
            default:
                return false;
        }
    }

    getUserSearchWord() {
        return this.args.split('=')[1];
    }
}