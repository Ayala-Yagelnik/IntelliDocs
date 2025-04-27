import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button, Breadcrumbs, Link as MuiLink, Paper, useMediaQuery, useTheme, IconButton, Tooltip, } from "@mui/material";
import {
  FolderPlus,
  Upload,
  ChevronRight,
  HomeIcon,
  RefreshCw,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux";
import { StoreType } from "../../models/storeModel";
import { createFolder, fetchFolderContents, fetchUserContent } from "../../store/StorageSlice";
import { AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import AddFolder from "../Contents/AddFolder";
import CustomModal from "../CustomModal";
import ToggleViewSelector from "./ToggleButtonGroup";
import FileFolderList from "./FileFolderListProps";
import { motion } from "framer-motion"
import FileUploader from "./FileUploader";

const MotionBox = motion(Box)



const FileList: React.FC = () => {
  const user = useSelector((state: StoreType) => state.users.user);
  const loading = useSelector((state: StoreType) => state.files.loading);
  const files = useSelector((state: StoreType) => state.files.files);
  const folders = useSelector((state: StoreType) => state.files.folders);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [folderHistory, setFolderHistory] = useState<{ id: number | null; name: string }[]>([
    { id: null, name: "Home" },
  ]);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))


  useEffect(() => {
    if (!user?.id) {
      navigate("/");
    } else {
      handleRefresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, user?.id, currentFolderId]);

  const handleRefresh = () => {
    if (currentFolderId === null) {
      dispatch(fetchUserContent({ userId: user.id }));
    } else {
      dispatch(fetchFolderContents({ folderId: currentFolderId }));
    }
  }

  const handleFolderClick = (folderId: number, folderName: string) => {
    setFolderHistory((prev) => [...prev, { id: folderId, name: folderName }]);
    setCurrentFolderId(folderId);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newHistory = folderHistory.slice(0, index + 1);
    setFolderHistory(newHistory);
    setCurrentFolderId(newHistory[newHistory.length - 1].id);
  };

  const handleAddFolder = (folderName: string) => {
    if (!user.id) return;
    dispatch(createFolder({ name: folderName, parentFolderId: currentFolderId, ownerId: user.id }));
    setIsAddFolderOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleViewChange = (newView: string | null) => {
    if (newView !== null) {
      setIsGridView(newView === "grid");
    }
  };

  return (
    <>
      <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <CustomModal open={isAddFolderOpen} onClose={() => setIsAddFolderOpen(false)}>
          <AddFolder onAddFolder={handleAddFolder} onCancel={() => setIsAddFolderOpen(false)} existingFolders={folders.map(f => f.name)} />
        </CustomModal>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            mb: 3,
            border: "1px solid #eaeaea",
          }}
        >
          <Breadcrumbs separator={<ChevronRight size={16} />} aria-label="breadcrumb" sx={{ mb: 2 }}>
            {folderHistory.map((folder, index) => (
              <MuiLink
                key={folder.id ?? "home"}
                underline="hover"
                color={index === folderHistory.length - 1 ? "text.primary" : "inherit"}
                onClick={() => handleBreadcrumbClick(index)}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  fontWeight: index === folderHistory.length - 1 ? 600 : 400,
                  color: index === folderHistory.length - 1 ? "#333" : "#666",
                }}
              >
                {index === 0 && <HomeIcon size={16} style={{ marginRight: 4 }} />}
                {folder.name}
              </MuiLink>
            ))}
          </Breadcrumbs>

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
                {folderHistory[folderHistory.length - 1].name}
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

            <Box
              sx={{
                display: "flex",
                gap: 1,
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "space-between", sm: "flex-end" },
              }}
            >
              <ToggleViewSelector isGridView={isGridView} onViewChange={handleViewChange} />

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FolderPlus size={18} />}
                  onClick={() => setIsAddFolderOpen(true)}
                  sx={{
                    borderColor: "#10a37f",
                    color: "#10a37f",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#0e8c6b",
                      backgroundColor: "rgba(16, 163, 127, 0.04)",
                    },
                  }}
                >
                  {!isMobile && "New Folder"}
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Upload size={18} />}
                  onClick={handleOpenModal}
                  sx={{
                    backgroundColor: "#10a37f",
                    color: "#fff",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#0e8c6b",
                    },
                  }}
                >
                  {!isMobile && "Upload"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        <CustomModal open={isModalOpen} onClose={handleCloseModal}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Upload File
          </Typography>
          <FileUploader folderId={currentFolderId} />
        </CustomModal>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <CircularProgress sx={{ color: "#10a37f" }} />
          </Box>
        )}

        {!loading && folders?.length === 0 && files?.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
              color: "#888",
            }}
          >
            <Typography variant="h6">This folder is empty.</Typography>
          </Box>
        )}

        {!loading && (files?.length > 0 || folders?.length > 0) && (
          <FileFolderList
            isGridView={isGridView}
            files={files}
            folders={folders}
            onFolderClick={(folderId: number, folderName: string) => handleFolderClick(folderId, folderName)}
            userId={user.id}
          />
        )}
      </MotionBox>
    </>
  );
};

export default FileList;