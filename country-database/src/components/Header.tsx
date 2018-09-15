import * as React from 'react';
import { Link } from 'react-router-dom';

import {
    AppBar, createStyles, Theme,
    Toolbar, Typography, withStyles
} from '@material-ui/core';

import SearchBar from './SearchBar';

import { HContext } from '../AppContext';

import { MIN_SCREEN_WIDTH } from '../AppConfig';
import { WebLogoDetailed, WebLogoSimple } from '../AppLogo';

// Declare props for this component
interface IHeaderProps {
    onIndexPage: boolean,
    getNewAlpha3Code?: (newAlpha3Code: string) => void, // '?' mean optional, if missing this prop then will use the default prop
}

// Interface
interface IHeader {
    winWidth: number,
    // Classes for styling material ui components
    classes: any,
}

// Styles
const searchBarStyle = {
    width: '70%',
    padding: 'auto',
    textAlign: 'initial' as 'initial',
    color: 'initial',
}

// Big logo style
const webLogoDetailedStyle = {
    width: '250px',
}

// Small logo style
const webLogoSimpleStyle = {
    width: '80px',
}

// App bar style
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
                        return (data.length > 0 &&
                            <AppBar className={classes.appBar} position="sticky">
                                <Toolbar variant="dense">
                                    <Typography variant="title">
                                        {/* Load hyperlink (link back to home page) after the content has been loaded */}
                                        {JSON.parse(data).pageLoaded ?
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
                winWidth >= MIN_SCREEN_WIDTH ?
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