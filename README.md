# Installation

### Using NPM:

```sh
$ npm install --save intersight-rest
```

### Usage:

```js
// Import "intersight-rest" Package
const isRest = require('intersight-rest');

// Load Public/Private Keys
const fs = require('fs');
isRest.setPublicKey(fs.readFileSync('./keys/public_key.txt', 'utf8'));
isRest.setPrivateKey(fs.readFileSync('./keys/private_key.pem', 'utf8'));

// Select Resource Path from https://www.intersight.com/apidocs
const resourcePath = '/ntp/Policies';

// GET EXAMPLE
isRest.intersightREST(resourcePath, queryParams, {}, null).then(body => {
    console.log(body);
}).catch(err => {
    console.log('Error: ', err);
});

/* NOTE: intersightREST Returns a JS Promise */

// GET "queryParams" Examples
/* Example queryParams returning the top 1 result(s) */
queryParams = {
    "$top": 1
};

/* Example queryParams showing filter by "Name" key */
queryParams = {
    "$filter": "Name eq 'Test-NTP'"
};

/* Example queryParams showing filter by "Description" key */
queryParams = {
    "$filter": "Description eq 'pool.ntp.org'"
};

/* Example queryParams showing advanced Tag filder by key & value */
queryParams = {
    "$filter": "Tags/any(t: t/Key eq 'loc' and t/Value eq 'California')"
};

// POST EXAMPLE
/* Assemble POST Body */
postBody = {
    Name: "Test-NTP",
    Description: "Test NTP Policy",
    NtpServers: ["8.8.8.8"]
};

cisco.intersightREST(resourcePath, {}, postBody, null).then(body => {
    console.log(body);
}).catch(err => {
    console.log('Error: ', err);
});

/* NOTE: intersightREST Returns a JS Promise */

// PATCH EXAMPLE
/* Set Object MOID to be Modified */
patchMoid = '6b1727fa686c873463b8163e';

/* Assemble PATCH Body */
patchBody = {
    NtpServers: ["10.10.10.10"]
};

cisco.intersightREST(resourcePath, {}, patchBody, patchMoid).then(body => {
    console.log(body);
}).catch(err => {
    console.log('Error: ', err);

/* NOTE: intersightREST Returns a JS Promise */
```

### See package source for more details...
