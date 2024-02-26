// Actions
const newNotification = (which) => ({
    type: 'NEW_NOTIFICATION',
    payload: which
});
const clearNotification = (which) => ({
    type: 'CLEAR_NOTIFICATION',
    payload: which,
});

const initialState = {
    orders: 0,
}

// Reducer
// In both cases, action.payload holds "which" tab should be displaying the badge
const notification = (state = initialState, action) => {
    const copy = { ...state.notifications };
    if (action.type === 'NEW_NOTIFICATION') {
        copy[action.payload]++;
        return {
            ...state,
            notifications: copy
        }
    } else if (action.type === 'CLEAR_NOTIFICATION') {
        copy[action.payload] = 0
        return {
            ...state,
            notification: copy
        }
    } else {
        return state;
    }
}

export {
    newNotification,
    clearNotification,
    notification,
}