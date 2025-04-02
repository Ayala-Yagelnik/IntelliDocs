import { Button, Box, Container, Typography, TextField, Alert, CircularProgress, Paper, IconButton, InputAdornment, Divider, useMediaQuery, useTheme, } from '@mui/material';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, login } from '../store/authSlice';
import { StoreType } from '../models/storeModel';
import { useTransition } from 'react';
import { AppDispatch } from '../store/store';
import { setCurrentUser } from '../store/userSlice';
import { User } from '../models/user';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock, User as LucideUser, AlertCircle } from "lucide-react"

const MotionButton = motion(Button);

const AuthForm = ({ isRegister = false }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [username, setUsername] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                if (err) {
                    setErrorMessage(err);
                } else {
                    setErrorMessage('An unknown error occurred');
                }
            }
        });
    };

    const handleGoogleSignIn = async (token: string) => {
        try {
            const response = await axios.post<{ user: User; token: string }>(`${import.meta.env.VITE_BASE_URL}/auth/google`, { token });
            const { user, token: jwtToken } = response.data;

            localStorage.setItem('token', jwtToken);
            dispatch(setCurrentUser(user));
            navigate('/');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Google Sign-In Error:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.message || 'Failed to sign in with Google. Please try again.');
        }
    };


    return (
        <Container maxWidth="sm" sx={{ py: { xs: 4, md: 8 } }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper
                    elevation={0}
                    sx={{
                        padding: { xs: 3, md: 5 },
                        borderRadius: 3,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                        backgroundColor: "#fff",
                        border: "1px solid #eaeaea",
                    }}
                >
                    <Box textAlign="center" mb={4}>
                        <Typography
                            variant={isMobile ? "h5" : "h4"}
                            component="h1"
                            gutterBottom
                            sx={{ fontWeight: 700, color: "#333" }}
                        >
                            {isRegister ? "Create Account" : "Welcome Back"}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                            {isRegister
                                ? "Sign up to start managing your documents intelligently"
                                : "Sign in to your IntelliDocs account"}
                        </Typography>
                    </Box>
                    <form onSubmit={handleSubmit}>
                        {isRegister && (
                            <Box mb={3}>
                                <TextField
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    fullWidth
                                    required
                                    variant="outlined"
                                    disabled={isPending}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LucideUser size={20} color="#666" />
                                            </InputAdornment>
                                        ),
                                        sx: { borderRadius: 2 },
                                    }}
                                />
                            </Box>
                        )}
                        <Box mb={3}>
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                disabled={isPending}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Mail size={20} color="#666" />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 2 },
                                }}
                            />
                        </Box>
                        <Box mb={3}>
                            <TextField
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                required
                                variant="outlined"
                                disabled={isPending}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock size={20} color="#666" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 2 },
                                }}
                            />
                        </Box>
                        {errorMessage && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} icon={<AlertCircle size={20} />}>
                                {errorMessage}
                            </Alert>
                        )}
                        <Box textAlign="center" mt={3}>
                            <MotionButton
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                sx={{
                                    backgroundColor: "#10a37f",
                                    "&:hover": { backgroundColor: "#0e8c6b" },
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 500,
                                    textTransform: "none",
                                    fontSize: "1rem",
                                }}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : isRegister ? "Create account" : "Sign in"}
                            </MotionButton>
                        </Box>
                    </form>
                    <Divider sx={{ my: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            OR
                        </Typography>
                    </Divider>
                    <Box
                        sx={{
                            width: "100%", // תופס את כל הרוחב
                            display: "flex",
                            justifyContent: "center",
                            mt: 2, // מרווח עליון
                        }}
                    >
                        <GoogleLogin
                            locale='en'
                            text="signin_with"
                            onSuccess={(credentialResponse) => {
                                console.log('Google Sign-In Success:', credentialResponse);
                                const token = credentialResponse.credential;
                                if (token) {
                                    handleGoogleSignIn(token);
                                } else {
                                    console.error('Google Sign-In failed: Token is undefined');
                                    setErrorMessage('Google Sign-In failed. Please try again.');
                                }
                            }}
                            onError={() => {
                                console.error('Google Sign-In Failed');
                                setErrorMessage('Google Sign-In failed. Please try again.');
                            }}
                            useOneTap
                            theme="outline" // עיצוב כפתור
                            size="large"
                        />
                    </Box>

                    <Box textAlign="center" mt={4}>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                            {isRegister ? (
                                <>
                                    Already have an account?{" "}
                                    <Link to="/login" style={{ color: "#10a37f", fontWeight: 500, textDecoration: "none" }}>
                                        Sign in
                                    </Link>
                                </>
                            ) : (
                                <>
                                    New to IntelliDocs?{" "}
                                    <Link to="/register" style={{ color: "#10a37f", fontWeight: 500, textDecoration: "none" }}>
                                        Create an account
                                    </Link>
                                </>
                            )}
                        </Typography>
                    </Box>
                </Paper>
            </motion.div>
        </Container>
    );
};

export default AuthForm;
