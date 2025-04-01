import React, { useState } from "react";
import { Box, Typography, TextField, Button, InputAdornment, CircularProgress } from "@mui/material"
import { Folder, X } from "lucide-react"
import { motion } from "framer-motion"

interface AddFolderProps {
  onAddFolder: (folderName: string) => void;
  onCancel: () => void;
}

const MotionBox = motion(Box)


const AddFolder: React.FC<AddFolderProps> = ({ onAddFolder, onCancel }) => {
  const [folderName, setFolderName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!folderName.trim()) {
      setError("Folder name cannot be empty")
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
                <Folder size={18} color="#666" />
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
              borderColor: "#ddd",
              color: "#666",
              borderRadius: 2,
              "&:hover": {
                borderColor: "#ccc",
                backgroundColor: "#f9f9f9",
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
              backgroundColor: "#10a37f",
              color: "#fff",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#0e8c6b",
              },
              "&.Mui-disabled": {
                backgroundColor: "#e0e0e0",
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