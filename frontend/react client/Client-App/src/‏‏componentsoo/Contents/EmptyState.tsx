import React from "react";
import { Box, Typography, Paper } from "@mui/material";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => (
  <Paper
    elevation={0}
    sx={(theme) => ({
      p: 6,
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    })}
  >
    <Box sx={{
      width: 80,
      height: 80,
      borderRadius: "50%",
      backgroundColor: "rgba(16, 163, 127, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 3,
    }}>
      {icon}
    </Box>
    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>{title}</Typography>
    {description && <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>{description}</Typography>}
  </Paper>
);

export default EmptyState;