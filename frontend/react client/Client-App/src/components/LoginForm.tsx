import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { StoreType } from '../models/storeModel';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector((state: StoreType) => state.auth.error);
    const loading = useSelector((state: StoreType) => state.auth.loading);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await dispatch<any>(login({ email, password })).unwrap();
            console.log('Login successful:', response);
            localStorage.setItem('token', response.token);
            navigate('/files');
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    התחברות
                </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
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
                <Box textAlign="center">
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        התחבר
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default LoginForm;