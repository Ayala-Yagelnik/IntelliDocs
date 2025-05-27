import { Outlet } from "react-router"
import Nav from "./Nav"
import { Box, useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import Sidebar from "./Sidebar"


const AppLayout = () => {

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // Close sidebar by default on mobile
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: theme.palette.background.default,
        }}
      >
        <Nav />
        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: { xs: 2, md: 3 },
              transition: "padding 0.2s ease",
              width: "100%",
              overflowX: "hidden",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default AppLayout