import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import CountryDatabase from './App';
import { CountryDetails } from './components/CountryDetails';
import { Header } from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import './css/styles.css';

export const AppRouter: React.StatelessComponent<{}> = () => {
    return (

        <BrowserRouter>
            <div>
                <Header />
                <main>
                    <Route exact={true} path="/" component={CountryDatabase} />
                    <Route exact={true} path="/details/:alpha3Code" component={CountryDetails} />
                    <Route exact={true} path="/LoadingScreen" component={LoadingScreen} />
                </main>
            </div>
        </BrowserRouter>

    );
}