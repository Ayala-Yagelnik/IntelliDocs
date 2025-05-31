import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  CircularProgress,
  InputBase,
  IconButton,
} from "@mui/material";
import { Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreType } from "../../models/storeModel";
import { AppDispatch } from "../../store/store";
import BreadcrumbsNav from "./BreadcrumbsNav";
import PageHeader from "./PageHeader";
import ToggleViewSelector from "./ToggleButtonGroup";
import EmptyState from "./EmptyState";
import FileFolderList from "./FileFolderList";
import { motion } from "framer-motion";
import { fetchUserContent, searchFiles } from "../../store/StorageSlice";

const MotionBox = motion(Box);

const SearchFilesList: React.FC = () => {
  const user = useSelector((state: StoreType) => state.users.user);
  const loading = useSelector((state: StoreType) => state.files.loading);
  const files = useSelector((state: StoreType) => state.files.files);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isGridView, setIsGridView] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  // ניווט אם אין משתמש
  useEffect(() => {
    if (!user?.id) navigate("/");
    else dispatch(fetchUserContent({ userId: user.id }));
  }, [dispatch, navigate, user?.id]);

  // debounce: מחכה שהקלדה תסתיים לפני שליחת חיפוש
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // שליחת חיפוש בפועל
  useEffect(() => {
    if (debouncedTerm && user?.id) {
      dispatch(searchFiles({ query: debouncedTerm, userId: user.id }));
    }
  }, [debouncedTerm, dispatch, user?.id]);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setDebouncedTerm(searchTerm.trim()); // מידית
    }
  };

  return (
    <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, mb: 3, border: "1px solid #eaeaea" }}>
        <BreadcrumbsNav items={[{ id: null, name: "Search" }]} onClick={() => { }} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 2, sm: 0 } }}>
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
        <Box sx={{ mt: 3, mb: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
          <Paper
            component="form"
            onSubmit={e => { e.preventDefault(); setDebouncedTerm(searchTerm.trim()); }}
            sx={{ p: "2px 8px", display: "flex", alignItems: "center", width: { xs: "100%", sm: 400 }, border: "1px solid #eaeaea", borderRadius: 3, boxShadow: "none" }}
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

      {!loading && debouncedTerm && files.length === 0 && (
        <EmptyState
          icon={<Search size={40} color="#10a37f" />}
          title="No results found"
          description="No files match your search."
        />
      )}

      {!loading && (!debouncedTerm || files.length > 0) && (
        <FileFolderList
          isGridView={isGridView}
          files={files}
          onFolderClick={() => { }}
          userId={user.id}
          folders={[]}
        />
      )}
    </MotionBox>
  );
};

export default SearchFilesList;
