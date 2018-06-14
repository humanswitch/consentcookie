const uuidv1 = require('uuid/v1');

/* CONFIG KEYS */
export const CONFIG_KEY_GENERAL_GDPR_CONTACTLINK = 'general.gdpr.contact';
export const CONFIG_KEY_GENERAL_CONSENTWALL = 'general.consentwall';
export const CONFIG_KEY_GENERAL_CONSENTWALL_ENABLED = CONFIG_KEY_GENERAL_CONSENTWALL + '.enabled';
export const CONFIG_KEY_GENERAL_CONSENTWALL_TIMEOUT = CONFIG_KEY_GENERAL_CONSENTWALL + '.timeout';
export const CONFIG_KEY_GENERAL_CONSENTWALL_BLOCKPAGE = CONFIG_KEY_GENERAL_CONSENTWALL + '.blockpage';

export const CONFIG_KEY_APPS = 'apps';
export const CONFIG_KEY_APPS_ENDPOINT = CONFIG_KEY_APPS + '.endpoint';
export const CONFIG_KEY_APPS_CONSENT = CONFIG_KEY_APPS + '.consent';

export const CONFIG_KEY_DESIGN = 'design';
export const CONFIG_KEY_DESIGN_LAYOUT = CONFIG_KEY_DESIGN + '.layout';
export const CONFIG_KEY_DESIGN_LAYOUT_POSITION = CONFIG_KEY_DESIGN_LAYOUT + '.position';
export const CONFIG_KEY_DESIGN_COLORSCHEME = CONFIG_KEY_DESIGN + '.colorscheme';
export const CONFIG_KEY_DESIGN_COLORSCHEME_PRIMARY = CONFIG_KEY_DESIGN_COLORSCHEME + '.primary';
export const CONFIG_KEY_DESIGN_COLORSCHEME_SECONDARY = CONFIG_KEY_DESIGN_COLORSCHEME + '.secondary';

export const CONFIG_KEY_RESOURCES = 'resources';

export const CONFIG_KEY_RESOURCES_APPLICATIONS = 'applications';
export const CONFIG_KEY_RESOURCES_APPLICATIONS_TITLE = CONFIG_KEY_RESOURCES_APPLICATIONS + '.title';
export const CONFIG_KEY_RESOURCES_ABOUT = 'about';
export const CONFIG_KEY_RESOURCES_ABOUT_TITLE = CONFIG_KEY_RESOURCES_ABOUT + '.title';
export const CONFIG_KEY_RESOURCES_ABOUT_TEXT = CONFIG_KEY_RESOURCES_ABOUT + '.text';
export const CONFIG_KEY_RESOURCES_CONSENT = 'consent';
export const CONFIG_KEY_RESOURCES_CONSENT_TITLE = CONFIG_KEY_RESOURCES_CONSENT + '.title';
export const CONFIG_KEY_RESOURCES_CONSENT_TEXT = CONFIG_KEY_RESOURCES_CONSENT + '.text';
export const CONFIG_KEY_RESOURCES_CONSENT_BUTTON = CONFIG_KEY_RESOURCES_CONSENT + '.button';
export const CONFIG_KEY_RESOURCES_CONSENT_INFOLINK = CONFIG_KEY_RESOURCES_CONSENT + '.infolink';

/* CONFIG DEFAULTS */
export const DEFAULT_CONSENTWALL_COOKIE_ID = 'ccw';
export const DEFAULT_CONSENTWALL_TIMEOUT = 300;

export const DEFAULT_CONSENTCOOKIE_COOKIE_NAME = 'consentcookie';
export const DEFAULT_CONSENTCOOKIE_COOKIE_TTL = (20 * 365); // Default expire time, 20 years from now in days
export const DEFAULT_CONSENTCOOKIE_COOKIE_VAL_ACCEPTED = 1;
export const DEFAULT_CONSENTCOOKIE_COOKIE_VAL_REJECTED = 0;
export const DEFAULT_CONSENTCOOKIE_COOKIE_VAL_ALWAYSON = -1;

export const DEFAULT_CONSENTS_SEPERATOR = '&';
export const DEFAULT_CONSENT_SEPERATOR = '=';

export const DEFAULT_CONSENT_INIT_STATE_OPTIN = DEFAULT_CONSENTCOOKIE_COOKIE_VAL_REJECTED;
export const DEFAULT_CONSENT_INIT_STATE_OPTOUT = DEFAULT_CONSENTCOOKIE_COOKIE_VAL_ACCEPTED;
export const DEFAULT_CONSENT_INIT_STATE_ALWAYSON = DEFAULT_CONSENTCOOKIE_COOKIE_VAL_ALWAYSON;
export const DEFAULT_CONSENT_INIT_STATE = DEFAULT_CONSENT_INIT_STATE_ALWAYSON;

