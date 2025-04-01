// import { Tab } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { StoreType } from '../models/storeModel';
import { logout } from '../store/authSlice';
import { useState } from "react"
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    useMediaQuery,
    useTheme,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
} from "@mui/material"
import { Menu, X } from "lucide-react"
import Logo from './logo';

// צבעים וקונפיגורציות
// const primaryColor = "#10a37f";
// const textColor = "#333";


// ניווט ראשי
const Nav = () => {
    const theme = useTheme();
    const location = useLocation();
    const pathname = location.pathname;
    const user = useSelector((state: StoreType) => state.auth.user);
    const dispatch = useDispatch();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [drawerOpen, setDrawerOpen] = useState(false)


    const handleLogout = () => {
        dispatch(logout());
    }

    const navItems = !user
        ? [
            { label: "Sign in", path: "/login" },
        ]
        : [
            { label: "My Files", path: "/files" },
            { label: "Files Shared With Me", path: "/files-shared" },
            { label: "Log out", path: "/", onClick: handleLogout },
        ]

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    const drawer = (
        <Box onClick={toggleDrawer} sx={{ width: 250 }} role="presentation">
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <IconButton>
                    <X size={24} />
                </IconButton>
            </Box>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton component={Link} to="/">
                        <ListItemText primary="Home" />
                    </ListItemButton>
                </ListItem>
                {navItems.map((item) => (
                    <ListItem key={item.label} disablePadding>
                        <ListItemButton component={Link} to={item.path} onClick={item.onClick}>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    return (
        <AppBar
            position="sticky"
            color="default"
            elevation={0}
            sx={{
                bgcolor: "white",
                borderBottom: "1px solid #eaeaea",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 4 } }}>
            <Logo variant="full" size="medium" />

{isMobile ? (
  <>
    <IconButton color="inherit" aria-label="open drawer" edge="end" onClick={toggleDrawer}>
      <Menu />
    </IconButton>
    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
      {drawer}
    </Drawer>
  </>
) : (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Button
      component={Link}
      to="/"
      variant="text"
      sx={{
        color: pathname === "/" ? "#10a37f" : "#666",
        fontWeight: pathname === "/" ? 600 : 400,
        mx: 1,
      }}
    >
      Home
    </Button>

    {navItems.map((item) => (
      <Button
        key={item.label}
        component={Link}
        to={item.path}
        onClick={item.onClick}
        variant={item.label === "Sign in" ? "contained" : "text"}
        sx={{
          bgcolor: item.label === "Sign in" ? "#10a37f" : "transparent",
          color: item.label === "Sign in" ? "white" : "#666",
          "&:hover": {
            bgcolor: item.label === "Sign in" ? "#0e8c6b" : "transparent",
          },
          fontWeight: pathname === item.path ? 600 : 400,
          borderRadius: "4px",
          mx: 0.5,
        }}
      >
        {item.label}
      </Button>
    ))}
  </Box>
)}
</Toolbar>
</AppBar>
    )
}
export default Nav;