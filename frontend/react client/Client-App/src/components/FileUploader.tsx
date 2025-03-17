import { useState } from 'react';
import { Button, Box, Typography, TextField, CircularProgress } from '@mui/material';
// import { motion } from 'framer-motion';
// import { useState } from 'react';
import axios from 'axios';

// צבעים וקונפיגורציות
// const primaryColor = "#10a37f";
// const textColor = "#333";
// const hoverColor = "#0e8c6b";

// const MotionButton = motion(Button);

const FileUploader = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
const [loading, setLoading] = useState(false);
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        setLoading(true);

        try {
            // Get presigned URL from server
            const response = await axios.get('http://localhost:5046/api/Files/upload-url', {
                params: {
                    fileName: file.name,
                    contentType: file.type
                },
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            const { url } = response.data;

            // Upload file to S3 using the presigned URL
            await axios.put(url, file, {
                headers: {
                    'Content-Type': file.type
                },
                onUploadProgress: (progressEvent) => setProgress(Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))),
            });

            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Upload File
            </Typography>
            <TextField
                type="file"
                onChange={handleFileChange}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Upload'}

            </Button>
            {progress > 0 && <Typography mt={1}>התקדמות: {progress}%</Typography>}

        </Box>
    );
};

export default FileUploader;
