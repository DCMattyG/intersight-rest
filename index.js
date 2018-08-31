/**
 * Intersight REST API Module
 * @module intersight-rest
 */

const request = require('request-promise');
const crypto = require('crypto');
const url = require('url');

const host = url.parse('https://intersight.com/api/v1');
const digest_algorithm = 'rsa-sha256';

var private_key = null;
var public_key = null;

/**
 * Set RSA public key.
 * @function set_public_key
 * @private
 * @param  {String} data  RSA public key.
 */
const setPublicKey = function set_public_key(pub_key) {
    public_key = pub_key;
}

/**
 * Set RSA private key.
 * @function set_private_key
 * @private
 * @param  {String} data  RSA private key.
 */
const setPrivateKey = function set_private_key(prv_key) {
    private_key = prv_key;
}

/**
 * Generates a SHA256 digest from a JSON Object.
 * @function get_sha256_digest
 * @private
 * @param  {Object} data  JSON object.
 * @return {string}       Base64 formatted string.
 */
function get_sha256_digest(data) {
    return digest = crypto.createHash('sha256').update(JSON.stringify(data), 'utf8').digest();
}

/**
 * Generates an RSA Signed SHA256 digest from a String.
 * @function get_rsasig_sha256_b64encode
 * @private
 * @param  {String} private_key  RSA private key.
 * @param  {String} data         String to be signed & hashed.
 * @return {string}              Base64 formatted string.
 */
function get_rsasig_sha256_b64encode(private_key, data) {
    var key_data = {
        key: private_key,
        padding: crypto.constants.RSA_PKCS1_PADDING
    };

    return sign = crypto.createSign('RSA-SHA256').update(data).sign(key_data, 'base64');
}

/**
 * Assmebled an Intersight formatted authorization header.
 * @function get_auth_header
 * @private
 * @param  {String} public_key  RSA public key.
 * @param  {Object} hdrs        Object with header keys.
 * @param  {String} signed_msg  Base64 encoded SHA256 hashed body.
 * @return {string}             Concatenated authorization header.
 */
function get_auth_header(public_key, hdrs, signed_msg) {
    var auth_str = "Signature";

    auth_str = auth_str + " " + "keyId=\"" + public_key + "\"," + "algorithm=\"" + digest_algorithm + "\"," + "headers=\"(request-target)";

    for (var key in hdrs) {
        auth_str = auth_str + " " + key.toLowerCase();
    }
    auth_str = auth_str + "\"";

    auth_str = auth_str + "," + "signature=\"" + signed_msg + "\"";

    return auth_str;
}

/**
 * Concatenates Intersight headers in preparation to be RSA signed.
 * @function prepare_str_to_sign
 * @private
 * @param  {String} req_tgt  HTTP Method + endpoint.
 * @param  {Object} hdrs     Object with header keys.
 * @return {string}          Concatenated header authorization string.
 */
function prepare_str_to_sign(req_tgt, hdrs) {
    var ss = "(request-target): " + req_tgt.toLowerCase() + "\n";

    var length = Object.keys(hdrs).length;

    var count = 0;
    for (var key in hdrs) {
        ss = ss + key.toLowerCase() + ": " + hdrs[key];
        if(count < length-1) {
            ss = ss + "\n";
        }
        count++;
    }

    return ss;
}

/**
 * Encodes query string properly to work in Intersight API calls.
 * @function encode_intersight_uri
 * @private
 * @param  {String} raw_uri  Query string formatted URI.
 * @return {String}          Intersight encoded URI query string.
 */
