import React, { useState } from "react";
import { Box, Typography, TextField, Button, InputAdornment, CircularProgress, useTheme } from "@mui/material"
import { Folder, X } from "lucide-react"
import { motion } from "framer-motion"

interface AddFolderProps {
  onAddFolder: (folderName: string) => void;
  onCancel: () => void;
  existingFolders: string[];
}

const MotionBox = motion(Box)


const AddFolder: React.FC<AddFolderProps> = ({ onAddFolder, onCancel, existingFolders }) => {
  const [folderName, setFolderName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const theme = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!folderName.trim()) {
      setError("Folder name cannot be empty")
      return
    }

    if (existingFolders.includes(folderName.trim())) {
      setError("Folder name already exists")
      return
    }

    setIsSubmitting(true)
    onAddFolder(folderName.trim());
    setFolderName("");
    setIsSubmitting(false);
    setError("");
  };

  return (
    <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Create New Folder
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Folder Name"
          value={folderName}
          onChange={(e) => {
            setFolderName(e.target.value)
            setError("")
          }}
          error={!!error}
          helperText={error}
          variant="outlined"
          placeholder="Enter folder name"
          autoFocus
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Folder size={18} color={theme.palette.text.secondary} />
              </InputAdornment>
            ),
            sx: { borderRadius: 2 },
          }}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            startIcon={<X size={18} />}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              borderRadius: 2,
              "&:hover": {
                borderColor: theme.palette.text.primary,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!folderName.trim() || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <Folder size={18} />}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              "&.Mui-disabled": {
                backgroundColor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
            }}
          >
            {isSubmitting ? "Creating..." : "Create Folder"}
          </Button>
        </Box>
      </form>
    </MotionBox>
  );
};

export default AddFolder;