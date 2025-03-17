import { Button, Box, Container, Typography, TextField, Alert, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, login } from '../store/authSlice';
import { StoreType } from '../models/storeModel';

// Colors and Configurations
const primaryColor = "#10a37f";
const textColor = "#333";
const hoverColor = "#0e8c6b";
const MotionButton = motion(Button);

const AuthForm = ({ isRegister = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState(''); 
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const error = useSelector((state: StoreType) => state.auth.error);
    const loading = useSelector((state: StoreType) => state.auth.loading);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (isRegister) {
                await dispatch(register({ email, password,username: name })).unwrap(); 
            }
            const response = await dispatch(login({ email, password })).unwrap();
            localStorage.setItem('token', response.token);
            navigate('/');
        } catch (err) {
            console.error('Auth failed:', err);
        }
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
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : (isRegister ? 'Sign Up' : 'Login')}
                    </MotionButton>
                </Box>
            </form>
        </Container>
    );
};

export default AuthForm;
