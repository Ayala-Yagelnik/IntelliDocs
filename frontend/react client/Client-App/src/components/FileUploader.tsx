import { useState } from "react";
import { Button, Box, Typography, TextField, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import { useSelector } from "react-redux";
import { StoreType } from '../models/storeModel';
import FileList from "./FileList";

// Design Tokens
const primaryColor = "#10a37f";
const hoverColor = "#0e8c6b";
const textColor = "#333";

// Animated Button with Hover Effect
const MotionButton = motion(Button);

const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: StoreType) => state.users.user);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setFile(files[0]);
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
    console.log("Current user:", user);
    setLoading(true);

    try {
      // Get presigned URL from server
      const response = await axios.get("http://localhost:5046/api/Files/upload-url", {
        params: { fileName: file.name, contentType: file.type },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const { url, bucketName, region } = response.data as { url: string; bucketName: string; region: string };

      // Upload file to S3 using the presigned URL
      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
      });
      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${user.name}/${file.name}`;

   // Save file metadata in the database
   const fileMetadata = {
    fileName: file.name,
    filePath: fileUrl, 
    fileSize: file.size,
    fileType: file.type,
    authorId: user.id,
};
console.log("fileMetadata: ",fileMetadata);
console.log("file: ",file);

await axios.post("http://localhost:5046/api/Files/upload", fileMetadata, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`}});

      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 6,
        p: 3,
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
        mx: "auto",
      }}
    >
          

      <Typography variant="h4" sx={{ color: textColor, mb: 2 }}>
        Upload File
      </Typography>

      <TextField
        type="file"
        onChange={handleFileChange}
        sx={{
          mb: 2,
          "& input": {
            cursor: "pointer",
          },
        }}
        InputLabelProps={{ shrink: true }}
      />

      <MotionButton
        variant="contained"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleUpload}
        disabled={loading}
        sx={{
          backgroundColor: primaryColor,
          color: "#fff",
          px: 3,
          py: 1,
          borderRadius: "8px",
          textTransform: "none",
          "&:hover": { backgroundColor: hoverColor },
        }}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Upload"}
      </MotionButton>
    </Box>
    <FileList />
        </>
  );
};

export default FileUploader;