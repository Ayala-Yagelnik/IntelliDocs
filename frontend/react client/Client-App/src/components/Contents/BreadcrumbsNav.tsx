import React from "react";
import { Breadcrumbs, Link as MuiLink, useTheme } from "@mui/material";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  id: number | null;
  name: string;
}

interface BreadcrumbsNavProps {
  items: BreadcrumbItem[];
  onClick: (index: number) => void;
}


const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({ items, onClick }) => {
  const theme = useTheme();

  return (
    <Breadcrumbs separator={<ChevronRight size={16} />} aria-label="breadcrumb" sx={{ mb: 2 }}>
      {items.map((item, idx) => (
        <MuiLink
          key={item.id ?? "home"}
          underline="hover"
          color={idx === items.length - 1 ? theme.palette.text.secondary : theme.palette.primary.dark}
          onClick={() => onClick(idx)}
          sx={{
            cursor: "pointer",
            fontWeight: idx === items.length - 1 ? 600 : 400,
            color: idx === items.length - 1 ? "#333" :theme.palette.text.secondary ,
          }}
        >
          {item.name}
        </MuiLink>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsNav;