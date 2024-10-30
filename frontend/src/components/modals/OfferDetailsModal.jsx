// frontend/src/components/modals/OfferDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { getOfferById } from "../../backend/offerService";

const OfferDetailsModal = ({ offerId, show, handleClose }) => {
  const [offerDetails, setOfferDetails] = useState(null);

  useEffect(() => {
    if (offerId) {
      getOfferById(offerId, setOfferDetails, (error) => {
        console.error("Error fetching offer details:", error);
      });
    }
  }, [offerId]);

  return (
      <Modal open={show} onClose={handleClose}>
        <Box
            sx={{
              width: 400,
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              mx: "auto",
              my: "10vh",
            }}
        >
          <Typography variant="h6" component="h2">
            Offer Details
          </Typography>
          {offerDetails ? (
              <div>
                <p>ID: {offerDetails.id}</p>
                <p>Description: {offerDetails.description}</p>
                <p>Price: {offerDetails.price}</p>
                {/* Add more details as needed */}
              </div>
          ) : (
              <p>Loading...</p>
          )}
          <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
  );
};

export default OfferDetailsModal;