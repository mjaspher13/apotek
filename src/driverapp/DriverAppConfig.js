import {IMLocalized, setI18nConfig} from './Core/localization/IMLocalization';

setI18nConfig();

const regexForNames = /^[a-zA-Z]{2,25}$/;
const regexForPhoneNumber = /\d{9}$/;
const APP_NAME = 'Apotek';

const DriverAppConfig = {
  isSMSAuthEnabled: false,
  appIdentifier: 'rn-multivendor-driverapp-android',
  tables: {
    VENDOR: 'vendors',
    VENDOR_ORDERS: 'restaurant_orders',
    VENDOR_DELIVERIES: 'restaurant_deliveries',
    VENDOR_REVIEWS: 'vendor_reviews',
    VENDOR_PRODUCTS: 'vendor_products',
    RESERVATIONS: 'reservations',
  },
  onboardingConfig: {
    welcomeTitle: IMLocalized(`Welcome to ${APP_NAME}`),
    welcomeCaption: IMLocalized('Make money by delivering medicines.'),
    walkthroughScreens: [
      {
        icon: require('../assets/icons/restaurant-menu.png'),
        title: IMLocalized(`Welcome to ${APP_NAME}`),
        description: IMLocalized(
          'Log in and start delivering medicines to make money.',
        ),
      },
      {
        icon: require('../assets/icons/delivery-icon.png'),
        title: IMLocalized('Medicine Ordering'),
        description: IMLocalized(
          'Deliver medicines and earn a generous fee for your work.',
        ),
      },
      {
        icon: require('../assets/icons/binoculars.png'),
        title: IMLocalized('Delivery'),
        description: IMLocalized(
          'Track your routes and orders in real-time, directly in the app.',
        ),
      },
      {
        icon: require('../assets/icons/paymongo.png'),
        title: IMLocalized('Seamless Payments'),
        description: IMLocalized(
          'We handle the payments for you, so you can focus on earning money.',
        ),
      },
    ],
  },
  tosLink: 'https://newagent-8984e.web.app/terms',
  editProfileFields: {
    sections: [
      {
        title: IMLocalized('PUBLIC PROFILE'),
        fields: [
          {
            displayName: IMLocalized('First Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'firstName',
            placeholder: 'Your first name',
          },
          {
            displayName: IMLocalized('Last Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'lastName',
            placeholder: 'Your last name',
          },
        ],
      },
      {
        title: IMLocalized('PRIVATE DETAILS'),
        fields: [
          {
            displayName: IMLocalized('E-mail Address'),
            type: 'text',
            editable: false,
            key: 'email',
            placeholder: 'Your email address',
          },
          {
            displayName: IMLocalized('Phone Number'),
            type: 'text',
            editable: true,
            regex: regexForPhoneNumber,
            key: 'phone',
            placeholder: 'Your phone number',
          },
        ],
      },
    ],
  },
  userSettingsFields: {
    sections: [
      {
        title: IMLocalized('SECURITY'),
        fields: [
          {
            displayName: IMLocalized('Allow Push Notifications'),
            type: 'switch',
            editable: true,
            key: 'push_notifications_enabled',
            value: false,
          },
          {
            displayName: IMLocalized('Enable Face ID / Touch ID'),
            type: 'switch',
            editable: true,
            key: 'face_id_enabled',
            value: false,
          },
        ],
      },
      {
        title: IMLocalized('PUSH NOTIFICATIONS'),
        fields: [
          {
            displayName: IMLocalized('Order updates'),
            type: 'switch',
            editable: true,
            key: 'order_updates',
            value: false,
          },
          {
            displayName: IMLocalized('New arrivals'),
            type: 'switch',
            editable: false,
            key: 'new_arrivals',
            value: false,
          },
          {
            displayName: IMLocalized('Promotions'),
            type: 'switch',
            editable: false,
            key: 'promotions',
            value: false,
          },
        ],
      },
      {
        title: IMLocalized('ACCOUNT'),
        fields: [
          {
            displayName: IMLocalized('Save'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsFields: {
    sections: [
      {
        title: IMLocalized('CONTACT'),
        fields: [
          {
            displayName: IMLocalized('Address'),
            type: 'text',
            editable: false,
            key: 'contactus',
            value: 'Taguig City 1218',
          },
          {
            displayName: IMLocalized('E-mail us'),
            value: 'mjaspher.ramile@gmail.com',
            type: 'text',
            editable: false,
            key: 'email',
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Call Us'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsPhoneNumber: '+63 976 001 8217',
  APIs: {
    firebase: 'firebase',
  },
  API_TO_USE: 'firebase',
  stripe_ENV: {
    API: {
      baseURL: 'https://murmuring-caverns-83174.herokuapp.com/', //your copied heroku link
      timeout: 9000,
    },
  },
  STRIPE_CONFIG: {
    PUBLISHABLE_KEY: 'pk_test_LSo5mTIQqkRiTWd0eBMSDAXf00QZGCttt3', // "pk_test_..." in test mode and ""pk_live_..."" in live mode
    MERCHANT_ID: 'Your_merchant_id_goes_here',
    ANDROID_PAYMENT_MODE: 'test', // test || production
  },
  GOOGLE_SIGNIN_CONFIG: {
    SCOPES: ['https://www.googleapis.com/auth/drive.photos.readonly'],
    WEB_CLIENT_ID:
      '706061484183-l0l58dds4kg329fh1trbiha1ci5rqm5n.apps.googleusercontent.com', // from google-services.json file
    OFFLINE_ACCESS: true,
  },
  FIREBASE_COLLECTIONS: {
    USERS: 'users',
    PAYMENT_METHODS: 'payment_methods',
    STRIPE_CUSTOMERS: 'stripe_customers',
    CATEGORIES: 'vendor_categories',
    CHARGES: 'charges',
    ORDERS: 'restaurant_orders',
    SOURCES: 'sources',
    PRODUCTS: 'vendor_products',
    SHIPPING_METHODS: 'shipping_methods',
  },
};

export default DriverAppConfig;
