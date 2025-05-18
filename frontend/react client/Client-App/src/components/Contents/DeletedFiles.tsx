import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StoreType } from '../../models/storeModel';
import { AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import { deleteFilePermanently, fetchDeletedFiles, restoreFile } from '../../store/StorageSlice';
import {
    Box,
    Typography,
    Container,
    Paper,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Alert,
    Snackbar,
} from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, RefreshCw, AlertTriangle, 
    // RotateCcw,
     Trash, Info } from "lucide-react"
import FileFolderList from './FileFolderListProps';


const DeletedFiles: React.FC = () => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false)
    const [selectedFileId, setSelectedFileId] = useState<number | null>(null)
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    })

    // const theme = useTheme()
    // const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const loading = useSelector((state: StoreType) => state.files.loading);
    const user = useSelector((state: StoreType) => state.users.user);
    const dispatch = useDispatch<AppDispatch>();
    const deletedFiles = useSelector((state: StoreType) => state.files.trashFiles);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchDeletedFiles(user.id)).then((response) => {
                console.log("Trash Files Response:", response.payload);
            });
        }
        else {
            navigate("/");
        }
    }, [dispatch, navigate, user.id]);

    // const handleViewChange = (newView: string | null) => {
    //     if (newView !== null) {
    //         setIsGridView(newView === "grid")
    //     }
    // }
    // const handleRestoreFile = (id: number) => {
    //     dispatch(restoreFile(id)).then((response) => {
    //         if (response.meta.requestStatus === "fulfilled") {
    //             setSnackbar({
    //                 open: true,
    //                 message: "File restored successfully",
    //                 severity: "success",
    //             })
    //         }
    //     })
    // }



    // const deletePermanently = (id: number) => {
    //     dispatch(deleteFilePermanently(id));
    // };
    // const handleDeletePermanently = (id: number) => {
    //     setSelectedFileId(id)
    //     setDeleteDialogOpen(true)
    const confirmDeletePermanently = async () => {
        if (selectedFileId !== null) {
            dispatch(deleteFilePermanently(selectedFileId)).then((result) => {
                setDeleteDialogOpen(false)
                setSelectedFileId(null)
                if (result.meta.requestStatus === "fulfilled") {

                    setSnackbar({
                        open: true,
                        message: "File deleted permanently",
                        severity: "success",
                    })
                }
            })
        }
    }

    const handleDeleteAllFiles = () => {
        setDeleteAllDialogOpen(true)
    }

    const confirmDeleteAllFiles = async () => {
        // const result = await deleteAllFilesPermanently()
        setDeleteAllDialogOpen(false)
        // if (result.success) {
        //     setSnackbar({
        //         open: true,
        //         message: "All files deleted permanently",
        //         severity: "success",
        //     })
        // }
    }

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false })
    }

    const handleRefresh = () => {
        if (user?.id) {
            fetchDeletedFiles(user.id)
        }
    }

    return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    backgroundColor: "rgba(231, 76, 60, 0.1)",
                  }}
                >
                  <Trash2 size={24} color="#e74c3c" />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
                    Trash
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Files are permanently deleted after 30 days
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshCw size={18} />}
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    borderColor: "#10a37f",
                    color: "#10a37f",
                    "&:hover": {
                      borderColor: "#0e8c6b",
                      backgroundColor: "rgba(16, 163, 127, 0.04)",
                    },
                  }}
                >
                  Refresh
                </Button>

                {deletedFiles.length > 0 && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Trash size={18} />}
                    onClick={handleDeleteAllFiles}
                    disabled={loading}
                    sx={{
                      borderColor: "#e74c3c",
                      color: "#e74c3c",
                      "&:hover": {
                        borderColor: "#c0392b",
                        backgroundColor: "rgba(231, 76, 60, 0.04)",
                      },
                    }}
                  >
                    Empty Trash
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>

           {/* {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <Button color="inherit" size="small" onClick={handleRefresh}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert> 
          )} */}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#10a37f" }} />
            </Box>
          ) : deletedFiles.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  borderRadius: 3,
                  border: "1px solid #eaeaea",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
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
                  <Info size={40} color="#10a37f" />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Trash is Empty
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                  Items that you delete will appear here. Files in the trash will be permanently deleted after 30 days.
                </Typography>
              </Paper>
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid #eaeaea",
                  }}
                >
                  <Box sx={{ mb: 3 }}>
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      <Typography variant="body2">
                        Files in trash will be permanently deleted after 30 days. You can restore them or delete them
                        permanently.
                      </Typography>
                    </Alert>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {deletedFiles.length} {deletedFiles.length === 1 ? "item" : "items"}
                    </Typography>
                  </Box>

                  <FileFolderList
                    isGridView={true}
                    files={deletedFiles}
                    folders={[]}
                    onFolderClick={() => {}}
                    userId={user?.id || 0}
                    // customActions={(file) => (
                    //   <Box sx={{ display: "flex", gap: 1 }}>
                    //     <Button
                    //       size="small"
                    //       variant="outlined"
                    //       startIcon={<RotateCcw size={16} />}
                    //       onClick={() => handleRestoreFile(file.id)}
                    //       sx={{
                    //         borderColor: "#10a37f",
                    //         color: "#10a37f",
                    //         "&:hover": {
                    //           borderColor: "#0e8c6b",
                    //           backgroundColor: "rgba(16, 163, 127, 0.04)",
                    //         },
                    //       }}
                    //     >
                    //       Restore
                    //     </Button>
                    //     <Button
                    //       size="small"
                    //       variant="outlined"
                    //       color="error"
                    //       startIcon={<Trash2 size={16} />}
                    //       onClick={() => handleDeletePermanently(file.id)}
                    //       sx={{
                    //         borderColor: "#e74c3c",
                    //         color: "#e74c3c",
                    //         "&:hover": {
                    //           borderColor: "#c0392b",
                    //           backgroundColor: "rgba(231, 76, 60, 0.04)",
                    //         },
                    //       }}
                    //     >
                    //       Delete
                    //     </Button>
                    //   </Box>
                    // )}
                  />
                </Paper>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* Delete confirmation dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AlertTriangle size={20} color="#e74c3c" />
            Confirm Permanent Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action cannot be undone. Are you sure you want to permanently delete this file?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "#666" }}>
            <Button
              onClick={confirmDeletePermanently}
              color="error"
              variant="contained"
              sx={{
                bgcolor: "#e74c3c",
                "&:hover": {
                  bgcolor: "#c0392b",
                },
              }}
              disabled={selectedFileId === null}
            >
              Delete Permanently
            </Button>
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete all confirmation dialog */}
        <Dialog
          open={deleteAllDialogOpen}
          onClose={() => setDeleteAllDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            },
          }}
        >
          <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AlertTriangle size={20} color="#e74c3c" />
            Empty Trash
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will permanently delete all items in the trash. This action cannot be undone. Are you sure you want
              to continue?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteAllDialogOpen(false)} sx={{ color: "#666" }}>
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteAllFiles}
              color="error"
              variant="contained"
              sx={{
                bgcolor: "#e74c3c",
                "&:hover": {
                  bgcolor: "#c0392b",
                },
              }}
            >
              Empty Trash
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success/Error snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%", borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  )
};

export default DeletedFiles;