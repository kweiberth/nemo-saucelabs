## nemo-saucelabs

### Details

`nemo-saucelabs` plugin exposes methods to update and get information about sauce labs job. Once `nemo-saucelabs` plugin is registered, you will have `nemo.saucelabs` object available. 

### Methods

<h5 class="name" id="allDisabled"><span class="type-signature"></span>1. updateJob<span class="signature">(data, callback)</span>

<dt>
<h6 class="name" id="allDisabled"><span class="type-signature">Request Fields for 'updateJob' method</span> 
```javascript
    name: [string] update the job name,
    cucumber_tags: [scenario.getTags()] nemo-sauce will traverse cucumber tags and get tag names to update the job tags
    tags: [list of strings] array of tags to update the job tags,
    build: [int] The build number being tested,
    custom-data: [JSON] a set of key-value pairs with any extra info that a user would like to add to the job. Max 64KB.
```

<h6 class="name" id="allDisabled"><span class="type-signature">Example</span> 
```javascript
@Before:
nemo.saucelabs.updateJob({  name: scenario.getName(),
                            cucumber_tags: scenario.getTags(),
                            build: build_id,
                            custom-data: {testInfo: 'information about test or cause of test failure...'}
                          }, callback);
```
</dt>

<h5 class="name" id="allDisabled"><span class="type-signature"></span>2. isJobPassed<span class="signature">(isPassed, callback)</span>

<h6 class="name" id="allDisabled"><span class="type-signature">Request Fields for 'isJobPassed' method</span> 
```javascript
    passed: [boolean] test result
```

<h6 class="name" id="allDisabled"><span class="type-signature">Example</span> 
```javascript
@After:
nemo.saucelabs.isJobPassed(!scenario.isFailed(), callback);
```

</dt>

<h5 class="name" id="allDisabled"><span class="type-signature"></span>3. getJobUrl<span class="signature">()</span>

<h6 class="name" id="allDisabled"><span class="type-signature">Example</span> 
```javascript
@After:
nemo.saucelabs.getJobUrl();
//e.g. https://saucelabs.com/tests/153a38fac7ab48869e7b3b9c3c567665, can be printed on report for reference
```

### Installation for nemo@1.0 and greater versions

```npm install nemo-saucelabs --save-dev```

Add dependencies to package.json and install.

```javascript
	...
    "nemo": "^1.0.4",
    "nemo-saucelabs": "^1.0.0",
	...
```

### Configuration

Add nemo-saucelabs to your `config/config.json` file. 

```javascript
    
    	"plugins": {
		    "saucelabs": {
		        "module": "nemo-saucelabs"
		    }
	},
	
	"driver": {
        "browser": "chrome",
    
        "server": "http://shop:8ab3d84c-859c-41fb-3266-cff489be9862@ondemand.saucelabs.com:80/wd/hub",
    
        "serverCaps": {
            "username": "shop",
            "accessKey": "8ab3d84c-859c-41fb-3266-cff489be9862", //not a real access key
            "platform": "MAC",
            "version": "27.0"
      	}
```

### Installation for pre@nemo1.0 and lesser versions

```npm install nemo-saucelabs --save-dev```

Add dependencies to package.json and install.

```javascript
	...
    "nemo": "^0.4.0",
    "nemo-saucelabs": "^0.1.3",
	...
```

### Configuration

Add nemo-saucelabs to your `config/nemo-plugins.json` file. 

```javascript
{
	"plugins": {
		"nemo-saucelabs": {
			"module": "nemo-saucelabs"
			"register": true
		}
	}
}
```

Define saucalabs `username` and `accessKey` to the config.json `serverCaps`

```javascript
 "serverCaps": {
            "username": "shop",
            "accessKey": "8ab3d84c-859c-41fb-3266-cff489be9862", //not a real access key
            "platform": "MAC",
            "version": "27.0"
      }
```