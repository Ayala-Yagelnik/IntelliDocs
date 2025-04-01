import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSharedFiles } from "../store/StorageSlice";
import { MyFile } from "../models/myfile";
import { StoreType } from "../models/storeModel";
import { AppDispatch } from "../store/store";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  List,
  ListItem,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { formatFileSize, formatDate, stringToColor, getFileIcon } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { ViewList, ViewModule } from "@mui/icons-material";
import FileCard from "./FileCard";

const primaryColor = "#10a37f";
const textColor = "#333";

const SharedFilesList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: StoreType) => state.users.user);
  const loading = useSelector((state: StoreType) => state.files.loading);
  const sharedFiles = useSelector((state: StoreType) => state.files.shareFiles);
  const [isGridView, setIsGridView] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSharedFiles(user.id)).then((response) => {
        console.log("Shared Files Response:", response.payload);
      });
    }
    else {
      navigate("/");
    }
  }, [dispatch, navigate, user.id]);


  const handleViewChange = (
    newView: string | null
  ) => {
    if (newView !== null) {
      setIsGridView(newView === "grid");
    }
  };

  if (loading) {
    return (<Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "50vh",
      }}
    >
      <CircularProgress sx={{ color: primaryColor }} />
    </Box>);
  }

  if (!sharedFiles || sharedFiles.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          color: "#888",
        }}
      >
        <Typography variant="h6">No files have been shared with you.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#fff",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: textColor,
          marginBottom: 2,
        }}
      >
        Shared Files
      </Typography>


      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <ToggleButtonGroup
          value={isGridView ? "grid" : "list"}
          exclusive
          onChange={(_, newView) => handleViewChange(newView)}
          sx={{
            borderRadius: "30px",
            overflow: "hidden",
            backgroundColor: "#e0e0e0",
            "& .MuiToggleButton-root": {
              border: "none",
              padding: "8px 16px",
              color: textColor,
              fontWeight: "500",
              "&.Mui-selected": {
                backgroundColor: primaryColor,
                color: "#fff",
              },
            },
          }}
        >
          <ToggleButton
            value="grid"
          >
            <ViewModule />
          </ToggleButton>
          <ToggleButton
            value="list"
          >
            <ViewList />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          padding: 2,
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      >
        {isGridView ? (
          <Grid container spacing={3}>
            {sharedFiles.map((file: MyFile) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                <FileCard file={file} userId={user.id} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <List>
            <ListItem
              sx={{
                display: "grid",
                gridTemplateColumns: "3fr 1fr 1fr 1fr",
                alignItems: "center",
                padding: "12px 16px",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#fff",
                color: textColor,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Name
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Size
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Last Update
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                Owner
              </Typography>
            </ListItem>

            {sharedFiles.map((file: MyFile) => (
              <ListItem
                key={file.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "3fr 1fr 1fr 1fr",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #e5e7eb",
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {getFileIcon(file.fileType)}
                  <Typography
                    variant="body2"
                    sx={{ marginLeft: 2, color: textColor }}
                  >
                    {file.fileName}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: textColor }}>
                  {file.fileSize ? formatFileSize(file.fileSize) : "—"}
                </Typography>
                <Typography variant="body2" sx={{ color: textColor }}>
                  {file.uploadDate ? formatDate(file.uploadDate) : "—"}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: file.author?.username
                        ? stringToColor(file.author.username)
                        : primaryColor,
                      marginRight: 1,
                      width: 28,
                      height: 28,
                      fontSize: "0.9rem",
                    }}
                  >
                    {file.author?.username
                      ? file.author.username[0].toUpperCase()
                      : "?"}
                  </Avatar>
                  <Typography variant="body2" sx={{ color: textColor }}>
                    {file.author?.email || "—"}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default SharedFilesList;