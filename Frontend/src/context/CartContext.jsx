import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItem = state.items.find(item => item.medicine._id === action.payload.medicine._id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.medicine._id === action.payload.medicine._id
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    )
                };
            } else {
                return {
                    ...state,
                    items: [...state.items,  action.payload]
                };
            }
        
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                items: state.items.filter(item => item.medicine._id !== action.payload)
            };
        
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item.medicine._id === action.payload.medicineId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        
        case 'CLEAR_CART':
            return {
                ...state,
                items: [],
                subscriptionDetails: null
            };
        
        case 'SET_CART':
            return {
                ...state,
                items: action.payload
            };

        case 'SET_SUBSCRIPTION_DETAILS':
            return {
                ...state,
                subscriptionDetails: action.payload
            };

        case 'CLEAR_SUBSCRIPTION_DETAILS':
            return {
                ...state,
                subscriptionDetails: null
            };
        
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
        cartReducer,
        { items: [], subscriptionDetails: null },
        (initialState) => {
            try {
                const savedCart = localStorage.getItem('cart');
                const savedSubscription = localStorage.getItem('subscriptionDetails');
                return {
                    items: savedCart ? JSON.parse(savedCart) : initialState.items,
                    subscriptionDetails: savedSubscription ? JSON.parse(savedSubscription) : initialState.subscriptionDetails
                };
            } catch (e) {
                console.error('Error loading cart:', e);
                return initialState;
            }
        }
    );
    

    
    
    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.items));
    }, [state.items]);

    // Save subscription details to localStorage whenever it changes
    useEffect(() => {
        if (state.subscriptionDetails) {
            localStorage.setItem('subscriptionDetails', JSON.stringify(state.subscriptionDetails));
        } else {
            localStorage.removeItem('subscriptionDetails');
        }
    }, [state.subscriptionDetails]);

    const addToCart = (medicine, quantity = 1) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: { medicine, quantity, price: medicine.price }
        });
    };

    const removeFromCart = (medicineId) => {
        dispatch({
            type: 'REMOVE_FROM_CART',
            payload: medicineId
        });
    };

    const updateQuantity = (medicineId, quantity) => {
        dispatch({
            type: 'UPDATE_QUANTITY',
            payload: { medicineId, quantity }
        });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const getCartTotal = () => {
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return state.items.reduce((count, item) => count + item.quantity, 0);
    };

    const setSubscriptionDetails = (details) => {
        if (details) {
            dispatch({
                type: 'SET_SUBSCRIPTION_DETAILS',
                payload: details
            });
        } else {
            dispatch({ type: 'CLEAR_SUBSCRIPTION_DETAILS' });
        }
    };

    const clearSubscriptionDetails = () => {
        dispatch({ type: 'CLEAR_SUBSCRIPTION_DETAILS' });
    };

    const value = {
        items: state.items,
        subscriptionDetails: state.subscriptionDetails,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        setSubscriptionDetails,
        clearSubscriptionDetails
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 