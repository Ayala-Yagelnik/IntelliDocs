
import { Container, Typography, Box, Button, useMediaQuery, useTheme, Grid, Paper } from "@mui/material"
import { motion } from "framer-motion"
import { Link } from "react-router";
import { FileText, Upload, Share2, Shield } from "lucide-react"
import Logo from "../logo"
import { Testimonial } from "./Testimonial";
import { ParticleBackground } from "./ParticleBackground";


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

    const testimonials = [
        {
            content:
                "IntelliDocs has transformed how our team manages documents. The AI-powered features save us hours every week.",
            author: "Sarah Johnson",
            company: "Tech Innovations",
            rating: 5,
        },
        {
            content: "The intelligent categorization and search capabilities have made finding documents incredibly easy.",
            author: "Michael Chen",
            company: "Global Solutions",
            rating: 4.5,
        },
        {
            content: "Security and ease of use in one platform. IntelliDocs has become an essential tool for our business.",
            author: "Emma Rodriguez",
            company: "Creative Studios",
            rating: 5,
        },
    ]


    return (
        <>
            <ParticleBackground />

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
                        <Logo variant="full" size="large" color="dark" />
                    </Box>

                    <MotionTypography
                        variant={isMobile ? "h4" : "h2"}
                        fontWeight={700}
                        color="#333"
                        gutterBottom
                        sx={{ lineHeight: 1.2 }}
                    >
                        Manage Your Documents, 
                        <MotionTypography
                            variant={isMobile ? "h3" : "h2"}
                            align="center"
                            sx={{
                                fontWeight: 700,
                             
                                fontSize: "3rem",
                                background: "linear-gradient(90deg,rgb(16, 185, 131) 20%, rgb(20, 184 ,166) 80%)",
                                backgroundClip: "text",
                                textFillColor: "transparent",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                padding: "0.2rem",
                            }}
                        >
                            Intelligently.
                        </MotionTypography>
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

                <Box id="learn-more" sx={{backgroundColor:"rgb(240, 253, 250)", width: "100%",px:8, my: 6, pt: 6 }}>
                    <ParticleBackground />

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
                {/* Testimonials Section */}
                <Box id="testimonials" sx={{ my: 8, scrollMarginTop: 80 }}>
                    <MotionTypography
                        variant="h3"
                        align="center"
                        sx={{ fontWeight: 700, mb: 6 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Trusted by teams worldwide
                    </MotionTypography>

                    <Grid container spacing={3}>
                        {testimonials.map((testimonial, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Testimonial
                                    content={testimonial.content}
                                    author={testimonial.author}
                                    company={testimonial.company}
                                    rating={testimonial.rating}
                                    delay={index * 0.1}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* CTA Section */}
                <MotionBox
                    sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        background: "linear-gradient(135deg, #10a37f 0%, #0e8c6b 100%)",
                        color: "white",
                        position: "relative",
                        overflow: "hidden",
                        mt: 8,
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                                Ready to get started?
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                                Join thousands of teams who use IntelliDocs to manage their documents intelligently.
                            </Typography>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        bgcolor: "white",
                                        color: "primary.main",
                                        borderRadius: 2,
                                        px: 4,
                                        py: 1.5,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": {
                                            bgcolor: "rgba(255, 255, 255, 0.9)",
                                        },
                                    }}
                                >
                                    Sign Up Now
                                </Button>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" } }}>
                            <Box
                                sx={{
                                    height: 200,
                                    width: "100%",
                                    borderRadius: 4,
                                    bgcolor: "rgba(255, 255, 255, 0.1)",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Decorative elements */}
                                {[...Array(5)].map((_, i) => (
                                    <MotionBox
                                        key={i}
                                        sx={{
                                            position: "absolute",
                                            width: 40 + Math.random() * 40,
                                            height: 40 + Math.random() * 40,
                                            borderRadius: "50%",
                                            bgcolor: "rgba(255, 255, 255, 0.1)",
                                        }}
                                        animate={{
                                            x: [Math.random() * 200, Math.random() * 200],
                                            y: [Math.random() * 200, Math.random() * 200],
                                            opacity: [0.1, 0.3, 0.1],
                                        }}
                                        transition={{
                                            duration: 5 + Math.random() * 5,
                                            repeat: Number.POSITIVE_INFINITY,
                                            repeatType: "reverse",
                                        }}
                                    />
                                ))}
                            </Box>
                        </Grid>
                    </Grid>
                </MotionBox>
            </Container>
        </>
    )
}

export default Home


