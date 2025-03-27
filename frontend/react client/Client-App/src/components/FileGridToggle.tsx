import { useState } from "react";
import { Box,  IconButton, Grid, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";

const files = [
  { name: "Financial Reports", type: "folder" },
  { name: "Project Documents", type: "folder" },
  { name: "Contract.pdf", type: "pdf" },
  { name: "Financial Report.xlsx", type: "excel" },
  { name: "Meeting Notes.docx", type: "word" },
  { name: "Presentation.pptx", type: "ppt" },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case "pdf":
      return <PictureAsPdfIcon sx={{ color: "#d32f2f" }} />;
    case "excel":
      return <InsertChartIcon sx={{ color: "#388e3c" }} />;
    case "word":
      return <DescriptionIcon sx={{ color: "#1976d2" }} />;
    case "ppt":
      return <InsertDriveFileIcon sx={{ color: "#d84315" }} />;
    case "folder":
      return <FolderIcon sx={{ color: "#0288d1" }} />;
    default:
      return <InsertDriveFileIcon />;
  }
};

const FileGridToggle = () => {
  const [isGridView, setIsGridView] = useState(false);

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">My Files</Typography>
        <IconButton onClick={() => setIsGridView(!isGridView)}>
          {isGridView ? <ViewListIcon /> : <ViewModuleIcon />}
        </IconButton>
      </Box>
      {isGridView ? (
        <Grid container spacing={2}>
          {files.map((file, index) => (
            <Grid item key={index} xs={6} sm={4} md={3} lg={2}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "#f1f3f4",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {getFileIcon(file.type)}
                <Typography variant="body2" sx={{ mt: 1 }}>{file.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <List>
          {files.map((file, index) => (
            <ListItem key={index} divider>
              <ListItemIcon>{getFileIcon(file.type)}</ListItemIcon>
              <ListItemText primary={file.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileGridToggle;
