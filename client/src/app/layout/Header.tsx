import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import SignedInMenu from "./SignedInMenu";

const appBarLinksLeft = [
    {title: 'catalog', path: '/catalog' },
    {title: 'about', path: '/about' },
    {title: 'contact', path: '/contact' },
]

const appBarLinksRight = [
    {title: 'login', path: '/login' },
    {title: 'register', path: '/register' },
]

const navStyles = {
    color: 'inherit',
    textDecoration: 'none', 
    typography: 'h6',    
    '&:hover': {
        color: 'grey.500'
    },
    '&.active': {
        color: 'text.secondary'
    }
}

interface Props{
    darkMode: boolean;
    themeChangeEventHandler: () => void
}

export default function Header({darkMode, themeChangeEventHandler}: Props) {

    const {basket} = useAppSelector(state => state.basket);
    const {user} = useAppSelector(state => state.account);
    const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0);

    return(
        <AppBar position='static'>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>

                <Box display='flex' alignItems='center'>
                    <Typography 
                        variant="h6" 
                        component={NavLink} 
                        to='/'
                        sx={navStyles}    
                    >
                        REACT STORE
                    </Typography>
                    
                    <Switch checked={darkMode} onChange={themeChangeEventHandler}></Switch>
                </Box>
                
                <List sx={{display: 'flex'}}>
                  {appBarLinksLeft.map(({title, path}) => (
                  <ListItem 
                    component={NavLink} 
                    to={path} 
                    key={path} 
                    sx={navStyles}>
                        {title.toUpperCase()}
                  </ListItem>))}  
                </List>

                <Box display='flex' alignItems='center'>
                    <IconButton 
                        component={Link} 
                        to='/basket' 
                        size='large' 
                        edge='start' 
                        color='inherit' 
                        sx={{mr: 2}}>
                            <Badge badgeContent={itemCount} color='secondary'>
                                <ShoppingCart />
                            </Badge>
                    </IconButton>
                    {
                        //  If we have a user, show the signed in menu otherwise show the list of default links
                        user 
                    
                            ? 
                            (
                                <SignedInMenu />
                            ) 
                            : 
                            (
                                <List sx={{display: 'flex'}}>
                                    {appBarLinksRight.map(({title, path}) => (
                                    <ListItem 
                                        component={NavLink} 
                                        to={path} 
                                        key={path} 
                                        sx={navStyles}
                                    >
                                        {title.toUpperCase()}
                                    </ListItem>))}  
                                </List>
                            )
                    }
                </Box>

            </Toolbar>
        </AppBar>
    )

}