import {
    LOW_STOCK_THRESHOLD,
    DELIVERY_FEE,
    FIRST_DELIVERY_FREE,
} from '../Configuration';

// Actions
const updateSettings = (newSettingsBatch) => {
    return {
        type: 'SETTINGS_UPDATED',
        payload: newSettingsBatch,
    }
}

// Reducers
const initialState = {
    low_stock_threshold: {
        name: 'low_stock_threshold',
        value: LOW_STOCK_THRESHOLD,
    },
    delivery_fee: {
        name: 'delivery_fee',
        value: DELIVERY_FEE,
    },
    first_delivery_free: {
        name: 'first_delivery_free',
        value: FIRST_DELIVERY_FREE,
    }
};
const settings = (state = initialState, action) => {
    const copy = { ...state };
    switch (action.type) {
        case 'SETTINGS_UPDATED':
            const keys = Object.keys(action.payload);
            for (let key of keys) {
                copy[key] = action.payload[key];
            }
            return copy;
            break;
    }

    return state;
}

export {
    updateSettings,
    settings,
};