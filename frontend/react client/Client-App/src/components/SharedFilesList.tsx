import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSharedFiles } from "../store/StorageSlice";
import { MyFile } from "../models/myfile";
import { StoreType } from "../models/storeModel";
import { AppDispatch } from "../store/store";
import { Box, Typography, Grid, CircularProgress, List, ListItem, Avatar, Paper, Tooltip, IconButton, } from "@mui/material"
import { FolderOpen, RefreshCw, } from "lucide-react"
import { formatFileSize, formatDate, stringToColor, getFileIcon } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import FileCard from "./FileCard";
import { motion } from "framer-motion"
import ToggleViewSelector from "./ToggleButtonGroup";

const MotionListItem = motion(ListItem);


const MotionBox = motion(Box)


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

  const handleViewChange = (newView: string | null) => {
    if (newView !== null) {
      setIsGridView(newView === "grid")
    }
  }

  const handleRefresh = () => {
    dispatch(fetchSharedFiles(user.id))
  }

  return (
    <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          mb: 3,
          border: "1px solid #eaeaea",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
              Shared Files
            </Typography>
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={handleRefresh}
                sx={{
                  color: "#666",
                  "&:hover": { color: "#10a37f", backgroundColor: "rgba(16, 163, 127, 0.08)" },
                }}
              >
                <RefreshCw size={18} />
              </IconButton>
            </Tooltip>
          </Box>

          <ToggleViewSelector isGridView={isGridView} onViewChange={handleViewChange} />
        </Box>
      </Paper>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#10a37f" }} />
        </Box>
      ) : !sharedFiles || sharedFiles.length === 0 ? (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "rgba(16, 163, 127, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <FolderOpen size={40} color="#10a37f" />
          </Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
            No files have been shared with you
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center", maxWidth: 400 }}>
            When someone shares files with you, they will appear here
          </Typography>
        </MotionBox>
      ) : isGridView ? (
        <Box sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            {sharedFiles.map((file) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                <FileCard file={file} userId={user.id} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #eaeaea",
            borderRadius: 3,
            overflow: "hidden",
            mt: 3,
          }}
        >
          <List disablePadding>
            <ListItem
              sx={{
                backgroundColor: "#f9f9f9",
                borderBottom: "1px solid #eaeaea",
                py: 1.5,
                px: 3,
                display: "grid",
                gridTemplateColumns: {
                  xs: "3fr 1fr",
                  md: "3fr 1fr 1fr 1fr",
                },
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#666" }}>
                Name
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: "#666",
                  display: { xs: "none", md: "block" },
                }}
              >
                Size
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  color: "#666",
                  display: { xs: "none", md: "block" },
                }}
              >
                Last Update
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#666" }}>
                Owner
              </Typography>
            </ListItem>

            {sharedFiles.map((file: MyFile, index: number) => (
              <MotionListItem
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                sx={{
                  borderBottom: "1px solid #eaeaea",
                  py: 1.5,
                  px: 3,
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "3fr 1fr",
                    md: "3fr 1fr 1fr 1fr",
                  },
                  "&:hover": {
                    backgroundColor: "#f9f9f9",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {getFileIcon(file.fileType)}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#333",
                      fontWeight: 500,
                      ml: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "100%",
                    }}
                  >
                    {file.fileName}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {file.fileSize ? formatFileSize(file.fileSize) : "—"}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {file.uploadDate ? formatDate(file.uploadDate) : "—"}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: file.author?.username ? stringToColor(file.author.username) : "#10a37f",
                      width: 28,
                      height: 28,
                      fontSize: "0.9rem",
                      mr: 1,
                    }}
                  >
                    {file.author?.username ? file.author.username[0].toUpperCase() : "?"}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {file.author?.email || "—"}
                  </Typography>
                </Box>
              </MotionListItem>
            ))}
          </List>
        </Paper>
      )}
    </MotionBox>
  );
};

export default SharedFilesList;