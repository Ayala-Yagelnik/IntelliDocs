import { Button, Box, Container, Typography, TextField, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, login } from '../store/authSlice';
import { StoreType } from '../models/storeModel';
import { useTransition } from 'react';
import { AppDispatch } from '../store/store';
import { setCurrentUser } from '../store/userSlice';
import { User } from '../models/user';

// Colors and Configurations
const primaryColor = "#10a37f";
const textColor = "#333";
const hoverColor = "#0e8c6b";
const MotionButton = motion(Button);

const AuthForm = ({ isRegister = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const error = useSelector((state: StoreType) => state.auth.error);
    const loading = useSelector((state: StoreType) => state.auth.loading);
    const [isPending, startTransition] = useTransition();
    const user = useSelector((state: StoreType) => state.users.user)
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        startTransition(async () => {
            try {
                let userData: { user: User, token: string };
                if (isRegister) {
                    userData = await dispatch(register({ username, email, password })).unwrap();
                }
                userData = await dispatch(login({ email, password })).unwrap() as { user: User; token: string };
                console.log("userData: ", userData);
                localStorage.setItem('token', userData.token);
                dispatch(setCurrentUser(userData.user));
                console.log("Current user:", user);

                navigate('/');
            } catch (err) {
                console.error('Auth failed:', err);
            }
        });
    };

    return (
        <Container maxWidth="sm">
            <Box textAlign="center" my={4}>
                <Typography variant="h4" component="h1" gutterBottom color={textColor}>
                    {isRegister ? 'Sign Up' : 'Login'}
                </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <Box mb={2}>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            required
                            variant="outlined"
                        />
                    </Box>
                )}
                <Box mb={2}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        variant="outlined"
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
                        variant="outlined"
                    />
                </Box>
                {error && <Alert severity="error">{error}</Alert>}
                <Box textAlign="center" mt={2}>
                    <MotionButton
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: primaryColor,
                            '&:hover': { backgroundColor: hoverColor },
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontWeight: 'bold'
                        }}
                        disabled={loading || isPending}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {loading || isPending ? <CircularProgress size={24} color="inherit" /> : (isRegister ? 'Sign Up' : 'Login')}
                    </MotionButton>
                </Box>
            </form>
        </Container>
    );
};

export default AuthForm;
