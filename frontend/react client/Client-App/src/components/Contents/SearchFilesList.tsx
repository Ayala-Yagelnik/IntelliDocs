import React, { useEffect, useState } from "react";
import { Box, Paper, CircularProgress, InputBase, IconButton, 
    // useTheme, useMediaQuery
 } from "@mui/material";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreType } from "../../models/storeModel";
import { AppDispatch } from "../../store/store";
import { fetchUserContent } from "../../store/StorageSlice";
import BreadcrumbsNav from "./BreadcrumbsNav";
import PageHeader from "./PageHeader";
import ToggleViewSelector from "./ToggleButtonGroup";
import EmptyState from "./EmptyState";
import FileFolderList from "./FileFolderList";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const SearchFilesList: React.FC = () => {
  const user = useSelector((state: StoreType) => state.users.user);
  const loading = useSelector((state: StoreType) => state.files.loading);
  const files = useSelector((state: StoreType) => state.files.files);
  const folders = useSelector((state: StoreType) => state.files.folders);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isGridView, setIsGridView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // מה שמבוצע בפועל

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!user?.id) {
      navigate("/");
    } else {
      dispatch(fetchUserContent({ userId: user.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, user?.id]);

  // חיפוש קבצים ותיקיות לפי שם (או כל שדה שתרצי)
  const filteredFiles = files?.filter(file =>
    file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredFolders = folders?.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          mb: 3,
          border: "1px solid #eaeaea",
        }}
      >
        <BreadcrumbsNav items={[{ id: null, name: "Search" }]} onClick={() => {}} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <PageHeader
            title="Search Files"
            actions={
              <ToggleViewSelector
                isGridView={isGridView}
                onViewChange={view => setIsGridView(view === "grid")}
              />
            }
          />
        </Box>
        {/* שורת חיפוש */}
        <Box
          sx={{
            mt: 3,
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Paper
            component="form"
            onSubmit={e => { e.preventDefault(); handleSearch(); }}
            sx={{
              p: "2px 8px",
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: 400 },
              border: "1px solid #eaeaea",
              borderRadius: 3,
              boxShadow: "none",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search files or folders…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={handleInputKeyDown}
              inputProps={{ "aria-label": "search files or folders" }}
            />
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <Search />
            </IconButton>
          </Paper>
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress sx={{ color: "#10a37f" }} />
        </Box>
      )}

      {!loading && searchQuery && filteredFiles.length === 0 && filteredFolders.length === 0 && (
        <EmptyState
          icon={<Search size={40} color="#10a37f" />}
          title="No results found"
          description="No files or folders match your search."
        />
      )}

      {!loading && (!searchQuery || filteredFiles.length > 0 || filteredFolders.length > 0) && (
        <FileFolderList
          isGridView={isGridView}
          files={filteredFiles}
          folders={filteredFolders}
          onFolderClick={() => {}}
          userId={user.id}
        />
      )}
    </MotionBox>
  );
};

export default SearchFilesList;