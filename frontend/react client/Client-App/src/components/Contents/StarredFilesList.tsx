import React, { useEffect, useState } from "react";
import { Box, Paper, CircularProgress, useTheme, useMediaQuery } from "@mui/material";
import { Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { StoreType } from "../../models/storeModel";
import { AppDispatch } from "../../store/store";
import { fetchUserContent } from "../../store/StorageSlice";
import BreadcrumbsNav from "./BreadcrumbsNav";
import PageHeader from "./PageHeader";
import ActionButtons from "./ActionButtons";
import ToggleViewSelector from "./ToggleButtonGroup";
import EmptyState from "./EmptyState";
import FileFolderList from "./FileFolderList";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const StarredFilesList: React.FC = () => {
  const user = useSelector((state: StoreType) => state.users.user);
  const loading = useSelector((state: StoreType) => state.files.loading);
  const files = useSelector((state: StoreType) => state.files.files);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isGridView, setIsGridView] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (!user?.id) {
      navigate("/");
    } else {
      dispatch(fetchUserContent({ userId: user.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate, user?.id]);

  // סינון קבצים מסומנים בכוכב
  const starredFiles = files?.filter(file => file.isStarred) || [];

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
        <BreadcrumbsNav items={[{ id: null, name: "Starred" }]} onClick={() => {}} />
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
            title="Starred Files"
            actions={
              <ActionButtons
                onAddFolder={() => {}}
                onUpload={() => {}}
                onRefresh={() => dispatch(fetchUserContent({ userId: user.id }))}
                viewSelector={
                  <ToggleViewSelector isGridView={isGridView} onViewChange={view =>
                    setIsGridView(view === "grid")
                  } />
                }
                isMobile={isMobile}
              />
            }
          />
        </Box>
      </Paper>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress sx={{ color: "#10a37f" }} />
        </Box>
      )}

      {!loading && starredFiles.length === 0 && (
        <EmptyState
          icon={<Star size={40} color="#10a37f" />}
          title="No starred files"
          description="You haven't starred any files yet."
        />
      )}

      {!loading && starredFiles.length > 0 && (
        <FileFolderList
          isGridView={isGridView}
          files={starredFiles}
          folders={[]} // אין תיקיות בכוכבים
          onFolderClick={() => {}}
          userId={user.id}
        />
      )}
    </MotionBox>
  );
};

export default StarredFilesList;