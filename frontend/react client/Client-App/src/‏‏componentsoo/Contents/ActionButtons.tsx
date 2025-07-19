import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Plus, RefreshCw, Upload } from "lucide-react";

interface ActionButtonsProps {
    onAddFolder: () => void;
    onUpload: () => void;
    onRefresh: () => void;
    viewSelector?: React.ReactNode;
    isMobile?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    onAddFolder,
    onUpload,
    onRefresh,
    viewSelector,
    isMobile = false,
}) => (
    <Box
        sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexDirection: "row",
            width: "100%",
            justifyContent: { xs: "center", sm: "flex-end" },
        }}
    >
        {/* Toggle viewSelector תמיד ראשון */}
        {viewSelector}
        {/* כפתור תיקיה */}
        <Button
            onClick={onAddFolder}
            startIcon={<Plus />}
            variant="outlined"
            sx={{
                minWidth: isMobile ? 40 : 150,
                px: isMobile ? 0 : 3,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: isMobile ? "1.2rem" : "1rem",
                height: 40,
                textTransform: "none",
                justifyContent: "center",
            }}
        >
            {!isMobile && "New Folder"}
        </Button>
        {/* כפתור העלאה */}
        <Button
            onClick={onUpload}
            startIcon={<Upload />}
            variant="contained"
            sx={{
                minWidth: isMobile ? 40 : 150,
                px: isMobile ? 0 : 3,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: isMobile ? "1.2rem" : "1rem",
                height: 40,
                textTransform: "none",
                boxShadow: "none",
                justifyContent: "center",
            }}
        >
            {!isMobile && "Upload"}
        </Button>
        <Tooltip title="Refresh">
            <IconButton onClick={onRefresh}><RefreshCw /></IconButton>
        </Tooltip>
    </Box>
);

export default ActionButtons;

// import { Box, Button, IconButton, Tooltip } from "@mui/material";
// import { Plus, Upload, RefreshCw } from "lucide-react";

// interface ActionButtonsProps {
//   onAddFolder: () => void;
//   onUpload: () => void;
//   onRefresh: () => void;
//   viewSelector?: React.ReactNode;
//   isMobile?: boolean;
// }

// const ActionButtons: React.FC<ActionButtonsProps> = ({   onAddFolder,
//   onUpload,
//   onRefresh,
//   viewSelector,
//   isMobile = false,
// }) => (
//   <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//      {isMobile ? (
//       <>
//         <Tooltip title="New Folder">
//           <IconButton onClick={onAddFolder}><Plus /></IconButton>
//         </Tooltip>
//         <Tooltip title="Upload">
//           <IconButton onClick={onUpload}><Upload /></IconButton>
//         </Tooltip>
//         <Tooltip title="Refresh">
//           <IconButton onClick={onRefresh}><RefreshCw /></IconButton>
//         </Tooltip>
//       </>
//     ) : (
//       <>
//         <Button
//           onClick={onAddFolder}
//           startIcon={<Plus />}
//           variant="outlined"
//           sx={{ minWidth: 0, px: 1.5 }}
//         >
//           New Folder
//         </Button>
//         <Button
//           onClick={onUpload}
//           startIcon={<Upload />}
//           variant="outlined"
//           sx={{ minWidth: 0, px: 1.5 }}
//         >
//           Upload
//         </Button>
//         <Tooltip title="Refresh">
//           <IconButton onClick={onRefresh}><RefreshCw /></IconButton>
//         </Tooltip>
//       </>
//     )}
//     {viewSelector}
//   </Box>
// );

// export default ActionButtons;