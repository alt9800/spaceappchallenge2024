import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

import { Link, useLocation } from "react-router-dom";

const mainListItems = [
  { text: "北海道", path: "" },
  { text: "東北", path: "" },
  { text: "関東", path: "" },
  { text: "中部", path: "" },
  { text: "近畿", path: "" },
  { text: "中国", path: "" },
  { text: "四国", path: "" },
  { text: "九州", path: "" },
];

export default function MenuContent() {
  const location = useLocation();
  const isSelected = (path: string) => location.pathname === path;
  return (
    <Stack
      sx={{
        flexGrow: 1,
        p: 1,
        justifyContent: "space-between",
        width: "200pt",
      }}
    >
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isSelected(item.path)}
            >
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
