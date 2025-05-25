import { Box, CircularProgress, Paper, Typography, useMediaQuery, useTheme } from "@mui/material";
import FileUploader from "./FileUploader";
import BreadcrumbsNav from "./BreadcrumbsNav";
import PageHeader from "./PageHeader";
import ToggleViewSelector from "./ToggleButtonGroup";
import EmptyState from "./EmptyState";
import { FolderOpen } from "lucide-react";
import FileFolderList from "./FileFolderList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreType } from "../../models/storeModel";
import { AppDispatch } from "../../store/store";
import { useEffect, useState } from "react";
import { createFolder, fetchFolderContents, fetchUserContent } from "../../store/StorageSlice";
import CustomModal from "../CustomModal";
import ActionButtons from "./ActionButtons";
import AddFolder from "./AddFolder";
import { motion } from "framer-motion";

const MotionBox = motion(Box);


const NewFileList: React.FC = () => {
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

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


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
                    <AddFolder
                        onAddFolder={handleAddFolder}
                        onCancel={() => setIsAddFolderOpen(false)}
                        existingFolders={folders.map(f => f.name)}
                    />
                </CustomModal>
                <CustomModal open={isModalOpen} onClose={handleCloseModal}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                        Upload File
                    </Typography>
                    <FileUploader folderId={currentFolderId} />
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
                    <BreadcrumbsNav items={folderHistory} onClick={handleBreadcrumbClick} />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: { xs: 2, sm: 0 },
                        }}
                    >
                        <PageHeader
                            title={folderHistory[folderHistory.length - 1].name}
                            actions={
                                <ActionButtons
                                    onAddFolder={() => setIsAddFolderOpen(true)}
                                    onUpload={handleOpenModal}
                                    onRefresh={handleRefresh}
                                    viewSelector={
                                        <ToggleViewSelector isGridView={isGridView} onViewChange={handleViewChange} />
                                    }
                                    isMobile={isMobile}
                                />
                            }
                        />
                    </Box>
                </Paper>

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                        <CircularProgress sx={{ color: "#10a37f" }} />
                    </Box>
                )}

                {!loading && folders?.length === 0 && files?.length === 0 && (
                    <EmptyState
                        icon={<FolderOpen size={40} color="#10a37f" />}
                        title="This folder is empty."
                        description="Start by uploading files or creating a folder."
                    />
                )}

                {!loading && (files?.length > 0 || folders?.length > 0) && (
                    <FileFolderList
                        isGridView={isGridView}
                        files={files}
                        folders={folders}
                        onFolderClick={handleFolderClick}
                        userId={user.id}
                    />
                )}
            </MotionBox>
        </>
        // <>
        //     <CustomModal open={isAddFolderOpen} onClose={() => setIsAddFolderOpen(false)}>
        //         <AddFolder onAddFolder={handleAddFolder} onCancel={() => setIsAddFolderOpen(false)} existingFolders={folders.map(f => f.name)} />
        //     </CustomModal>
        //     <CustomModal open={isModalOpen} onClose={handleCloseModal}>
        //         <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        //             Upload File
        //         </Typography>
        //         <FileUploader folderId={currentFolderId} />
        //     </CustomModal>
        //     {/* <UploadModal open={isModalOpen} onClose={handleCloseModal} folderId={currentFolderId} /> */}
        //     <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, mb: 3, border: "1px solid #eaeaea" }}>
        //         <BreadcrumbsNav items={folderHistory} onClick={handleBreadcrumbClick} />
        //         <PageHeader
        //             title="My Files"
        //             actions={
        //                 <ActionButtons
        //                     onAddFolder={() => setIsAddFolderOpen(true)}
        //                     onUpload={handleOpenModal}
        //                     onRefresh={handleRefresh}
        //                     viewSelector={
        //                         <ToggleViewSelector isGridView={isGridView} onViewChange={handleViewChange} />
        //                     }
        //                 />
        //             }
        //         />
        //     </Paper>
        //     {loading ? (
        //         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        //             <CircularProgress sx={{ color: "#10a37f" }} />
        //         </Box>
        //     ) : files.length === 0 && folders.length === 0 ? (
        //         <EmptyState
        //             icon={<FolderOpen size={40} color="#10a37f" />}
        //             title="No files or folders"
        //             description="Start by uploading files or creating a folder."
        //         />
        //     ) : (
        //         <FileFolderList
        //             isGridView={isGridView}
        //             files={files}
        //             folders={folders}
        //             onFolderClick={handleFolderClick}
        //             userId={user.id}
        //         />
        //     )}
        // </>
    );
};

export default NewFileList;