import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
} from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import HistoryIcon from '@mui/icons-material/History';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <EventSeatIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Book Seats</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Book your train seats for your next journey. Choose from available seats and make your reservation.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/book-seats')}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <HistoryIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">My Bookings</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  View your current and past bookings. Manage your reservations and check booking status.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => navigate('/my-bookings')}
                >
                  View Bookings
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrainIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Train Information</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Get information about train schedules, routes, and other important details for your journey.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  disabled
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard; 