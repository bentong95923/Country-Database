import * as React from "react";
/* 
    Curely brace import only work if, in this case, CContext
    contains a named export called CContext.
*/
import { CContext } from "../App";

import AppBar from '@material-ui/core/AppBar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import AccessTime from '@material-ui/icons/AccessTime';
import Assignment from '@material-ui/icons/Assignment';
import Comment from '@material-ui/icons/Comment';
import Done from '@material-ui/icons/Done';
import EuroSymbol from '@material-ui/icons/EuroSymbol';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Face from '@material-ui/icons/Face';
import Flag from '@material-ui/icons/Flag';
import Group from '@material-ui/icons/Group';
import GTranslate from '@material-ui/icons/GTranslate';
import Http from '@material-ui/icons/Http';
import Info from '@material-ui/icons/Info';
import Language from '@material-ui/icons/Language';
import LocationCity from '@material-ui/icons/LocationCity';
import MonetizationOn from '@material-ui/icons/MonetizationOn';
import People from '@material-ui/icons/People';
import Phone from '@material-ui/icons/Phone';
import PinDrop from '@material-ui/icons/PinDrop';
import Place from '@material-ui/icons/Place';
import Public from '@material-ui/icons/Public';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Timeline from '@material-ui/icons/Timeline';
import Translate from '@material-ui/icons/Translate';
import VerticalAlignCenter from '@material-ui/icons/VerticalAlignCenter';
import ZoneOutMap from '@material-ui/icons/ZoomOutMap';

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

                <AppBar position="static" color="default">
                    <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        scrollable={true}
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="General Info" icon={<Info />} />
                        <Tab label="Location, Area &amp; Borders" icon={<Place />} />
                        <Tab label="Economy" icon={<EuroSymbol />} />
                        <Tab label="Languages / Names" icon={<Translate />} />
                        <Tab label="Code / Domain" icon={<ThumbDown />} />
                    </Tabs>
                </AppBar>
                {this.state.countryDetailsList.map((country) => {
                    return (
                        <div key={country.alpha3Code}>
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
                                    {this.renderLanguagesNamesContent(country.name, country.altSpellings, country.nativeName, country.translations, country.languages)}
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
                        <People /> Population (estimate): {this.numberWithCommas(population)}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <LocationCity /> Capital: {capital}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <Face /> Demonym: {demonym.length !== 0 ? demonym : "n/a"}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <AccessTime /> Time Zone(s): {timezones.toString().split(',\s')}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <Flag /> Flag: {flag}
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
                        <Public /> Region: {region} &mdash; {subregion}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <PinDrop /> Geo coordinates: {latlng.length > 0 ? 'Lat: ' + latlng[0].toFixed(1) + ', Long: ' + latlng[1].toFixed(1) : "No data"}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <ZoneOutMap /> Area: {this.numberWithCommas(area)} km<sup>2</sup>
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <VerticalAlignCenter /> Country border(s): {borders.length > 0 ? this.state.borderFullName.toString().split(',\s') : "No Country Surrounded"}
                    </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    public renderEconmonyContent(gini: number, currencies: any[], regionalBlocs: any[]) {
        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Economy</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Typography>
                        <Timeline /> Gini Coefficient (%): {gini !== null ? gini : "No data"}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <MonetizationOn /> Currencies:
                    </Typography>
                    {currencies.map((v: any) => {
                        return (
                            <ExpansionPanelDetails key={v.code}>
                                <Typography>
                                    {/* In case the server returns 'null' for currency symbol */}
                                    {v.name} &mdash; {v.code} {v.symbol !== null ? ' (' + v.symbol + ')' : ""}
                                </Typography>
                            </ExpansionPanelDetails>
                        );
                    })}
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <Group /> Regional Trade BLOCs:
                    </Typography>
                    {regionalBlocs.length > 0 ? regionalBlocs.map((v: any) => {
                        return (
                            <ExpansionPanelDetails key={v.acronym}>
                                <Assignment /> {v.acronym} &mdash; {v.name}
                            </ExpansionPanelDetails>
                        );
                    }) : <ExpansionPanelDetails><Typography>None</Typography></ExpansionPanelDetails>}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    public renderLanguagesNamesContent(name: string, altSpellings: string[], nativeName: string, translations: any[], languages: any[]) {
        return (
            <ExpansionPanel defaultExpanded={true}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Languages / Names</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <Typography>
                        <Public /> {"Original / Official Name: " + name}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <GTranslate /> {"Also know as: " + altSpellings.toString().split(',\s')}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <Comment /> {"Native people call their country: " + nativeName.toString().split(',\s')}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <Language /> Language they speak:
                    </Typography>
                    {languages.map(value => {
                        return (
                            <ExpansionPanelDetails key={value.iso639_1}>
                                <Done /> {value.name}
                            </ExpansionPanelDetails>
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
                        <Http /> Top Level Domain: {topLevelDomain.toString().length !== 0 ? topLevelDomain.toString().split(',\s') : "Not assigned yet"}
                    </Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <Public /> ISO Code: {alpha2Code + " (Alpha-2), " + alpha3Code + " (Alpha-3), " + numericCode + " (UN M49)"}
                    </ Typography>
                </ExpansionPanelDetails>

                <ExpansionPanelDetails>
                    <Typography>
                        <Phone /> Calling Code:
                    </Typography>
                    {callingCodes.map(value => {
                        return (
                            <ExpansionPanelDetails key={value}>
                                <Typography>
                                    {"+ " + value}
                                </Typography>
                            </ExpansionPanelDetails>
                        );
                    })}
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    // Will be called if there is any component(s) updated for re-rendering
    public componentDidUpdate() {
        let temp = new Array();
        this.state.countryDetailsList.map(val => {
            temp = val.borders
        });
        // Stop calling the API if countries name for all alpha3codes are all received
        if (temp.length !== 0 && temp.length !== this.state.borderFullName.length) {
            this.getCountryFullNameArray(temp);
        }
    }

    // Add commas for each thoudsand
    public numberWithCommas(n: number) {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
                    .catch(err => alert('getCountryFullNameArray(): ' + err)
                    );

            }
        }
        this.setState({ borderFullName: tempArray });
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
                    output.push(out);
                    this.setState({ countryDetailsList: output });
                } else {
                    // 404 Not result found error, but should not reach here
                    this.setState({ countryDetailsList: out.message });
                }
            })
            .catch(err => alert('searchCountryDetails(): '+ err)
            );

    }

}