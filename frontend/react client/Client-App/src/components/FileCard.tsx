import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useDispatch } from 'react-redux';
import { deleteFile, shareFile, starFile } from '../store/fileSlice';
import { AppDispatch } from '../store/store';
import { File } from '../models/file';
interface FileCardProps {
  file: File;
  userId: number;
}

const FileCard: React.FC<FileCardProps> = React.memo(({ file, userId }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
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
          <IconButton
            onClick={() => dispatch(deleteFile(file.id))}
            className="text-red-500 hover:text-red-700"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => dispatch(shareFile({ fileId: file.id, userId }))}
            className="text-blue-500 hover:text-blue-700"
          >
            <ShareIcon />
          </IconButton>
          <IconButton
            onClick={() => dispatch(starFile({ fileId: file.id, isStarred: file.isStarred }))}
          >
            {file.isStarred ? (
              <StarIcon style={{ color: "#ffe402" }} className="text-yellow-500" />
            ) : (
              <StarBorderIcon className="text-gray-400" />
            )}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
});

export default FileCard;