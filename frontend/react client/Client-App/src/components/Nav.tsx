import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { StoreType } from '../models/storeModel';
import { logout } from '../store/authSlice';
import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  useTheme as useMuiTheme,
  IconButton,
  Slide,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material"
import { User, LogOut } from "lucide-react"
import Logo from './logo';
import { AppDispatch } from '../store/store';
import { motion } from "framer-motion"
import ThemeToggle from './ThemeToggle';


// צבעים וקונפיגורציות
// const primaryColor = "#10a37f";
// const textColor = "#333";


// ניווט ראשי
const Nav = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: StoreType) => state.auth.user)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate();
  const theme = useMuiTheme()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate("/");
  }

  const handleLogin = () => {
    navigate("/login")
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }



  return (
    <Slide appear={false} direction="down" in={true}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: scrolled
            ? theme.palette.mode === "dark"
              ? "rgba(30, 30, 30, 0.1)"
              : "rgba(255, 255, 255, 0.1)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? `1px solid ${theme.palette.divider}` : "none",
          transition: "all 0.3s ease-in-out",
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between",borderRadius:"50%", px: { xs: 2, sm: 4 } }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Logo variant="full" size="medium" />
          </motion.div>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 ,borderRadius:"50%"}}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ThemeToggle />
            </motion.div>
            {!user ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Button
                  onClick={handleLogin}
                  variant="contained"
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                    },
                    fontWeight: 600,
                    borderRadius: 2,
                    px: 3,
                    transition: "all 0.3s ease",
                  }}
                >
                  Login
                </Button>
              </motion.div>
            ) : (
              <Box>
                <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      fontSize: "1rem",
                      fontWeight: 500,
                      bgcolor: theme.palette.primary.main,
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
                      bgcolor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
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
    </Slide>
      )
}
      export default Nav;