import * as React from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import App from './App'
import CountryDetails from './components/CountryDetails';
import FirstComponent from './components/FirstComponent';
import { Header } from './components/Header';
import SecondComponent from './components/SecondComponent';
import './css/styles.css';

export const AppRouter: React.StatelessComponent<{}> = () => {
    return (

        <BrowserRouter>
            <div>
                <Header />
                <main>
                    <Route exact={true} path="/" component={App} />
                    <Route path="/FirstComponent" component={FirstComponent} />
                    <Route path="/SecondComponent" component={SecondComponent} />
                    <Route path="/CountryDetails" component={CountryDetails} />
                    <Redirect from='*' to='/' />
                </main>
            </div>
        </BrowserRouter>

    );
}