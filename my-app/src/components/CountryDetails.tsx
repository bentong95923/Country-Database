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
    borderFullName: any[],
    value: number
}

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
            borderFullName: [],
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
                {/* JSON.stringify(this.state.countryDetailsList) */}

                <AppBar position="static" color="default">
                    <Tabs
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
                        <Tab label="Other Names" icon={<ShoppingBasket />} />
                        <Tab label="Code / Domain" icon={<ThumbDown />} />
                    </Tabs>
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
                                    {this.renderEconmonyContent(country.gini, country.currencies, country.regionalBlocs)}
                                </TabContainer>}
                            {this.state.value === 3 &&
                                <TabContainer>
                                    {this.renderOtherNamesContent(country.name, country.altSpellings, country.nativeName, country.translations, country.languages)}
                                </TabContainer>}
                            {this.state.value === 4 &&
                                <TabContainer>
                                    {this.renderCodeDomainContent(country.topLevelDomain, country.alpha2Code, country.alpha3Code, country.callingCodes, country.numericCode)}
                                </TabContainer>}
                        </div>
                    );
                })}
            </div>
        );
    }

    public renderGeneralInfoContent(population: number, capital: string, demonym: string, timezones: string[], flag: string) {
        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>General Info</Typography>
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
                        Demonym: {demonym.length !== 0 ? demonym : "n/a"}
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

    public renderLocationContent(region: string, subregion: string, latlng: number[], area: number, borders: string[]) {
        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Location, Area &amp; Borders</Typography>
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
                        Country Border: {borders.length > 0 ? this.state.borderFullName.toString().split(',\s') : "No Country Surrounded"}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    // Will be called if there is any component(s) updated for re-rendering
    public componentDidUpdate() {
        let temp = new Array();
        this.state.countryDetailsList.map(val => {            
            temp = val.data.borders
        });
        if (temp.length !== 0 && temp.length !== this.state.borderFullName.length) {
            this.getCountryFullNameArray(temp);
        }
    }
    
    public componentWillUnmount() {
        this.setState({countryDetailsList: []});
    }

    public async getCountryFullNameArray(countryArray: string[]) {
        const tempArray = new Array();
        /* Calling api from REST Countries website */
        for (const i in countryArray) {
            if (countryArray.length >= 0) {
                const url = 'https://restcountries.eu/rest/v2/alpha/' + countryArray[i] + '?fields=name';
                await fetch(url)
                    .then(response => response.json())
                    .then((out) => {
                        if (out.status !== 404) {
                            // Retrieve the alpha 3 code (Primary key) and the country name from the result
                            tempArray.push(out.name);
                        } else {
                            // 404 Not result found error, but should not reach here
                            tempArray.push(out.message);
                        }
                    })
                    .catch(err => alert('async'+err)
                    );

            }
        }        
        this.setState({borderFullName: tempArray});
    }

    public renderEconmonyContent(gini: number, currencies: any[], regionalBlocs: any[]) {
        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Economy</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Typography>
                        Gini Coefficient (%): {gini}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    Currencies:
                    {currencies.map((v: any) => {
                        return (
                            <Typography key={v.code}>
                                {/* In case the server returns 'null' for currency symbol */}
                                {v.name} &mdash; {v.code} {v.symbol !== null ? ' (' + v.symbol + ')' : ""}
                            </Typography>
                        );
                    })}
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    Regional Trade BLOCs:
                    {regionalBlocs.length > 0 ? regionalBlocs.map((v: any) => {
                        return (
                            <Typography key={v.acronym}>
                                {v.acronym} &mdash; {v.name}
                            </Typography>
                        );
                    }) : "None"}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    public renderOtherNamesContent(name: string, altSpellings: string[], nativeName: string, translations: any[], languages: any[]) {
        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Other Names</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Typography>
                        {"Original / Official Name: " + name}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        {"Also know as: " + altSpellings.toString().split(',\s')}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        {"Native people will call their country: " + nativeName.toString().split(',\s')}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    They speak:
                    {languages.map(value => {
                        return (
                            <Typography key={value.iso639_1}>
                                {" " + value.name + ", "}
                            </Typography>
                        );
                    })}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    public renderCodeDomainContent(topLevelDomain: string[], alpha2Code: string, alpha3Code: string, callingCodes: string[], numericCode: string) {
        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Code / Domain</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Typography>
                        Top Level Domain: {topLevelDomain.toString().length !== 0 ? topLevelDomain.toString().split(',\s') : "Not assigned yet"}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        ISO Code: {alpha2Code + " (Alpha-2 Code), " + alpha3Code + " (Alpha-3 Code), " + numericCode + " (Numeric Code / UN M49)"}
                    </ Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    Calling Code:
                    {callingCodes.map(value => {
                        return (
                            <Typography key={value}>
                                {"+" + value}
                            </Typography>
                        );
                    })}
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