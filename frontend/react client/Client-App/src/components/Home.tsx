import { Container, Typography, Box, Button, useMediaQuery, useTheme } from "@mui/material"
import { motion } from "framer-motion"
import { Link } from "react-router";



const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

export const Home = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    return (
        <Container
            maxWidth="lg"
            sx={{
                textAlign: "center",
                py: { xs: 8, md: 12 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "calc(100vh - 64px)",
            }}
        >
            <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                sx={{ maxWidth: 700, mx: "auto" }}
            >
                <MotionTypography
                    variant={isMobile ? "h4" : "h2"}
                    fontWeight={700}
                    color="#333"
                    gutterBottom
                    sx={{ lineHeight: 1.2 }}
                >
                    Manage Your Documents, Intelligently.
                </MotionTypography>

                <MotionTypography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                    sx={{
                        fontSize: { xs: "1rem", md: "1.125rem" },
                        mb: 4,
                        maxWidth: 600,
                        mx: "auto",
                    }}
                >
                    Secure cloud storage with smart organization and collaboration tools powered by AI.
                </MotionTypography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                        width: { xs: "100%", sm: "auto" },
                    }}
                >
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            component={Link}
                            to="/register"
                            variant="contained"
                            size="large"
                            sx={{
                                bgcolor: "#10a37f",
                                color: "white",
                                borderRadius: "8px",
                                px: 4,
                                py: 1.5,
                                fontWeight: 500,
                                "&:hover": {
                                    bgcolor: "#0e8c6b",
                                },
                            }}
                        >
                            Get Started
                        </Button>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Button
                            component={Link}
                            to="#learn-more"
                            variant="outlined"
                            size="large"
                            sx={{
                                borderColor: "#10a37f",
                                color: "#10a37f",
                                borderRadius: "8px",
                                px: 4,
                                py: 1.5,
                                fontWeight: 500,
                                "&:hover": {
                                    borderColor: "#0e8c6b",
                                    color: "#0e8c6b",
                                    bgcolor: "rgba(16, 163, 127, 0.04)",
                                },
                            }}
                        >
                            Learn More
                        </Button>
                    </motion.div>
                </Box>
            </MotionBox>

            <MotionBox
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                sx={{
                    mt: 8,
                    width: "100%",
                    maxWidth: 900,
                    height: { xs: 200, md: 300 },
                    position: "relative",
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
            >

            </MotionBox>
        </Container>
    )
}

export default Home

