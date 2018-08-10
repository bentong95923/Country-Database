import {AppBar, Toolbar, Typography} from '@material-ui/core/';
import * as React from 'react'
// import { Nav, Navbar, NavItem } from 'react-bootstrap';
// import { IndexLinkContainer } from "react-router-bootstrap";
import { Link } from 'react-router-dom';

export const Header: React.StatelessComponent<{}> = () => {
    return (
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="display2" color="inherit">
                        <Link style={{color: "white"}} to="/" className="App-Title">Country Database</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
    );
}