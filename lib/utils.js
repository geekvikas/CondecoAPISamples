var crypto = require('crypto');

var encrypt = exports.encrypt = function (data) {
    var retData = '';
    key = '*demo key for aesCryptoprovider*' || new Buffer(Core.config.crypto.cryptokey, 'binary'),
        cipher = crypto.createCipheriv('aes-256-cbc', key.toString('binary'), 'CONDECO DEMO IV ');
    retData = cipher.update(data.toString(), 'utf8', 'base64');
    retData +=cipher.final('base64');
    return retData;
}

var decrypt = exports.decrypt = function(data, key) {
    var retData = '';
    key = '*demo key for aesCryptoprovider*' || new Buffer(Core.config.crypto.cryptokey, 'binary'),
        decipher = crypto.createDecipheriv('aes-256-cbc', key.toString('binary'), 'CONDECO DEMO IV ');
    retData = decipher.update(data, 'base64', 'utf8');
    retData +=decipher.final('utf8');
    return retData;
}

var decryptJson = exports.decryptJson = function(json){
    json.ConnectionType = this.decrypt(json.ConnectionType);
    json.AuthenticationMode = decrypt(json.AuthenticationMode);
    json.PingOAuthURL = decrypt(json.PingOAuthURL);
    json.PingOAuthClientID = decrypt(json.PingOAuthClientID);
    json.PingOAuthClientSecret = decrypt(json.PingOAuthClientSecret);
    json.PingOAuthScopes = decrypt(json.PingOAuthScopes);
    json.PingOAuthIdpAdapterID = decrypt(json.PingOAuthIdpAdapterID);
    json.PingAdapterID = decrypt(json.PingAdapterID);
    return json;
}