# ConsentCookie

Open source AVG solution for websites. More info: [www.consentcookie.nl](https://www.consentcookie.nl)

## ConsentCookie on your website

Download the script [here](https://www.consentcookie.nl/consentcookie/latest/consentcookie.min.js) or [build your own (custom) ConsentCookie](#build-your-own-consentcookie)

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

#### Google Analytics example
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

### Basic Usage

#### API

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

```
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

To add addition functionality to ConsentCookie, you can register a plugin a each unique connection.

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

## Built With

* [VueJS](https://vuejs.org/v2/guide/) - The application framework used
* [Webpack](https://webpack.js.org/) - Module bundler for building the application

## Authors

* **Christian Vriens** - *Initial work* - [HumanSwitch](https://github.com/humanswitch)
* **Ramon Rockx** - *Initial work* - [HumanSwitch](https://github.com/humanswitch)
* **Steven Choo** - *Initial work* - [HumanSwitch](https://github.com/humanswitch)

See also the list of [contributors](https://github.com/humanswitch/consentcookie/contributors)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [OOGT](https://oogt.nl/) -  for creating the intial design of ConsentCookie
* [Eveline Druncks](https://evelinedruncks.com/) - for helping with improving the initial design of ConsentCookie
