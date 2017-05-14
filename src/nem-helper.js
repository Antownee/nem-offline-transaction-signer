import util from 'util';
import nem from 'nem-sdk';

var transferTransaction = nem
    .model
    .objects
    .get("transferTransaction"); // Get an empty un-prepared transfer transaction object
var common = nem
    .model
    .objects
    .get("common"); // Get an empty common object to hold pass and key

let nemhelper = {

    updateFee: (state) => {
        var amount = state.nemAmount;
        var message = state.nemMessage;
        // Check for amount errors
        if (undefined === amount || !nem.utils.helpers.isTextAmountValid(amount)) 
            return alert('Invalid amount !');
        
        // Set the cleaned amount into transfer transaction object
        transferTransaction.amount = nem
            .utils
            .helpers
            .cleanTextAmount(amount);

        // Set the message into transfer transaction object
        transferTransaction.message = message;

        // Prepare the updated transfer transaction object
        var transactionEntity = nem
            .model
            .transactions
            .prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

        // Format fee returned in prepared object
        var feeString = parseInt(nem.utils.format.nemValue(transactionEntity.fee)[0].replace(/\s+/g, "")) + "." + nem
            .utils
            .format
            .nemValue(transactionEntity.fee)[1];
        return Math.round(parseInt(feeString));
    },

    signTransaction: (state) => {
        //Sign the transaction
        var prv = state.nemPrvKey;
        var amount = state.nemAmount;
        var address = state.nemAddress;
        var message = state.nemMessage;

        // Check form for errors
        if (!prv || !address) 
            return alert('Missing parameter! Enter private key and address');
        if (undefined === amount || !nem.utils.helpers.isTextAmountValid(amount)) 
            return alert('Invalid amount !');
        if (!nem.model.address.isValid(address)) 
            return alert('Invalid recipent address !');
        
        // Set the private key in common object
        common.privateKey = prv;

        // Check private key for errors
        if (common.privateKey.length !== 64 && common.privateKey.length !== 66) 
            return alert('Invalid private key, length must be 64 or 66 characters !');
        if (!nem.utils.helpers.isHexadecimal(common.privateKey)) 
            return alert('Private key must be hexadecimal only !');
        
        // Set the cleaned amount into transfer transaction object
        transferTransaction.amount = nem
            .utils
            .helpers
            .cleanTextAmount(amount);

        // Recipient address must be clean (no hypens: "-")
        transferTransaction.recipient = nem
            .model
            .address
            .clean(address);

        // Set message
        transferTransaction.message = message;

        // Prepare the updated transfer transaction object
        var transactionEntity = nem
            .model
            .transactions
            .prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

        // Create a key pair object from private key
        var kp = nem
            .crypto
            .keyPair
            .create(common.privateKey);

        // Serialize the transaction
        var serialized = nem
            .utils
            .serialization
            .serializeTransaction(transactionEntity);

        // Sign the serialized transaction with keypair object
        var signature = kp.sign(serialized);

        // Build the object to send
        var result = {
            'data': nem
                .utils
                .convert
                .ua2hex(serialized),
            'signature': signature.toString()
        };
        return result;
    }

};

export default nemhelper;