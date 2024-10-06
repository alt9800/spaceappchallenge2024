import React from "react";
import { styled } from "@mui/material/styles";
import Divider, { dividerClasses } from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuButton from "../../../features/dashboard/components/MenuButton";
import { authService } from "../../../features/auth/services/authService";
import { useNavigate } from "react-router-dom";
import HomePage from "../../../features/home/HomePage";
import { clearUser } from "../../../store/slices/authSlice";
import { Severity, useSnackbar } from "../../CustomSnackbar";
import { useDispatch } from "react-redux";

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
});

export default function OptionsMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(clearUser());
      navigate(HomePage.path);
      showSnackbar("ログアウトしました", Severity.SUCCESS);
    } catch (error: any) {
      console.error("Logout error:", error);
      if (error.response && error.response.status === 401) {
        showSnackbar("認証エラーが発生しました", Severity.ERROR);
      } else if (error.message === "Network Error") {
        showSnackbar("ネットワークエラーが発生しました", Severity.ERROR);
      } else {
        showSnackbar("ログアウトに失敗しました", Severity.ERROR);
      }
    }
    handleClose();
  };
  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "4px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px -4px",
          },
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>Add another account</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
