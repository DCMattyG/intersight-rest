# intersight-rest

Cisco has released their new Intersight platform for managing UCS Server and Hyperflex Hyperconverged infrastructure from a SaaS based interface. With high security standards, forming and signing the RESTful API calls to Intersight can be a challenge, so this package was written to do all of that work for you. All you need to provide is your Public/Private keys generated from the Intersight interface, as well at the API endpoint you'd like to target. Optionally you can add in query parameters for GET requests, and a body for POST/PATCH opterations.  

### **Overview:**
```js
intersightREST(<options>);
```

| Option | Format | Value |
| ------ | ------ | ------ |
| resource_path | &lt;String&gt; | Resource Path from https://intersight.com/apidocs |
| query_params | &lt;Object&gt; | Query Parameters from Resource Path GET |
| body | &lt;Object&gt; | Body Parameters from Resource Path POST|
| moid | &lt;String&gt; | MOID of Object to be Modified |

More information about Intersight is available at: https://intersight.com  
Details on the RESTful API and documentation: https://intersight.com/apidocs  

### **NPM Installation:**

```sh
$ npm install --save intersight-rest
```

### **Usage:**

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
/* Set GET Options */
options = {
    http_method: 'get',
    resource_path: resourcePath,
    query_params: queryParams
};

/* Send GET Request */
isREST.intersightREST(options).then(response => {
    console.log(response.body);
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

/* Set POST Options */
options = {
    http_method: 'post',
    resource_path: resourcePath,
    body: postBody
};

/* Send POST Request */
isREST.intersightREST(options).then(response => {
    console.log(response.body);
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

/* Set PATCH Options */
options = {
    http_method: 'patch',
    resource_path: resourcePath,
    body: patchBody,
    moid: patchMoid
};

/* Send PATCH Request */
isREST.intersightREST(options).then(response => {
    console.log(response.body);
}).catch(err => {
    console.log('Error: ', err);

/* NOTE: intersightREST Returns a JS Promise */

// DELETE EXAMPLE
/* Set Object MOID to be Deleted */
deleteMoid = '6b1727fa686c873463b8163e';

/* Set DELETE Options */
options = {
    http_method: 'delete',
    resource_path: resourcePath,
    moid: deleteMoid
};

/* Send DELETE Request */
isREST.intersightREST(options).then(response => {
    console.log(response.statusCode);
}).catch(err => {
    console.log('Error: ', err);

/* NOTE: intersightREST Returns a JS Promise */
```

### See package source for more details...

*Copyright (c) 2018 Cisco and/or its affiliates.
