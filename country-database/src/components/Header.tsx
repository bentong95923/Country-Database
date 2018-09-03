import * as React from 'react';
import { Link } from 'react-router-dom';

import {
    AppBar, createStyles, Theme,
    Toolbar, Typography, withStyles
} from '@material-ui/core';

import SearchBar from './SearchBar';

import { LContext, SContext } from '../AppData';

import { WebLogoDetailed, WebLogoSimple } from '../AppLogo';

const searchBarStyle = {
    width: '70%',
    padding: 'auto',
    textAlign: 'initial' as 'initial',
    color: 'initial',
}

const webLogoDetailedStyle = {
    width: '250px',
}

const webLogoSimpleStyle = {
    width: '80px',
}

const styles = (theme: Theme) => createStyles({
    appBar: {
        padding: '15px 0',
        backgroundColor: 'rgba(255,255,255,0.5)',
    }
});

interface IHeader {
    winWidth: number,
    classes: any,
}

export const Header = withStyles(styles)(
    class extends React.Component<{}, IHeader> {

        constructor(props: any) {
            super(props);
            this.state = {
                winWidth: window.innerWidth,
                classes: props,
            }
        }

        public render() {
            const { classes } = this.state.classes;
            return (
                <AppBar className={classes.appBar} position="sticky">
                    <Toolbar variant="dense">
                        <Typography variant="title">
                            <LContext.Consumer>
                                {pageFinishedLoading => {
                                    return (
                                        (pageFinishedLoading ?
                                            <Link to="/">
                                                {this.renderLogoByScreenWidth(this.state.winWidth)}
                                            </Link>
                                            :
                                            this.renderLogoByScreenWidth(this.state.winWidth)
                                        )
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

        public renderLogoByScreenWidth = (winWidth: number) => {
            return (
                winWidth >= 500 ?
                    <WebLogoDetailed style={webLogoDetailedStyle} />
                    :
                    <WebLogoSimple style={webLogoSimpleStyle} />
            );
        }

        public updateResolution = () => {
            this.setState({ winWidth: window.innerWidth });
        }

        public componentDidMount() {
            window.addEventListener('resize', this.updateResolution);
        }

        public componentWillUnmount() {
            window.removeEventListener('resize', this.updateResolution);
        }

    }
)