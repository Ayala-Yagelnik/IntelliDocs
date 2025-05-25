import React from "react";
import { Breadcrumbs, Link as MuiLink } from "@mui/material";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  id: number | null;
  name: string;
}

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[];
  onClick: (index: number) => void;
}

const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({ items, onClick }) => (
  <Breadcrumbs separator={<ChevronRight size={16} />} aria-label="breadcrumb" sx={{ mb: 2 }}>
    {items.map((item, idx) => (
      <MuiLink
        key={item.id ?? "home"}
        underline="hover"
        color={idx === items.length - 1 ? "text.primary" : "inherit"}
        onClick={() => onClick(idx)}
        sx={{
          cursor: "pointer",
          fontWeight: idx === items.length - 1 ? 600 : 400,
          color: idx === items.length - 1 ? "#333" : "#666",
        }}
      >
        {item.name}
      </MuiLink>
    ))}
  </Breadcrumbs>
);

export default BreadcrumbsNav;