import * as React from 'react';

import { APP_TITLE, MIN_SCREEN_HEIGHT, MIN_SCREEN_WIDTH } from './AppData';
import { WebLogoDetailed } from './AppLogo';
import SearchBar from './components/SearchBar';

import { createStyles, Theme, withStyles } from '@material-ui/core';

// Interface
interface IHome {
    // Load boolean of this component
    loaded: boolean,
    // CSS style classes
    classes: any,
    // Variable stores the style required to be changed for small screen device
    styleForSmallScreen: any,
}

// Style using material ui method
const styles = (theme: Theme) => createStyles({
    appDefaultStyle: {
        position: 'fixed' as 'fixed',
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
            // State
            this.state = {
                loaded: false,
                classes: props,
                styleForSmallScreen: this.getResponsiveStyle(),
            }
            // Setting the title of this page
            document.title = APP_TITLE;
        }

        // Only display this component if the image has been loaded
        public showComponent = () => this.setState({ loaded: true });

        // Get function of responsive style of this component
        public getResponsiveStyle = () => {
            const topStyle = window.innerHeight < MIN_SCREEN_HEIGHT ? '50%' : '45%';
            return window.innerWidth < MIN_SCREEN_WIDTH ? ({ width: '100%', top: topStyle }) : ({ borderRadius: '5px', top: topStyle });
        }

        // Set function of responsive style of this component
        public setHomePageStyle = () => this.setState({ styleForSmallScreen: this.getResponsiveStyle() });

        // Restyle the component if the browser window has been resized
        public componentDidMount() {
            window.addEventListener('resize', this.setHomePageStyle);
        }

        // Deregister the event listener when the component is being destroyed
        public componentWillUnmount() {
            window.removeEventListener('resize', this.setHomePageStyle);
        }

        public render() {
            const { classes } = this.state.classes;
            return (
                <div style={this.state.styleForSmallScreen} className={classes.appDefaultStyle}>
                    <div
                        /* Prevent user from seeing the internal state of loading the weblogo */
                        style={{
                            visibility: this.state.loaded ? 'visible' : 'hidden',
                        }}
                    >
                        <WebLogoDetailed className={classes.webLogoStyle} onLoad={this.showComponent} />
                        <SearchBar onIndexPage={true} />
                    </div>
                </div>
            );
        }

    }
)