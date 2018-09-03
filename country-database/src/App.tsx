import * as React from 'react';

import SearchBar from './components/SearchBar';

import { SContext } from './AppData';

import { WebLogoDetailed } from './AppLogo';

const appStyle = {
    position: 'fixed' as 'fixed',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
}

const webLogoStyle = {
    width: '100%',
    maxWidth: '700px',
    minWidth: '300px',
    marginBottom: '10%',
}

export default class Home extends React.Component<{}> {

    public render() {
        return (
            <div style={appStyle}>
                <WebLogoDetailed style={webLogoStyle} />
                <SContext.Provider value={true}>
                    <SearchBar />
                </SContext.Provider>
            </div>
        );
    }

}