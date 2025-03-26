import React, { useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid, CircularProgress, IconButton } from '@mui/material';
// import { File } from '../models/file';
import { useSelector } from 'react-redux';
import { StoreType } from '../models/storeModel';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FileUploader from './FileUploader';
import { deleteFile, fetchUserFiles, shareFile, starFile } from '../store/fileSlice';

const FileList: React.FC = () => {
  // const [files, setFiles] = useState<File[]>([]);
  //const [loading, setLoading] = useState<boolean>(true);
  const user = useSelector((state: StoreType) => state.users.user);
  const loading = useSelector((state: StoreType) => state.files.loading);
  const files = useSelector((state: StoreType) => state.files.list);
  useEffect(() => {
    console.log("called use effect get all files");
    fetchUserFiles();
  }, []);

  if (loading) {
    return (
      <Box className="flex justify-center items-center h-screen">
        <FileUploader />
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
    <>
      <FileUploader />
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
                    <IconButton onClick={() => deleteFile(file.id)} className="text-red-500 hover:text-red-700">
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => shareFile({ fileId: file.id, userId: user?.id ?? -1 })} className="text-blue-500 hover:text-blue-700">
                      <ShareIcon />
                    </IconButton>
                    <IconButton onClick={() => starFile({ fileId: file.id, isStarred: file.isStarred })}>
                      {file.isStarred ? <StarIcon className="text-yellow-500" /> : <StarBorderIcon className="text-gray-400" />}
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default FileList;
