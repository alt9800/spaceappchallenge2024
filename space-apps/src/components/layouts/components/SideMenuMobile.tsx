import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import MenuContent from "./MenuContent";

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
}

export default function SideMenuMobile({
  open,
  toggleDrawer,
}: SideMenuMobileProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: "none",
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: "70dvw",
          height: "100%",
          width: "200pt",
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}></Stack>

        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent />
        </Stack>

        <Stack sx={{ p: 2 }}></Stack>
      </Stack>
    </Drawer>
  );
}