export const DEFAULT_CONSENT_STATE_LABEL_OPTIN = 'optin';
export const DEFAULT_CONSENT_STATE_LABEL_OPTOUT = 'optout';
export const DEFAULT_CONSENT_STATE_LABEL_ALWAYSON = 'alwayson';

export const DEFAULT_CONSENTCOOKIE_HOST_LOCATION = 'https://cdn.humanswitch.services/cc/consentcookie/';
export const DEFAULT_CONSENTCOOKIE_APPLICATION_RESOURCE_LOCATION = DEFAULT_CONSENTCOOKIE_HOST_LOCATION + 'consentcookie.json';
export const DEFAULT_CONSENTCOOKIE_APPLICATION_LOGO_LOCATION = DEFAULT_CONSENTCOOKIE_HOST_LOCATION + 'logo/';
export const DEFAULT_CONSENTCOOKIE_APPLICATION_LOGO_EXTENSION = '.png';
export const DEFAULT_CONSENTCOOKIE_APPLICATION_ID_URL_PARAM = 'ccid';

export const DEFAULT_CONSENTCOOKIE_PROFILE_EXPORT_SUFFIX = '-profile.json';

export const DEFAULT_RESOURCE_LANGUAGE = 'nl';

export const DEFAULT_EVENT_CONSENT_STATE_VAL_REJECTED = 'disabled';
export const DEFAULT_EVENT_CONSENT_STATE_VAL_ACCEPTED = 'enabled';
export const DEFAULT_EVENT_CONSENT_STATE_DEFAULT = 'updated';

export const DEFAULT_EVENT_NAME_CONSENT = 'consent';
export const DEFAULT_EVENT_NAME_PROFILE = 'profile';

export const DEFAULT_EVENT_NAME_APP_CREATED = 'created';
export const DEFAULT_EVENT_NAME_APP_MOUNTED = 'mounted';
export const DEFAULT_EVENT_NAME_APP_OPENVIEW = 'openView';

/* eslint-disable max-len */
export const DEFAULT_RESOURCES_ABOUT_TEXT = '<p>Baas over eigen data, dat vinden wij heel normaal. Niet alleen vanwege de AVG, maar omdat wij geloven in transparantie en fatsoen. Daarom gebruiken wij ConsentCookie.</p>' +
  '<p>ConsentCookie laat jou zien welke data we van jou verzamelen en waarom we dat doen. Ga naar Jouw instellingen om jouw persoonlijke voorkeuren vast te leggen. Ze zijn daarna direct van kracht en kunnen op elk moment worden aangepast.</p>' +
  '<p><em>ConsentCookie op jouw eigen website gebruiken?</em><br />Voor meer informatie:<a href=\\"https://www.consentcookie.nl\\">www.consentcookie.nl</a></p>';
export const DEFAULT_RESOURCES_CONSENT_TEXT = '<p>Deze website maakt gebruik van <a href=\\"https://www.consentcookie.nl\\">' +
  '<u>ConsentCookie</u></a> om je cookies en privacy toestemmingen op deze website te beheren.</p>';
/* eslint-enable max-len */

/* DEFAULT CONFIG */
export const DEFAULT_CONFIG = {
  general: {
    consentwall: {
      enabled: false,
      timeout: 1000,
      blockpage: false,
    },
    defaultLanguage: DEFAULT_RESOURCE_LANGUAGE
  },
  resources: {
    nl: {
      general: {
        on: 'Aan',
        off: 'Uit',
        moreInfo: 'Meer informatie'
      },
      menu: {
        applications: 'Jouw instellingen',
        about: 'Over ConsentCookie',
        open: 'ConsentCookie openen',
        close: 'ConsentCookie sluiten',
        disabled: 'accepteer eerst',
      },
      applications: {
        title: 'Jouw instellingen',
        moreInfo: 'Meer informatie over deze applicaties',
        moreInfoLink: 'https://www.consentcookie.nl',
        actions: {
          gdpr: 'Recht op...',
        },
        detail: {
          moreInfo: 'Meer informatie over',
          gdprInfo: 'Contact over jouw AVG rechten'
        },
        profile: {
          title: 'Jouw profiel',
          loading: 'Profiel wordt opgehaald',
          noPlugin: 'Deze applicatie heeft geen publiek profiel beschikbaar',
          noProfile: 'Geen profiel beschikbaar',
        }
      },
      about: {
        title: 'Over ConsentCookie',
        text: DEFAULT_RESOURCES_ABOUT_TEXT,
      },
      consent: {
        title: 'ConsentCookie!',
        text: DEFAULT_RESOURCES_CONSENT_TEXT,
        button: 'Ok!',
        infolink: 'https://www.consentcookie.nl',
      },
    },
  },
};
