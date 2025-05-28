import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  Avatar,
  // List,
  // ListItem,
  // ListItemAvatar,
  // ListItemText,
  InputAdornment,
  CircularProgress,
  useTheme,
  Snackbar,
} from "@mui/material"
import MuiAlert from "@mui/material/Alert";
import { shareFile } from "../../store/StorageSlice";
import { AppDispatch } from "../../store/store";
import { useDispatch } from "react-redux";
import { MyFile } from "../../models/myfile";
import { X, Copy, Check, Mail, LinkIcon } from "lucide-react"
import { motion } from "framer-motion"
import { User } from "../../models/user";
import CustomModal from "../CustomModal";

interface ShareDialogProps {
  file: MyFile
  open: boolean
  onClose: () => void
}

const MotionBox = motion(Box)


const ShareDialog = ({ file, open, onClose }: ShareDialogProps) => {
  const [email, setEmail] = useState("");
  // const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const [errorMsg, setErrorMsg] = useState("");


  // const handleSelectUser = (user: User) => {
  //   setSelectedUsers([...selectedUsers, user]);
  //   setSearchTerm("");
  // };
 
  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
  };

 const handleShare = async () => {
  setIsSharing(true);
  try {
    await dispatch(shareFile({ fileId: file.id, email })).unwrap();
    console.log("File shared successfully with:", email);
    setErrorMsg("");
    onClose();
  } catch (error: unknown) {
    let msg = "";

    if (typeof error === "string") {
      msg = error;
    } else if (
      typeof error === "object" &&
      error !== null &&
      "message" in error &&
      typeof (error as { message: string }).message === "string"
    ) {
      msg = (error as { message: string }).message;
    }

    if (msg.includes("400")) {
      setErrorMsg(`The file is already shared with ${email}.`);
    } else {
      setErrorMsg("Error sharing file. Please try again.");
    }

    console.error("Error sharing file:", error);
  } finally {
    setIsSharing(false);
  }
};


  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://example.com/shared/${file.id}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <CustomModal open={open} onClose={onClose} maxWidth={500}>
      <Snackbar
        open={!!errorMsg}
        autoHideDuration={4000}
        onClose={() => setErrorMsg("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert onClose={() => setErrorMsg("")} severity="warning" sx={{ width: '100%' }}>
          {errorMsg}
        </MuiAlert>
      </Snackbar>
      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Share "{file.fileName}"
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            People
          </Typography>
          {/* <TextField
            fullWidth
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} color="#666" />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          /> */}
          <TextField
            fullWidth
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={18} color={theme.palette.text.secondary} />
                </InputAdornment>
              ),
              sx: { borderRadius: 2 },
            }}
          />
          {/* {searchTerm && (
            <Box sx={{ mt: 1, maxHeight: 200, overflow: "auto", borderRadius: 2, border: "1px solid #eaeaea" }}>
              <List disablePadding>
                {selectedUsers.map((user) => (
                  <ListItem
                    key={user.id}
                    component="button"
                    onClick={() => handleSelectUser(user)}
                    sx={{
                      "&:hover": { backgroundColor: "rgba(16, 163, 127, 0.04)" },
                      borderBottom: "1px solid #eaeaea",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar alt={user.username} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.username}
                      secondary={user.email}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {selectedUsers.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {selectedUsers.map((user) => (
                <Chip
                  key={user.id}
                  avatar={<Avatar alt={user.username} />}
                  label={user.username}
                  onDelete={() => handleRemoveUser(user.id)}
                  deleteIcon={<X size={16} />}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "rgba(16, 163, 127, 0.1)",
                    "& .MuiChip-label": { fontWeight: 500 },
                  }}
                />
              ))}
            </Box>
          )}
        </Box> */}
          {selectedUsers.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
              {selectedUsers.map((user) => (
                <Chip
                  key={user.id}
                  avatar={<Avatar alt={user.username} />}
                  label={user.username}
                  onDelete={() => handleRemoveUser(user.id)}
                  deleteIcon={<X size={16} />}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: "rgba(16, 163, 127, 0.1)",
                    "& .MuiChip-label": { fontWeight: 500 },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            Get a shareable link
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextField
              fullWidth
              value="https://example.com/shared/123456"
              variant="outlined"
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon size={18} color={theme.palette.text.secondary} />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
            <Button
              variant="outlined"
              onClick={handleCopyLink}
              startIcon={linkCopied ? <Check size={18} /> : <Copy size={18} />}
              sx={{
                minWidth: 100,
                borderColor: linkCopied ? theme.palette.primary.main : theme.palette.divider,
                color: linkCopied ? theme.palette.primary.main : theme.palette.text.secondary,
                borderRadius: 2,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: theme.palette.primary.light,
                },
              }}
            >
              {linkCopied ? "Copied" : "Copy"}
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{
              borderColor: theme.palette.divider,
              color: theme.palette.text.secondary,
              borderRadius: 2,
              "&:hover": {
                borderColor: theme.palette.text.primary,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleShare}
            disabled={!email}
            startIcon={isSharing ?
              <CircularProgress size={16} color="inherit" />
              : <Mail size={18} />}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
              "&.Mui-disabled": {
                backgroundColor: theme.palette.action.disabledBackground,
                color: theme.palette.action.disabled,
              },
            }}
          >
            {isSharing ? "Sharing..." : "Share"}
          </Button>
        </Box>
      </MotionBox>
    </CustomModal>
  );
};

export default ShareDialog;
