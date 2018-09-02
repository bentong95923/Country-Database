import * as React from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, Typography } from '@material-ui/core';
import SearchBar from './SearchBar';

import { SContext } from '../AppData';

const searchBarStyle = {
    width: '60%',
    padding: 'auto',
    maxWidth: '100%',
    minWidth: '20%',
    textAlign: 'initial' as 'initial',
    color: 'black',
}

const webLogoStyle = {
    width: '250px',
}

export default class Header extends React.Component<{}> {

    public render() {
        return (
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography variant="title" color="inherit">
                        <Link style={{ color: "white" }} to="/" className="App-Title">
                            <img style={webLogoStyle} src={require('../img/webLogo.png')} />
                        </Link>
                    </Typography>
                    <div style={searchBarStyle}>
                        <SContext.Provider value={false}>
                            <SearchBar />
                        </SContext.Provider>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }

}