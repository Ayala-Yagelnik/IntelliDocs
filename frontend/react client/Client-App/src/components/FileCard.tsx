import React, { useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFile, fetchPresignedUrl, shareFile, starFile } from '../store/fileSlice';
import { AppDispatch } from '../store/store';
import { File } from '../models/file';
import { StoreType } from '../models/storeModel';

interface FileCardProps {
  file: File;
  userId: number;
}

const FileCard: React.FC<FileCardProps> = React.memo(({ file, userId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const presignedUrl = useSelector((state: StoreType) => state.files.presignedUrls[file.fileKey]);

  useEffect(() => {
    if (!presignedUrl) {
      dispatch(fetchPresignedUrl(file));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, file.fileKey, presignedUrl]);


  const handleDownload = async () => {
    console.log("presignedUrl", presignedUrl);
    if (presignedUrl) {
      try {
        const link = document.createElement('a');
        link.href = presignedUrl;
        document.body.appendChild(link);

        if (file.fileName) {
          link.setAttribute('download', file.fileName);
        }

        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error(`Error downloading file: ${err}`);
        throw err;
      }
    };
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#fff',
      }}>
      <CardMedia
        component="img"
        height="140"
        image={presignedUrl || '/placeholder.jpg'}
        alt={file.fileName}
        sx={{ borderRadius: '8px 8px 0 0' }}
      />
      <CardContent className="p-4">
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#202124', marginBottom: 1 }}>
          {file.fileName}
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          Size: {(file.fileSize / 1024).toFixed(2)} KB
        </Typography>
        <Typography variant="body2" sx={{ color: 'gray' }}>
          Type: {file.fileType}
        </Typography>
        <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>

          <IconButton
            onClick={() => dispatch(deleteFile(file.id))}
            sx={{ color: 'gray', '&:hover': { color: 'red' } }}
          >
            <DeleteIcon />
          </IconButton>

          <IconButton
            onClick={() => userId !== -1 && dispatch(shareFile({ fileId: file.id, userId }))}
            sx={{ color: 'gray', '&:hover': { color: 'blue' } }}
          >
            <ShareIcon />
          </IconButton>

          <IconButton
            onClick={() => dispatch(starFile({ fileId: file.id, isStarred: file.isStarred }))}
            sx={{ color: 'gray', '&:hover': { color: 'gold' } }}
          >
            {file.isStarred ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>

          <IconButton
            onClick={handleDownload}
            sx={{ color: 'gray', '&:hover': { color: 'rgb(0 255 3)' } }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
});

export default FileCard;