import * as React from "react";

import {
    AppBar, Paper, Tab,
    Table, TableBody,
    TableCell, TableHead,
    TableRow, Tabs, Typography
} from '@material-ui/core';

import {
    AccessTime, Assignment, Comment,
    Done, EuroSymbol, Face,
    Group, GTranslate, Http,
    Info, Language, LocationCity,
    MonetizationOn, People,
    Phone, PinDrop, Place,
    Public, SettingsEthernet,
    Timeline, Translate,
    VerticalAlignCenter, ZoomOutMap
} from '@material-ui/icons';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import { CContext } from "./ExtractCard";

// Material UI default style
const styles = (theme: Theme) => createStyles({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

interface ICountryDetails {
    tabValue: number,
    classes: any,
    apiError: boolean
}

const TabContainer = (props: any) => {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

export const DetailsTables = withStyles(styles)(

    class extends React.Component<{}, ICountryDetails> {
        constructor(props: any) {
            super(props);
            this.state = {
                tabValue: 0,
                classes: props,
                apiError: false
            }
        }

        public handleChange = (event: any, val: number) => {
            this.setState({ tabValue: val });
        };

        public render() {
            return (
                <div>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={this.state.tabValue}
                            onChange={this.handleChange}
                            scrollButtons="on"
                            indicatorColor="primary"
                            textColor="primary"
                            centered={true}
                        >
                            <Tab icon={<Info />} title="General Info" />
                            <Tab icon={<Place />} title="Location, Area &amp; Borders" />
                            <Tab icon={<EuroSymbol />} title="Economy" />
                            <Tab icon={<Translate />} title="Languages / Names" />
                            <Tab icon={<SettingsEthernet />} title="Code / Domain" />
                        </Tabs>
                    </AppBar>
                    <CContext.Consumer>
                        {dataCountryDetails => {
                            const countryDetailsList = JSON.parse(dataCountryDetails);
                            if (countryDetailsList.length > 0) {
                                return (
                                    <div>
                                        {countryDetailsList.map((country: any) => {
                                            return (
                                                <div key={country.alpha3Code}>
                                                    {this.state.tabValue === 0 &&
                                                        <TabContainer>
                                                            {this.renderGeneralInfoContent(country.population, country.capital, country.demonym, country.timezones, country.flag)}
                                                        </TabContainer>
                                                    }
                                                    {this.state.tabValue === 1 &&
                                                        <TabContainer>
                                                            {this.renderLocationContent(country.region, country.subregion, country.latlng, country.area, country.borders)}
                                                        </TabContainer>
                                                    }
                                                    {this.state.tabValue === 2 &&
                                                        <TabContainer>
                                                            {this.renderEconmonyContent(country.gini, country.currencies, country.regionalBlocs)}
                                                        </TabContainer>
                                                    }
                                                    {this.state.tabValue === 3 &&
                                                        <TabContainer>
                                                            {this.renderLanguagesNamesContent(country.name, country.altSpellings, country.nativeName, country.translations, country.languages)}
                                                        </TabContainer>
                                                    }
                                                    {this.state.tabValue === 4 &&
                                                        <TabContainer>
                                                            {this.renderCodeDomainContent(country.topLevelDomain, country.alpha2Code, country.alpha3Code, country.callingCodes, country.numericCode)}
                                                        </TabContainer>
                                                    }
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            } else {
                                return "dataCountryDetails is empty.";
                            }
                        }}
                    </CContext.Consumer>
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
                                <TableCell> {capital.length > 0 ? capital : 'n/a'}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Face /> Demonym:
                                </TableCell>
                                <TableCell> {demonym.length !== 0 ? demonym : "n/a"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <AccessTime /> Time zone(s):
                                </TableCell>
                                <TableCell> {timezones.toString().toString().replace(/,/g, ', ')}</TableCell>
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
                                {area !== null ? <TableCell>{this.numberWithCommas(area) + " km"}<sup>2</sup></TableCell> : <TableCell>No data</TableCell>}
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <VerticalAlignCenter /> Country border(s):
                            </TableCell>
                                <TableCell> {borders.length > 0 ? borders.toString().replace(/,/g, ', ') : "No Country Surrounded"}</TableCell>
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
                                <TableCell> {altSpellings.toString().replace(/,/g, ', ')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    <Comment /> Native people call their country:
                            </TableCell>
                                <TableCell> {nativeName.toString().replace(/,/g, ', ')}</TableCell>
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
                                    <div> {"Alpha-2"} &mdash; {alpha2Code} </div>
                                    <div> {"Alpha-3"} &mdash; {alpha3Code} </div>
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

        // Add commas for each thoudsand
        public numberWithCommas = (n: number) => {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    }
)
