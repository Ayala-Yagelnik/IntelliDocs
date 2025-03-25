import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, CircularProgress, IconButton } from '@mui/material';
import axios from 'axios';
import { File } from '../models/file';
import { useSelector } from 'react-redux';
import { StoreType } from '../models/storeModel';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const FileList: React.FC = () => {

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: StoreType) => state.users.user);


  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<File[]>(`https://intellidocs-server.onrender.com/api/Files/user-files/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Files:", response.data);
      setFiles(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
      alert("Failed to fetch files. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (fileId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://intellidocs-server.onrender.com/api/Files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
      alert("File deleted successfully!");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  const handleShare = (file: File) => {
    // Implement sharing logic here (e.g., copy link or open a modal)
    alert(`Share link: ${file.filePath}`);
  };

  const handleStar = async (fileId: number, isStarred: boolean) => {
    try {
      const token = localStorage.getItem('token');
      console.log("File ID:", fileId);
      console.log("Is Starred:", !isStarred);
      await axios.patch(
        `https://intellidocs-server.onrender.com/api/Files/${fileId}/star`,
        { isStarred: !isStarred },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === fileId ? { ...file, isStarred: !isStarred } : file
        )
      );
    } catch (error) {
      console.error("Error starring file:", error);
      alert("Failed to star file. Please try again.");
    }
  };


  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (files.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6">No files found.</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Your Files
      </Typography>
      <Grid container spacing={3}>
        {files.map((file: File) => (
          <Grid item xs={12} sm={6} md={4} key={file.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={file.fileType?.startsWith('image') ? file.filePath : '/placeholder.png'}
                alt={file.fileName}
              />
              <CardContent>
                <Typography variant="h6">{file.fileName}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Size: {(file.fileSize / 1024).toFixed(2)} KB
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {file.fileType}
                </Typography>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <IconButton
                    color="primary"
                    onClick={() => handleDelete(file.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleShare(file)}
                  >
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => handleStar(file.id, file.isStarred)}
                  >
                    {file.isStarred ? <StarIcon /> : <StarBorderIcon />}
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FileList;