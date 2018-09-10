import * as React from 'react';

import SearchBar from './components/SearchBar';

import { APP_TITLE, MIN_SCREEN_WIDTH } from './AppData';
import { WebLogoDetailed } from './AppLogo';

import { createStyles, Theme, withStyles } from '@material-ui/core';

interface IHome {
    contentLoaded: boolean,
    classes: any,
    styleForSmallScreen: any,
}

const styles = (theme: Theme) => createStyles({
    appDefaultStyle: {
        position: 'fixed' as 'fixed',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(255,255,255,0.5)',
        padding: '70px 40px',
    },
    webLogoStyle: {
        width: '100%',
        maxWidth: '700px',
        minWidth: '230px',
        marginBottom: '10%',
    }
});


export const Home = withStyles(styles)(
    class extends React.Component<{}, IHome> {

        constructor(props: any) {
            super(props);
            this.state = {
                contentLoaded: false,
                classes: props,
                styleForSmallScreen: this.getHomePageStyle(),
            }
        }

        public showContent = () => this.setState({ contentLoaded: true });

        public getHomePageStyle = () => {
            return (
                window.innerWidth < MIN_SCREEN_WIDTH) ? ({ width: '100%' }) : ({ borderRadius: '5px' }
                );
        }

        public setHomePageStyle = () => {
            this.setState({ styleForSmallScreen: this.getHomePageStyle() });
        }

        public componentDidMount() {
            window.addEventListener('resize', this.setHomePageStyle);
        }

        public componentWillUnmount() {
            window.removeEventListener('resize', this.setHomePageStyle);
        }

        public render() {
            const { classes } = this.state.classes;
            document.title = APP_TITLE;
            return (
                <div style={this.state.styleForSmallScreen} className={classes.appDefaultStyle}>
                    <div
                        /* Prevent user from seeing the internal state of loading the weblogo */
                        style={{
                            visibility: this.state.contentLoaded ? 'visible' : 'hidden',
                        }}
                    >
                        <WebLogoDetailed className={classes.webLogoStyle} onLoad={this.showContent} />
                        <SearchBar onIndexPage={true} />
                    </div>
                </div>
            );
        }

    }
)