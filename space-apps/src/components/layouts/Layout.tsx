import {
  Drawer,
  Box,
  Divider,
} from "@mui/material";
import MenuContent from "./components/MenuContent";
import AppNavbar from "./components/AppNavbar";
import { Outlet } from "react-router-dom";

const Layout = () => {

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          [`& .`]: {
            backgroundColor: "background.paper",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            mt: "calc(var(--template-frame-height, 0px) + 4px)",
            p: 1.5,
          }}
        ></Box>
        <Divider />
        <MenuContent />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, overflow: "auto" }}>
        <AppNavbar />
        {/* メインコンテンツを表示 */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
