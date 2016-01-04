## nemo-saucelabs

`nemo-saucelabs` plugin exposes methods to update the meta-data of running Sauce Labs job, e.g. Test Name, Test tags, Build Id and Test result (Pass/Fail) on Sauce Labs dashboard. It also exposes a method to get Job URL to print on your test reports. Once `nemo-saucelabs` plugin is registered, you will have `nemo.saucelabs` object available. 

### Methods

#### nemo-saucelabs@2.x.x : returns webdriver promises

##### 1. Update Sauce Labs Job: updateJob(data)

	request fields:
	```javascript
	    name:           [string] update the job name,
	    cucumber_tags:  [scenario.getTags()] nemo-sauce will traverse cucumber tags and get tag names to update the job tags
	    tags:           [list of strings] array of tags to update the job tags,
	    build:          [int] The build number being tested,
	    custom-data:    [JSON] a set of key-value pairs with any extra info that a user would like to add to the job. Max 64KB.
	```
	example:
	```javascript
	@Before:
	var options = { 
	                  name: scenario.getName(),
	                  cucumber_tags: scenario.getTags(),
	                  build: build_id,
	                  custom-data: {testInfo: 'information about test or cause of test failure...'}
	              };
	                          
	nemo.saucelabs.updateJob(options).then(function(){
	     // process succsss callback
	}).thenCatch(function(err){
	     //process error
	});
	```

##### 2. Update Sauce Labs Job Result: isJobPassed(isPassed)

	request fields: 
	```javascript
	    passed: [boolean] test result
	```
	example:
	```javascript
	@After:
	var isPassed = test.isPassed();
	nemo.saucelabs.isJobPassed(isPassed)
	    .then(function() {
	       //process success callback;
	    }).thenCatch(function(err) {
	       //process error callback;
	    })
	```

##### 3. Get Sauce Labs Job URL: getJobUrl()

	example: 
	```javascript
	@After:
	nemo.saucelabs.getJobUrl();
	//e.g. https://saucelabs.com/tests/153a38fac7ab48869e7b3b9c3c567665, can be printed on report for reference
	```

#### nemo-saucelabs@1.x.x : callback pattern

##### updateJob(data, callback)

request fields:
```javascript
    name:           [string] update the job name,
    cucumber_tags:  [scenario.getTags()] nemo-sauce will traverse cucumber tags and get tag names to update the job tags
    tags:           [list of strings] array of tags to update the job tags,
    build:          [int] The build number being tested,
    custom-data:    [JSON] a set of key-value pairs with any extra info that a user would like to add to the job. Max 64KB.
```
example:
```javascript
@Before:
var options = { 
                  name: scenario.getName(),
                  cucumber_tags: scenario.getTags(),
                  build: build_id,
                  custom-data: {testInfo: 'information about test or cause of test failure...'}
              };
                    
nemo.saucelabs.updateJob(options, callback);
```

##### isJobPassed(isPassed, callback)

request fields: 
```javascript
    passed: [boolean] test result
```
example:
```javascript
@After:
nemo.saucelabs.isJobPassed(!scenario.isFailed(), callback);
```

##### getJobUrl()

example: 
```javascript
@After:
nemo.saucelabs.getJobUrl();
//e.g. https://saucelabs.com/tests/153a38fac7ab48869e7b3b9c3c567665, can be printed on report for reference
```

### Installation for nemo@v1.x.x

Add dependencies to package.json and install.

```javascript
	...
    "nemo": "^1.0.4",
    "nemo-saucelabs": "^1.0.0",
	...
```

Define `nemo-saucelabs` plugin to your `config/config.json` under `plugins` section and define sauce labs `username` and `accessKey` under `serverCaps` section. 

```javascript
    
    	"plugins": {
		    "saucelabs": {
		        "module": "nemo-saucelabs"
		    }
		 ...
	},
	
	"driver": {
        "browser": "chrome",
    
        "server": "http://sauce-username:8ab3d84c-859c-41fb-3266-cff489be9862@ondemand.saucelabs.com:80/wd/hub",
    
        "serverCaps": {
            "username": "sauce-username",
            "accessKey": "8ab3d84c-859c-41fb-3266-cff489be9862", //not a real access key
            "platform": "MAC",
            "version": "27.0"
      	}
```

```npm install nemo-saucelabs --save-dev```

### Installation for pre@nemo0.x.x

Add dependencies to package.json and install.

```javascript
	...
    "nemo": "^0.4.0",
    "nemo-saucelabs": "^0.1.3",
	...
```

Define `nemo-saucelabs` plugin to your `config/nemo-plugins.json` file. 

```javascript
{
	"plugins": {
		"nemo-saucelabs": {
			"module": "nemo-saucelabs"
			"register": true
		}
		...
	}
}
```

Define sauce labs `username` and `accessKey` to the config.json under `serverCaps` section

```javascript
 "serverCaps": {
            "username": "sauce-username",
            "accessKey": "8ab3d84c-859c-41fb-3266-cff489be9862", //not a real access key
            "platform": "MAC",
            "version": "27.0"
      }
```

```npm install nemo-saucelabs --save-dev```
