import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { getOfferById } from '../../backend/offerService'; // Ajusta la ruta de importación

const ModalOfferDetails = ({ offerId, open, handleClose }) => {
  const [offerDetails, setOfferDetails] = useState(null);

  useEffect(() => {
    if (offerId) {
      getOfferById(
        offerId,
        (data) => setOfferDetails(data),
        (errors) => console.error(errors)
      );
    }
  }, [offerId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 24, maxWidth: 400, mx: 'auto', mt: '10%' }}>
        <Typography variant="h6" component="h2">Offer Details</Typography>
        {offerDetails ? (
          <Box mt={2}>
            <Typography><strong>Buyer ID:</strong> {offerDetails.buyerId}</Typography>
            <Typography><strong>Seller ID:</strong> {offerDetails.sellerId}</Typography>
            <Typography><strong>Amount:</strong> {offerDetails.amount}</Typography>
            <Typography><strong>Items:</strong></Typography>
            <ul>
              {offerDetails.items.map((item, index) => (
                <li key={index}>
                  Product ID: {item.productId}, Quantity: {item.quantity}
                </li>
              ))}
            </ul>
          </Box>
        ) : (
          <Typography>Loading...</Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
      </Box>
    </Modal>
  );
};

export default ModalOfferDetails;