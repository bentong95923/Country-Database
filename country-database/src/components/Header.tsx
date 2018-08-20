import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import * as React from 'react'
// import { Nav, Navbar, NavItem } from 'react-bootstrap';
// import { IndexLinkContainer } from "react-router-bootstrap";
import { Link } from 'react-router-dom';

export const Header: React.StatelessComponent<{}> = () => {
    return (
        <AppBar position="static">
            <Toolbar variant="dense">
                <IconButton color="inherit" aria-label="Menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="title" color="inherit">
                    <Link style={{ color: "white" }} to="/" className="App-Title">Country Database</Link>
                    <Link style={{ color: "white" }} to="/test" className="App-Title">Test</Link>
                </Typography>
            </Toolbar>
        </AppBar>
    );
}