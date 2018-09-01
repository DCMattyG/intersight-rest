# Installation

### Introduction
Cisco has released their new Intersight platform for managing UCS Server and Hyperflex Hyperconverged infrastructure from a SaaS based interface. With high security standards, forming and signing the RESTful API calls to Intersight can be a challenge, so I wrote this package to do all of that work for you. All you need to provide is your Public/Private keys generated from the Intersight interface, as well at the API endpoint you'd like to target. Optionally you can add in query parameters for GET requests, and a body for POST/PATCH opterations.

The intersightREST call structure looks like:
```js
intersightREST(<resourcePath>, <queryParams>, <body>, <moid>);
```

The HTTP verbs will be assumed as follows:
- GET: &lt;resourcePath&gt; / &lt;resourcePath&gt; + &lt;queryParams&gt;
- POST: &lt;resourcePath&gt; + &lt;body&gt;
- PATCH: &lt;resourcePath&gt; + &lt;body&gt; + &lt;moid&gt;

More information about Intersight is available at: https://www.intersight.com
<br>
Details on the RESTful API and documentation: https://www.intersight.com/apidocs
<br>
### NPM Installation

```sh
$ npm install --save intersight-rest
```

### Usage

```js
// Import "intersight-rest" Package
const isREST = require('intersight-rest');

// Load Public/Private Keys
const fs = require('fs');
isREST.setPublicKey(fs.readFileSync('./keys/public_key.txt', 'utf8'));
isREST.setPrivateKey(fs.readFileSync('./keys/private_key.pem', 'utf8'));

// Select Resource Path from https://www.intersight.com/apidocs
const resourcePath = '/ntp/Policies';

// GET EXAMPLE
isREST.intersightREST(resourcePath, queryParams, {}, null).then(body => {
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

isREST.intersightREST(resourcePath, {}, postBody, null).then(body => {
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

isREST.intersightREST(resourcePath, {}, patchBody, patchMoid).then(body => {
    console.log(body);
}).catch(err => {
    console.log('Error: ', err);

/* NOTE: intersightREST Returns a JS Promise */
```

### See package source for more details...
