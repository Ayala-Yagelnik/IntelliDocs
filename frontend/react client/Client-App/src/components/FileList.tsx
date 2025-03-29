import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Modal,
  IconButton,
  List,
  ListItem,

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
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import MovieIcon from "@mui/icons-material/Movie";
import CodeIcon from "@mui/icons-material/Code";

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <PictureAsPdfIcon sx={{ color: "#d32f2f" }} />;
    case "excel":
      return <InsertChartIcon sx={{ color: "#388e3c" }} />;
    case "word":
      return <DescriptionIcon sx={{ color: "#1976d2" }} />;
    case "folder":
      return <FolderIcon sx={{ color: "#0288d1" }} />;
    case "audio":
      return <AudiotrackIcon sx={{ color: "#8e44ad" }} />;
    case "video":
      return <MovieIcon sx={{ color: "#e67e22" }} />;
    case "code":
      return <CodeIcon sx={{ color: "#2c3e50" }} />;
    default:
      return <InsertDriveFileIcon />;
  }
};

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
  }, [dispatch, user?.id]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <Box
        sx={{
          padding: 2,
          backgroundColor: "#f1f3f4",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#202124" }}>
          Your Files
        </Typography>
        <Box>
          <IconButton onClick={() => setIsGridView(!isGridView)}>
            {isGridView ? <ViewListIcon /> : <ViewModuleIcon />}
          </IconButton>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Add File
          </Button>
        </Box>
      </Box>

      {/* Modal for uploading files */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
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
          <CircularProgress />
        </Box>
      )}

      {files.length === 0 && !loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <Typography variant="h6" sx={{ color: "gray" }}>
            No files found.
          </Typography>
        </Box>
      )}

      {!loading && files.length > 0 && (
        <Box sx={{ padding: 4, backgroundColor: "#f1f3f4", minHeight: "100vh" }}>
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
                  padding: "8px 16px",
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  שם
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  גודל הקובץ
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  השינוי האחרון
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  בעלים
                </Typography>
              </ListItem>

              {files.map((file) => (

                <ListItem
                  key={file.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "3fr 1fr 1fr 1fr",
                    alignItems: "center",
                    padding: "8px 16px",
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  {/* <ListItemIcon>{getFileIcon(file.fileType)}</ListItemIcon> */}
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {getFileIcon(file.fileType)}
                    <Typography variant="body2" sx={{ marginLeft: 2 }}>
                      {file.fileName}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{file.fileSize || "—"}</Typography>
                  <Typography variant="body2">{file.updatedAt ? file.updatedAt.toLocaleString() : "—"}</Typography>
                  <Typography variant="body2">{file.userId || "—"}</Typography>
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