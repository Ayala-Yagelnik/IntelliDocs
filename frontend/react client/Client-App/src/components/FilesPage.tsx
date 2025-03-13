import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Alert } from '@mui/material';
import { fetchUserFiles, uploadFile } from '../services/fileService';

interface FileWithUrl extends File {
  url: string;
  thumbnailUrl: string;
}

const FilesPage: React.FC = () => {
  const [files, setFiles] = useState<FileWithUrl[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileWithUrl | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const userFiles = await fetchUserFiles();
        setFiles(userFiles);
      } catch (err) {
        setError('Failed to load files. Please try again.');
      }
    };
    loadFiles();
  }, []);

  const handleFileClick = (file: FileWithUrl) => {
    setSelectedFile(file);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFile(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadFile(file);
        const userFiles = await fetchUserFiles();
        setFiles(userFiles);
      } catch (err) {
        setError('Failed to upload file. Please try again.');
      }
    }
  };

  return (
    <Container>
      <Box textAlign="center" my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          הקבצים שלי
        </Typography>
        <Button variant="contained" component="label">
          העלה קובץ
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
      </Box>
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <Grid container spacing={4}>
        {files.map((file, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card onClick={() => handleFileClick(file)}>
              <CardMedia
                component="img"
                height="140"
                image={file.thumbnailUrl}
                alt={file.name}
              />
              <CardContent>
                <Typography variant="h6" component="h2">
                  {file.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedFile?.name}</DialogTitle>
        <DialogContent>
          <img src={selectedFile?.url} alt={selectedFile?.name} style={{ width: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FilesPage;