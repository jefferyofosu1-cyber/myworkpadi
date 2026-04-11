import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../utils/api';

const BookingContext = createContext();

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (!context) throw new Error('useBooking must be used within a BookingProvider');
    return context;
};

export const BookingProvider = ({ children }) => {
    const [screen, setScreen] = useState(0);
    const [user, setUser] = useState(null);
    const [service, setService] = useState({ 
        abbr: "AC", 
        name: "AC Repair & Servicing", 
        type: "assessment", 
        price: "GHS 25" 
    });
    
    const [bookingData, setBookingData] = useState({
        problemDescription: '',
        photos: [],
        scheduledDay: 0,
        scheduledTime: '2:00 PM',
        address: '',
        landmark: '',
        lat: 5.6037, // Default Accra
        lng: -0.1870,
    });

    const [bookingId, setBookingId] = useState(null);
    const [selectedTasker, setSelectedTasker] = useState(null);
    const [provider, setProvider] = useState("mtn");
    const [isProcessing, setIsProcessing] = useState(false);

    // Navigation
    const goNext = () => setScreen(s => Math.min(s + 1, 14));
    const goBack = () => setScreen(s => Math.max(s - 1, 0));
    const goTo = (i) => setScreen(i);

    // Persistence Check
    useEffect(() => {
        const userId = localStorage.getItem('taskgh_user_id');
        if (userId) setUser({ id: userId });
    }, []);

    const value = {
        screen, setScreen,
        user, setUser,
        service, setService,
        bookingData, setBookingData,
        bookingId, setBookingId,
        selectedTasker, setSelectedTasker,
        provider, setProvider,
        isProcessing, setIsProcessing,
        goNext, goBack, goTo
    };

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
};
