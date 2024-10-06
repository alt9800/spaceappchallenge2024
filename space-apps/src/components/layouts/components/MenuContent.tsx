import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { Link, useLocation } from "react-router-dom";
import HomePage from "../../../features/home/HomePage";
import DashboardPage from "../../../features/dashboard/DashboardPage";
import ClientsPage from "../../../features/clients/ClientsPage";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, path: HomePage.path },
  {
    text: "Analytics",
    icon: <AnalyticsRoundedIcon />,
    path: DashboardPage.path,
  },
  { text: "Clients", icon: <PeopleRoundedIcon />, path: ClientsPage.path },
  { text: "Reports", icon: <AssignmentRoundedIcon />, path: HomePage.path },
  { text: "Schedule", icon: <AssignmentRoundedIcon />, path: HomePage.path },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon />, path: "/settings" },
  { text: "About", icon: <InfoRoundedIcon />, path: "/settings" },
  { text: "Feedback", icon: <HelpRoundedIcon />, path: "/settings" },
];

export default function MenuContent() {
  const location = useLocation();
  const isSelected = (path: string) => location.pathname === path;
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isSelected(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={isSelected(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
