import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const appBarLinksLeft = [
    {title: 'catalog', path: '/catalog' },
    {title: 'about', path: '/about' },
    {title: 'contact', path: '/contact' },
]

const appBarLinksRight = [
    {title: 'login', path: '/login' },
    {title: 'register', path: '/register' },
]

interface Props{
    darkMode: boolean;
    themeChangeEventHandler: () => void
}

export default function Header({darkMode, themeChangeEventHandler}: Props) {

    return(
        <AppBar position='static' sx={{mb: 4}} >
            <Toolbar>
                <Typography 
                    variant="h6" 
                    component={NavLink} 
                    to='/'
                    sx={{cololr: 'inherit', textDecoration: 'none'}}    
                >
                    
                    REACT STORE
                </Typography>
                
                <Switch checked={darkMode} onChange={themeChangeEventHandler}></Switch>

                <List sx={{display: 'flex'}}>
                  {appBarLinksLeft.map(({title, path}) => (
                  <ListItem component={NavLink} to={path} key={path} sx={{color: 'inherit', typography: 'h6'}}>
                    {title.toUpperCase()}
                  </ListItem>))}  
                </List>

                <IconButton size='large' edge='start' color='inherit' sx={{mr: 2}}>
                    <Badge badgeContent='4' color='secondary'>
                        <ShoppingCart />
                    </Badge>
                </IconButton>

                <List sx={{display: 'flex'}}>
                  {appBarLinksRight.map(({title, path}) => (
                  <ListItem component={NavLink} to={path} key={path} sx={{color: 'inherit', typography: 'h5'}}>
                    {title.toUpperCase()}
                  </ListItem>))}  
                </List>
            
            </Toolbar>
        </AppBar>
    )

}