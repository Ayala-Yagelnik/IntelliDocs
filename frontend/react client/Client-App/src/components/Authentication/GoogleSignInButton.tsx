import { Box, Button, useTheme } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useRef, useState } from "react";

interface GoogleSignInButtonProps {
    onSuccess: (token: string) => void;
    onError?: (msg: string) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onSuccess, onError }) => {
    const theme = useTheme();
    const [showReal, setShowReal] = useState(false);
    const googleLoginRef = useRef<HTMLDivElement>(null);

    // אחרי שמציגים את GoogleLogin, מבצעים קליק אוטומטי
    const handleStyledClick = () => {
        setShowReal(true);
        setTimeout(() => {
            const googleButton = googleLoginRef.current?.querySelector('div[role="button"]');
            if (googleButton) {
                (googleButton as HTMLElement).click();
            }
            setShowReal(false);
        }, 50);
    };

    // אחרי הצלחה/שגיאה - מחזירים לכפתור המעוצב
    interface GoogleCredentialResponse {
        credential?: string;
        select_by?: string;
        clientId?: string;
    }

    const handleGoogleSuccess = (credentialResponse: GoogleCredentialResponse) => {
        setShowReal(false);
        const token = credentialResponse.credential;
        if (token) {
            onSuccess(token);
        } else {
            onError?.('Google Sign-In failed. Please try again.');
        }
    };

    const handleGoogleError = () => {
        setShowReal(false);
        onError?.('Google Sign-In failed. Please try again.');
    };

    return (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2, position: "relative" }}>
            {/* כפתור מעוצב */}
            {!showReal && (
                <Button
                    onClick={handleStyledClick}
                    startIcon={
                        <Box
                            component="img"
                            src="/google.png"
                            alt="Google"
                            sx={{ width: 24, height: 24 }}
                        />
                    }
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: theme.palette.background.paper,
                        color: theme.palette.text.primary,
                        borderColor: theme.palette.divider,
                        transition: "all 0.2s",
                        "&:hover": {
                            bgcolor: theme.palette.action.hover,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                        },
                        py: 1.2,
                        fontSize: "1rem",
                    }}
                    fullWidth
                    size="large"
                >
                    Sign in with Google
                </Button>
            )}

            {/* GoogleLogin האמיתי, מוסתר ועם ref */}
            {showReal && (
                <Box
                    ref={googleLoginRef}
                    sx={{
                        position: "absolute",
                        left: 0,
                        width: "100%",
                        opacity: 0,
                        pointerEvents: "none",
                    }}
                >
                    <GoogleLogin
                        locale="en"
                        text="signin_with"
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap={false}
                        logo_alignment="left"
                        theme={theme.palette.mode === 'dark' ? 'filled_black' : 'outline'}
                        size="large"
                        width="100%"
                    />
                </Box>
            )}
        </Box>
    );
};

export default GoogleSignInButton;