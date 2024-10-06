import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import {
  Event as EventIcon,
  Image as ImageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import EditPage from "../Edit/EditPage";

interface TimelineEvent {
  id: string;
  create_at: Date;
  explanatory: string;
  image_path: string;
  prefectures: string;
  update_at: Date;
  writer_name: string;
}

interface PrefectureTimelineProps {
  open: boolean;
  onClose: () => void;
  prefectures: string;
  onEditClick: () => void;
}

const PrefectureTimeline: React.FC<PrefectureTimelineProps> = ({
  open,
  onClose,
  prefectures,
  onEditClick,
}) => {
  const [timelineData, setTimelineData] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setLoading(true);
        const timelineCollection = collection(db, "timeline");
        const q = query(
          timelineCollection,
          where("prefectures", "==", prefectures)
          //orderBy("create_at", "desc")
        );

        const querySnapshot = await getDocs(q);
        const events: TimelineEvent[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          events.push({
            id: doc.id,
            create_at: data.create_at.toDate(),
            explanatory: data.explanatory,
            image_path: data.image_path,
            prefectures: data.prefectures,
            update_at: data.update_at.toDate(),
            writer_name: data.writer_name,
          });
        });

        setTimelineData(events);
        setLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error fetching timeline data:", err);
        if (
          err instanceof Error &&
          err.message.includes("The query requires an index")
        ) {
          setError(
            "データベースのインデックスが必要です。Firebase Consoleでインデックスを作成してください。"
          );
        } else {
          setError("タイムラインデータの取得中にエラーが発生しました。");
        }
        setLoading(false);
      }
    };

    if (prefectures) {
      fetchTimelineData();
    }
  }, [prefectures]);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        <Typography variant="h6">{prefectures}</Typography>

        <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
          タイムライン
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Timeline>
            {timelineData.map((event, index) => (
              <TimelineItem
                key={event.id}
                sx={{
                  "&:before": { display: "none" },
                  "&.MuiTimelineItem-positionRight": {
                    "&::before": {
                      display: "none",
                    },
                  },
                }}
              >
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    {event.image_path ? <ImageIcon /> : <EventIcon />}
                  </TimelineDot>
                  {index < timelineData.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="h6" component="span">
                    {event.explanatory}
                  </Typography>
                  <Typography>
                    {event.create_at.toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    作成者: {event.writer_name}
                  </Typography>
                  {event.image_path && (
                    <Box
                      component="img"
                      src={event.image_path}
                      alt="Event image"
                      sx={{ maxWidth: "100%", height: "auto", mt: 1 }}
                    />
                  )}
                  <Button
                    startIcon={<EditIcon style={{ fontSize: "12px" }} />}
                    onClick={onEditClick}
                    sx={{ fontSize: "12px", height: "12px" }}
                  >
                    削除
                  </Button>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Box>
      <Button
        variant="outlined"
        startIcon={<EditIcon />}
        onClick={() => setEditDialogOpen(true)}
        sx={{ mt: 2, mx: 3 }}
      >
        登録
      </Button>
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <EditPage prefecture={prefectures} />
        </DialogContent>
      </Dialog>
    </Drawer>
  );
};

export default PrefectureTimeline;
