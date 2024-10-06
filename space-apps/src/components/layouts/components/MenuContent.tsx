import { Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";

import { Link, useLocation } from "react-router-dom";

const mainListItems = [
  { text: "北海道", path: "map:北海道" },
  { text: "東北", path: "map:東北" },
  { text: "関東", path: "map:関東" },
  { text: "中部", path: "map:中部" },
  { text: "近畿", path: "map:近畿" },
  { text: "中国", path: "map:中国" },
  { text: "四国", path: "map:四国" },
  { text: "九州", path: "map:九州" },
  { text: "沖縄", path: "map:沖縄" },
];

export default function MenuContent() {
  const location = useLocation();
  const isSelected = (path: string) => location.pathname === path;
  return (
    <>
     
      <Stack
        sx={{
          flexGrow: 1,
          p: 1,
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
    </>
  );
}
