"use client"

import { useRef } from "react"
import { Box, Paper, Typography } from "@mui/material"
import { motion } from "framer-motion"
import { FileText, FolderOpen, Share2, Lock } from "lucide-react"

const MotionPaper = motion(Paper)
const MotionBox = motion(Box)

export function HeroAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <Box ref={containerRef} sx={{ position: "relative", height: 400, width: "100%", maxWidth: 500 }}>
      {/* Main document */}
      <MotionPaper
        elevation={4}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.05, rotate: 1 }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 256,
          height: 320,
          p: 2,
          zIndex: 20,
          bgcolor: "background.paper",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
            <FileText width={20} height={20} color="primary" />
          </Box>
          <Typography variant="body2" fontWeight="medium">
            Important Document
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ height: 12, bgcolor: "action.hover", borderRadius: 4, width: "100%" }} />
          <Box sx={{ height: 12, bgcolor: "action.hover", borderRadius: 4, width: "83%" }} />
          <Box sx={{ height: 12, bgcolor: "action.hover", borderRadius: 4, width: "67%" }} />
          <Box sx={{ height: 12, bgcolor: "action.hover", borderRadius: 4, width: "100%" }} />
          <Box sx={{ height: 12, bgcolor: "action.hover", borderRadius: 4, width: "50%" }} />
        </Box>

        <Box sx={{ position: "absolute", bottom: 16, right: 16, display: "flex", gap: 1 }}>
          <MotionBox
            whileHover={{ scale: 1.2 }}
            sx={{
              height: 32,
              width: 32,
              borderRadius: "50%",
              bgcolor: "primary.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.8,
            }}
          >
            <Share2 width={16} height={16} color="var(--mui-palette-primary-main)" />
          </MotionBox>
          <MotionBox
            whileHover={{ scale: 1.2 }}
            sx={{
              height: 32,
              width: 32,
              borderRadius: "50%",
              bgcolor: "primary.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.8,
            }}
          >
            <Lock width={16} height={16} color="var(--mui-palette-primary-main)" />
          </MotionBox>
        </Box>
      </MotionPaper>

      {/* Background documents */}
      <MotionPaper
        elevation={2}
        initial={{ opacity: 0, rotate: -5 }}
        animate={{ opacity: 0.7, rotate: -5 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 224,
          height: 288,
          p: 2,
          zIndex: 10,
          bgcolor: "primary.light",
          opacity: 0.2,
          transform: "translate(-60%, -60%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
            <FolderOpen width={20} height={20} color="var(--mui-palette-primary-main)" />
          </Box>
          <Typography variant="body2" fontWeight="medium">
            Project Files
          </Typography>
        </Box>
      </MotionPaper>

      <MotionPaper
        elevation={2}
        initial={{ opacity: 0, rotate: 5 }}
        animate={{ opacity: 0.7, rotate: 5 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 224,
          height: 288,
          p: 2,
          zIndex: 0,
          bgcolor: "primary.light",
          opacity: 0.2,
          transform: "translate(-40%, -40%)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Box sx={{ mr: 1, display: "flex", alignItems: "center" }}>
            <FileText width={20} height={20} color="var(--mui-palette-primary-main)" />
          </Box>
          <Typography variant="body2" fontWeight="medium">
            Research Notes
          </Typography>
        </Box>
      </MotionPaper>

      {/* Floating elements */}
      {[...Array(5)].map((_, i) => (
        <MotionBox
          key={i}
          sx={{
            position: "absolute",
            height: 40,
            width: 40,
            borderRadius: 2,
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            opacity: 0.7,
          }}
          initial={{
            x: Math.random() * 300 - 150,
            y: Math.random() * 300 - 150,
            opacity: 0,
          }}
          animate={{
            x: [Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150],
            y: [Math.random() * 300 - 150, Math.random() * 300 - 150, Math.random() * 300 - 150],
            opacity: [0, 0.5, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 10 + Math.random() * 20,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 2,
          }}
        />
      ))}

      {/* AI processing visualization */}
      <MotionBox
        sx={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          height: 48,
          borderRadius: 24,
          background: (theme) =>
            `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          opacity: 0.8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 12,
          fontWeight: 500,
          transform: "translateX(-50%)",
        }}
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: [48, 120, 180, 120, 48],
          opacity: [0.2, 0.8, 0.8, 0.8, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        AI Processing
      </MotionBox>
    </Box>
  )
}
