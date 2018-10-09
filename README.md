# ConsentCookie

Open source AVG solution for websites. More info: [www.consentcookie.nl](https://www.consentcookie.nl)

## ConsentCookie on your website

Download the script [here](https://cdn.humanswitch.services/cc/consentcookie/consentcookie.min.js) or [build your own (custom) ConsentCookie](#build-your-own-consentcookie)

Include the script on your website:
```html
<script src="/path/to/consentcookie.min.js"></script>
```

Initialize ConsentCookie:
```html
<script>
// An example of ConsentCookie initialized with a custom config
ConsentCookie.init({
    'connections': {
      'cc': {
        'initstate': 'disabled'
      },
      'iq': {
        'initstate': 'optout'
      },
      'ga': {
        'initstate': 'disabled'
      },
      'gtm': {
        'initstate': 'disabled'
      }
    },
    'moreinfolink': 'https://www.humanswitch.io/over/privacy/'
  });
</script>
```

To load a tracker based on the ConsentCookie preference of the user you can do the following:
```html
<script>
// Check if the user accepted the consent for the given connection by its id
if(ConsentCookie.get("id").flag === 1){
  // Do stuff
}
</script>
```

### Google Analytics example
```html
<script>
// Check if the user accepted the Google Analytics consent
if(ConsentCookie.get("ga").flag === 1){
  // If so, load the Google Analytics integration script, https://developers.google.com/analytics/devguides/collection/analyticsjs/

  // The script provided by Google Anayltics
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-XXXXX-Y', 'auto');
  ga('send', 'pageview');

}
</script>
```

## Basic Usage

### API

| Method                         	| Params            	| Description                                    	| Docs          	|
|--------------------------------	|-------------------	|------------------------------------------------	|---------------	|
| `ConsentCookie.init`           	| `config`          	| Initialize ConsentCookie with the given config 	| [link](#consentcookieinit) 	|
| `ConsentCookie.on`             	| `event, callback` 	| Listen for the event with the given callback   	| [link](#consentcookieon) 	|
| `ConsentCookie.off`            	| `event, callback` 	| Remove event listener(s) for the given event   	| [link](#consentcookieoff) 	|
| `ConsentCookie.get`            	| `id`              	| Get the consent for the given id               	| [link](#consentcookieget) 	|
| `ConsentCookie.registerPlugin` 	| `plugin`          	| Register a ConsentCookie plugin                	| [link](#consentcookieregisterplugin) 	|

##### ConsentCookie.init

To enabled ConsentCookie you need to initialize it with a config object.
The config object should have the following properties:

Name                          | Description
----------------------------- | -----------------
`moreinfolink`                | The link that is shown on the bottom of the connections view
`connections`                 | The connections that ConsentCookie manages given as an object where each property key is the id of the connection and the property value the config of the connection

```javascript
ConsentCookie.init({
    'connections': {
      // connection 1
      'id 2':{
        //connection config
      }
      // connection 2
      'id 1':{
        //connection config
      }
    },
    'moreinfolink': 'https://www.link-to-your-info.com'
  });
</script>
```

A connection represents a consent integration with your website. Each connection has a specific id that should correspond with an id of a connection listed in [ConsentCookie tracker list](src/assets/json/trackers.json).
The connection config should have the following properties

| Name      | Options                 | Description                     |
|-----------|-------------------------|---------------------------------|
| initstate | optin, optout, disabled | <ul><li>optin: the user can change the consentsetting. Initially the consent by default is disabled</li><li>optout: the user can change the consentsetting. Initially the consent by default is enabled</li><li>disabled: the user can not change the consentsetting. Initially the consent by default is enabled</li></ul>


#### ConsentCookie.on
You can listen for an event with a given callback:
```javascript
ConsentCookie.on("consent",function($payload){
  // Do stuff
});
```

The following events are emitted:

Name                          | Description
----------------------------- | -----------------
`consent`                     | All events related to consent changes
`profile`                     | All events related to changes of a consent profile

The callback function will receive a single payload object as argument with the following default properties:

Name                          | Description
----------------------------- | -----------------
`id`                         | The id of the consent connection
`state`                  | The update state related to the event

Depending on the event type additional properties can be available in the payload object.

#### ConsentCookie.off
You can remove all event listeners of an event by giving the name of the specific event:
```javascript
ConsentCookie.off("consent");
```

You can also remove a single listener:
```javascript
var specificListener = function($payload){
  // Do stuff
};

// Register the specific listener
ConsentCookie.on("consent",specificListener);

// Unregister the specific listener
ConsentCookie.off("consent",specificListener);
```

#### ConsentCookie.get
You can get the current state of a consent by giving the id of the consent:
```javascript
ConsentCookie.get("id");
```

The return is a consent object with the following properties:

Name                          | Description
----------------------------- | -----------------
`id`                         | The id of the consent connection
`flag`                    | The flag related to the state of the consent. 0=disabled 1=enabled

#### ConsentCookie.registerPlugin

To add addition functionality to ConsentCookie, you can register a plugin for each unique connection.

### Plugins

ConsentCookie plugins provide the option to extend ConsentCookie functionality for specific connections.
Each connection can load a (custom) plugin. Default plugins are provided by the default ConsentCookie tracker list.

Plugins are Javascript files following a spefic convention and should be publicly availbled by a url.
They are initially loaded when opening the Connections view, for each connection if configured for that specific connection.

##### Example
```javascript
(function ($global) {

function Plugin() {}

Plugin.prototype.register = function ($context) {
this.context = $context;
};

Plugin.prototype.getId = function () {};

Plugin.prototype.getProfileId = function () {};

Plugin.prototype.getProfileIds = function () {};

Plugin.prototype.getProfile = function () {};

Plugin.prototype.getProfileInfo = function () {};

Plugin.prototype.deleteProfile = function () {};

if (!$global || !$global.ConsentCookie || typeof $global.ConsentCookie.registerPlugin !== 'function') {
throw new Error('ConsentCookie not available. Unable to register plugin: ' + DEFAULT_ID);
}

$global.ConsentCookie.registerPlugin(new Plugin());

})(window);

```

#### Registering a plugin in the ConsentCookie client

To make the plugin available in ConsentCookie it needs to register itself by calling ```ConsentCookie.registerPlugin```.
Calling this function, will load the plugin and call ```Plugin.register``` providing a context object that can be used within the plugin.

```javascript
$global.ConsentCookie.registerPlugin(new Plugin());
```

Called by ConsentCookie when registerPlugin is executed:
```javascript
Plugin.prototype.register = function ($context) {
  this.context = $context;
};
```

##### Plugin Context

The plugin context is a Javascript object with the following API:

| Method | Params | Description | Example |
| --- | --- | --- | --- |
| getLib | $name | Returns the available library by its name | context.getLib("http")

The following libraries are available:

| Name | Description | API info |
|--------|--------------------------------------------------------------------------------------------|-----------------------------------------|
| http | library for making http requests within the plugin. Currently vue-resources is referenced. | https://github.com/pagekit/vue-resource |
| cookie | library for handling browser cookies. Currently js-cookie is referenced | https://github.com/js-cookie/js-cookie |
| _ | library for different Javascript helpers. Currently underscore is referenced | http://underscorejs.org/ |

##### Plugin default interface

ConsentCookie will call the following functions of the plugin when implemented.

| Method | Description | Return type
| --- | --- | --- |
| getId | Should return the id of the connection of the plugin | String
| getProfileId | Should return the id of the profile the connection manages | String
| getProfileIds | Should return an array of all profile id`s the connection manages | Array<String>
| getProfile | Should return the profile managed by the connection as a Javascript object | Promise
| getProfileInfo | Should return an object that represents the profile and is shown within ConsentCookie | Promise
| deleteProfile | Should delete the profile managed by the connection | Promise

##### Plugin.getProfileInfo

This function is used by ConsentCookie to show a summary of the profile the connection is managing.
ConsentCookie uses a default template for showing this info.
The template consists of a header and content panel.

When ConsentCookie calls getProfileInfo it expects a promise that resolves in an object with the following properties:

Name | Description
----------------------------- | -----------------
`header` | a String with valid HTML that is shown as the header
`content` | a String with valid HTML that is shown as content

```javascript
{
	"header": "<div>I am a header</div>",
	"content": "<div>I am content</div>"
}
```

##### Plugin listening for events

A plugin can also listen for changes by using the ConsentCookie event framework.

```javascript
// Plugin code that runs when loading the plugin
(function ($global) {

	// Register event listener when plugin is loaded
	$global.ConsentCookie.on('connection', function ($payload) {

		// Listen for connection changes

		// Do stuff
	});

})(window);
```

##### Custom plugin

By default all used plugins are defined in the [ConsentCookie tracker list](src/assets/json/trackers.json).
When you want to use a custom plugin for a specific connection your can override the default url with a custom one.

To override the default url, add the property ```plugin``` to the connection config of which you want to load the custom plugin.

```javascript
ConsentCookie.init({
    'connections': {
      // Google Analytics with custom plugin
      'ga': {
        'initstate': 'disabled',
        'plugin':'https://yourdomain.com/the/location/of/the/plugin.js'
      }
    },
    'moreinfolink': 'https://www.link-to-your-info.com'
  });
```

## Build your own ConsentCookie

### Prerequisites

1. Node.js => 4.0.0
2. NPM => 3.0.0

### Installing

Clone a copy of the main ConsentCookie git repo by running:

```
git clone git://github.com/humanswitch/consentcookie.git
```

Install the project dependencies:

```
cd consentcookie && npm install
```

### Developing

To run the development server with the demo page:
```
npm run dev
```

A browser window will automatically open with the demo page visible.

### Building

To build ConsentCookie for deployment:
```
npm run build -- -r
```

Using the ```-r``` option will create a singlefile minified version of ConsentCookie that is optimized for use on websites.

### Building single file
To build ConsentCookie in 1 file consentcookie.min.js for release.

```
npm run release
```

## Built With

* [VueJS](https://vuejs.org/v2/guide/) - The application framework used
* [Webpack](https://webpack.js.org/) - Module bundler for building the application

## Authors

* **Christian Vriens** - *Initial work* - [HumanSwitch](https://github.com/humanswitch)
* **Ramon Rockx** - *Initial work* - [HumanSwitch](https://github.com/humanswitch)
* **Steven Choo** - *Initial work* - [HumanSwitch](https://github.com/humanswitch)

See also the list of [contributors](https://github.com/humanswitch/consentcookie/contributors)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* [OOGT](https://oogt.nl/) -  for creating the intial design of ConsentCookie
* [Eveline Druncks](https://evelinedruncks.com/) - for helping with improving the initial design of ConsentCookie
