import { AppBar, Switch, Toolbar, Typography } from "@mui/material";

interface Props{
    darkMode: boolean;
    themeChangeEventHandler: () => void
}

export default function Header({darkMode, themeChangeEventHandler}: Props) {

    return(
        <AppBar position='static' sx={{mb: 4}} >
            <Toolbar>
                <Typography variant="h6">REACT STORE</Typography>
                <Switch checked={darkMode} onChange={themeChangeEventHandler}></Switch>
            </Toolbar>
        </AppBar>
    )

}