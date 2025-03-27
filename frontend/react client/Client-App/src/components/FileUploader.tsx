import { useState } from "react";
import { Button, Box, Typography, CircularProgress, styled, Paper, CardContent, Card, CardHeader } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from '../models/storeModel';
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material"
import { uploadFile } from "../store/fileSlice";
import { AppDispatch } from "../store/store";
// import { File } from "../models/file";

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
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: StoreType) => state.files.loading);
  const user = useSelector((state: StoreType) => state.users.user);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0] as unknown as File)
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
  
   
    const fileUpload = {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    };
    dispatch(uploadFile({ fileUpload, user }));
    setFile(null);
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


