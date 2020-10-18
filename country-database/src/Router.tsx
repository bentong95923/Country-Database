import * as React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Background from './components/Background';
import { CountryDetails } from './components/CountryDetails';

import { Home } from './Home';
import NotFound from './NotFound';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { URI_NAME_DETAILS } from './AppConfig';
import './css/styles.css';

// Theme: black
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

const redirectToUrlWithTrailingSlash = (props: any) => {
    return <Redirect to={`${props.location.pathname}/`} />;
}

export const AppRouter: React.StatelessComponent<{}> = () => {
    return (
        <BrowserRouter>
            <div>
                <Background />
                <MuiThemeProvider theme={theme}>
                    <main>
                        {/* Switch will try to match the url to each route from top to bottom. */}
                        <Switch>
                            <Route exact={true} strict={true} path="/:url*" render={redirectToUrlWithTrailingSlash} />
                            <Route exact={true} path="/" component={Home} />
                            <Route exact={true} path={"/" + URI_NAME_DETAILS + "/:alpha3Code/"} component={CountryDetails} />
                            {/* Path not matched will redirect back to home page */}
                            <Route component={NotFound} />
                        </Switch>
                    </main>
                </MuiThemeProvider>
            </div>
        </BrowserRouter>
    );
}