import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import api from '../services/api';

const SeatBooking = () => {
  const [seats, setSeats] = useState([]);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableSeats, setAvailableSeats] = useState(0);

  useEffect(() => {
    console.log('Component mounted, fetching seats...');
    fetchSeats();
  }, []);

  useEffect(() => {
    console.log('Seats updated:', seats);
    // Update available seats count whenever seats data changes
    const available = seats.filter(seat => !seat.isBooked).length;
    console.log('Available seats:', available);
    setAvailableSeats(available);
  }, [seats]);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      console.log('Making API request to /bookings/seats...');
      const response = await api.get('/bookings/seats');
      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);
      if (!response.data || !Array.isArray(response.data)) {
        console.error('Invalid response data format:', response.data);
        setError('Invalid response from server');
        return;
      }
      setSeats(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching seats:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      if (err.response?.status === 401) {
        setError('Please login to book seats');
      } else {
        setError('Failed to fetch seats. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    try {
      setLoading(true);
      if (numberOfSeats < 1 || numberOfSeats > 7) {
        setError('Please enter a valid number of seats (1-7)');
        return;
      }

      if (numberOfSeats > availableSeats) {
        setError(`Only ${availableSeats} seats are available`);
        return;
      }

      console.log('Attempting to book seats:', numberOfSeats);
      const response = await api.post('/bookings/book', { numberOfSeats });
      setSuccess('Seats booked successfully!');
      setError('');
      setSeats(response.data.seats);
    } catch (err) {
      console.error('Error booking seats:', err);
      if (err.response?.status === 401) {
        setError('Please login to book seats');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to book seats');
      }
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatNumberChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 7) {
      setNumberOfSeats(value);
      setError('');
    } else {
      setError('Please enter a valid number of seats (1-7)');
    }
  };

  const renderSeat = (seat) => {
    const isBooked = seat.isBooked;
    return (
      <Grid item xs={1} key={seat._id}>
        <Paper
          elevation={2}
          sx={{
            p: 1,
            textAlign: 'center',
            bgcolor: isBooked ? 'error.light' : 'success.light',
            color: 'white',
            cursor: isBooked ? 'not-allowed' : 'pointer',
            '&:hover': {
              bgcolor: isBooked ? 'error.main' : 'success.main',
            },
          }}
        >
          {seat.seatNumber}
        </Paper>
      </Grid>
    );
  };

  const renderRow = (rowNumber) => {
    const rowSeats = seats.filter(seat => seat.row === rowNumber);
    const isLastRow = rowNumber === 12; // Last row has 3 seats
    
    return (
      <Grid container spacing={1} sx={{ mb: 2, justifyContent: 'center' }}>
        {rowSeats.map(renderSeat)}
        {isLastRow && (
          <Grid item xs={4} /> // Add empty space for the last row to center the 3 seats
        )}
      </Grid>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Train Seat Booking
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <TextField
              label="Number of Seats"
              type="number"
              value={numberOfSeats}
              onChange={handleSeatNumberChange}
              inputProps={{ min: 1, max: 7 }}
              sx={{ mr: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleBooking}
              disabled={loading || !availableSeats}
            >
              {loading ? <CircularProgress size={24} /> : 'Book Seats'}
            </Button>
          </Box>

          <Typography variant="body1" sx={{ mb: 2 }}>
            Available Seats: {availableSeats}
          </Typography>

          {/* Render each row separately */}
          {[...Array(12)].map((_, index) => renderRow(index + 1))}

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Legend:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Paper sx={{ width: 20, height: 20, bgcolor: 'success.light', mr: 1 }} />
                <Typography variant="body2">Available</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Paper sx={{ width: 20, height: 20, bgcolor: 'error.light', mr: 1 }} />
                <Typography variant="body2">Booked</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SeatBooking; 