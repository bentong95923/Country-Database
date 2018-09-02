import * as React from 'react';

import SearchBar from './components/SearchBar';

import { SContext, WebLogo } from './AppData';

const appStyle = {
    marginTop: '5%',
    width: '60%',
    textAlign: 'center' as 'center',
}

const webLogoStyle = {
    width: '450px',
}

export default class Home extends React.Component<{}> {

    public render() {
        return (
            <div id="wrapper" style={appStyle}>
                <WebLogo style={webLogoStyle} />
                <SContext.Provider value={true}>
                    <SearchBar />
                </SContext.Provider>
            </div>
        );
    }

}