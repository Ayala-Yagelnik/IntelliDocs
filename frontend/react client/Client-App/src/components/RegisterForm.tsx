import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../store/authSlice';
import { StoreType } from '../models/storeModel';
import { useTransition } from 'react';

const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector((state: StoreType) => state.auth.error);
    const loading = useSelector((state: StoreType) => state.auth.loading);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        startTransition(async () => {
            try {
                const registerResponse = await dispatch(register({ username, email, password })).unwrap();
                console.log('Registration successful:', registerResponse);
    
                // Perform login after successful registration
                const loginResponse = await dispatch(login({ email, password })).unwrap();
                console.log('Login successful:', loginResponse);
    
                navigate('/'); // Redirect to home or any other page after login
            } catch (err) {
                console.error('Registration failed:', err);
            }
        });
    };

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    הרשמה
                </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
                <Box mb={2}>
                    <TextField
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                <Box mb={2}>
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                    />
                </Box>
                {error && (
                    <Box mb={2}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading || isPending}>
                    {loading || isPending ? 'טוען...' : 'הרשמה'}
                </Button>
            </form>
        </Container>
    );
};

export default RegisterForm;