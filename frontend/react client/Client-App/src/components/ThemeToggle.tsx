import type React from "react"
import { IconButton, Tooltip,  } from "@mui/material"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useTheme as useMuiTheme } from "@mui/material"
import { useTheme } from "../context/ThemeContext"

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme()
  const theme = useMuiTheme()

  return (
    <Tooltip title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          width: 35,
          height: 35,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "50%",
          border: `1px solid ${theme.palette.divider}`,
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
            transform: "scale(1.05)",
          },
          transition: "all 0.2s ease-in-out",
        }}
      >
        <motion.div
          initial={false}
          
          animate={{
            scale: [1, 0.8, 1],
            rotate: isDarkMode ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          {!isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
        </motion.div>
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle
