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


  // const handleDownload = async () => {
  //   console.log("presignedUrl", presignedUrl);
  //   if (presignedUrl) {
  //     try {
  //       const link = document.createElement('a');
  //       link.href = presignedUrl;
  //       document.body.appendChild(link);

  //       if (file.fileName) {
  //         link.setAttribute('download', file.fileName);
  //       }

  //       link.click();
  //       document.body.removeChild(link);
  //     } catch (err) {
  //       console.error(`Error downloading file: ${err}`);
  //       throw err;
  //     }
  //   };
  // };
  const handleDownload = () => {
    if (presignedUrl) {
      const link = document.createElement("a");
      link.href = presignedUrl;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.info("Your recording is being downloaded to your device.");
    } else {
      console.error("No presigned URL available for download.");
    }
  };



  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#fff',
      }}>
      <CardMedia
        component={
          file.fileType.startsWith("image/")
            ? "img"
            : file.fileType === "application/pdf"
              ? "iframe"
              : file.fileType.startsWith("video/")
                ? "video"
                : "div"
        }
        height="140"
        image={file.fileType.startsWith("image/") ? presignedUrl : undefined}
        src={file.fileType === "application/pdf" || file.fileType.startsWith("video/") ? presignedUrl : undefined}
        alt={file.fileName}
        controls={file.fileType.startsWith("video/") ? true : undefined}
        sx={{
          borderRadius: "8px 8px 0 0",
          backgroundColor: file.fileType.startsWith("txt/")
            ? "#f5f5f5"
            : file.fileType === "application/pdf"
              ? "#e0e0e0"
              : undefined,
          display: file.fileType.startsWith("text/") ? "flex" : undefined,
          justifyContent: file.fileType.startsWith("text/") ? "center" : undefined,
          alignItems: file.fileType.startsWith("txt/") ? "center" : undefined,
        }}
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