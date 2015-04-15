## nemo-saucelabs

### Installation

```npm install nemo-saucelabs --save-dev```

Add dependencies to package.json and install.

```javascript
	...
    "nemo": "^0.4.0",
    "nemo-saucelabs": "^0.1.0",
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

Define saucalabs `username` and `access_key` to the config object and register the plugin

```javascript
{
    username: config.serverCaps.username,
    access_key: config.serverCaps.accessKey,
}
```

### Details

Once `nemo-saucelabs` plugin is registered, you will have `nemo.saucelabs` object available. `nemo.saucelabs` exposes methods called `updateJob` and `isJobPassed` to help update saucelabs test job and test results.


### Methods

<h5 class="name" id="allDisabled"><span class="type-signature"></span>1. updateJob<span class="signature">(data, callback)</span>

<dt>
<h6 class="name" id="allDisabled"><span class="type-signature">Request Fields for 'updateJob' method</span> 
```javascript
    name: [string] update the job name,
    tags: [list of strings] update the job tags,
    build: [int] The build number being tested,
    custom-data: [JSON] a set of key-value pairs with any extra info that a user would like to add to the job. Max 64KB.
```

<h6 class="name" id="allDisabled"><span class="type-signature">Example</span> 
```javascript
@Before:
nemo.saucelabs.updateJob({  name: scenario.getName(),
                            tags: scenario.getTags(),
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