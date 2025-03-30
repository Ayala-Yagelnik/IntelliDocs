import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Modal,
  List,
  ListItem,
  Avatar,
  ToggleButton, ToggleButtonGroup
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../models/storeModel";
import FileUploader from "./FileUploader";
import { fetchUserFiles } from "../store/fileSlice";
import { AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import FileCard from "./FileCard";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";

import { formatFileSize, formatDate, stringToColor, getFileIcon } from "../utils/utils";
const primaryColor = "#10a37f";
const textColor = "#333";
const hoverColor = "#0e8c6b";

const FileList: React.FC = () => {
  const user = useSelector((state: StoreType) => state.users.user);
  const loading = useSelector((state: StoreType) => state.files.loading);
  const files = useSelector((state: StoreType) => state.files.files);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      navigate("/");
    } else {
      dispatch(fetchUserFiles(user?.id ?? -1));
    }
  }, [dispatch, navigate, user?.id]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleViewChange = (
    newView: string | null
  ) => {
    if (newView !== null) {
      setIsGridView(newView === "grid");
    }
  };
  return (
    <>
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
          Your Files
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 3,
          }}>
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
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton
              value="list"
            >
              <ViewListIcon />
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            sx={{
              backgroundColor: primaryColor,
              color: "#fff",
              textTransform: "none",
              fontWeight: "500",
              padding: "8px 16px",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: hoverColor,
              },
            }}
            onClick={handleOpenModal}
          >
            Add File
          </Button>
        </Box>
      </Box>

      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#ffffff",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Upload File
          </Typography>
          <FileUploader />
          <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress sx={{ color: "#f9fafb" }} />
        </Box>
      )}

      {files.length === 0 && !loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            color: "#888",
          }}
        >
          <Typography variant="h6">
            No files found.
          </Typography>
        </Box>
      )}

      {!loading && files.length > 0 && (
        <Box
          sx={{
            padding: 2,
            backgroundColor: "#fff",
            borderRadius: 2,
          }}>
          {isGridView ? (
            <Grid container spacing={3}>
              {files.map((file) => (
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
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>Name</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>Size</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>Last Update</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>Owner</Typography>
              </ListItem>

              {files.map((file) => (

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
                    <Typography variant="body2" sx={{ marginLeft: 2, color: "333" }}>
                      {file.fileName}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "#555" }}>
                    {file.fileSize ? formatFileSize(file.fileSize) : "—"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#555" }}>
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
                      {file.author?.username ? file.author.username[0].toUpperCase() : "?"}
                    </Avatar>
                    <Typography variant="body2" sx={{ color: "#555" }}>
                      {file.author?.email || "—"}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      )}
    </>
  );
};

export default FileList;