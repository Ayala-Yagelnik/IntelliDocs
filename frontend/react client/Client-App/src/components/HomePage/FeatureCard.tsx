"use client"

import { Box, Paper, Typography } from "@mui/material"
import { motion } from "framer-motion"
import { FileText, Cloud, Share2, Shield } from "lucide-react"

const MotionPaper = motion(Paper)

type FeatureCardProps = {
  icon: "document" | "cloud" | "share" | "shield"
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "document":
        return <FileText width={24} height={24} color="#1976d2" />
      case "cloud":
        return <Cloud width={24} height={24} color="#1976d2" />
      case "share":
        return <Share2 width={24} height={24} color="#1976d2" />
      case "shield":
        return <Shield width={24} height={24} color="#1976d2" />
      default:
        return <FileText width={24} height={24} color="#1976d2" />
    }
  }

  return (
    <MotionPaper
      elevation={1}
      sx={{
        p: 3,
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: 6,
          borderColor: "primary.main",
        },
      }}
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 48,
          height: 48,
          borderRadius: "50%",
          bgcolor: "primary.light",
          opacity: 0.2,
        }}
      >
        {getIcon()}
      </Box>
      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>

      {/* Hover effect */}
      <Box
        sx={{
          position: "absolute",
          bottom: -8,
          right: -8,
          height: 80,
          width: 80,
          borderRadius: "50%",
          bgcolor: "primary.light",
          opacity: 0,
          transition: "opacity 0.3s ease",
          ".MuiPaper-root:hover &": {
            opacity: 0.1,
          },
        }}
      />
    </MotionPaper>
  )
}
