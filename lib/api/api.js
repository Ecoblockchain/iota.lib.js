var apiCommands = require('./apiCommands')
var makeRequest = require('../utils/makeRequest')
var errors = require('../errors/inputErrors');
var inputValidator = require('../utils/inputValidator');
var Curl = require("../crypto/curl");
var Converter = require("../crypto/converter");
var Signing = require("../crypto/signing");
var Bundle = require("../crypto/bundle");
var Utils = require("../utils/utils");
var async = require("async");


/**
*  Making API requests, including generalized wrapper functions
**/
function api(provider) {
    this.makeRequest = provider;
}

/**
*   General function that makes an HTTP request to the local node
*
*   @method sendCommand
*   @param {object} command
*   @param {function} callback
*   @returns {object} success
**/
api.prototype.sendCommand = function(command, callback) {

    this.makeRequest.send(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method attachToTangle
*   @param {string} trunkTransaction
*   @param {string} branchTransaction
*   @param {integer} minWeightMagnitude
*   @param {array} trytes
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.attachToTangle = function(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) {

    // inputValidator: Check if correct hash
    if (!inputValidator.isHash(trunkTransaction)) {

        throw errors.invalidTrunkOrBranch(trunkTransaction);
    }

    // inputValidator: Check if correct hash
    if (!inputValidator.isHash(branchTransaction)) {

        throw errors.invalidTrunkOrBranch(branchTransaction);
    }

    // inputValidator: Check if int
    if (!inputValidator.isInt(minWeightMagnitude)) {

        throw errors.notInt();
    }

    // inputValidator: Check if array of trytes
    if (!inputValidator.isArrayOfTrytes(trytes)) {

        throw errors.invalidTrytes();
    }


    var command = apiCommands.attachToTangle(trunkTransaction, branchTransaction, minWeightMagnitude, trytes)

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method findTransactions
*   @param {object} searchValues
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.findTransactions = function(searchValues, callback) {

    // If not an object, throw error
    if (!inputValidator.isObject(searchValues)) {
        throw errors.invalidKey();
    }

    // Get search key from input object
    var searchKeys = Object.keys(searchValues);
    var availableKeys = ['bundles', 'addresses', 'tags', 'approvees'];

    searchKeys.forEach(function(key) {
        if (availableKeys.indexOf(key) === -1) {

            throw errors.invalidKey();
        }


        var hashes = searchValues[key];

        // If tags, append to 27 trytes
        if (key === 'tags') {

            hashes.forEach(function(hash) {

                // Simple padding to 27 trytes
                while (hash.length < 27) {
                    hash += '9'
                }

                // validate hashes
                if (!inputValidator.isTrytes(hash, 27)) {

                    throw errors.invalidTrytes();
                }
            })

            // Reassign padded tags so that it can be used for findTransactions
            searchValues[key] = hashes;
        } else {

            // Check if correct array of hashes
            if (!inputValidator.isArrayOfHashes(hashes)) {

                throw errors.invalidTrytes();
            }
        }


    })

    var command = apiCommands.findTransactions(searchValues);

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method getBalances
*   @param {array} addresses
*   @param {int} threshold
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.getBalances = function(addresses, threshold, callback) {

    // Check if correct transaction hashes
    if (!inputValidator.isArrayOfHashes(addresses)) {

        throw errors.invalidTrytes();
    }

    var command = apiCommands.getBalances(addresses, threshold);

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method getInclusionStates
*   @param {array} transactions
*   @param {array} tips
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.getInclusionStates = function(transactions, tips, callback) {

    // Check if correct transaction hashes
    if (!inputValidator.isArrayOfHashes(transactions)) {

        throw errors.invalidTrytes();
    }

    // Check if correct tips
    if (!inputValidator.isArrayOfHashes(tips)) {

        throw errors.invalidTrytes();
    }

    var command = apiCommands.getInclusionStates(transactions, tips);

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method getNodeInfo
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.getNodeInfo = function(callback) {

    var command = apiCommands.getNodeInfo();

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method getNeighbors
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.getNeighbors = function(callback) {

    var command = apiCommands.getNeighbors();

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method addNeighbors
*   @param {Array} uris List of URI's
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.addNeighbors = function(uris, callback) {

    var command = apiCommands.addNeighbors();

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method removeNeighbors
*   @param {Array} uris List of URI's
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.removeNeighbors = function(uris, callback) {

    var command = apiCommands.removeNeighbors();

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method getTips
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.getTips = function(callback) {

    var command = apiCommands.getTips();

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method getTransactionsToApprove
*   @param {int} depth
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.getTransactionsToApprove = function(depth, callback) {

    var command = apiCommands.getTransactionsToApprove(milestone);

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method getTrytes
*   @param {array} hashes
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.getTrytes = function(hashes, callback) {

    if (!inputValidator.isArrayOfHashes(hashes)) {

        throw errors.invalidTrytes();
    }

    var command = apiCommands.getTrytes(hashes);

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method interruptAttachingToTangle
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.interruptAttachingToTangle = function(callback) {

    var command = apiCommands.interruptAttachingToTangle

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method broadcastTransactions
*   @param {array} trytes
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.broadcastTransactions = function(trytes, callback) {

    if (!inputValidator.isArrayOfAttachedTrytes(trytes)) {

        throw errors.invalidAttachedTrytes();
    }

    var command = apiCommands.broadcastTransactions(trytes);

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}

/**
*   @method storeTransactions
*   @param {array} trytes
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.storeTransactions = function(trytes, callback) {

    if (!inputValidator.isArrayOfAttachedTrytes(trytes)) {

        throw errors.invalidAttachedTrytes();
    }

    var command = apiCommands.storeTransactions(trytes);

    this.sendCommand(command, function(error, success) {

        if (callback) {
            return callback(error, success)
        } else {
            return success;
        }
    })
}



/*************************************

WRAPPER FUNCTIONS

**************************************/

/**
*   Broadcasts and stores transaction trytes
*
*   @method broadcastAndStore
*   @param {array} trytes
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.broadcastAndStore = function(trytes, callback) {

    var self = this;

    self.broadcastTransactions(trytes, function(error, success) {

        if (!error) {

            self.storeTransactions(trytes, function(error, stored) {

                // TODO Better error checking

                if (callback) {
                    return callback(error, stored)
                } else {
                    return success;
                }
            })
        }
    })
}

/**
*   Wrapper function for getTrytes and transactionObjects
*   gets the trytes and transaction object from a list of transaction hashes
*
*   @method getTransactionsObjects
*   @param {array} hashes
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.getTransactionsObjects = function(hashes, callback) {

    // If not array of hashes, return error
    if (!inputValidator.isArrayOfHashes(hashes)) {
        return callback(errors.invalidInputs);
    }

    // get the trytes of the transaction hashes
    this.getTrytes(hashes, function(error, trytes) {

        if (error) return callback(error);

        var transactionObjects = [];

        // call transactionObjects for each trytes
        trytes.trytes.forEach(function(thisTrytes) {

            // If no trytes returned, simply push null as placeholder
            if (thisTrytes === null) {
                transactionObject.push(null);
            } else {
                transactionObjects.push(Utils.transactionObject(thisTrytes));
            }
        })

        return callback(null, transactionObjects);
    })
}

/**
*   Gets transactions to approve, attaches to Tangle, broadcasts and stores
*
*   @method sendTrytes
*   @param {array} trytes
*   @param {int} depth
*   @param {int} minWeightMagnitude
*   @param {function} callback
*   @returns {object} analyzed Transaction objects
**/
api.prototype.sendTrytes = function(trytes, depth, minWeightMagnitude, callback) {

    var self = this;

    // Get branch and trunk
    self.getTransactionsToApprove(depth, function(error, toApprove) {

        if (error) {
            return callback(error)
        }

        // attach to tangle - do pow
        self.attachToTangle(toApprove.trunkTransaction, toApprove.branchTransaction, minWeightMagnitude, trytes, function(error, attached) {
            if (error) {
                return callback(error)
            }

            // Broadcast and store tx
            self.broadcastAndStore(attached.trytes, function(error, success) {

                if (!error) {

                    Utils.transactionObject(attached.trytes, function(error, analyzed) {
                        return callback(null, analyzed);
                    })
                }
            })
        })
    })
}

/**
*   Prepares Transfer, gets transactions to approve
*   attaches to Tangle, broadcasts and stores
*
*   @method sendTrytes
*   @param {string} seed
*   @param {int} depth
*   @param {int} minWeightMagnitude
*   @param {array} transfer
*   @param {object} options
*   @param {function} callback
*   @returns {object} analyzed Transaction objects
**/
api.prototype.sendTransfer = function(seed, depth, minWeightMagnitude, transfer, options, callback) {

    var self = this;

    if (!inputValidator.isTransfersArray(transfer)) {

        throw errors.invalidTrytes()
    }

    self.prepareTransfers(seed, transfers, options, function(error, trytes) {

        if (error) {
            return callback(error)
        }

        self.sendTrytes(trytes, depth, minWeightMagnitude, callback);
    })
}

/**
*   Replays a transfer by doing Proof of Work again
*
*   @method replayTransfer
*   @param {string} tail
*   @param {function} callback
*   @returns {object} analyzed Transaction objects
**/
api.prototype.replayTransfer = function(tail, callback) {

    var self = this;
    self.getBundle(tail, function(error, bundle) {

        if (error) return callback(error);

        // Get the trytes of all the bundle objects
        var bundleTrytes = [];
        bundle[0].forEach(function(bundleTx) {
            bundleTrytes.push(Utils.transactionTrytes(bundleTx));
        })

        self.sendTrytes(bundleTrytes.reverse(), callback);
    })
}


/**
*   Generates a new address
*
*   @method newAddress
*   @param {string} seed
*   @param {int} index
*   @param {bool} checksum
*   @returns {String} address Transaction objects
**/
api.prototype._newAddress = function(seed, index, checksum) {

    var key = Signing.key(Converter.trits(seed), index, 2);
    var digests = Signing.digests(key);
    var addressTrits = Signing.address(digests);
    var address = Converter.trytes(addressTrits)

    if (checksum) {
        address = Utils.getChecksum(address);
    }

    return address;
}

/**
*   Generates a new address either deterministically or index-based
*
*   @method getNewAddress
*   @param {string} seed
*   @param {object} options
*       @property {int} index Key index to start search from
*       @property {bool} checksum
*       @property {int} total Total number of addresses to return
*       @property {bool} returnAll return all searched addresses or not
*   @param {function} callback
*   @returns {array} address List of addresses
**/
api.prototype.getNewAddress = function(seed, options, callback) {

    var self = this;

    // If no options provided, switch arguments
    if (arguments.length === 2 && Object.prototype.toString.call(options) === "[object Function]") {
        callback = options;
        options = {};
    }

    var index = options.index || 0;
    var checksum = options.checksum || false;
    var total = options.total || null;
    var allAddresses = [];


    // Case 1: total
    //
    // If total number of addresses to generate is supplied, simply generate
    // and return the list of all addresses
    if (total) {

        // Increase index with each iteration
        for (var i = 0; i < total; i++, index++) {

            var address = self._newAddress(seed, index, checksum);
            allAddresses.push(address);
        }

        return callback(null, allAddresses);
    }
    //  Case 2: no total provided
    //
    //  Continue calling findTransactions to see if address was already created
    //  if null, return list of addresses
    //
    else {

        async.doWhilst(function(callback) {
            // Iteratee function

            var newAddress = self._newAddress(seed, index, checksum);

            self.findTransactions({'addresses': Array(newAddress)}, function(error, transactions) {

                if (error) {
                    return callback(error);
                }
                callback(null, newAddress, transactions)
            })

        }, function(address, transactions) {
            // Test function with validity check

            if (options.returnAll) {
                allAddresses.push(address)
            }

            // Increase the index
            index += 1;

            // Validity check
            return transactions.hashes.length > 0;
        }, function(err, address) {
            // Final callback

            if (err) {
                return callback(err);
            } else {

                // If returnAll, return list of allAddresses
                // else return the last address that was generated
                var addressToReturn = options.returnAll ? allAddresses : Array(address);

                return callback(null, addressToReturn);
            }
        })
    }
}

/**
*   Gets the inputs of a seed
*
*   @method getNewAddress
*   @param {string} seed
*   @param {object} options
*       @property {int} start Starting key index
*       @property {int} end Ending key index
*       @property {int} threshold Min balance required
*   @param {function} callback
**/
api.prototype.getInputs = function(seed, options, callback) {

    var self = this;

    // If no options provided, switch arguments
    if (arguments.length === 2 && Object.prototype.toString.call(options) === "[object Function]") {
        callback = options;
        options = {};
    }

    var start = options.start || 0;
    var end = options.end || null;
    var threshold = options.threshold || null;

    // If start value bigger than end, return error
    // or if difference between end and start is bigger than 500 keys
    if (start > end || end > (start + 500)) {
        return callback(new Error("Invalid inputs provided"))
    }

    //  Case 1: start and end
    //
    //  If start and end is defined by the user, simply iterate through the keys
    //  and call getBalances
    if (end) {

        var allAddresses = [];

        for (var i = start; i < end; i++) {

            var address = self._newAddress(seed, i, false);
            allAddresses.push(address);
        }

        getBalanceAndFormat(allAddresses);
    }
    //  Case 2: iterate till threshold || end
    //
    //  Either start from index: 0 or start (if defined) until threshold is reached.
    //  Calls getNewAddress and deterministically generates and returns all addresses
    //  We then do getBalance, format the output and return it
    else {

        self.getNewAddress(seed, {'index': start, 'returnAll': true}, function(error, addresses) {

            if (error) {
                return callback(error);
            } else {
                getBalanceAndFormat(addresses);
            }
        })
    }


    //  Calls getBalances and formats the output
    //  returns the final inputsObject then
    function getBalanceAndFormat(addresses) {

        self.getBalances(addresses, 100, function(error, balances) {

            var inputsObject = {
                'inputs': [],
                'totalBalance': 0
            };

            // If threshold defined, keep track of whether reached or not
            // else set default to true
            var thresholdReached = threshold ? false : true;

            for (var i = 0; i < addresses.length; i++) {

                var balance = parseInt(balances.balances[i]);

                if (balance > 0) {

                    var newEntry = {
                        'address': addresses[i],
                        'balance': balance,
                        'keyIndex': start + i
                    }

                    // Add entry to inputs
                    inputsObject.inputs.push(newEntry);
                    // Increase totalBalance of all aggregated inputs
                    inputsObject.totalBalance += balance;

                    if (threshold && inputsObject.totalBalance >= threshold) {

                        thresholdReached = true;
                        break;
                    }
                }
            }

            if (thresholdReached) {
                return callback(null, inputsObject);
            } else {
                return callback(new Error("Not enough balance"));
            }
        })
    }
}


/**
*   Prepares transfer by generating bundle, finding and signing inputs
*
*   @method prepareTransfers
*   @param {string} seed
*   @param {object} transfers
*   @param {object} options
*       @property {array} inputs Inputs used for signing. Needs to have correct keyIndex and address value
*       @property {string} address Remainder address
*   @param {function} callback
*   @returns {array} trytes Returns bundle trytes
**/
api.prototype.prepareTransfers = function(seed, transfers, options, callback) {

    var self = this;

    // If no options provided, switch arguments
    if (arguments.length === 3 && Object.prototype.toString.call(options) === "[object Function]") {
        callback = options;
        options = {};
    }

    // Input validation of transfers object
    if (!inputValidator.isTransfersArray(transfers)) {
        return callback(errors.invalidTransfers());
    }

    // If inputs provided, validate the format
    if (options.inputs && !inputValidator.isInputs(options.inputs)) {
        return callback(errors.invalidInputs());
    }

    var remainder = options.address || null;
    var chosenInputs = options.inputs || [];


    // Create a new bundle
    var bundle = new Bundle();

    var totalValue = 0;
    var signatureFragments = [];
    var tag;

    //
    //  Iterate over all transfers, get totalValue
    //  and prepare the signatureFragments, message and tag
    //
    for (var i = 0; i < transfers.length; i++) {

        var signatureMessageLength = 1;

        // If message longer than 2187 trytes, increase signatureMessageLength (add 2nd transaction)
        if (transfers[i].message.length > 2187) {

            // Get total length, message / maxLength (2187 trytes)
            signatureMessageLength += Math.floor(transfers[i].message.length / 2187);

            var msgCopy = transfers[i].message;

            // While there is still a message, copy it
            while (msgCopy) {

                var fragment = msgCopy.slice(0, 2187);
                msgCopy = msgCopy.slice(2187, msgCopy.length);

                // Pad remainder of fragment
                for (var j = 0; fragment.length < 2187; j++) {
                    fragment += '9';
                }

                signatureFragments.push(fragment);
            }
        } else {
            // Else, get single fragment with 2187 of 9's trytes
            var fragment = '';

            if (transfers[i].message) {
                fragment = transfers[i].message.slice(0, 2187)
            }

            for (var j = 0; fragment.length < 2187; j++) {
                fragment += '9';
            }

            signatureFragments.push(fragment);
        }

        // get current timestamp in seconds
        var timestamp = Math.floor(Date.now() / 1000);

        // If no tag defined, get 27 tryte tag.
        tag = transfers[i].tag ? transfers[i].tag : '999999999999999999999999999';

        // Pad for required 27 tryte length
        for (var j = 0; tag.length < 27; j++) {
            tag += '9';
        }

        // Add first entry to the bundle
        bundle.addEntry(signatureMessageLength, transfers[i].address, transfers[i].value, tag, timestamp)
        // Sum up total value
        totalValue += parseInt(transfers[i].value);
    }

    // Get inputs if we are sending tokens
    if (totalValue) {

        //  Case 1: user provided inputs
        //
        //  Validate the inputs by calling getBalances
        if (options.inputs) {

            // Get list if addresses of the provided inputs
            var inputsAddresses = [];
            options.inputs.forEach(function(inputEl) {
                inputsAddresses.push(inputEl.address);
            })

            self.getBalances(inputsAddresses, 100, function(error, balances) {

                var confirmedInputs = [];
                var totalBalance = 0;
                for (var i = 0; i < balances.balances.length; i++) {
                    var thisBalance = parseInt(balances.balances[i]);
                    totalBalance += thisBalance;

                    // If input has balance, add it to confirmedInputs
                    if (thisBalance > 0) {
                        var inputEl = options.inputs[i];
                        inputEl.balance = thisBalance;

                        confirmedInputs.push(inputEl);
                    }
                }

                // Return not enough balance error
                if (totalValue > totalBalance) {
                    return callback("Not enough balance");
                }

                signInputsAndReturn(confirmedInputs);
            });

        }

        //  Case 2: Get inputs deterministically
        //
        //  If no inputs provided, derive the addresses from the seed and
        //  confirm that the inputs exceed the threshold
        else {

            self.getInputs(seed, {'threshold': totalValue}, function(error, inputs) {

                // If inputs with enough balance
                if (!error) {

                    signInputsAndReturn(inputs.inputs);
                } else {

                    return callback(error);
                }
            })
        }
    } else {

        // If no input required, don't sign and simply finalize the bundle
        bundle.finalize();
        bundle.addTrytes(signatureFragments);

        var bundleTrytes = []
        bundle.bundle.forEach(function(tx) {
            bundleTrytes.push(Utils.transactionTrytes(tx))
        })

        return callback(null, bundleTrytes.reverse());
    }



    function signInputsAndReturn(inputs) {

        for (var i = 0; i < inputs.length; i++) {

            var thisBalance = inputs[i].balance;
            var toSubtract = 0 - thisBalance;
            var timestamp = Math.floor(Date.now() / 1000);

            // Add input as bundle entry
            bundle.addEntry(2, inputs[i].address, toSubtract, tag, timestamp);

            // If there is a remainder value
            // Add extra output to send remaining funds to
            if (thisBalance > totalValue) {

                var remainder = thisBalance - totalValue;

                // If user has provided remainder address
                // Use it to send remaining funds to
                if (remainder) {

                    // Remainder bundle entry
                    bundle.addEntry(1, remainder, remainder, tag, timestamp);
                } else {

                    // Generate a new Address by calling getNewAddress
                    self.getNewAddress(seed, {}, function(error, address) {

                        var timestamp = Math.floor(Date.now() / 1000);

                        // Remainder bundle entry
                        bundle.addEntry(1, address[0], remainder, tag, timestamp);
                    })
                }
            } else {

                totalValue -= thisBalance;
            }
        }

        bundle.finalize();
        bundle.addTrytes(signatureFragments);

        //  SIGNING OF INPUTS
        //
        //  Here we do the actual signing of the inputs
        //  Iterate over all bundle transactions, find the inputs
        //  Get the corresponding private key and calculate the signatureFragment
        for (var i = 0; i < bundle.bundle.length; i++) {

            if (bundle.bundle[i].value < 0) {

                var thisAddress = bundle.bundle[i].address;

                // Get the corresponding keyIndex of the address
                var keyIndex;
                for (var k = 0; k < inputs.length; k++) {

                    if (inputs[k].address === thisAddress) {

                        keyIndex = inputs[k].keyIndex;
                        break;
                    }
                }

                var bundleHash = bundle.bundle[i].bundle;

                // Get corresponding private key of address
                var key = Signing.key(Converter.trits(seed), keyIndex, 2);

                //  First 6561 trits for the firstFragment
                var firstFragment = key.slice(0, 6561);

                //  Get the normalized bundle hash
                var normalizedBundleHash = bundle.normalizedBundle(bundleHash);

                //  First bundle fragment uses 27 trytes
                var firstBundleFragment = normalizedBundleHash.slice(0, 27);

                //  Calculate the new signatureFragment with the first bundle fragment
                var firstSignedFragment = Signing.signatureFragment(firstBundleFragment, firstFragment);

                //  Convert signature to trytes and assign the new signatureFragment
                bundle.bundle[i].signatureMessageFragment = Converter.trytes(firstSignedFragment);

                //  Because the signature is > 2187 trytes, we need to
                //  find the second transaction to add the remainder of the signature
                for (var j = 0; j < bundle.bundle.length; j++) {

                    //  Same address as well as value = 0 (as we already spent the input)
                    if (bundle.bundle[j].address === thisAddress && bundle.bundle[j].value === 0) {

                        // Use the second 6562 trits
                        var secondFragment = key.slice(6561,  2 * 6561);

                        // The second 27 to 54 trytes of the bundle hash
                        var secondBundleFragment = normalizedBundleHash.slice(27, 27 * 2);

                        //  Calculate the new signature
                        var secondSignedFragment = Utils.signatureFragment(secondBundleFragment, secondFragment);

                        //  Convert signature to trytes and assign it again to this bundle entry
                        bundle.bundle[j].signatureMessageFragment = Converter.trytes(secondSignedFragment);
                    }
                }
            }
        }

        var bundleTrytes = []

        // Convert all bundle entries into trytes
        bundle.bundle.forEach(function(tx) {
            bundleTrytes.push(Utils.transactionTrytes(tx))
        })

        return callback(null, bundleTrytes.reverse());
    }
}



/**
*   Basically traverse the Bundle by going down the trunkTransactions until
*   the bundle hash of the transaction is no longer the same. In case the input
*   transaction hash is not a tail, we return an error.
*
*   @method traverseBundle
*   @param {string} trunkTx Hash of a trunk or a tail transaction  of a bundle
*   @param {string} bundleHash
*   @param {array} bundle List of bundles to be populated
*   @returns {array} bundle Transaction objects
**/
api.prototype.traverseBundle = function(trunkTx, bundleHash, bundle, callback) {

    var self = this;

    // Get trytes of transaction hash
    self.getTrytes(Array(trunkTx), function(error, trytesList) {

        var trytes = trytesList.trytes[0]

        if (error) return callback(error);

        if (trytes === null) return callback(new Error("Bundle transactions not visible"))

        // get the transaction object
        var txObject = Utils.transactionObject(trytes);

        if (error) return callback(error);

        // If first transaction to search is not a tail, return error
        if (!bundleHash && txObject.currentIndex !== 0) {

            return callback(new Error("Invalid tail transaction supplied."));
        }

        // If no bundle hash, define it
        if (!bundleHash) {

            bundleHash = txObject.bundle;
        }

        // If different bundle hash, return with bundle
        if (bundleHash !== txObject.bundle) {
            return callback(null, bundle);
        }

        // If only one bundle element, return
        if (txObject.lastIndex === 0 && txObject.currentIndex === 0) {
            return callback(null, Array(txObject));
        }

        // Define new trunkTransaction for search
        var trunkTx = txObject.trunkTransaction;

        // Add transaction object to bundle
        bundle.push(txObject);

        // Continue traversing with new trunkTx
        return self.traverseBundle(trunkTx, bundleHash, bundle, callback);
    })
}

/**
*   Gets the associated bundle transactions of a single transaction
*   Does validation of signatures, total sum as well as bundle order
*
*   @method getBundle
*   @param {string} transaction Hash of a tail transaction
*   @returns {list} bundle Transaction objects
**/
api.prototype.getBundle = function(transaction, callback) {

    var self = this;

    self.traverseBundle(transaction, null, Array(), function(error, bundle) {

        if (error) return callback(error);

        /********

        Validity Check Functions

        ********/

        var totalSum = 0, lastIndex, bundleHash = bundle[0].bundle;

        // Prepare to absorb txs and get bundleHash
        var bundleFromTxs = [], state = [];
        Curl.initialize(state);

        // Prepare for signature validation
        var signaturesToValidate = [];

        bundle.forEach(function(bundleTx, index) {

            totalSum += bundleTx.value;

            // currentIndex has to be equal to the index in the array
            if (bundleTx.currentIndex !== index) return callback(new Error("Invalid Bundle"));

            // Get the transaction trytes
            var thisTxTrytes = Utils.transactionTrytes(bundleTx);

            // Absorb bundle hash + value + timestamp + lastIndex + currentIndex trytes.
            Curl.absorb(Converter.trits(thisTxTrytes.slice(2187, 2187 + 162)), state)

            // Check if input transaction
            if (bundleTx.value < 0) {
                var thisAddress = bundleTx.address;

                var newSignatureToValidate = {
                    'address': thisAddress,
                    'signatureFragments': Array(bundleTx.signatureMessageFragment)
                }

                // Find the subsequent txs with the remaining signature fragment
                for (var i = index; i < bundle.length - 1; i++) {
                    var newBundleTx = bundle[i + 1];

                    // Check if new tx is part of the signature fragment
                    if (newBundleTx.address === thisAddress && newBundleTx.value === 0) {
                        newSignatureToValidate.signatureFragments.push(newBundleTx.signatureMessageFragment);
                    }
                }

                signaturesToValidate.push(newSignatureToValidate);
            }
        });

        // Check for total sum, if not equal 0 return error
        if (totalSum !== 0) return callback(new Error("Invalid Bundle Sum"));

        Curl.squeeze(bundleFromTxs, state);
        var bundleFromTxs = Converter.trytes(bundleFromTxs);

        // Check if bundle hash is the same as returned by tx object
        if (bundleFromTxs !== bundleHash) return callback(new Error("Invalid Bundle Hash"));

        // Last tx in the bundle should have currentIndex === lastIndex
        if (bundle[bundle.length - 1].currentIndex !== bundle[bundle.length - 1].lastIndex) return callback(new Error("Invalid Bundle"));

        // Validate the signatures
        for (var i = 0; i < signaturesToValidate.length; i++) {

            var isValidSignature = Signing.validateSignatures(signaturesToValidate[i].address, signaturesToValidate[i].signatureFragments, bundleHash);

            if (!isValidSignature) return callback(new Error("Invalid Signatures!"));
        }

        // Return bundle element
        return callback(null, bundle);
    })
}





/**
*   @method getTransfers
*   @param {string} seed
*   @param {object} options
*       @property {int} start Starting key index
*       @property {int} end Ending key index
*       @property {bool} inclusionStates
*   @param {function} callback
*   @returns {object} success
**/
api.prototype.getTransfers = function(seed, options, callback) {

    var self = this;

    // If no options provided, switch arguments
    if (arguments.length === 2 && Object.prototype.toString.call(options) === "[object Function]") {
        callback = options;
        options = {};
    }

    var start = options.start || 0;
    var end = options.end || null;
    var inclusionStates = options.inclusionStates || null;

    // If start value bigger than end, return error
    // or if difference between end and start is bigger than 500 keys
    if (start > end || end > (start + 500)) {
        return callback(new Error("Invalid inputs provided"))
    }


    // first call findTransactions
    // If a transaction is non tail, get the tail transactions associated with it
    // add it to the list of tail transactions


    var addressOptions = {
        index: start,
        total: end ? end - start : null,
        returnAll: true
    }

    //  Get a list of all addresses associated with the users seed
    self.getNewAddress(seed, addressOptions, function(error, addresses) {

        if (error) return callback(error);

        // call wrapper function to get txs associated with addresses
        findAndGetTxs({'addresses': addresses}, function(error, transactionObjects) {

            // set of tail transactions
            var tailTransactions = new Set();
            var nonTailBundleHashes = new Set();

            transactionObjects.forEach(function(thisTransaction) {

                // Sort tail and nonTails
                if (thisTransaction.currentIndex === 0) {
                    tailTransactions.add(thisTransaction.hash);
                } else {
                    nonTailBundleHashes.add(thisTransaction.bundle)
                }
            })

            // Get tail transactions for each nonTail via the bundle hash
            findAndGetTxs({'bundles': Array.from(nonTailBundleHashes)}, function(error, bundleObjects) {

                bundleObjects.forEach(function(thisTransaction) {

                    if (thisTransaction.currentIndex === 0) {

                        tailTransactions.add(thisTransaction.hash);
                    }
                })

                var finalBundles = [];
                var tailTxArray = Array.from(tailTransactions);

                async.map(tailTxArray, function(tailTx, cb) {

                     self.getBundle(tailTx, function(error, bundle) {

                         if (!error) {
                             finalBundles.push(bundle);
                         }
                         cb(null, true);
                     })
                }, function(error, results) {

                    // credit: http://stackoverflow.com/a/8837505
                    // Sort by timestamp
                    finalBundles.sort(function(a, b) {
                        var x = parseInt(a[0]['timestamp']); var y = parseInt(b[0]['timestamp']);
                        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                    });

                    return callback(error, finalBundles);
                })
            })
        })
    })


    // Simple wrapper function for findTransactions and getTxObjects
    function findAndGetTxs(input, callback) {

        self.findTransactions(input, function(error, transactions) {

            if (error) return callback(error);

            // get the transaction objects of the transactions
            self.getTransactionsObjects(transactions.hashes, callback);
        })
    }
}

















//
//  bundle hash, transaction hash,
//

/**
*   @method readMessage
*   @param {Object} options
*       @property {string} hash
*       @property {string} bundle
*   @returns {function} callback
*   @returns {object} success
**/
api.prototype.readMessage = function(options, callback) {

    //  If it's a single transaction hash, first get
    if (options.hash) {


    }
    // First get the bundle

    // If the bundle only contains 1 transaction, it does not contain a message
    if (data.transactions.length < 2) {
        processedTxs += 1;
        return
    }
}

module.exports = api;
