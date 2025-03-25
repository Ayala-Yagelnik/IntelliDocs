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
      const response = await axios.get<File[]>(
        `https://intellidocs-server.onrender.com/api/Files/user-files/${user?.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      alert('Failed to fetch files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://intellidocs-server.onrender.com/api/Files/${fileId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleShare = (file: File) => {
    alert(`Share link: ${file.filePath}`);
  };

  const handleStar = async (fileId: number, isStarred: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `https://intellidocs-server.onrender.com/api/Files/${fileId}/star`,
        !isStarred,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setFiles((prevFiles) =>
        prevFiles.map((file) => (file.id === fileId ? { ...file, isStarred: !isStarred } : file))
      );
    } catch (error) {
      console.error('Error starring file:', error);
      alert('Failed to star file. Please try again.');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );
  }

  if (files.length === 0) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <Typography variant="h6" className="text-gray-700">No files found.</Typography>
      </Box>
    );
  }

  return (
    <Box className="p-10 bg-gray-50 min-h-screen">
      <Typography variant="h4" gutterBottom className="text-gray-800 mb-6 font-semibold">Your Files</Typography>
      <Grid container spacing={4}>
        {files.map((file) => (
          <Grid item xs={12} sm={6} md={4} key={file.id}>
            <Card className="rounded-2xl shadow-md transition-transform transform hover:scale-105 bg-white">
              <CardMedia
                component="img"
                height="140"
                image={file.fileType?.startsWith('image') ? file.filePath : '/placeholder.png'}
                alt={file.fileName}
                className="rounded-t-2xl"
              />
              <CardContent className="p-4">
                <Typography variant="h6" className="text-teal-600 font-semibold mb-2">{file.fileName}</Typography>
                <Typography variant="body2" className="text-gray-500">Size: {(file.fileSize / 1024).toFixed(2)} KB</Typography>
                <Typography variant="body2" className="text-gray-500">Type: {file.fileType}</Typography>
                <Box className="mt-4 flex justify-between">
                  <IconButton onClick={() => handleDelete(file.id)} className="text-red-500 hover:text-red-700">
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleShare(file)} className="text-blue-500 hover:text-blue-700">
                    <ShareIcon />
                  </IconButton>
                  <IconButton onClick={() => handleStar(file.id, file.isStarred)}>
                    {file.isStarred ? <StarIcon className="text-yellow-500" /> : <StarBorderIcon className="text-gray-400" />}
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
