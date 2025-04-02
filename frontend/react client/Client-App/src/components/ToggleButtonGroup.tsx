import React from "react";
import { ToggleButtonGroup, ToggleButton, Tooltip, useMediaQuery, useTheme } from "@mui/material"
import { LayoutGrid, LayoutList } from "lucide-react"

interface ToggleViewSelectorProps {
  isGridView: boolean;
  onViewChange: (newView: string | null) => void;
}

const ToggleViewSelector: React.FC<ToggleViewSelectorProps> = ({ isGridView, onViewChange }) => {

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const handleViewChange = (_: React.MouseEvent<HTMLElement>, newView: string | null) => {
    onViewChange(newView)
  }

  return (
    <ToggleButtonGroup
      value={isGridView ? "grid" : "list"}
      exclusive
      onChange={handleViewChange}
      aria-label="view mode"
      size={isMobile ? "small" : "medium"}
      sx={{
        "& .MuiToggleButtonGroup-grouped": {
          border: "1px solid #eaeaea",
          "&.Mui-selected": {
            backgroundColor: "#10a37f",
            color: "white",
            "&:hover": {
              backgroundColor: "#0e8c6b",
            },
          },
          "&:not(:first-of-type)": {
            borderRadius: 1,
            borderLeft: "1px solid #eaeaea",
          },
          "&:first-of-type": {
            borderRadius: 1,
          },
        },
      }}
    >
      <ToggleButton value="grid" aria-label="grid view">
        <Tooltip title="Grid view">
          <LayoutGrid size={isMobile ? 16 : 18} />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="list" aria-label="list view">
        <Tooltip title="List view">
          <LayoutList size={isMobile ? 16 : 18} />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default ToggleViewSelector;