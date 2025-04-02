import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  InputAdornment,
  CircularProgress,
} from "@mui/material"
import { shareFile } from "../store/StorageSlice";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { MyFile } from "../models/myfile";
import { Search, X, Copy, Check, Mail, LinkIcon } from "lucide-react"
import { motion } from "framer-motion"
import { User } from "../models/user";
import CustomModal from "./CustomModal";

interface ShareDialogProps {
  file: MyFile
  open: boolean
  onClose: () => void
}

const MotionBox = motion(Box)


const ShareDialog = ({ file, open, onClose }: ShareDialogProps) => {

  const [email, 
    // setEmail
  ] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [linkCopied, setLinkCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const dispatch = useDispatch<AppDispatch>();

  const handleSelectUser = (user:  User[][0]) => {
    setSelectedUsers([...selectedUsers, user])
    setSearchTerm("")
  }

  const handleRemoveUser = (userId: number) => {
    setSelectedUsers(selectedUsers.filter((user: { id: number; }) => user.id !== userId))
  }

  const handaleShare = () => {
    setIsSharing(true);
    dispatch(shareFile({ fileId: file.id, email }))
    setIsSharing(false);
    onClose();
  }

  const handleCopyLink = () => {
    // Mock copy link functionality
    navigator.clipboard.writeText(`https://example.com/shared/${file.id}`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  return (
    <CustomModal open={open} onClose={onClose} maxWidth={500}>
      <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Share "{file.fileName}"
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
            People
          </Typography>
          <TextField
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
          />

          {searchTerm &&  (
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
                      <Avatar  alt={user.username} />
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
                  avatar={<Avatar  alt={user.username} />}
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
                    <LinkIcon size={18} color="#666" />
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
                borderColor: linkCopied ? "#10a37f" : "#ddd",
                color: linkCopied ? "#10a37f" : "#666",
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#10a37f",
                  backgroundColor: "rgba(16, 163, 127, 0.04)",
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
              borderColor: "#ddd",
              color: "#666",
              borderRadius: 2,
              "&:hover": {
                borderColor: "#ccc",
                backgroundColor: "#f9f9f9",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handaleShare}
            disabled={selectedUsers.length === 0 && !linkCopied}
            startIcon={isSharing ? <CircularProgress size={16} color="inherit" /> : <Mail size={18} />}
            sx={{
              backgroundColor: "#10a37f",
              color: "#fff",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#0e8c6b",
              },
              "&.Mui-disabled": {
                backgroundColor: "#e0e0e0",
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
