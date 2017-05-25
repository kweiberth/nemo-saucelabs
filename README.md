## nemo-saucelabs

This plugin exposes methods to update the metadata of running Sauce Labs job, e.g. Test Name, Test tags, Build Id and Test result (Pass/Fail) on Sauce Labs dashboard. It also exposes a method to get Job URL to print on your test reports. Once `nemo-saucelabs` plugin is registered, you will have `nemo.saucelabs` object available.

This is `v3` of this plugin, which requires as a peer dependency `nemo@^3.0.0-alpha.6`, which in turn required node `v6` or later

### Installation and usage

Use `npm` to install `nemo-saucelabs` into your project:

```
npm install --save-dev nemo-saucelabs@^3.0.0
```

Then, define the `nemo-saucelabs` plugin in your `config/config.json` under `plugins` section and specify Sauce Labs `username` and `accessKey` under `serverCaps` section:

```
  "plugins": {
    "saucelabs": {
      "module": "nemo-saucelabs"
    }
  },
  "driver": {
    "browser": "chrome",
    "server": "http://sauce-username:8ab3d84c-859c-41fb-3266-cff489be9862@ondemand.saucelabs.com:80/wd/hub",
    "serverCaps": {
      "username": "sauce-username",
      "accessKey": "sauce-access-key", // not a real access key
      "platform": "MAC",
      "version": "27.0"
    }
  }
```

### Methods

##### 1. Update Sauce Labs Job: ` updateJob(data) `

request fields:
```javascript
name:           [string] update the job name,
cucumber_tags:  [scenario.getTags()] nemo-saucelabs will traverse cucumber tags and get tag names to update the job tags
tags:           [list of strings] array of tags to update the job tags,
build:          [int] The build number being tested,
custom-data:    [JSON] a set of key-value pairs with any extra info that a user would like to add to the job. Max 64KB.
```
example:
```javascript
var options = {
  name: scenario.getName(),
  cucumber_tags: scenario.getTags(),
  build: build_id,
  custom-data: {
    testInfo: 'information about test or cause of test failure...'
  }
};

nemo.saucelabs.updateJob(options)
  .then(function() { /* process success results */ })
  .catch(function(err) { /* process error */ });
```

##### 2. Update Sauce Labs Job Result: ` isJobPassed(isPassed) `

request fields:
```javascript
passed: [boolean]
```
example:
```javascript
var isPassed = test.isPassed();
nemo.saucelabs.isJobPassed(isPassed)
  .then(function() { /* process success results */ })
  .catch(function(err) { /* process error */ });
```

##### 3. Get Sauce Labs Job URL: ` getJobUrl() `

example:
```javascript
nemo.saucelabs.getJobUrl()
  .then(function(url) { /* do something with url e.g. `console.log` */ })
  .catch(function(err) { /* process error */ });
// example saucelabs url: https://saucelabs.com/tests/153a38fac7ab48869e7b3b9c3c567665
```
