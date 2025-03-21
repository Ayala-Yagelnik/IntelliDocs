import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { File } from '../models/file';
const FileList: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchFiles = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get<File[]>('http://localhost:5046/api/Files', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFiles(response.data);
        } catch (error) {
          console.error('Error fetching files:', error);
        } finally {
          setLoading(false);
        }
      };
  
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
          {files.map((file:File) => (
            <Grid item xs={12} sm={6} md={4} key={file.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={file.type.startsWith('image') ? file.path : '/placeholder.png'}
                  alt={file.name}
                />
                <CardContent>
                  <Typography variant="h6">{file.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {(file.size / 1024).toFixed(2)} KB
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type: {file.type}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  export default FileList;