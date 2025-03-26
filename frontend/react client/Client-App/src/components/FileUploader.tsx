import { useState } from "react";
import { Button, Box, Typography, CircularProgress, styled, Paper, CardContent, Card, CardHeader } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { StoreType } from '../models/storeModel';
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material"


// Define theme colors
const primaryColor = "#10a37f" 
const hoverColor = "#0e8e6d"
const textColor = "#343541"
const lightGrayColor = "#f7f7f8"
const borderColor = "#e5e5e6"


// Styled components
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
})

const UploadBox = styled(Paper)(({ theme }) => ({
  border: `1px dashed ${borderColor}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(3),
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: "transparent",
  transition: "background-color 0.2s",
  "&:hover": {
    backgroundColor: lightGrayColor,
  },
}))

const FileUploader = () => {

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ files,setFiles] = useState<File[]>([]);
  const user = useSelector((state: StoreType) => state.users.user);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

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

    const bucketName = import.meta.env.VITE_AWS_BUCKET_NAME;
    const region = import.meta.env.VITE_AWS_REGION;

    if (!bucketName || !region) {
      console.error("Environment variables are missing:", {
        bucketName,
        region,
      });
      alert("Environment variables are not properly configured.");
      console.log(files);
      return;
    }

    try {
      // Get presigned URL from server
      const response = await axios.get("https://intellidocs-server.onrender.com/api/Files/upload-url", {
        params: { fileName: file.name, contentType: file.type },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("response: ", response);
      const { url } = response.data as { url: string; b: string; r: string };
      console.log("url: ", url);
      // Upload file to S3 using the presigned URL
      await axios.put(url, file, {
        headers: { "Content-Type": file.type },
      });
      console.log("user: ", user)
      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${user.username}/${file.name}`;
      console.log("fileUrl: ", fileUrl);
      // Save file metadata in the database
      const fileMetadata = {
        fileName: file.name,
        filePath: fileUrl,
        fileSize: file.size,
        fileType: file.type,
        authorId: user.id,
      };
      console.log("fileMetadata: ", fileMetadata);
      console.log("file: ", file);

      const savedFile = await axios.post("https://intellidocs-server.onrender.com/api/Files/upload", fileMetadata, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setFiles((prevFiles: File[]) => [...prevFiles, savedFile.data as File]);

      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        mx: "auto",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
        border: `1px solid ${borderColor}`,
        borderRadius: 2,
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="h6"
            align="center"
            sx={{
              fontWeight: 500,
              color: textColor,
            }}
          >
            Upload File
          </Typography>
        }
        sx={{ pb: 1 }}
      />
      <CardContent sx={{ pt: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <UploadBox>
            <Button
              component="label"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100%",
                py: 2,
                textTransform: "none",
                color: "text.secondary",
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: "text.disabled", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {file ? file.name : "Select a file to upload"}
              </Typography>
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
          </UploadBox>

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            variant="contained"
            fullWidth
            sx={{
              bgcolor: primaryColor,
              color: "white",
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                bgcolor: hoverColor,
                transform: "scale(1.02)",
              },
              "&:active": {
                transform: "scale(0.98)",
              },
              transition: "transform 0.2s, background-color 0.2s",
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Upload"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};


export default FileUploader;


