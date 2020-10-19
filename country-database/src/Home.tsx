import * as React from 'react';

import { APP_TITLE, MIN_SCREEN_HEIGHT, MIN_SCREEN_WIDTH } from './AppConfig';
import { WebLogoDetailed } from './AppLogo';
import SearchBar from './components/SearchBar';

import { createStyles, Theme, withStyles } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { APP_INTRO, APP_SEO_DESC, SEOImage } from 'src/AppSEO';

// Interface
interface IHome {
    // Load boolean of this component
    loaded: boolean,
    // CSS style classes
    classes: any,
    // Variable stores the style required to be changed for small screen device
    styleForSmallScreen: any,
}

interface IHomeProps {
    // Flag indicates if page or country is not found
    notFound?: boolean,
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
    },
    notFoundTxt: {
        color: "red",
        marginBottom: "20px",
    }
});

export const Home = withStyles(styles)(

    class extends React.Component<IHomeProps, IHome> {

        static defaultProps = {
            notFound: "",
        }

        constructor(props: any) {
            super(props);
            // State
            this.state = {
                loaded: false,
                classes: props,
                styleForSmallScreen: this.getResponsiveStyle(),
            }
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
                <>
                    <Helmet>
                        {/* <!-- Google / Search Engine Tags --> */}
                        <meta itemProp="name" content={APP_TITLE} />
                        <meta
                            itemProp="description"
                            content={APP_SEO_DESC}
                        />
                        <meta
                            itemProp="image"
                            content={SEOImage}
                        />
                        <title>{`${APP_INTRO} | ${APP_TITLE}`}</title>
                    </Helmet>
                    <div style={this.state.styleForSmallScreen} className={classes.appDefaultStyle}>
                        <div
                            /* Prevent user from seeing the internal state of loading the weblogo */
                            style={{
                                visibility: this.state.loaded ? 'visible' : 'hidden',
                            }}
                        >
                            <WebLogoDetailed className={classes.webLogoStyle} onLoad={this.showComponent} />
                            {/* Display page not found message */}
                            {this.props.notFound &&
                                <div className={classes.notFoundTxt}>
                                    Oops! Page Not Found (404)
                            </div>
                            }
                            <SearchBar onIndexPage={true} />
                        </div>
                    </div>
                </>
            );
        }

    }
)