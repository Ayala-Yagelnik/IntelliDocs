import type React from "react"
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"

interface LogoProps {
  variant?: "full" | "icon"
  size?: "small" | "medium" | "large"
  color?: "light" | "dark" | "primary"
  onClick?: () => void
}

const Logo: React.FC<LogoProps> = ({ variant = "full", size = "medium", color = "primary", onClick }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // Determine sizes based on the size prop
  const getIconSize = () => {
    switch (size) {
      case "small":
        return { width: 24, height: 24 }
      case "large":
        return { width: 48, height: 48 }
      case "medium":
      default:
        return { width: 32, height: 32 }
    }
  }

  const getFontSize = () => {
    switch (size) {
      case "small":
        return { fontSize: "1.25rem", letterSpacing: "-0.02em" }
      case "large":
        return { fontSize: "2rem", letterSpacing: "-0.02em" }
      case "medium":
      default:
        return { fontSize: "1.5rem", letterSpacing: "-0.02em" }
    }
  }

  // Determine color based on the color prop
  const getColor = () => {
    switch (color) {
      case "light":
        return "#ffffff"
      case "dark":
        return "#333333"
      case "primary":
      default:
        return "#10a37f"
    }
  }

  const logoColor = getColor()
  const { width, height } = getIconSize()
  const fontStyles = getFontSize()

  // Animation variants for the logo
  const iconVariants = {
    hover: {
      rotate: [0, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  return (
    <Box
      component={Link}
      to="/"
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        textDecoration: "none",
        color: logoColor,
      }}
    >
      <motion.div whileHover="hover" variants={iconVariants}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width={width}
          height={height}
        >
          {/* Document stack base */}
          <motion.rect
            x="4"
            y="16"
            width="24"
            height="12"
            rx="2"
            fill={logoColor}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />

          {/* Middle document */}
          <motion.rect
            x="6"
            y="10"
            width="20"
            height="12"
            rx="2"
            fill={logoColor}
            fillOpacity="0.8"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          />

          {/* Top document */}
          <motion.rect
            x="8"
            y="4"
            width="16"
            height="12"
            rx="2"
            fill={logoColor}
            fillOpacity="0.6"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Document lines */}
          <motion.path
            d="M12 20H20M12 24H16"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </svg>
      </motion.div>

      {variant === "full" && !isMobile && (
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontWeight: 700,
            ...fontStyles,
            display: "inline-block",
          }}
        >
          IntelliDocs
        </Typography>
      )}
    </Box>
  )
}

export default Logo

