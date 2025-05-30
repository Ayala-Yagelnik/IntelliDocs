import React, { useState } from "react";
import { Box, Typography, Grid, List, ListItem, Avatar, Paper, Accordion, AccordionSummary, AccordionDetails, IconButton, Tooltip, useTheme, } from "@mui/material"
import { ChevronDown, Folder, Trash2, Share2, Star, MoreHorizontal, } from "lucide-react"
import { motion } from "framer-motion"
import { MyFile } from "../../models/myfile";
import FileCard from "./FileCard";
import { formatFileSize, formatDate, stringToColor, getFileIcon } from "../../utils/utils";
import { Folder as FolderModel } from "../../models/folder";
import { deleteFolder } from "../../store/StorageSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";

const MotionListItem = motion(ListItem);

interface FileFolderListProps {
    isGridView: boolean;
    files: MyFile[];
    folders: FolderModel[];
    onFolderClick: (folderId: number, folderName: string) => void;
    userId: number;
    customActions?: (file: MyFile) => React.ReactNode
}

const MotionPaper = motion(Paper)


const FileFolderList: React.FC<FileFolderListProps> = ({ isGridView, files, folders, onFolderClick, userId, customActions }) => {
    const [foldersExpanded, setFoldersExpanded] = useState(true)
    const [filesExpanded, setFilesExpanded] = useState(true)
    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();

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
                                    border: `1px solid ${theme.palette.divider}`,
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
                                            backgroundColor: theme.palette.background.default,
                                            borderBottom: foldersExpanded ? `1px solid ${theme.palette.divider}` : "none",
                                            px: 3,
                                            py: 1.5,
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
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
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            transition: "all 0.2s ease",
                                                            "&:hover": {
                                                                transform: "translateY(-4px)",
                                                                boxShadow: theme.shadows[4],
                                                                borderColor: theme.palette.primary.main,
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
                                                                    backgroundColor: theme.palette.primary.light,
                                                                    mr: 2,
                                                                }}
                                                            >
                                                                <Folder size={24} color={theme.palette.primary.main} />
                                                            </Box>
                                                            <Box sx={{ flexGrow: 1 }}>
                                                                <Typography
                                                                    variant="body1"
                                                                    sx={{
                                                                        fontWeight: 500,
                                                                        color: theme.palette.text.primary,
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
                                                                        color: theme.palette.text.secondary,
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
                                                                        color: theme.palette.text.secondary,
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
                                                                        color: folder.isStarred ? "#f39c12" : theme.palette.text.secondary,
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
                                                                        color: theme.palette.text.secondary,
                                                                        "&:hover": { color: theme.palette.text.primary, backgroundColor: theme.palette.action.hover },
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
                                    border: `1px solid ${theme.palette.divider}`,
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
                                            backgroundColor: theme.palette.background.default,
                                            borderBottom: filesExpanded ? `1px solid ${theme.palette.divider}` : "none",
                                            px: 3,
                                            py: 1.5,
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                            Files
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ p: 3 }}>
                                        <Grid container spacing={3}>
                                            {files.map((file) => (
                                                <Grid item xs={12} sm={6} md={4} lg={3} key={file.id}>
                                                    <FileCard file={file} userId={userId} customActions={customActions ? customActions(file) : undefined} hideStar={!!customActions} />
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
                                border: `1px solid ${theme.palette.divider}`,
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
                                        backgroundColor: theme.palette.background.default,
                                        borderBottom: foldersExpanded ? `1px solid ${theme.palette.divider}` : "none",
                                        px: 3,
                                        py: 1.5,
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                        Folders
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 0 }}>
                                    <List disablePadding>
                                        <MotionListItem
                                            sx={{
                                                backgroundColor: theme.palette.background.default,
                                                borderBottom: `1px solid ${theme.palette.divider}`,
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
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                                                Name
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: theme.palette.text.secondary,
                                                    display: { xs: "none", md: "block" },
                                                }}
                                            >
                                                Size
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: theme.palette.text.secondary,
                                                    display: { xs: "none", md: "block" },
                                                }}
                                            >
                                                {files[0]?.deletedAt ? "Deleted Date" : "Last Update"}                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: theme.palette.text.secondary,
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
                                                    borderBottom: `1px solid ${theme.palette.divider}`,
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
                                                        backgroundColor: theme.palette.action.hover,
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
                                                            backgroundColor: theme.palette.primary.light,
                                                            mr: 2,
                                                        }}
                                                    >
                                                        <Folder size={18} color={theme.palette.primary.main} />
                                                    </Box>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: theme.palette.text.primary,
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
                                                        color: theme.palette.text.secondary,
                                                        display: { xs: "none", md: "block" },
                                                    }}
                                                >
                                                    —
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: theme.palette.text.secondary,
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
                                                                color: theme.palette.text.secondary,
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
                                                                color: folder.isStarred ? "#f39c12" : theme.palette.text.secondary,
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
                                                                color: theme.palette.text.secondary,
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
            border: `1px solid ${theme.palette.divider}`,
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
                                         backgroundColor: theme.palette.background.default,
                    borderBottom: filesExpanded ? `1px solid ${theme.palette.divider}` : "none",
                                        px: 3,
                                        py: 1.5,
                                    }}
                                >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                                        Files
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 0 }}>
                                    <List disablePadding>
                                        <MotionListItem
                                            sx={{
                                                backgroundColor: theme.palette.background.default,
                                                borderBottom: `1px solid ${theme.palette.divider}`,
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
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                                                Name
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: theme.palette.text.secondary,
                                                    display: { xs: "none", md: "block" },
                                                }}
                                            >
                                                Size
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: theme.palette.text.secondary,
                                                    display: { xs: "none", md: "block" },
                                                }}
                                            >
                                                Last Update
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: theme.palette.text.secondary,
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
                                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                                    py: 1.5,
                                                    px: 3,
                                                    display: "grid",
                                                    gridTemplateColumns: {
                                                        xs: "1fr",
                                                        sm: "3fr 1fr",
                                                        md: "3fr 1fr 1fr 1fr",
                                                    },
                                                    "&:hover": {
                                                        backgroundColor: theme.palette.background.default,
                                                    },
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    {getFileIcon(file.fileType)}
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: theme.palette.text.primary,
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
                                                        color: theme.palette.text.secondary,
                                                        display: { xs: "none", md: "block" },
                                                    }}
                                                >
                                                    {file.fileSize ? formatFileSize(file.fileSize) : "—"}
                                                </Typography>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: theme.palette.text.secondary,
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
                                                                bgcolor: file.author?.username ? stringToColor(file.author.username) : theme.palette.primary.main,
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
                                                                    color: theme.palette.text.secondary,
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


