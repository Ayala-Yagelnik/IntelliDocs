import { Container, Typography, Box, Button, useMediaQuery, useTheme, Grid, Paper } from "@mui/material"
import { motion } from "framer-motion"
import { Link } from "react-router";
import { FileText, Upload, Share2, Shield } from "lucide-react"
import Logo from "./logo"


const MotionTypography = motion(Typography)
const MotionBox = motion(Box)
const MotionPaper = motion(Paper)

export const Home = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const features = [
        {
            icon: <FileText size={24} />,
            title: "Smart Document Management",
            description: "Organize and access your documents with AI-powered categorization and search.",
        },
        {
            icon: <Upload size={24} />,
            title: "Secure Cloud Storage",
            description: "Store your files safely in the cloud with enterprise-grade encryption.",
        },
        {
            icon: <Share2 size={24} />,
            title: "Easy Collaboration",
            description: "Share files and folders with teammates and control access permissions.",
        },
        {
            icon: <Shield size={24} />,
            title: "Privacy First",
            description: "Your data is yours. We prioritize your privacy with strict security measures.",
        },
    ]

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
                <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
                    <Logo variant="full" size="large" color="dark"/>
                </Box>

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

            {/* <MotionBox
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
        <Image
          src="/placeholder.svg?height=600&width=1200"
          alt="IntelliDocs Dashboard Preview"
          fill
          style={{ objectFit: "cover" }}
        />
      </MotionBox> */}


            <Box id="learn-more" sx={{ width: "100%", mt: 12, mb: 6 }}>
                <MotionTypography
                    variant="h4"
                    fontWeight={700}
                    color="#333"
                    gutterBottom
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    Features that make document management effortless
                </MotionTypography>

                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <MotionPaper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                    borderRadius: 3,
                                    border: "1px solid #eaeaea",
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                                        borderColor: "#10a37f",
                                    },
                                }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: "50%",
                                        backgroundColor: "rgba(16, 163, 127, 0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        mb: 2,
                                        color: "#10a37f",
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </MotionPaper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                sx={{
                    mt: 8,
                    p: 4,
                    borderRadius: 4,
                    backgroundColor: "rgba(16, 163, 127, 0.05)",
                    maxWidth: 800,
                    width: "100%",
                }}
            >
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                    Ready to get started?
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Join thousands of users who trust IntelliDocs for their document management needs.
                </Typography>
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
                        Create Free Account
                    </Button>
                </motion.div>
            </MotionBox>

        </Container>
    )
}

export default Home

