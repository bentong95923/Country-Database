import * as React from "react";

import CircularProgress from '@material-ui/core/CircularProgress';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

interface ILoadingLogo {
    loaded: boolean, // Hide the internal state of loading image src
    classes: any,
    winResolution: number[],
}

const styles = (theme: Theme) => createStyles({
    loadingScreenBackground: {
        backgroundColor: 'rgb(0,0,0,0.3)',
        position: 'fixed' as 'fixed',
        zIndex: 300,
    },
    loadingScreenStyle: {
        position: 'fixed' as 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(255,255,255,0.5)',
        padding: '70px 40px',
        borderRadius: '5px',
        maxWidth: '200px',
        minWidth: '100px',
        zIndex: 301, // a layer higher than loading screen background
    },
    webLogoStyle: {
        width: '100%',
        marginBottom: '10%',
    },
    spinnerStyle: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        margin: '20px auto 0 auto'
    },
});

export const LoadingLogo = withStyles(styles)(
    class extends React.Component<{}, ILoadingLogo> {

        constructor(props: any) {
            super(props);
            this.state = {
                loaded: false,
                classes: props,
                winResolution: [window.innerWidth, window.innerHeight],
            }
        }

        public showComponent = () => this.setState({ loaded: true });

        public updateResolution = () => {
            this.setState({ winResolution: [window.innerWidth, window.innerHeight] });
        }

        public disableScrolling = () => {
            if (document.getElementsByTagName('body').length !== 0) {
                document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
            }
        }

        public enableScrolling = () => {
            if (document.getElementsByTagName('body').length !== 0) {
                document.getElementsByTagName('body')[0].style.overflowY = 'visible'
            }
        }

        public componentDidMount() {
            // Disable scrolling while loading the content
            this.disableScrolling();
            window.addEventListener('resize', this.updateResolution);
        }

        public componentWillUnmount() {
            // Enable scrolling after the content is loaded.
            this.enableScrolling();
            window.removeEventListener('resize', this.updateResolution);
        }

        public render() {
            const { classes } = this.state.classes;
            return (
                <div
                    style={{
                        /* Prevent user from seeing the internal state of loading the weblogo */
                        visibility: this.state.loaded ? 'visible' : 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: this.state.winResolution[0],
                            height: this.state.winResolution[1],
                        }}
                        className={classes.loadingScreenBackground}
                    />
                    <div className={classes.loadingScreenStyle}>
                        <img src={require("../img/world.svg")} className={classes.webLogoStyle} onLoad={this.showComponent} />
                        <CircularProgress className={classes.spinnerStyle} />
                    </div >
                </div >
            );
        }
    }
)