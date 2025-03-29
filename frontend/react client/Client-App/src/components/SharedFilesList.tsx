import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSharedFiles } from "../store/fileSlice";
import { MyFile } from "../models/myfile";
import { CircularProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import { StoreType } from "../models/storeModel";
import { AppDispatch } from "../store/store";

const SharedFilesList: React.FC = () => {
  const { list: sharedFiles, loading } = useSelector((state: StoreType) => state.files);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Fetch shared files when the component mounts
    dispatch(fetchSharedFiles());
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!sharedFiles || sharedFiles.length === 0) {
    return <Typography>No files have been shared with you.</Typography>;
  }

  return (
    <List>
      {sharedFiles.map((file: MyFile) => (
        <ListItem key={file.id}>
          <ListItemText
            primary={file.fileName}
            secondary={`Size: ${file.fileSize} bytes | Type: ${file.fileType}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default SharedFilesList;