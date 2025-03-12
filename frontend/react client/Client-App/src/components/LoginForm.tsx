import React, { useState } from 'react';
import { login } from '../services/authService';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await login({ email, password });
            console.log('Login successful:', response);
            localStorage.setItem('token', response.token);
            navigate('/files');
        } catch (err) {
            console.error('Login failed:', err);
            setError('Login failed. Please check your credentials and try again.');
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
                    <Button type="submit" variant="contained" color="primary">
                        התחבר
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default LoginForm;