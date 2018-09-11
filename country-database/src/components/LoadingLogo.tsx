import * as React from "react";

import CircularProgress from '@material-ui/core/CircularProgress';

interface ILoadingLogo {
    loaded: boolean, // Hide the internal state of loading image src
}

const loadingScreenStyle = {
    position: 'fixed' as 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: '70px 40px',
    maxWidth: '200px',
    minWidth: '100px',
    borderRadius: '5px',
}

const webLogoStyle = {
    width: '100%',
    marginBottom: '10%',
}

const spinnerStyle = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    margin: '20px auto 0 auto'
}

export default class LoadingLogo extends React.Component<{},ILoadingLogo> {

    constructor(props: any) {
        super(props);
        this.state = {
            loaded: false,
        }
    }

    public showComponent = () => this.setState({ loaded: true });

    public render() {
        return (
            <div
                /* Prevent user from seeing the internal state of loading the weblogo */
                style={{
                    visibility: this.state.loaded ? 'visible' : 'hidden',
                }}
            >
                <div style={loadingScreenStyle}>
                    <img src={require("../img/world.svg")} style={webLogoStyle} onLoad={this.showComponent}/>
                    <CircularProgress style={spinnerStyle} />
                </div >
            </div>
        );
    }
}