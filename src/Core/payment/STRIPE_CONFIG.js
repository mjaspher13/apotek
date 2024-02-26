const STRIPE_CONFIG = {
  APIs: {
    wooCommerce: 'wooCommerce',
    firebase: 'firebase',
    shopify: 'shopify',
  },
  API_TO_USE: 'wooCommerce',
  stripe_ENV: {
    API: {
      baseURL: 'https://murmuring-caverns-83164.herokuapp.com/', //your copied heroku link
      timeout: 9000,
    },
  },
  STRIPE_CONFIG: {
    PUBLISHABLE_KEY: 'pk_test_LSo5mTIQqkRiTWd0eBMSDAXf00QZGCttt3', // "pk_test_..." in test mode and ""pk_live_..."" in live mode
    MERCHANT_ID: 'Your_merchant_id_goes_here',
    ANDROID_PAYMENT_MODE: 'test', // test || production
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

export default STRIPE_CONFIG;
