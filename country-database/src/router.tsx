import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Background from './components/Background';
import { CountryDetails } from './components/CountryDetails';

import Home from './App';
import './css/styles.css';

export const AppRouter: React.StatelessComponent<{}> = () => {
    return (
        <BrowserRouter>
            <div>
                <Background />
                <main>
                    {/* Switch will try to match the url to each route from top to bottom. */}
                    <Switch>
                        <Route exact={true} path="/" component={Home} />
                        <Route exact={true} path="/details/:alpha3Code" component={CountryDetails} />
                        {/* Path not matched will redirect back to home page */}
                        <Route component={Home} />
                    </Switch>
                </main>
            </div>
        </BrowserRouter>
    );
}