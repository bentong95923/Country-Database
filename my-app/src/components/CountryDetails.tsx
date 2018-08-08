import * as React from "react";
/* 
    Curely brace import only work if, in this case, CContext
    contains a named export called CContext.
*/
import { CContext } from "./FirstComponent";

import AppBar from '@material-ui/core/AppBar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import PhoneIcon from '@material-ui/icons/Phone';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import ThumbDown from '@material-ui/icons/ThumbDown';

interface ICountryDetails {
    countryDetailsList: any[],
    value: number
}

// const numTab = 10;

function TabContainer(props: any) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

export default class CountryDetails extends React.Component<{}, ICountryDetails> {

    constructor(props: any) {
        super(props);
        this.state = {
            countryDetailsList: [],
            value: 0
        }
    }

    public handleChange = (event: any, val: number) => {
        this.setState({ value: val });
    };

    public render() {
        return (
            <div>
                {/* An iframe is created for only allowing to auto-trigger the api in the searchCountryDetails() to get the country details. It is not rendered out. */}
                <CContext.Consumer>
                    {state => <iframe className="iframeTriggerOnly" id={state.selectedCountry3Code} onLoad={this.searchCountryDetails} />}
                </CContext.Consumer>
                {/* React components must have a wrapper node/element */}
                <h2>Country Details:</h2>
                {JSON.stringify(this.state.countryDetailsList)}

                <AppBar position="static" color="default">
                    {this.state.countryDetailsList.map((value) => {
                        return (
                            <Tabs
                                key={value.name}
                                value={this.state.value}
                                onChange={this.handleChange}
                                scrollable={true}
                                scrollButtons="on"
                                indicatorColor="primary"
                                textColor="primary"
                            >
                                <Tab label="General Info" icon={<PhoneIcon />} />
                                <Tab label="Location, Area &amp; Borders" icon={<FavoriteIcon />} />
                                <Tab label="Economy" icon={<PersonPinIcon />} />
                                <Tab label="Also Known As" icon={<ShoppingBasket />} />
                                <Tab label="Code/Domain" icon={<ThumbDown />} />
                            </Tabs>
                        );
                    })}
                </AppBar>
                {this.state.countryDetailsList.map((val) => {
                    const country = val.data;
                    return (
                        <div key={val.id}>
                            {this.state.value === 0 &&
                                <TabContainer>
                                    {country.name}
                                    {this.renderGeneralInfoContent(country.population, country.capital, country.demonym, country.timezones, country.flag)}
                                </TabContainer>
                            }
                            {this.state.value === 1 &&
                                <TabContainer>
                                    {this.renderLocationContent(country.region, country.subregion, country.latlng, country.area, country.borders)}
                                </TabContainer>}
                            {this.state.value === 2 &&
                                <TabContainer>

                                    {this.renderEconmonyContent(country.gini, country.currencies, country.regionBlocs)}
                                </TabContainer>}
                            {this.state.value === 3 && <TabContainer>Item Four</TabContainer>}
                        </div>
                    );
                })}


            </div>
        );
    }

    public renderGeneralInfoContent(population: number, capital: string, demonym: string, timezones: any[], flag: string) {
        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Location Details and Population</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Typography>
                        Population (estimate): {this.numberWithCommas(population)}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        Capital: {capital}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        Demonym: {demonym}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        Time Zone(s): {timezones.toString().split(',\s')}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        Flag: {flag}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    public renderLocationContent(region: string, subregion: string, latlng: any[], area: number, borders: any[]) {
        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Location Details and Population</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Typography>
                        Region: {region} &mdash; {subregion}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        Latitude &amp; Longitude: {latlng.toString().split(',\s')}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        Area: {this.numberWithCommas(area)} km<sup>2</sup>
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        Border: {borders.length > 0 ? borders.toString().split(',\s') : "No Country Surrounded"}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    public renderEconmonyContent(gini: number, currencies: any[], regionBlocs: any[]) {
        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Location Details and Population</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Typography>
                        Gini Coefficient (%): {gini}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        Currencies:
                        {currencies.map((v: any) => {
                            return <div key={v.code}>
                                {v.name} &mdash; {v.code} &#40;{v.symbol}&#41;
                            </div>
                        })}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        Regional Trade BLOCS:
                        {regionBlocs.map((v: any) => {
                            return <div key={v.code}>
                                {v.acronym} &mdash; {v.code} &#40;{v.symbol}&#41;
                            </div>
                        })}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    // Add commas for each thoudsand
    public numberWithCommas(n: number) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    public searchCountryDetails = (event: any) => {
        /* Calling api from REST Countries website */
        const url = 'https://restcountries.eu/rest/v2/alpha/' + event.target.id;
        fetch(url)
            .then(response => response.json())
            .then((out) => {
                if (out.status !== 404) {
                    const output = new Array();
                    // Retrieve the alpha 3 code (Primary key) and the country name from the result
                    output.push({ id: 0, data: out });
                    this.setState({ countryDetailsList: output });
                } else {
                    // 404 Not result found error, but should not reach here
                    this.setState({ countryDetailsList: out.message });
                }
            })
            .catch(err => alert(err)
            );

    }

}