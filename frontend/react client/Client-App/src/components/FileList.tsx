/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
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

  useEffect(() => {
    if (!user?.id) {
      navigate('/');
    } else {
      dispatch(fetchUserFiles(user?.id ?? -1));
    }
  }, [dispatch, user?.id]);


  return (
    <>
      <Box sx={{ padding: 2, backgroundColor: '#f1f3f4' }}>
        <FileUploader />
      </Box>
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
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#202124' }}>
            Your Files
          </Typography>
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
