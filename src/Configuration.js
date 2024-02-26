export const VENDOR = 'vendors';
export const VENDOR_ORDERS = 'restaurant_orders';
export const VENDOR_DELIVERIES = 'restaurant_deliveries';
export const VENDOR_REVIEWS = 'vendor_reviews';
export const VENDOR_PRODUCTS = 'vendor_products';
export const RESERVATIONS = 'reservations';
export const VENDOR_CATEGORIES = 'vendor_categories';
export const VENDOR_DEALS = 'app_banners';
export const DELIVERY_FEE = 200;
export const FIRST_DELIVERY_FREE = false;
export const LOW_STOCK_THRESHOLD = 50;
export const TARGET_PAYMENT_STATUS = 'SUCCESS';
export const SETTINGS = 'admin_configurable_settings';

export const PWD_MULTIPLIER = 1 / 1.12 * 0.8;
export const PWD_DISCOUNTABLE_CATEGORIES = [
    'GLUCOSE-MONITORING',
    'INSULIN-NEEDLES',
];
export const PWD_DISCOUNTABLE_TAGS = [
    'Glucose Test Strips',
    'Lancets',
    'Meter',
    'Insulin Pen Needle',
    'Medicines & Vitamins',
];

// Set to filter for either TDS, A1RX, or other partners
export const VENDOR_ID = 'W7zO9ojOPCHb9dsz4EO6';
// Valid: 3NTjZxbC3bVl9M7sEARJ, W7zO9ojOPCHb9dsz4EO6

export const ORDER_STATUSES = {
    Placed:         'Order Placed',
    Preparing:      'Preparing Order',
    Accepted:       'Order Accepted',   // = Ready to Ship
    Rejected:       'Order Rejected',
    Shipped:        'Order Shipped',
    InTransit:      'In Transit',
    DriverPending:  'Driver Pending',
    DriverAccepted: 'Driver Accepted',
    DriverRejected: 'Driver Rejected',
    Completed:      'Order Completed',
    Received:       'Order Received',
    Cancelled:      'Order Cancelled',

    ManualShipped:  'Manually Shipped',
    ManualDelivered:'Manually Delivered',
};
