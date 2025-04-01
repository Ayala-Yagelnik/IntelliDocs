import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFile, fetchPresignedUrl, starFile } from '../store/StorageSlice';
import { AppDispatch } from '../store/store';
import { MyFile } from '../models/myfile';
import { StoreType } from '../models/storeModel';
import ShareFile from './ShareFile';
import { getFileIcon } from '../utils/utils';
import { Card, CardContent, CardMedia, Typography, Box, IconButton, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText, Skeleton, } from "@mui/material"
import { Trash2, Share, Star, Download, MoreVertical } from "lucide-react"
import { motion } from "framer-motion"

interface FileCardProps {
  file: MyFile;
  userId: number;
}

const MotionCard = motion(Card)


const FileCard: React.FC<FileCardProps> = React.memo(({ file, }) => {

  const dispatch = useDispatch<AppDispatch>();
  const presignedUrl = useSelector((state: StoreType) => state.files.presignedUrls?.[file.fileKey] || null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const loading = useSelector((state: StoreType) => state.files.loading)
  useEffect(() => {
    console.log(presignedUrl);

    if (!presignedUrl) {
      dispatch(fetchPresignedUrl(file));
    }
  }, [dispatch, file, file.fileKey, presignedUrl]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDownload = () => {
    if (presignedUrl) {
      const encodedFileName = encodeURIComponent(file.fileName);
      const link = document.createElement("a");
      link.href = `${presignedUrl}&fileName=${encodedFileName}`;

      // תמיד להוריד את הקובץ, גם אם הוא פתוח בדפדפן
      link.setAttribute('download', file.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.info("Your file is being downloaded to your device.");
    } else {
      console.error("No presigned URL available for download.");
    }
    handleMenuClose()
  };

  const handleDelete = () => {
    console.log(`Deleting ${file.fileName}`)
    dispatch(deleteFile(file.id))
    handleMenuClose()
  }

  const handleShare = () => {
    setShareModalOpen(true)
    handleMenuClose()
  }

  const handleStar = () => {
    dispatch(starFile({ fileId: file.id, isStarred: file.isStarred }))
    console.log(`${file.isStarred ? "Unstarring" : "Starring"} ${file.fileName}`)
    handleMenuClose()
  }

  return (
    <>
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          backgroundColor: "#fff",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid #eaeaea",
          overflow: "hidden",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        {/* <CardMedia
          component={
            file.fileType.startsWith("image/")
              ? "img"
              : file.fileType === "application/pdf"
                ? "iframe"
                : file.fileType.startsWith("video/")
                  ? "video"
                  : "div"
          }
          height="140"
          image={file.fileType.startsWith("image/") ? presignedUrl || undefined : undefined}
          src={file.fileType === "application/pdf" ? presignedUrl || undefined : undefined}
          alt={file.fileName}
          controls={file.fileType.startsWith("video/") ? true : undefined}
          sx={{
            borderRadius: "8px 8px 0 0",
            backgroundColor: file.fileType.startsWith("txt/")
              ? "#f5f5f5"
              : file.fileType === "application/pdf"
                ? "#e0e0e0"
                : undefined,
            display: file.fileType.startsWith("image/") || file.fileType === "application/pdf" || file.fileType.startsWith("video/")
              ? "block"
              : "none",
            objectFit: "cover",
            height: 150,
          }}
        /> */}
        {/* {!(file.fileType.startsWith("image/") || file.fileType === "application/pdf" || file.fileType.startsWith("video/")) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 150,
              backgroundColor: "#f5f5f5",
            }}
          >
            {React.cloneElement(getFileIcon(file.fileType), { sx: { fontSize: "8rem", ...getFileIcon(file.fileType).props.sx } })}
          </Box>
        )} */}

        {loading ? (
          <Skeleton variant="rectangular" height={140} animation="wave" sx={{ borderRadius: "12px 12px 0 0" }} />
        ) : (
          <>
            {file.fileType.startsWith("image/") ? (
              <CardMedia
                component="img"
                height={140}
                image={presignedUrl || undefined}
                alt={file.fileName}
                sx={{
                  borderRadius: "12px 12px 0 0",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 140,
                  backgroundColor: "#f9f9f9",
                  borderRadius: "12px 12px 0 0",
                }}
              >
                {getFileIcon(file.fileType)}
              </Box>
            )}
          </>
        )}


        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          {loading ? (
            <>
              <Skeleton animation="wave" height={24} width="80%" />
              <Skeleton animation="wave" height={20} width="40%" />
              <Skeleton animation="wave" height={20} width="60%" />
            </>
          ) : (
            <>
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    color: "#333",
                    mb: 0.5,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {file.fileName}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
                  Size: {(file.fileSize / 1024).toFixed(2)} KB
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", fontSize: "0.75rem" }}>
                  {file.fileType.split("/")[1]?.toUpperCase() || file.fileType}
                </Typography>
              </Box>
            </>
          )}

{!loading && (
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="Download">
                <IconButton
                  onClick={handleDownload}
                  size="small"
                  sx={{
                    color: "#666",
                    "&:hover": { color: "#10a37f", backgroundColor: "rgba(16, 163, 127, 0.08)" },
                  }}
                >
                  <Download size={18} />
                </IconButton>
              </Tooltip>

              <Tooltip title={file.isStarred ? "Unstar" : "Star"}>
                <IconButton
                  onClick={handleStar}
                  size="small"
                  sx={{
                    color: file.isStarred ? "#f39c12" : "#666",
                    "&:hover": {
                      color: file.isStarred ? "#e67e22" : "#f39c12",
                      backgroundColor: "rgba(243, 156, 18, 0.08)",
                    },
                  }}
                >
                  <Star size={18} fill={file.isStarred ? "#f39c12" : "none"} />
                </IconButton>
              </Tooltip>
            </Box>

            <IconButton
              onClick={handleMenuOpen}
              size="small"
              sx={{
                color: "#666",
                "&:hover": { color: "#333", backgroundColor: "rgba(0, 0, 0, 0.04)" },
              }}
            >
              <MoreVertical size={18} />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.08))",
                  mt: 1.5,
                  borderRadius: 2,
                  minWidth: 180,
                  "& .MuiMenuItem-root": {
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    mx: 0.5,
                    my: 0.25,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleDownload}>
                <ListItemIcon>
                  <Download size={18} />
                </ListItemIcon>
                <ListItemText>Download</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleShare}>
                <ListItemIcon>
                  <Share size={18} />
                </ListItemIcon>
                <ListItemText>Share</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleStar}>
                <ListItemIcon>
                  <Star size={18} fill={file.isStarred ? "#f39c12" : "none"} />
                </ListItemIcon>
                <ListItemText>{file.isStarred ? "Unstar" : "Star"}</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDelete} sx={{ color: "#e74c3c" }}>
                <ListItemIcon>
                  <Trash2 size={18} color="#e74c3c" />
                </ListItemIcon>
                <ListItemText>Delete</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </CardContent>
      </MotionCard>
        <ShareFile file={file} open={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </>
  );
});

export default FileCard;