import React, { createContext, useState } from 'react';

export const OffersContext = createContext({
  offers: [],
  addOffer: () => {},
  updateOfferStatus: () => {}
});

export const OffersProvider = ({ children }) => {
  const [offers, setOffers] = useState([]);

  const addOffer = ({ title, price, seller, availability, meetingPlace, image, direction }) => {
    const newOffer = {
      id: Date.now().toString(),
      title,
      price,
      seller,
      availability,
      meetingPlace,
      image,
      direction,           // 'sent' or 'received'
      status: 'pending',   // initial status
      timestamp: new Date()
    };
    setOffers(prev => [ newOffer, ...prev ]);
  };

  const updateOfferStatus = (id, status) => {
    setOffers(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  return (
    <OffersContext.Provider value={{ offers, addOffer, updateOfferStatus }}>
      {children}
    </OffersContext.Provider>
  );
};