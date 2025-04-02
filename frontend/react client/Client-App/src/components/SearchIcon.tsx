"use client"

import type React from "react"
import { Box, type BoxProps } from "@mui/material"
import { motion } from "framer-motion"

interface SearchIconProps extends BoxProps {
  size?: "small" | "medium" | "large"
  color?: "primary" | "light" | "dark"
  animated?: boolean
}

const SearchIcon: React.FC<SearchIconProps> = ({
  size = "medium",
  color = "primary",
  animated = true,
  sx,
  ...props
}) => {
  // Determine size dimensions
  const getSize = () => {
    switch (size) {
      case "small":
        return { width: 24, height: 24 }
      case "large":
        return { width: 64, height: 64 }
      case "medium":
      default:
        return { width: 40, height: 40 }
    }
  }

  // Determine colors based on the color prop
  const getColors = () => {
    switch (color) {
      case "light":
        return {
          primary: "#ffffff",
          secondary: "rgba(255, 255, 255, 0.8)",
          tertiary: "rgba(255, 255, 255, 0.6)",
          highlight: "rgba(255, 255, 255, 0.9)",
          shadow: "rgba(0, 0, 0, 0.3)",
        }
      case "dark":
        return {
          primary: "#333333",
          secondary: "#555555",
          tertiary: "#777777",
          highlight: "#444444",
          shadow: "rgba(0, 0, 0, 0.3)",
        }
      case "primary":
      default:
        return {
          primary: "#10a37f",
          secondary: "#0d8c6d",
          tertiary: "#0a755b",
          highlight: "#13c296",
          shadow: "rgba(0, 0, 0, 0.2)",
        }
    }
  }

  const { width, height } = getSize()
  const colors = getColors()

  // Animation variants
  const pulseVariants = {
    initial: { opacity: 0.6, scale: 0.95 },
    animate: {
      opacity: [0.6, 1, 0.6],
      scale: [0.95, 1, 0.95],
      transition: {
        duration: 2.5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const searchVariants = {
    initial: { x: 0 },
    animate: {
      x: [0, 2, 0, -2, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        times: [0, 0.25, 0.5, 0.75, 1],
      },
    },
  }

  const highlightVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <Box
      sx={{
        width,
        height,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
      {...props}
    >
      <motion.svg
        width={width}
        height={height}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Document base */}
        <motion.g filter="url(#filter0_d)">
          <path
            d="M12 14C12 11.7909 13.7909 10 16 10H40L52 22V50C52 52.2091 50.2091 54 48 54H16C13.7909 54 12 52.2091 12 50V14Z"
            fill="white"
          />
          <path d="M40 10L52 22H44C41.7909 22 40 20.2091 40 18V10Z" fill={colors.primary} fillOpacity="0.1" />
          <path
            d="M40 10L52 22H44C41.7909 22 40 20.2091 40 18V10Z"
            stroke={colors.primary}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 14C12 11.7909 13.7909 10 16 10H40L52 22V50C52 52.2091 50.2091 54 48 54H16C13.7909 54 12 52.2091 12 50V14Z"
            stroke={colors.primary}
            strokeWidth="1.5"
          />
        </motion.g>

        {/* Document lines with highlight effect */}
        <motion.path d="M20 32H44" stroke={colors.tertiary} strokeWidth="1.5" strokeLinecap="round" />
        <motion.path d="M20 38H36" stroke={colors.tertiary} strokeWidth="1.5" strokeLinecap="round" />
        <motion.path d="M20 44H28" stroke={colors.tertiary} strokeWidth="1.5" strokeLinecap="round" />

        {/* Highlighted search result */}
        <motion.rect
          x="30"
          y="43"
          width="14"
          height="2"
          rx="1"
          fill={colors.highlight}
          variants={animated ? highlightVariants : undefined}
          initial="initial"
          animate="animate"
        />

        {/* Magnifying glass with search intelligence */}
        <motion.g variants={animated ? searchVariants : undefined} initial="initial" animate="animate">
          <motion.g filter="url(#filter1_d)">
            <circle cx="38" cy="26" r="10" fill="white" stroke={colors.primary} strokeWidth="2" />
            <path d="M46 34L50 38" stroke={colors.primary} strokeWidth="3" strokeLinecap="round" />
          </motion.g>

          {/* Intelligence indicators */}
          <motion.g variants={animated ? pulseVariants : undefined} initial="initial" animate="animate">
            <circle cx="35" cy="23" r="1.5" fill={colors.primary} />
            <circle cx="38" cy="26" r="1.5" fill={colors.primary} />
            <circle cx="41" cy="23" r="1.5" fill={colors.primary} />
            <path d="M35 23L38 26L41 23" stroke={colors.primary} strokeWidth="0.75" strokeLinecap="round" />
          </motion.g>
        </motion.g>

        {/* Filters for shadow effects */}
        <defs>
          <filter
            id="filter0_d"
            x="9"
            y="8"
            width="46"
            height="50"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
          <filter
            id="filter1_d"
            x="25"
            y="14"
            width="28"
            height="28"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
          </filter>
        </defs>
      </motion.svg>
    </Box>
  )
}

export default SearchIcon

