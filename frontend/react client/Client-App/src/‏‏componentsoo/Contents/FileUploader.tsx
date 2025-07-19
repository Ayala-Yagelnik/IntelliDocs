import { Box, Button, Typography, CircularProgress, Paper, alpha } from "@mui/material"
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store/store";
import { StoreType } from "../../models/storeModel";
import { uploadFile } from "../../store/StorageSlice";
import { Upload, File, X } from "lucide-react"
import { motion } from "framer-motion"

const FileUploader = ({ folderId }: { folderId: number | null }) => {
  console.log("FileUploader component rendered with folderId:", folderId);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: StoreType) => state.files.loading);
  const user = useSelector((state: StoreType) => state.users.user);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleUpload = async () => {
    if (!user || !user.id) {
      alert("User is not logged in or invalid.");
      return;
    }
    if (!file) {
      alert("Please select a file first!");
      return;
    }


    dispatch(uploadFile({ fileUpload: file, user, folderId }));
    setFile(null);
  };

  const handleRemoveFile = () => {
    setFile(null)
  }
  return (
    <Box sx={{ width: "100%" }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Paper
          elevation={0}
          sx={{
            border: `2px dashed ${isDragging ? "#10a37f" : "#eaeaea"}`,
            borderRadius: 3,
            p: 4,
            mb: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            backgroundColor: isDragging ? alpha("#10a37f", 0.05) : "transparent",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#10a37f",
              backgroundColor: alpha("#10a37f", 0.02),
            },
            position: "relative",
            overflow: "hidden",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          component={motion.div}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: alpha("#10a37f", 0.1),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <Upload size={32} color="#10a37f" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 1 }}>
            Drag & drop files here
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or click to browse from your computer
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Maximum file size: 100MB
          </Typography>
          <input
            type="file"
            onChange={handleFileChange}
            style={{
              opacity: 0,
              position: "absolute",
              width: "100%",
              height: "100%",
              cursor: "pointer",
              top: 0,
              left: 0,
            }}
          />
        </Paper>

        {file && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              border: "1px solid #eaeaea",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: alpha("#10a37f", 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <File size={20} color="#10a37f" />
              </Box>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: "#333",
                    maxWidth: "240px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            </Box>
            <Button
              onClick={handleRemoveFile}
              sx={{
                minWidth: "auto",
                p: 1,
                color: "#666",
                "&:hover": { color: "#e74c3c", backgroundColor: alpha("#e74c3c", 0.05) },
              }}
            >
              <X size={18} />
            </Button>
          </Paper>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || loading}
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#10a37f",
            color: "white",
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            "&:hover": {
              bgcolor: "#0e8c6b",
            },
            "&.Mui-disabled": {
              bgcolor: alpha("#10a37f", 0.5),
              color: "white",
            },
          }}
          component={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
              <span>Uploading...</span>
            </Box>
          ) : (
            "Upload File"
          )}
        </Button>
      </motion.div>
    </Box>
  );
};


export default FileUploader;


