import * as React from "react";

import CircularProgress from '@material-ui/core/CircularProgress';

const loadingScreenStyle = {
    margin: 0,
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '50%',
}

export default class LoadingScreen extends React.Component<{}> {

    public render() {
        return (
            <div>
                <CircularProgress style={loadingScreenStyle} />
            </div>
        );
    }
}