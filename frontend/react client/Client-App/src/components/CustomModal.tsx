import type React from "react"
import { Modal, IconButton, Paper, useTheme } from "@mui/material"
import { X } from "lucide-react"

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string | number;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, children, maxWidth = 500 }) => {
    const theme = useTheme();
  
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Paper
        elevation={0}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          maxWidth: maxWidth,
          bgcolor: theme.palette.background.default,
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          p: { xs: 3, sm: 4 },
          outline: "none",
          border: "1px solid #eaeaea",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#666",
          }}
        >
          <X size={20} />
        </IconButton>
        {children}
      </Paper>
    </Modal>
  );
};

export default CustomModal;