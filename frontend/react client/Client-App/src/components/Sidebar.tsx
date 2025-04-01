import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Divider,
  Tooltip,
  Badge,
} from "@mui/material";
import { FolderOpen, Share2, Trash2, Star, Settings, ChevronLeft, ChevronRight, MenuIcon } from 'lucide-react';
import { Link, useLocation } from "react-router-dom"

interface SidebarProps {
  open?: boolean
  onToggle?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ open = true, onToggle }) => {
  const location = useLocation();
  const pathname = location.pathname;
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)


  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const menuItems = [
    {
      text: "My Files",
      icon: <FolderOpen size={20} />,
      path: "/files",
    },
    {
      text: "Shared with Me",
      icon: <Share2 size={20} />,
      path: "/files-shared",
      badge: 4, // Example badge count
    },
    {
      text: "Starred",
      icon: <Star size={20} />,
      path: "/starred",
    },
    {
      text: "Trash",
      icon: <Trash2 size={20} />,
      path: "/trash",
    },
  ]

  const bottomMenuItems = [
    {
      text: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ]

  const sidebarContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: open ? 240 : 72,
        transition: "width 0.2s ease",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
        }}
      >
        {!isMobile && (
          <IconButton
            onClick={onToggle}
            sx={{
              color: "#666",
              "&:hover": { color: "#10a37f", backgroundColor: "rgba(16, 163, 127, 0.08)" },
            }}
          >
            {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={pathname === item.path}
              sx={{
                borderRadius: 2,
                py: 1,
                minHeight: 44,
                color: pathname === item.path ? "#10a37f" : "#666",
                "&.Mui-selected": {
                  backgroundColor: "rgba(16, 163, 127, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(16, 163, 127, 0.12)",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Tooltip title={open ? "" : item.text} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: pathname === item.path ? "#10a37f" : "#666",
                  }}
                >
                  {item.badge ? (
                    <Badge
                      badgeContent={item.badge}
                      color="primary"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#10a37f",
                          color: "white",
                        },
                      }}
                    >
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
              </Tooltip>
              {open && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: pathname === item.path ? 600 : 400,
                  }}
                />
              )}
              {open && item.badge && (
                <Box
                  sx={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: 10,
                    backgroundColor: "#10a37f",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {item.badge}
                </Box>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <List sx={{ px: 1, mb: 2 }}>
        {bottomMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={pathname === item.path}
              sx={{
                borderRadius: 2,
                py: 1,
                minHeight: 44,
                color: pathname === item.path ? "#10a37f" : "#666",
                "&.Mui-selected": {
                  backgroundColor: "rgba(16, 163, 127, 0.08)",
                  "&:hover": {
                    backgroundColor: "rgba(16, 163, 127, 0.12)",
                  },
                },
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <Tooltip title={open ? "" : item.text} placement="right">
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                    color: pathname === item.path ? "#10a37f" : "#666",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
              {open && (
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: pathname === item.path ? 600 : 400,
                  }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )



  return (
    <>
      {isMobile ? (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleMobileToggle}
            sx={{
              position: "fixed",
              left: 16,
              top: 74, // Positioned below the app bar
              zIndex: 1100,
              color: "#666",
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "white",
                color: "#10a37f",
              },
              display: mobileOpen ? "none" : "flex", // Hide when drawer is open
            }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleMobileToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              "& .MuiDrawer-paper": {
                width: 72,
                boxSizing: "border-box",
                border: "none",
                boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
                height: "100%",
                paddingTop: "64px", // Space for the app bar
              },
              zIndex: 1000, // Below the app bar
            }}
          >
            {sidebarContent}
          </Drawer>
        </>
      ) : (
        <Box
          component="nav"
          sx={{
            width: open ? 240 : 72,
            flexShrink: 0,
            transition: "width 0.2s ease",
            borderRight: "1px solid #eaeaea",
            height: "calc(100vh - 64px)", // Subtract app bar height
            position: "sticky",
            top: 64, // Position below app bar
            backgroundColor: "white",
            zIndex: 1000,
          }}
        >
          {sidebarContent}
        </Box>
      )}
    </>
  )
}

export default Sidebar

