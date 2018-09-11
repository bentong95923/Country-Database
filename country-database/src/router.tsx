import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Background from './components/Background';
import { CountryDetails } from './components/CountryDetails';
import LoadingScreen from "./components/LoadingLogo";

import { Home } from './Home';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import './css/styles.css';

const theme = createMuiTheme({
    palette: {
        primary: {
          // light: will be calculated from palette.primary.main,
          main: '#000',
          // dark: will be calculated from palette.primary.main,
          // contrastText: will be calculated to contrast with palette.primary.main
        },
    }
});

export const AppRouter: React.StatelessComponent<{}> = () => {
    return (
        <BrowserRouter>
            <div>
                <Background />
                <MuiThemeProvider theme={theme}>
                <main>
                    {/* Switch will try to match the url to each route from top to bottom. */}
                    <Switch>
                        <Route exact={true} path="/" component={Home} />
                        <Route exact={true} path="/details/:alpha3Code" component={CountryDetails} />
                        <Route exact={true} path="/loadingScreen" component={LoadingScreen} />
                        {/* Path not matched will redirect back to home page */}
                        <Route component={Home} />
                    </Switch>
                </main>
                </MuiThemeProvider>
            </div>
        </BrowserRouter>
    );
}