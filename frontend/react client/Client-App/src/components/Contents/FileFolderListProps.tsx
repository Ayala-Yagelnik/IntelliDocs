import React, { useState } from "react";
import {
    Box,
    Typography,
    Grid,
    List,
    ListItem,
    Avatar,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Tooltip,
} from "@mui/material"
import {
    ChevronDown,
    Folder,
    Trash2,
    Share2,
    Star,
    MoreHorizontal,
} from "lucide-react"
import { motion } from "framer-motion"

const MotionListItem = motion(ListItem);
// import FolderIcon from "@mui/icons-material/Folder";
import { MyFile } from "../../models/myfile";
import FileCard from "./FileCard";
import { formatFileSize, formatDate, stringToColor, getFileIcon } from "../../utils/utils";
import { Folder as FolderModel } from "../../models/folder";
import { deleteFolder } from "../../store/StorageSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
// import { Delete, Download, Share, Star, StarBorder, ExpandMore } from "@mui/icons-material";

interface FileFolderListProps {
    isGridView: boolean;
    files: MyFile[];
    folders: FolderModel[];
    onFolderClick: (folderId: number, folderName: string) => void;
    userId: number;
    customActions?: (file: MyFile) => React.ReactNode
}

const MotionPaper = motion(Paper)


const FileFolderList: React.FC<FileFolderListProps> = ({ isGridView, files, folders, onFolderClick, userId ,customActions}) => {
    const [foldersExpanded, setFoldersExpanded] = useState(true)
    const [filesExpanded, setFilesExpanded] = useState(true)
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = (folder: FolderModel) => {
        console.log(`Deleting ${folder.name}`)
        dispatch(deleteFolder(folder.id))
    }


    return (
        <Box>
            {isGridView ? (
                <Box>
                    {folders.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 3,
                                    border: "1px solid #eaeaea",
                                    overflow: "hidden",
                                    mb: 3,
                                }}
                            >
                                <Accordion
                                    expanded={foldersExpanded}
                                    onChange={() => setFoldersExpanded(!foldersExpanded)}
                                    disableGutters
                                    elevation={0}
                                    sx={{
                                        "&:before": {
                                            display: "none",
                                        },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ChevronDown size={20} />}
                                        sx={{
                                            backgroundColor: "#f9f9f9",
                                            borderBottom: foldersExpanded ? "1px solid #eaeaea" : "none",
                                            px: 3,
                                            py: 1.5,
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333" }}>
                                            Folders
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            {folders.map((folder, index) => (
                                                <Grid item xs={12} sm={6} md={4} lg={3} key={folder.id}>
                                                    <MotionPaper
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                                        elevation={0}
                                                        onClick={() => onFolderClick(folder.id, folder.name)}
                                                        sx={{
                                                            p: 2,
                                                            borderRadius: 3,
                                                            border: "1px solid #eaeaea",
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            transition: "all 0.2s ease",
                                                            "&:hover": {
                                                                transform: "translateY(-4px)",
                                                                boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                                                                borderColor: "#10a37f",
                                                            },
                                                        }}
                                                    >
                                                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    width: 40,
                                                                    height: 40,
                                                                    borderRadius: "12px",
                                                                    backgroundColor: "rgba(16, 163, 127, 0.1)",
                                                                    mr: 2,
                                                                }}
                                                            >
                                                                <Folder size={24} color="#10a37f" />
                                                            </Box>
                                                            <Box sx={{ flexGrow: 1 }}>
                                                                <Typography
                                                                    variant="body1"
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        color: "#333",
                                                                        whiteSpace: "nowrap",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                    }}
                                                                >
                                                                    {folder.name}
                                                                </Typography>
                                                            </Box>
                                                            {folder.isStarred && <Star size={16} fill="#f39c12" color="#f39c12" />}
                                                        </Box>

                                                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: "auto" }}>
                                                            <Tooltip title="Delete">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleDelete(folder)
                                                                        console.log(`Delete folder ${folder.id}`)
                                                                    }}
                                                                    sx={{
                                                                        color: "#666",
                                                                        "&:hover": { color: "#e74c3c", backgroundColor: "rgba(231, 76, 60, 0.08)" },
                                                                    }}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Share">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        console.log(`Share folder ${folder.id}`)
                                                                    }}
                                                                    sx={{
                                                                        color: "#666",
                                                                        "&:hover": { color: "#3498db", backgroundColor: "rgba(52, 152, 219, 0.08)" },
                                                                    }}
                                                                >
                                                                    <Share2 size={16} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title={folder.isStarred ? "Unstar" : "Star"}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        console.log(`${folder.isStarred ? "Unstar" : "Star"} folder ${folder.id}`)
                                                                    }}
                                                                    sx={{
                                                                        color: folder.isStarred ? "#f39c12" : "#666",
                                                                        "&:hover": {
                                                                            color: folder.isStarred ? "#e67e22" : "#f39c12",
                                                                            backgroundColor: "rgba(243, 156, 18, 0.08)",
                                                                        },
                                                                    }}
                                                                >
                                                                    <Star size={16} fill={folder.isStarred ? "#f39c12" : "none"} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="More options">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        console.log(`More options for folder ${folder.id}`)
                                                                    }}
                                                                    sx={{
                                                                        color: "#666",
                                                                        "&:hover": { color: "#333", backgroundColor: "rgba(0, 0, 0, 0.04)" },
                                                                    }}
                                                                >
                                                                    <MoreHorizontal size={16} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    </MotionPaper>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Paper>
                        </Box>
                    )}

                    {files.length > 0 && (
                        <Box>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 3,
                                    border: "1px solid #eaeaea",
                                    overflow: "hidden",
                                    mb: 3,
                                }}
                            >
                                <Accordion
                                    expanded={filesExpanded}
                                    onChange={() => setFilesExpanded(!filesExpanded)}
                                    disableGutters
                                    elevation={0}
                                    sx={{
                                        "&:before": {
                                            display: "none",
                                        },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ChevronDown size={20} />}
                                        sx={{
                                            backgroundColor: "#f9f9f9",
                                            borderBottom: filesExpanded ? "1px solid #eaeaea" : "none",
                                            px: 3,
                                            py: 1.5,
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333" }}>
                                            Files
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            {files.map((file,
                                                //  index
                                            ) => (
                                                <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                                                    <FileCard file={file} userId={userId} />
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Paper>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box>
                    {folders.length > 0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: "1px solid #eaeaea",
                                overflow: "hidden",
                                mb: 3,
                            }}
                        >
                            <Accordion
                                expanded={foldersExpanded}
                                onChange={() => setFoldersExpanded(!foldersExpanded)}
                                disableGutters
                                elevation={0}
                                sx={{
                                    "&:before": {
                                        display: "none",
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ChevronDown size={20} />}
                                    sx={{
                                        backgroundColor: "#f9f9f9",
                                        borderBottom: foldersExpanded ? "1px solid #eaeaea" : "none",
                                        px: 3,
                                        py: 1.5,
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333" }}>
                                        Folders
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 0 }}>
                                    <List disablePadding>
                                        <MotionListItem
                                            sx={{
                                                backgroundColor: "#f9f9f9",
                                                borderBottom: "1px solid #eaeaea",
                                                py: 1.5,
                                                px: 3,
                                                display: "grid",
                                                gridTemplateColumns: {
                                                    xs: "1fr",
                                                    sm: "3fr 1fr",
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
                                                {files[0]?.deletedAt ? "Deleted Date" : "Last Update"}                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#666",
                                                    display: { xs: "none", sm: "block" },
                                                    textAlign: "right",
                                                }}
                                            >
                                                Actions
                                            </Typography>
                                        </MotionListItem>

                                        {folders.map((folder, index) => (
                                            <MotionListItem
                                                key={folder.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                onClick={() => onFolderClick(folder.id, folder.name)}
                                                sx={{
                                                    borderBottom: "1px solid #eaeaea",
                                                    py: 1.5,
                                                    px: 3,
                                                    display: "grid",
                                                    gridTemplateColumns: {
                                                        xs: "1fr",
                                                        sm: "3fr 1fr",
                                                        md: "3fr 1fr 1fr 1fr",
                                                    },
                                                    cursor: "pointer",
                                                    "&:hover": {
                                                        backgroundColor: "#f9f9f9",
                                                    },
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: "8px",
                                                            backgroundColor: "rgba(16, 163, 127, 0.1)",
                                                            mr: 2,
                                                        }}
                                                    >
                                                        <Folder size={18} color="#10a37f" />
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: "#333",
                                                            fontWeight: 500,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                        }}
                                                    >
                                                        {folder.name}
                                                        {folder.isStarred && <Star size={14} fill="#f39c12" color="#f39c12" />}
                                                    </Typography>
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#666",
                                                        display: { xs: "none", md: "block" },
                                                    }}
                                                >
                                                    —
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#666",
                                                        display: { xs: "none", md: "block" },
                                                    }}
                                                >
                                                    —
                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: { xs: "none", sm: "flex" },
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Tooltip title="Share">
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                color: "#666",
                                                                "&:hover": { color: "#3498db", backgroundColor: "rgba(52, 152, 219, 0.08)" },
                                                            }}
                                                        >
                                                            <Share2 size={16} />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title={folder.isStarred ? "Unstar" : "Star"}>
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                color: folder.isStarred ? "#f39c12" : "#666",
                                                                "&:hover": {
                                                                    color: folder.isStarred ? "#e67e22" : "#f39c12",
                                                                    backgroundColor: "rgba(243, 156, 18, 0.08)",
                                                                },
                                                            }}
                                                        >
                                                            <Star size={16} fill={folder.isStarred ? "#f39c12" : "none"} />
                                                        </IconButton>
                                                    </Tooltip>

                                                    <Tooltip title="Delete">
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                color: "#666",
                                                                "&:hover": { color: "#e74c3c", backgroundColor: "rgba(231, 76, 60, 0.08)" },
                                                            }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </MotionListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    )}

                    {files.length > 0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: "1px solid #eaeaea",
                                overflow: "hidden",
                            }}
                        >
                            <Accordion
                                expanded={filesExpanded}
                                onChange={() => setFilesExpanded(!filesExpanded)}
                                disableGutters
                                elevation={0}
                                sx={{
                                    "&:before": {
                                        display: "none",
                                    },
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ChevronDown size={20} />}
                                    sx={{
                                        backgroundColor: "#f9f9f9",
                                        borderBottom: filesExpanded ? "1px solid #eaeaea" : "none",
                                        px: 3,
                                        py: 1.5,
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333" }}>
                                        Files
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 0 }}>
                                    <List disablePadding>
                                        <MotionListItem
                                            sx={{
                                                backgroundColor: "#f9f9f9",
                                                borderBottom: "1px solid #eaeaea",
                                                py: 1.5,
                                                px: 3,
                                                display: "grid",
                                                gridTemplateColumns: {
                                                    xs: "1fr",
                                                    sm: "3fr 1fr",
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
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#666",
                                                    display: { xs: "none", sm: "block" },
                                                }}
                                            >
                                                Owner
                                            </Typography>
                                        </MotionListItem>

                                        {files.map((file, index) => (
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
                                                        xs: "1fr",
                                                        sm: "3fr 1fr",
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
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 1,
                                                        }}
                                                    >
                                                        {file.fileName}
                                                        {file.isStarred && <Star size={14} fill="#f39c12" color="#f39c12" />}
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
                                                    {file.deletedAt
                                                        ? formatDate(file.deletedAt)
                                                        : file.uploadDate
                                                            ? formatDate(file.uploadDate)
                                                            : "—"}                                                </Typography>

                                                <Box
                                                    sx={{
                                                        display: { xs: "none", sm: "flex" },
                                                        alignItems: "center",
                                                        justifyContent: "flex-end",
                                                    }}
                                                >
                                                    {customActions ? (
                                                        customActions(file)
                                                    ) : (
                                                        <Box sx={{ display: "flex", alignItems: "center" }}>                                                    <Avatar
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
                                                    )}
                                                </Box>
                                            </MotionListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </Paper>
                    )}
                </Box>
            )}
        </Box>
    )

};

export default FileFolderList;


