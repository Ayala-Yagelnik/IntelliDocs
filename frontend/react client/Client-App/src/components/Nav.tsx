// import { Tab } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { StoreType } from '../models/storeModel';
import { logout } from '../store/authSlice';
import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Button,
  Box,

  IconButton,

  Avatar,
  Menu,
  MenuItem,
} from "@mui/material"
import { User, LogOut } from "lucide-react"
import Logo from './logo';

// צבעים וקונפיגורציות
// const primaryColor = "#10a37f";
// const textColor = "#333";


// ניווט ראשי
const Nav = () => {
  // const theme = useTheme();
  // const location = useLocation();
  // const pathname = location.pathname;
  const user = useSelector((state: StoreType) => state.auth.user) 
   const dispatch = useDispatch();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate("/");
  }

  const handleLogin=()=>{
    navigate("/login")
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }



  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: "white",
        borderBottom: "1px solid #eaeaea",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
        <Logo variant="full" size="medium" />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!user ? (
            <Button
              onClick={handleLogin}
              variant="contained"
              sx={{
                bgcolor: "#10a37f",
                color: "white",
                "&:hover": {
                  bgcolor: "#0e8c6b",
                },
                fontWeight: 500,
                borderRadius: "4px",
              }}
            >
              Login
            </Button>
          ) : (
            <Box>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  ml: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#10a37f",
                    fontSize: "1rem",
                    fontWeight: 500,
                  }}
                >
                  {user && user.username ? user.username.charAt(0).toUpperCase() : ""}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                    mt: 1.5,
                    borderRadius: 2,
                    minWidth: 180,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      mx: 0.5,
                      my: 0.25,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5 }}>
                  <User size={18} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: '#e74c3c' }}>
                  <LogOut size={18} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
export default Nav;