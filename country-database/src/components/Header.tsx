import * as React from 'react';
import { Link } from 'react-router-dom';

import {
    AppBar, createStyles, Theme,
    Toolbar, Typography, withStyles
} from '@material-ui/core';

import SearchBar from './SearchBar';

import { HContext } from '../AppData';

import { WebLogoDetailed, WebLogoSimple } from '../AppLogo';

// Declare props for this component
interface IHeaderProps {
    onIndexPage: boolean,
    getNewAlpha3Code?: (newAlpha3Code: string) => void, // '?' mean optional, if missing this prop then will use the default prop
}

// Interface
interface IHeader {
    winWidth: number,
    classes: any,
}

// Styles
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

export const Header = withStyles(styles)(
    class extends React.Component<IHeaderProps, IHeader> {

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
                <HContext.Consumer>
                    {data => {
                        if (data.length > 0) {
                            const pageLoaded = JSON.parse(data).pageLoaded;
                            return (
                                <AppBar className={classes.appBar} position="sticky">
                                    <Toolbar variant="dense">
                                        <Typography variant="title">
                                            {pageLoaded ?
                                                <Link to="/">
                                                    {this.renderLogoByScreenWidth(this.state.winWidth)}
                                                </Link>
                                                :
                                                this.renderLogoByScreenWidth(this.state.winWidth)
                                            }
                                        </Typography>
                                        <div style={searchBarStyle}>
                                            {JSON.parse(data).alpha3Code.length === 3 &&
                                                <SearchBar onIndexPage={false} getNewAlpha3Code={this.sendDataToParent} preLoadCountryData={data} />
                                            }
                                        </div>
                                    </Toolbar>
                                </AppBar>
                            );
                        } else {
                            return '';
                        }
                    }}
                </HContext.Consumer>
            );
        }

        public sendDataToParent = (valueChild: string) => {
            if (this.props.getNewAlpha3Code !== undefined) {
                this.props.getNewAlpha3Code(valueChild);
            }
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