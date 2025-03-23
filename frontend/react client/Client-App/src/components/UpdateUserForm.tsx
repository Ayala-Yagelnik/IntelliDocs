import React, { useState } from 'react';
import { Container, TextField, Typography, Box } from '@mui/material';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserById, updateUser } from '../store/userSlice';
// import { StoreType } from '../models/storeModel';
// import { useParams, useNavigate } from 'react-router-dom';
// import { AppDispatch } from '../store/store';

const UpdateUserForm: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  // const dispatch = useDispatch<AppDispatch>();
  // const navigate = useNavigate();
  // const user = useSelector((state: StoreType) => state.users.user);
  // const loading = useSelector((state: StoreType) => state.users.loading);
  // const error = useSelector((state: StoreType) => state.users.error);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // useEffect(() => {
    // if (id) {
    //   dispatch(fetchUserById(id));
    // }
  // }, [dispatch, id]);

  // useEffect(() => {
  //   if (user) {
  //     setName(user.name);
  //     setEmail(user.email);
  //   }
  // }, [user]);

  // const handleSubmit = async (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (id) {
  //     try {
  //       await dispatch(updateUser({ id, user: { ...user, id, name, email } })).unwrap();
  //       navigate('/profile');
  //     } catch (err) {
  //       console.error('Update failed:', err);
  //     }
  //   }
  // };

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          עדכון פרטי משתמש
        </Typography>
      </Box>
      {/* <form onSubmit={handleSubmit}> */}
        <Box mb={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
        </Box>
        {/* {error && ( */}
          <Box mb={2}>
            {/* <Alert severity="error">{error}</Alert> */}
          </Box>
        {/* )} */}
        <Box textAlign="center">
          {/* <Button type="submit" variant="contained" color="primary" disabled={loading}> */}
            עדכן
          {/* </Button> */}
        </Box>
      {/* </form> */}
    </Container>
  );
};

export default UpdateUserForm;