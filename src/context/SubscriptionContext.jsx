/* eslint-disable react/prop-types */
import { createContext, useState, useContext } from 'react';

// Buat context
const SubscriptionContext = createContext();

// Custom hook untuk memudahkan akses context
export const useSubscription = () => useContext(SubscriptionContext);

// Provider yang membungkus seluruh aplikasi
export const SubscriptionProvider = ({ children }) => {
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscriptionSuccess = () => {
        setIsSubscribed(true);
    };

    return (
        <SubscriptionContext.Provider value={{ isSubscribed, handleSubscriptionSuccess }}>
            {children}
        </SubscriptionContext.Provider>
    );
};
