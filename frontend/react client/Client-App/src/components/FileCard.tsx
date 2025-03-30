import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFile, fetchPresignedUrl, starFile } from '../store/fileSlice';
import { AppDispatch } from '../store/store';
import { MyFile } from '../models/myfile';
import { StoreType } from '../models/storeModel';
import ShareFile from './ShareFile';
import { getFileIcon } from '../utils/utils';

// export const downloadFileWithPresignedUrl = async (fileKey: string): Promise<void> => {
//   try {
//     // Use getPresignedUrl to fetch the presigned URL for downloading
//     const presignedUrl = await getPresignedUrl(fileKey, 'download');

//     console.log("Presigned URL received for download:", presignedUrl);

//     await (async () => {
//       const downloadResponse = await axios.get(presignedUrl, {
//         responseType: 'blob',

//       });

//       // Create a blob URL and trigger the download
//       const url = window.URL.createObjectURL(new Blob([downloadResponse.data as BlobPart]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', fileKey);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     });
//   } catch (error) {
//     console.error('Error downloading file:', error);
//     alert('Error downloading file');
//   }
// };


interface FileCardProps {
  file: MyFile;
  userId: number;
}

const FileCard: React.FC<FileCardProps> = React.memo(({ file, }) => {
  const dispatch = useDispatch<AppDispatch>();
  const presignedUrl = useSelector((state: StoreType) => state.files.presignedUrls?.[file.fileKey] || null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(presignedUrl);

    if (!presignedUrl) {
      dispatch(fetchPresignedUrl(file));
    }
  }, [dispatch, file, file.fileKey, presignedUrl]);


  // const handleDownload = () => {
  //   if (presignedUrl) {
  //     const encodedFileName = encodeURIComponent(file.fileName);
  //     const link = document.createElement("a");
  //     link.href = `${presignedUrl}&fileName=${encodedFileName}`;
  //     link.download = file.fileName;
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);

  //     console.info("Your file is being downloaded to your device.");
  //   } else {
  //     console.error("No presigned URL available for download.");
  //   }
  // };

  const handleDownload = () => {
    if (presignedUrl) {
      const encodedFileName = encodeURIComponent(file.fileName);
      const link = document.createElement("a");
      link.href = `${presignedUrl}&fileName=${encodedFileName}`;
  
      // תמיד להוריד את הקובץ, גם אם הוא פתוח בדפדפן
      link.setAttribute('download', file.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      console.info("Your file is being downloaded to your device.");
    } else {
      console.error("No presigned URL available for download.");
    }
  };
  
  return (
    <>
      <Card
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
          // width: 250,
          height: "100%",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
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
          image={file.fileType.startsWith("image/") ? presignedUrl || undefined : undefined}
          src={file.fileType === "application/pdf" ? presignedUrl || undefined : undefined}
          alt={file.fileName}
          controls={file.fileType.startsWith("video/") ? true : undefined}
          sx={{
            borderRadius: "8px 8px 0 0",
            backgroundColor: file.fileType.startsWith("txt/")
              ? "#f5f5f5"
              : file.fileType === "application/pdf"
                ? "#e0e0e0"
                : undefined,
            display: file.fileType.startsWith("image/") || file.fileType === "application/pdf" || file.fileType.startsWith("video/")
              ? "block"
              : "none", 
            objectFit: "cover",
            height: 150,
          }}
        />
        {!(file.fileType.startsWith("image/") || file.fileType === "application/pdf" || file.fileType.startsWith("video/")) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 150,
              backgroundColor: "#f5f5f5",
            }}
          >
            {React.cloneElement(getFileIcon(file.fileType), { fontSize: "large" })}
          </Box>
        )}
        <CardContent

          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h6" sx={{
            fontWeight: 'bold',
            color: '#202124',
            marginBottom: 1,
            marginLeft: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
          }}>
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
              onClick={() => setOpen(true)
                // userId !== -1 && dispatch(shareFile({ fileId: file.id, userId }))
              }
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
      <ShareFile file={file} open={open} onClose={() => setOpen(false)} />
    </>
  );
});

export default FileCard;