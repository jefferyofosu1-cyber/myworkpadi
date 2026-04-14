import React from 'react';
import { BookingProvider, useBooking } from './BookingContext';

// Import Screens (to be created)
import Screen0_Login from './screens/Screen0_Login';
import Screen1_OTP from './screens/Screen1_OTP';
import Screen2_Home from './screens/Screen2_Home';
import Screen3_ServiceDetail from './screens/Screen3_ServiceDetail';
import Screen4_Describe from './screens/Screen4_Describe';
import Screen5_DateTime from './screens/Screen5_DateTime';
import Screen6_Address from './screens/Screen6_Address';
import Screen7_Tasker from './screens/Screen7_Tasker';
import Screen8_Payment from './screens/Screen8_Payment';
import Screen9_Confirmed from './screens/Screen9_Confirmed';
import Screen10_Tracking from './screens/Screen10_Tracking';
import Screen11_Quote from './screens/Screen11_Quote';
import Screen12_InProgress from './screens/Screen12_InProgress';
import Screen13_Review from './screens/Screen13_Review';
import Screen14_Complete from './screens/Screen14_Complete';

import './styles/BookingFlow.css';

const SCREENS = [
  Screen0_Login, Screen1_OTP, Screen2_Home, Screen3_ServiceDetail,
  Screen4_Describe, Screen5_DateTime, Screen6_Address, Screen7_Tasker,
  Screen8_Payment, Screen9_Confirmed, Screen10_Tracking, Screen11_Quote,
  Screen12_InProgress, Screen13_Review, Screen14_Complete,
];

const BookingFlowContent = () => {
    const { screen } = useBooking();
    const CurrentScreen = SCREENS[screen];

    // Screens 0 (Login), 1 (OTP), and 2 (Home/Services) are "Hero" screens
    const isHeroScreen = screen <= 2;

    if (isHeroScreen) {
        return (
            <div className="booking-flow-container hero-layout">
                <div className="booking-flow-inner-fluid">
                    <CurrentScreen />
                </div>
            </div>
        );
    }

    return (
        <div className="booking-flow-container focused-layout" style={{ paddingTop: 80 }}>
            <div className="booking-flow-inner-constrained">
                <CurrentScreen />
            </div>
        </div>
    );
};

export default function BookingFlowContainer() {
    return (
        <BookingProvider>
            <BookingFlowContent />
        </BookingProvider>
    );
}
