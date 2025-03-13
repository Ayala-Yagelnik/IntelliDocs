import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Dialog, DialogTitle, DialogContent, DialogActions, Box, Alert } from '@mui/material';
import { fetchUserFiles, uploadFile } from '../store/fileSlice';
import { useDispatch, useSelector } from 'react-redux';
import { File } from '../models/file';
import { AppDispatch } from '../store/store';
import { StoreType } from '../models/storeModel';
import { useTransition } from 'react';

const FilesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const files = useSelector((state: StoreType) => state.files.list);
  const loading = useSelector((state: StoreType) => state.files.loading);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    dispatch(fetchUserFiles());
  }, [dispatch]);

  const handleFileClick = (file: File) => {
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
      startTransition(async () => {
        try {
          await dispatch(uploadFile(file)).unwrap();
          dispatch(fetchUserFiles());
        } catch (err) {
          setError('Failed to upload file. Please try again.');
        }
      });
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
                image={file.path}
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
          <img src={selectedFile?.path} alt={selectedFile?.name} style={{ width: '100%' }} />
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