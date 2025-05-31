import ImageIcon from "@mui/icons-material/Image";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import MovieIcon from "@mui/icons-material/Movie";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import CodeIcon from "@mui/icons-material/Code";


export const formatFileSize = (sizeInBytes: number): string => {
  return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`; // Convert bytes to MB
};

export const formatDate = (date: string | Date): string => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return `${parsedDate.toLocaleDateString()} ${parsedDate.getHours()}:${parsedDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

export const stringToColor = (string: string): string => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`; // Generate an HSL color
  return color;
};


export const getFileIcon = (type: string) => {
  if (!type ) {
    return < InsertDriveFileIcon/>;
  }
  if (type.startsWith("image/")) {
    return <ImageIcon sx={{ color: "#ff5722" }} />; // Orange for images
  }
  if (type.startsWith("audio/")) {
    return <AudiotrackIcon sx={{ color: "#8e44ad" }} />; // Purple for audio
  }
  if (type.startsWith("video/")) {
    return <MovieIcon sx={{ color: "#e67e22" }} />; // Orange for video
  }
  if (type === "application/pdf") {
    return <PictureAsPdfIcon sx={{ color: "#d32f2f" }} />; // Red for PDFs
  }
  if (
    type === "application/vnd.ms-excel" ||
    type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    return <InsertChartIcon sx={{ color: "#388e3c" }} />; // Green for Excel
  }
  if (
    type === "application/msword" ||
    type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return <DescriptionIcon sx={{ color: "#1976d2" }} />; // Blue for Word
  }
  if (
    type === "application/vnd.ms-powerpoint" ||
    type === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return <InsertDriveFileIcon sx={{ color: "#d84315" }} />; // Orange for PowerPoint
  }
  if (type === "folder") {
    return <FolderIcon sx={{ color: "#0288d1" }} />; // Blue for folders
  }
  if (type.startsWith("text/")) {
    return <CodeIcon sx={{ color: "#2c3e50" }} />; // Dark blue for text/code files
  }
  return <InsertDriveFileIcon sx={{ color: "#757575" }} />; // Default gray icon for unknown types
};

// const getFileIcon = (fileType: string) => {
//   if (fileType.startsWith("image/")) return <FileImage size={64} color="#10a37f" />
//   if (fileType === "application/pdf") return <FilePdf size={64} color="#e74c3c" />
//   if (fileType.startsWith("video/")) return <FileVideo size={64} color="#3498db" />
//   if (fileType.startsWith("audio/")) return <FileAudio size={64} color="#9b59b6" />
//   if (fileType.includes("spreadsheet") || fileType.includes("excel") || fileType.includes("xlsx"))
//     return <FileSpreadsheet size={64} color="#27ae60" />
//   if (fileType.includes("zip") || fileType.includes("rar") || fileType.includes("tar") || fileType.includes("gz"))
//     return <FileArchive size={64} color="#f39c12" />
//   if (
//     fileType.includes("html") ||
//     fileType.includes("css") ||
//     fileType.includes("javascript") ||
//     fileType.includes("json")
//   )
//     return <FileCode size={64} color="#2c3e50" />
//   if (fileType.includes("text") || fileType.includes("doc") || fileType.includes("word"))
//     return <FileText size={64} color="#3498db" />
//   return <File size={64} color="#95a5a6" />
// }

// const getFileIcon = (fileType: string) => {
//   if (fileType.startsWith("image/")) return <FileImage size={20} color="#10a37f" />
//   if (fileType === "application/pdf") return <FilePdf size={20} color="#e74c3c" />
//   if (fileType.startsWith("video/")) return <FileVideo size={20} color="#3498db" />
//   if (fileType.startsWith("audio/")) return <FileAudio size={20} color="#9b59b6" />
//   if (fileType.includes("spreadsheet") || fileType.includes("excel") || fileType.includes("xlsx"))
//     return <FileSpreadsheet size={20} color="#27ae60" />
//   if (fileType.includes("zip") || fileType.includes("rar") || fileType.includes("tar") || fileType.includes("gz"))
//     return <FileArchive size={20} color="#f39c12" />
//   if (
//     fileType.includes("html") ||
//     fileType.includes("css") ||
//     fileType.includes("javascript") ||
//     fileType.includes("json")
//   )
//     return <FileCode size={20} color="#2c3e50" />
//   if (fileType.includes("text") || fileType.includes("doc") || fileType.includes("word"))
//     return <FileText size={20} color="#3498db" />
//   return <File size={20} color="#95a5a6" />
// }