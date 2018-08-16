import * as React from "react";
/* 
    Curely brace import only work if, in this case, CContext
    contains a named export called CContext. If with 'dafault'
    keyword on export, no curely brace is needed.
*/
import { CContext } from "../App";

import {
    AppBar, Paper, Tab,
    Table, TableBody,
    TableCell, TableHead,
    TableRow, Tabs, Typography
} from '@material-ui/core';

import {
    AccessTime, Assignment,
    Comment, Done, EuroSymbol,
    Face, Group, GTranslate,
    Http, Info, Language,
    LocationCity,
    MonetizationOn, People,
    Phone, PinDrop, Place,
    Public, SettingsEthernet,
    Timeline, Translate,
    VerticalAlignCenter, ZoomOutMap
} from '@material-ui/icons';

import { Gallery } from "./Gallery";

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

export const CountryNameContext = React.createContext({ allCountryName: "" });

// Material UI default style
const styles = (theme: Theme) => createStyles({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

interface ICountryDetails {
    countryDetailsList: any[],
    countryExtract: string,
    borderFullName: any[],
    loaded: boolean[],
    value: number,
    classes: any,
    allCountryName: string
}

function TabContainer(props: any) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

export const CountryDetails = withStyles(styles)(
    class extends React.Component<{}, ICountryDetails> {

        constructor(props: any) {
            super(props);
            this.state = {
                countryDetailsList: new Array(),
                countryExtract: "",
                borderFullName: [],
                // details, borderFullName, extract
                loaded: [false, false, false],
                value: 0,
                classes: props,
                allCountryName: ""
            }
        }

        public handleChange = (event: any, val: number) => {
            this.setState({ value: val });
        };

        public render() {
            const { classes } = this.state.classes;
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
                            <Tab label="Code / Domain" icon={<SettingsEthernet />} />
                        </Tabs>
                    </AppBar>
                    {this.state.countryDetailsList.map((country) => {
                        return (
                            <div key={country.alpha3Code}>
                                <Paper className={classes.root} elevation={4}>
                                    <Typography variant="headline" className="countryDetailsTitle" component="h2">
                                        {country.name}
                                        <a href={country.flag} target="_blank">
                                            <img className="countryFlag" src={country.flag} title={"Flag of " + country.name} alt={"Flag of " + country.name} />
                                        </a>
                                    </Typography>

                                    <Typography className="countryDescription" component="p">
                                        {this.state.countryExtract}
                                    </Typography>
                                    <CountryNameContext.Provider value={this.state}>
                                        <Gallery />
                                    </CountryNameContext.Provider>
                                </Paper>
                                {this.state.value === 0 &&
                                    <TabContainer>
                                        {this.renderGeneralInfoContent(country.population, country.capital, country.demonym, country.timezones, country.flag)}
                                    </TabContainer>
                                }
                                {this.state.value === 1 &&
                                    <TabContainer>
                                        {this.renderLocationContent(country.region, country.subregion, country.latlng, country.area, country.borders)}
                                    </TabContainer>
                                }
                                {this.state.value === 2 &&
                                    <TabContainer>
                                        {this.renderEconmonyContent(country.gini, country.currencies, country.regionalBlocs)}
                                    </TabContainer>
                                }
                                {this.state.value === 3 &&
                                    <TabContainer>
                                        {this.renderLanguagesNamesContent(country.name, country.altSpellings, country.nativeName, country.translations, country.languages)}
                                    </TabContainer>
                                }
                                {this.state.value === 4 &&
                                    <TabContainer>
                                        {this.renderCodeDomainContent(country.topLevelDomain, country.alpha2Code, country.alpha3Code, country.callingCodes, country.numericCode)}
                                    </TabContainer>
                                }
                            </div>
                        );
                    })}
                </div>
            );
        }

        public renderGeneralInfoContent(population: number, capital: string, demonym: string, timezones: string[], flag: string) {
            return (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>General Info</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <People /> Population (estimate):
                                </TableCell>
                                <TableCell> {this.numberWithCommas(population)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <LocationCity /> Capital:
                                </TableCell>
                                <TableCell> {capital.length > 0? capital: 'n/a'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Face /> Demonym:
                                </TableCell>
                                <TableCell> {demonym.length !== 0 ? demonym : "n/a"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <AccessTime /> Time Zone(s):
                                </TableCell>
                                <TableCell> {timezones.toString().split(',\s')}</TableCell>
                            </TableRow>                            
                        </TableBody>
                    </Table>
                </Paper>
            );
        }

        public renderLocationContent(region: string, subregion: string, latlng: number[], area: number, borders: string[]) {
            return (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Location, Area &amp; Borders</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Public /> Region:
                            </TableCell>
                                <TableCell> {region} &mdash; {subregion}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <PinDrop /> Geo coordinates:
                            </TableCell>
                                <TableCell> {latlng.length > 0 ? 'Lat: ' + latlng[0].toFixed(1) + ', Long: ' + latlng[1].toFixed(1) : "No data"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <ZoomOutMap /> Area:
                            </TableCell>
                                <TableCell> {this.numberWithCommas(area)} km<sup>2</sup></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <VerticalAlignCenter /> Country border(s):
                            </TableCell>
                                <TableCell> {borders.length > 0 ? this.state.borderFullName.toString().split(',\s') : "No Country Surrounded"}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            );
        }

        public renderEconmonyContent(gini: number, currencies: any[], regionalBlocs: any[]) {
            return (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Economy</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Timeline /> Gini Coefficient (%):
                            </TableCell>
                                <TableCell> {gini !== null ? gini : "No data"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <MonetizationOn /> Currencies:
                            </TableCell>
                                <TableCell component="th" scope="row">
                                    {currencies.map((v: any) => {
                                        {/* In case the server returns 'null' for currency symbol */ }
                                        const sym = (v.symbol !== null ? ' (' + v.symbol + ')' : "");
                                        return (
                                            <div key={v.code}>
                                                {v.name} &mdash; {v.code + ' ' + sym}
                                            </div>
                                        );
                                    })}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Group /> Regional Trade BLOCs:
                            </TableCell>
                                <TableCell component="th" scope="row">
                                    {regionalBlocs.length > 0 ? regionalBlocs.map((v: any) => {
                                        return (
                                            <div key={v.acronym}>
                                                <Assignment /> {v.acronym} &mdash; {v.name}
                                            </div>
                                        );
                                    }) : "None"}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            );
        }

        public renderLanguagesNamesContent(name: string, altSpellings: string[], nativeName: string, translations: any[], languages: any[]) {
            return (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Languages / Names</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Public /> Original / Official Name:
                            </TableCell>
                                <TableCell> {name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <GTranslate /> Also know as:
                            </TableCell>
                                <TableCell> {altSpellings.toString().split(',\s')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Comment /> Native people call their country:
                            </TableCell>
                                <TableCell> {nativeName.toString().split(',\s')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Language /> Language they speak:
                            </TableCell>
                                <TableCell component="th" scope="row">
                                    {languages.map(value => {
                                        return (
                                            <div key={value.iso639_1}>
                                                <Done /> {value.name}
                                            </div>
                                        );
                                    })}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            );
        }

        public renderCodeDomainContent(topLevelDomain: string[], alpha2Code: string, alpha3Code: string, callingCodes: string[], numericCode: string) {
            return (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Code / Domain</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Http /> Top Level Domain:
                            </TableCell>
                                <TableCell> {topLevelDomain.toString().length !== 0 ? topLevelDomain.toString().split(',\s') : "Not assigned yet"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Public /> ISO Code:
                            </TableCell>
                                <TableCell>
                                    <div> {" Alpha-2"} &mdash; {alpha2Code} </div>
                                    <div> {" Alpha-3"} &mdash; {alpha3Code} </div>
                                    <div> {"Numeric"} &mdash; {numericCode} </div>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Phone /> Calling Code:
                            </TableCell>
                                <TableCell component="th" scope="row">
                                    {callingCodes.map(value => {
                                        return (
                                            <div key={value}>
                                                {"+ " + value}
                                            </div>
                                        );
                                    })}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Paper>
            );
        }

        // Will be called if there is any component(s) updated for re-rendering
        public componentDidUpdate() {
            let temp = new Array();
            this.state.countryDetailsList.map(val => {
                temp = val.borders
            });
            // Stop calling the API if countries name for all alpha3codes are all received
            if (temp.length !== 0 && temp.length !== this.state.borderFullName.length && this.state.loaded) {
                this.getCountryFullNameArray(temp);
            }
            // Load extract if country detail list is loaded but have not loaded the extract
            if (this.state.countryDetailsList.length > 0 && !this.state.loaded[1]) {
                this.state.countryDetailsList.map(value => {
                    // Loading extract
                    this.getExtract(value.name);
                });
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
                        // alert(JSON.stringify(out));
                        const tempStr = JSON.stringify({ name: out.name, altSpellings: out.altSpellings })
                        this.setState({ countryDetailsList: output, allCountryName: tempStr });
                    } else {
                        // 404 Not result found error, but should not reach here
                        this.setState({ countryDetailsList: out.message });
                    }
                })
                .catch(err => alert('searchCountryDetails(): ' + err)
                );

        }

        public getExtract(countryName: string) {

            // Redirect: true - turn on to redirect automatically to content of synonyms
            const url = 'https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&exintro=1&explaintext=1&continue=&format=json&formatversion=2&redirects=1&titles=' + countryName.replace(' ', '_');
            fetch(url)
                .then(response => response.json())
                .then((out) => {
                    let extract = "";
                    // out.query.pages.extract cannot read length property
                    // alert(JSON.stringify(out));
                    if (out.query.pages !== undefined) {
                        out.query.pages.map((data: any) => {
                            if (data.extract.length > 0) {
                                extract = data.extract;
                            }
                        });
                    }
                    this.setState({
                        countryExtract: extract,
                        loaded: [this.state.loaded[0], !this.state.loaded[1], this.state.loaded[2]]
                    });
                })
                .catch(err => alert('getExtract(): ' + err)
                );
        }

    }
)