function encode_intersight_uri(raw_uri) {
    var encoded_uri;

    encoded_uri = encodeURI(raw_uri);
    encoded_uri = encoded_uri.replace(/'/g, "%27");
    encoded_uri = encoded_uri.replace(/\$/g, "%24");

    return encoded_uri;
}

/**
 * Generates a query string based on oData 2.0.
 * https://www.odata.org/documentation/odata-version-2-0/uri-conventions/
 * @function encode_query_params
 * @private
 * @param  {Object} query_params  Query string key/value pairs.
 * @return {String}               URI formatted query string.
 */
function encode_query_params(query_params) {
    var build_query = "?";
    var length = Object.keys(query_params).length;
    var count = 0;

    for(key in query_params) {
        build_query += key + "=" + query_params[key];
        if(count < length-1) {
            build_query += "&";
        }
        count++;
    }

    var encoded_query = encode_intersight_uri(build_query);

    return encoded_query;
}

/**
 * Generated a GMT formatted Date.
 * @function get_gmt_date
 * @private
 * @return {String} GMT formatted Date string.
 */
function get_gmt_date() {
    return new Date().toGMTString();
}

/**
 * Callback for sending HTTP requests.
 * @function make_request
 * @private
 * @param  {Object} request_data  Requests formatted object.
 * @return {Object}               Javascript Object from JSON response.
 */
function make_request(request_data) {
    return request(request_data).then(body => {
        return JSON.parse(body);
    });
}

/**
 * Invoke the Intersight API.
 * @function intersight_call
 * @public
 * @param  {String} public_key     RSA public key.
 * @param  {String} private_key    RSA private key.
 * @param  {String} resource_path  Intersight resource path e.g. '/ntp/Policies'.
 * @param  {Object} body           Javascript object with Intersight data.
 * @param  {String} moid           Intersight object MOID.
 * @return {Promise}               Javascript Promise for HTTP response body.
 */
const intersightREST = function intersight_call(resource_path, query_params={}, body={}, moid=null) {
    var target_host = host.hostname;
    var target_path = host.pathname;
    var query_path = "";
    var method;

    // Verify the body isn't empy & is a valid Javascript Object
    if(query_params != {} && query_params.constructor != Object) {
        return Promise.reject('The *query_params* value must be of type "Object"');
    }

    // Verify the body isn't empy & is a valid Javascript Object
    if(body != {} && body.constructor != Object) {
        return Promise.reject('The *body* value must be of type "Object"');
    }

    // Verify the MOID is not null & of proper length
    if(moid != null && Buffer.byteLength(moid, 'utf-8') != 24) {
        return Promise.reject('Invalid *moid* value!');
    }

    // Verify the public key is set
    if(public_key == null) {
        return Promise.reject('Public Key not set!');
    }

    // Verify the private key is set
    if(private_key == null) {
        return Promise.reject('Private Key not set!');
    }

    // Determine HTTP Method for requests call
    if(Object.keys(body).length > 0){
        if(moid != null) {
            method = 'PATCH';
            resource_path += "/" + moid;
        }
        else {
            method = 'POST';
        }
    }
    else {
        method = 'GET';

        if(query_params != {}) {
            query_path = encode_query_params(query_params);
        }
    }

    // Concatenate URLs for headers
    var target_url = host.href + resource_path;
    var request_target = method + " " + target_path + resource_path + query_path;

    // Get the current GMT Date/Time
    var cdate = get_gmt_date();

    // Generate the body digest
    var b64_body_digest = get_sha256_digest(body);

    // Generate the authorization header
    var auth_header = {
        'Date' : cdate,
        'Host' : target_host,
        'Digest' : 'SHA-256=' + b64_body_digest.toString('base64')
    };

    var string_to_sign = prepare_str_to_sign(request_target, auth_header);
    var b64_signed_msg = get_rsasig_sha256_b64encode(private_key, string_to_sign);
    var header_auth = get_auth_header(public_key, auth_header, b64_signed_msg);

    // Generate the HTTP requests header
    var request_header = {
        'Accept':           `application/json`,
        'Host':             `${target_host}`,
        'Date':             `${cdate}`,
        'Digest':           `SHA-256=${b64_body_digest.toString('base64')}`,
        'Authorization':    `${header_auth}`,
    };

    // Generate the HTTP request options
    var request_options = {
        method: method,
        url: target_url,
        qs: query_params,
        useQuerystring: true,
        qsParseOptions: {sep:'&', eq:'=', options:{}},
        body: JSON.stringify(body),
        headers: request_header
    };

    // Make HTTP request & return a Javascript Promise
    return make_request(request_options);
}

// Export the module functions
module.exports = {
    intersightREST,
    setPublicKey,
    setPrivateKey
};
