"use client"

import { Paper, Box, Typography, Rating, Avatar } from "@mui/material"
import { motion } from "framer-motion"

const MotionPaper = motion(Paper)

type TestimonialProps = {
  content: string
  author: string
  company: string
  rating: number
  delay?: number
}

export function Testimonial({ content, author, company, rating, delay = 0 }: TestimonialProps) {
  return (
    <MotionPaper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 2,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, boxShadow: "0px 4px 20px rgba(0,0,0,0.12)" }}
    >
      <Rating value={rating} readOnly precision={0.5} sx={{ mb: 2 }} />
      <Typography variant="body1" sx={{ mb: 3, fontStyle: "italic", color: "text.secondary" }}>
        "{content}"
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 40,
            height: 40,
            mr: 2,
          }}
        >
          {author.charAt(0)}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {author}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {company}
          </Typography>
        </Box>
      </Box>
    </MotionPaper>
  )
}
