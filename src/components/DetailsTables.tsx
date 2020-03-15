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
import { MIN_SCREEN_WIDTH } from "../AppConfig";
import { CContext } from "../AppContext";

// Material UI default style
const styles = (theme: Theme) => createStyles({
    reftxt: {
        textAlign: 'left',
        color: 'rgba(0, 0, 0, 0.54)',
        padding: '5px 0',
        fontSize: '11px',
    },
    refProviderTxt: {
        fontSize: '13px',
        display: 'inline-block',
        marginLeft: '3px',
    },
    // Override classes
    appBar: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
    },
    table: {
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: '15px 0',
    }
});

// Interface
interface ICountryDetails {
    tabValue: number,
    tabScrollable: boolean,
    classes: any,
    apiError: boolean,
}

const TabContainer = (props: any) => {
    return (
        <Typography component="div" style={{ padding: '10px 0' }}>
            {props.children}
        </Typography>
    );
}

const TableCellContainer = (props: any) => {
    return (
        <TableCell component="th" scope="row">
            <div style={{ display: 'table-row' }}>
                {props.children}
            </div>
        </TableCell>
    );
}

const TableCellText = (props: any) => {
    return (
        <span style={{ display: 'table-cell', paddingLeft: '5px' }}>
            {props.children}
        </span>
    );
}

