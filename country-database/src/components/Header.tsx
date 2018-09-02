import * as React from 'react';
import { Link } from 'react-router-dom';

import { AppBar, Toolbar, Typography } from '@material-ui/core';
import SearchBar from './SearchBar';

import { LContext, SContext, WebLogo } from '../AppData';

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
                        <LContext.Consumer>
                            {pageFinishedLoading => {
                                return (
                                    pageFinishedLoading ? <Link to="/"> <WebLogo style={webLogoStyle} /> </Link> : <WebLogo style={webLogoStyle} />
                                );
                            }}
                        </LContext.Consumer>
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