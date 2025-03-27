/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Button, Modal } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { StoreType } from '../models/storeModel';
import FileUploader from './FileUploader';
import { fetchUserFiles } from '../store/fileSlice';
import { AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import FileCard from './FileCard';

const FileList: React.FC = () => {
  const user = useSelector((state: StoreType) => state.users.user);
  const loading = useSelector((state: StoreType) => state.files.loading);
  const files = useSelector((state: StoreType) => state.files.list);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      navigate('/');
    } else {
      dispatch(fetchUserFiles(user?.id ?? -1));
    }
  }, [dispatch, user?.id]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
        <Box sx={{ padding: 2, backgroundColor: '#f1f3f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#202124' }}>
          Your Files
        </Typography>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>
          Add File
        </Button>
      </Box>

      {/* Modal להעלאת קובץ */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Upload File
          </Typography>
          <FileUploader />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      )}

        {files.length === 0 && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="h6" sx={{ color: 'gray' }}>
            No files found.
          </Typography>
        </Box>
      )}

       {!loading && files.length > 0 && (
        <Box sx={{ padding: 4, backgroundColor: '#f1f3f4', minHeight: '100vh' }}>
          
          <Grid container spacing={3}>
            {files.map((file) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                <FileCard file={file} userId={user?.id ?? -1} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </>
  );
};

export default FileList;