export const DetailsTables = withStyles(styles)(

    class extends React.Component<{}, ICountryDetails> {
        constructor(props: any) {
            super(props);
            this.state = {
                tabValue: 0,
                tabScrollable: this.isTabsNeedScrolling(),
                classes: props,
                apiError: false
            }
        }

        public selectTab = (event: any, val: number) => {
            this.setState({ tabValue: val });
        }

        // Add commas for each thoudsand
        public numberWithCommas = (n: number) => {
            return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        public setTableScrollable = () => {
            this.setState({
                tabScrollable: this.isTabsNeedScrolling(),
            });
        }

        // Make the tab bar scrollable for small screen device
        public isTabsNeedScrolling = () => {
            return window.innerWidth < MIN_SCREEN_WIDTH;
        }

        // Re-set scrollable if window is resized
        public componentDidMount() {
            window.addEventListener('resize', this.setTableScrollable);
        }

        // Deregister the event listener when the component is being destroyed
        public componentWillUnmount() {
            window.removeEventListener('resize', this.setTableScrollable);
        }

        public render() {
            const { classes } = this.state.classes;
            return (
                <div>
                    <AppBar position="static" color="default" classes={{ root: classes.appBar }}>
                        <Tabs
                            value={this.state.tabValue}
                            onChange={this.selectTab}
                            scrollButtons="on"
                            indicatorColor="primary"
                            textColor="primary"
                            centered={!this.state.tabScrollable}
                            scrollable={this.state.tabScrollable}
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
                            return (countryDetailsList.length > 0 &&
                                <div>
                                    {countryDetailsList.map((country: any) => {
                                        return (
                                            <TabContainer key={country.alpha3Code}>
                                                <Paper classes={{ root: classes.table }}>
                                                    {this.state.tabValue === 0 && this.renderGeneralInfoTable(country.population, country.capital, country.demonym, country.timezones, country.flag)}
                                                    {this.state.tabValue === 1 && this.renderLocationTable(country.region, country.subregion, country.latlng, country.area, country.borders)}
                                                    {this.state.tabValue === 2 && this.renderEconmonyTable(country.gini, country.currencies, country.regionalBlocs)}
                                                    {this.state.tabValue === 3 && this.renderLanguagesNamesTable(country.name, country.altSpellings, country.nativeName, country.translations, country.languages)}
                                                    {this.state.tabValue === 4 && this.renderCodeDomainTable(country.topLevelDomain, country.alpha2Code, country.alpha3Code, country.callingCodes, country.numericCode)}
                                                </Paper>
                                                <div className={classes.reftxt}>
                                                    Data provided by
                                                    <div className={classes.refProviderTxt}>REST Countries</div>
                                                </div>
                                            </TabContainer>
                                        );
                                    })}
                                </div>
                            );
                        }}
                    </CContext.Consumer>
                </div>
            );
        }

        public renderGeneralInfoTable = (population: number, capital: string, demonym: string, timezones: string[], flag: string) => {
            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>General Info</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCellContainer>
                                <People className="material-ui-icon" />
                                <TableCellText>
                                    Population (estimate):
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {this.numberWithCommas(population)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <LocationCity className="material-ui-icon" />
                                <TableCellText>
                                    Capital:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {capital.length > 0 ? capital : 'n/a'}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <Face className="material-ui-icon" />
                                <TableCellText>
                                    Demonym:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {demonym.length !== 0 ? demonym : "n/a"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <AccessTime className="material-ui-icon" />
                                <TableCellText>
                                    Time zone(s):
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {timezones.toString().toString().replace(/,/g, ', ')}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            );
        }

        public renderLocationTable = (region: string, subregion: string, latlng: number[], area: number, borders: string[]) => {
            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Location, Area &amp; Borders</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCellContainer>
                                <Public className="material-ui-icon" />
                                <TableCellText>
                                    Region:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell>
                                {region.length > 0 ?
                                    (region +
                                        (subregion.length > 0 ?
                                            " — " + subregion
                                            :
                                            ""
                                        )
                                    )
                                    :
                                    "No data"
                                }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <PinDrop className="material-ui-icon" />
                                <TableCellText>
                                    Geo coordinates:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {latlng.length > 0 ? 'Lat: ' + latlng[0].toFixed(1) + ', Long: ' + latlng[1].toFixed(1) : "No data"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <ZoomOutMap className="material-ui-icon" />
                                <TableCellText>
                                    Area:
                                 </TableCellText>
                            </TableCellContainer>
                            {area !== null ? <TableCell>{this.numberWithCommas(area) + " km"}<sup>2</sup></TableCell> : <TableCell>No data</TableCell>}
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <VerticalAlignCenter className="material-ui-icon" />
                                <TableCellText>
                                    Country border(s):
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {borders.length > 0 ? borders.toString().replace(/,/g, ', ') : "No country surrounded"}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            );
        }

        public renderEconmonyTable = (gini: number, currencies: any[], regionalBlocs: any[]) => {
            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Economy</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCellContainer>
                                <Timeline className="material-ui-icon" />
                                <TableCellText>
                                    Gini Coefficient (%):
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {gini !== null ? gini : "No data"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <MonetizationOn className="material-ui-icon" />
                                <TableCellText>
                                    Currencies:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCellContainer>
                                {currencies.map((v: any) => {
                                    {/* In case the server returns 'null' for currency symbol */ }
                                    const sym = (v.symbol !== null ? ' (' + v.symbol + ')' : "");
                                    return (
                                        <div key={v.code}>
                                            {v.name} &mdash; {(v.code !== null ? v.code + ' ' : '') + sym}
                                        </div>
                                    );
                                })}
                            </TableCellContainer>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <Group className="material-ui-icon" />
                                <TableCellText>
                                    Regional Trade BLOCs:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCellContainer>
                                {regionalBlocs.length > 0 ? regionalBlocs.map((v: any) => {
                                    return (
                                        <div key={v.acronym}>
                                            <Assignment className="material-ui-icon" /> {v.acronym} &mdash; {v.name}
                                        </div>
                                    );
                                }) : "None"}
                            </TableCellContainer>
                        </TableRow>
                    </TableBody>
                </Table>
            );
        }

        public renderLanguagesNamesTable = (name: string, altSpellings: string[], nativeName: string, translations: any[], languages: any[]) => {
            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Languages / Names</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCellContainer>
                                <Public className="material-ui-icon" />
                                <TableCellText>
                                    Original / Official Name:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <GTranslate className="material-ui-icon" />
                                <TableCellText>
                                    Also know as:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {altSpellings.toString().replace(/,/g, ', ')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <Comment className="material-ui-icon" />
                                <TableCellText>
                                    Native people call their country:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {nativeName.toString().replace(/,/g, ', ')}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <Language className="material-ui-icon" />
                                <TableCellText>
                                    Language they speak:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCellContainer>
                                {languages.map(value => {
                                    return (
                                        <div key={value.iso639_1}>
                                            <Done className="material-ui-icon" /> {value.name}
                                        </div>
                                    );
                                })}
                            </TableCellContainer>
                        </TableRow>
                    </TableBody>
                </Table>
            );
        }

        public renderCodeDomainTable = (topLevelDomain: string[], alpha2Code: string, alpha3Code: string, callingCodes: string[], numericCode: string) => {
            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Code / Domain</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCellContainer>
                                <Http className="material-ui-icon" />
                                <TableCellText>
                                    Top Level Domain:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell> {topLevelDomain.toString().length !== 0 ? topLevelDomain.toString().split(',\s') : "Not assigned yet"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <Phone className="material-ui-icon" />
                                <TableCellText>
                                    Calling Code:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCellContainer>
                                {callingCodes[0].length > 0 ?
                                    callingCodes.map(value => {
                                        return (
                                            <div key={value}>
                                                {"+ " + value}
                                            </div>
                                        );
                                    })
                                    :
                                    'Not assigned yet'
                                }
                            </TableCellContainer>
                        </TableRow>
                        <TableRow>
                            <TableCellContainer>
                                <Public className="material-ui-icon" />
                                <TableCellText>
                                    ISO Code:
                                </TableCellText>
                            </TableCellContainer>
                            <TableCell>
                                <div> {"Alpha-2"} &mdash; {alpha2Code} </div>
                                <div> {"Alpha-3"} &mdash; {alpha3Code} </div>
                                <div> {"Numeric"} &mdash; {numericCode} </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            );
        }

    }
)
