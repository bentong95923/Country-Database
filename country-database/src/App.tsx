import * as React from 'react';

import SearchBar from './components/SearchBar';

import { SContext } from './AppData';

const appStyle = {
    marginTop: '5%',
    width: '60%',
    textAlign: 'center' as 'center',
}

export default class Home extends React.Component<{}> {

    public render() {
        return (
            <div id="wrapper" style={appStyle}>
                <h2> Country Database<br />more than 200+ country information available</h2>
                <SContext.Provider value={true}>
                    <SearchBar />
                </SContext.Provider>
            </div>
        );
    }

}