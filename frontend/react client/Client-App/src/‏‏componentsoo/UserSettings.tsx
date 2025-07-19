import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Avatar,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTheme } from "../context/ThemeContext";
// ...existing imports...
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { updateUser } from "../store/userSlice";
import { StoreType } from "../models/storeModel";

const languages = [
  { code: "en", label: "English" },
  { code: "he", label: "עברית" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
];

const UserSettings: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  // דוגמאות לסטייטים
  const [displayName, setDisplayName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: StoreType) => state.auth.user)

  const handleSave = () => {
    if (user && typeof user.id === "number") {
      dispatch(updateUser({
        id: String(user.id),
        user: {
          ...user,
          id: user.id, // Ensure id is always a number
          username: displayName,
          email,
        }
      }));
    }
    setSnackbarOpen(true);
  };
  // const handleDelete = () => {
  //   dispatch(deleteUser(String(user.id)));
  // };
  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          maxWidth: 600,
          margin: "0 auto",
          borderRadius: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          User Settings
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Theme */}
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
            />
          }
          label="Enable Dark Theme"
        />

        <Divider sx={{ my: 2 }} />

        {/* Profile */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56 }}>J</Avatar>
          <Box>
            <Typography variant="subtitle1">Profile Picture</Typography>
            <Button variant="outlined" size="small" sx={{ mt: 1 }}>
              Change Avatar
            </Button>
          </Box>
        </Stack>

        <TextField
          label="Display Name"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Language</InputLabel>
          <Select
            value={language}
            label="Language"
            onChange={e => setLanguage(e.target.value)}
          >
            {languages.map(lang => (
              <MenuItem key={lang.code} value={lang.code}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
          }
          label="Enable Email Notifications"
        />

        <Divider sx={{ my: 2 }} />

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" color="error">
            Delete Account
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Settings saved!
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default UserSettings;

// import React from "react";
// import { Box, Paper, Typography, Switch, FormControlLabel } from "@mui/material";
// import { useTheme } from "../context/ThemeContext";

// const UserSettings: React.FC = () => {
//   const { isDarkMode, toggleTheme } = useTheme();

//   return (
//     <Box sx={{ p: 3 }}>
//       <Paper
//         elevation={3}
//         sx={{
//           p: 3,
//           maxWidth: 600,
//           margin: "0 auto",
//           borderRadius: 3,
//         }}
//       >
//         <Typography variant="h5" gutterBottom>
//           User Settings
//         </Typography>
//         <Box sx={{ mt: 2 }}>
//           {/* הגדרת Theme */}
//           <FormControlLabel
//             control={
//               <Switch
//                 checked={isDarkMode}
//                 onChange={toggleTheme}
//               />
//             }
//             label="Enable Dark Theme"
//           />
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default UserSettings;