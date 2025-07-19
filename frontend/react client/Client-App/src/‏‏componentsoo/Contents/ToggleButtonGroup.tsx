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
          border: `1px solid ${theme.palette.divider}`,
          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          },
          "&:not(:first-of-type)": {
            borderRadius: 1,
            borderLeft: `1px solid ${theme.palette.divider}`,
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