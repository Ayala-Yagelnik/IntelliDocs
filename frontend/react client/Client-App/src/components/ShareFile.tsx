import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  Typography,
  Avatar,
  Box,
  IconButton,
  Divider
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import { shareFile } from "../store/fileSlice";
import { AppDispatch } from "../store/store";
import { useDispatch } from "react-redux";
import { MyFile } from "../models/myfile";

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  file:MyFile;
}

const ShareDialog = ({file, open, onClose }: ShareDialogProps) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("Can view");
  const dispatch = useDispatch<AppDispatch>();

    const handaleShare=()=> {
       dispatch(shareFile({ fileId: file.id, email }))
    }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Share "Contract.pdf"</DialogTitle>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <DialogContent>
        <Box display="flex" mb={2}>
          <Button variant="contained" startIcon={<PersonIcon />} sx={{ flex: 1, mr: 1, bgcolor: "#f1f3f4", color: "black" }}>
            People
          </Button>
          <Button variant="contained" startIcon={<LinkIcon />} sx={{ flex: 1, bgcolor: "#f1f3f4", color: "black" }}>
            Get Link
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>Add people</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            fullWidth
            placeholder="Email addresses"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={permission} onChange={(e) => setPermission(e.target.value)}>
              <MenuItem value="Can view">Can view</MenuItem>
              <MenuItem value="Can edit">Can edit</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button fullWidth variant="contained" startIcon={<EmailIcon />} sx={{ mt: 2, bgcolor: "#8ab4f8" }}
        onClick={() => {
          // Handle send invite logic here
          console.log("Invite sent to:", email, "with permission:", permission);
          handaleShare();
          onClose();
        }}
        >
          Send Invite
        </Button>

        <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
          People with access
        </Typography>
        <Box display="flex" alignItems="center" p={1} sx={{ bgcolor: "#f1f3f4", borderRadius: 2 }}>
          <Avatar sx={{ bgcolor: "#34a853" }}>JD</Avatar>
          <Box ml={2}>
            <Typography variant="body1">John Doe (You)</Typography>
            <Typography variant="body2" color="textSecondary">
              john.doe@example.com
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary" sx={{ ml: "auto" }}>
            Owner
          </Typography>
        </Box>

        <Button fullWidth variant="contained" sx={{ mt: 2, bgcolor: "#dadce0", color: "black" }} onClick={onClose}>
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
