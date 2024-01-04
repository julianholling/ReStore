import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/account/accountSlice";
import { clearBasket } from "../../features/basket/basketSlice";

export default function SignedInMenu() {

    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.account);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const onClickEventHandler = (event: any) => {
        setAnchorEl(event.currentTarget);
  
    };

    const onCloseEventhandler = () => {
        setAnchorEl(null);
    };

  return (
    <>
      <Button
        color='inherit' 
        onClick={onClickEventHandler}
        sx={{typography: 'h6'}}
        >
            {user?.email}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onCloseEventhandler}
      >
        <MenuItem onClick={onCloseEventhandler}>Profile</MenuItem>
        <MenuItem onClick={onCloseEventhandler}>My orders</MenuItem>
        <MenuItem onClick={() => {
          dispatch(signOut());
          dispatch(clearBasket());
        }}>Logout</MenuItem>
      </Menu>
    </>
  );

}

