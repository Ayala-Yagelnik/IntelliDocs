import { Container, Typography, Box,Button} from "@mui/material";
import { motion } from "framer-motion";
// import ShareFile from "./ShareFile";
import FileGridToggle from "./FileGridToggle";

// צבעים וקונפיגורציות
const primaryColor = "#10a37f";
const textColor = "#333";

const MotionButton = motion(Button);

export const Home = () => (
  <Container  sx={{ textAlign: "center", pt: 10 }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <Typography variant="h3" fontWeight={600} color={textColor} gutterBottom>
              Manage Your Documents, Intelligently.
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Secure cloud storage with smart organization and collaboration tools.
          </Typography>
          <Box mt={3} display="flex" justifyContent="center" gap={2}>
              <MotionButton
                  variant="contained"
                  sx={{ backgroundColor: primaryColor, color: "white", borderRadius: "12px" }}
                  whileHover={{ scale: 1.05 }}
              >
                  Get Started
              </MotionButton>
              <MotionButton
                  variant="outlined"
                  sx={{ borderColor: primaryColor, color: primaryColor, borderRadius: "12px" }}
                  whileHover={{ scale: 1.05 }}
              >
                  Learn More
              </MotionButton>
              {/* <ShareFile open={true} onClose={() => {}} /> */}
          </Box>
          <FileGridToggle />

      </motion.div>
  </Container>
);

export default Home;