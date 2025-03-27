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

  useEffect(() => {
    if (user?.id === -1) {
      navigate('/'); 
    }}
,[user]);
  return (
    <>
      <FileUploader />
      {user?.id === -1}
      {loading &&
        (<Box className="flex justify-center items-center h-screen">
          <CircularProgress />
        </Box>)
      }
      {files.length === 0 && !loading &&
        (<Box className="flex justify-center items-center h-screen">
          <Typography variant="h6" className="text-gray-700">No files found.</Typography>
        </Box>)
      }
      {!loading && files.length > 0 && (
        <Box className="p-10 bg-gray-50 min-h-screen">
          <Typography variant="h4" gutterBottom className="text-gray-800 mb-6 font-semibold">Your Files</Typography>
          <Grid container spacing={4}>
            {files.map((file) => (
              <Grid item xs={12} sm={6} md={4} key={file.id}>
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
