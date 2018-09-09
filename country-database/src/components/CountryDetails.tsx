import * as React from 'react';
import { Redirect } from 'react-router';

import classnames from 'classnames';

import { optimizeCountryName } from "../CountryNameOptimization";

import {
    Card, CardActions, CardContent,
    CardHeader, ClickAwayListener,
    Collapse, Fade, IconButton,
    MenuItem, Paper, Typography
} from '@material-ui/core'

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GetApp from '@material-ui/icons/GetApp';

import { DetailsTables } from './DetailsTables';
import { Gallery } from './Gallery';
import { Header } from './Header';
import LoadingScreen from './LoadingScreen';

import { APP_TITLE, CContext, GContext, HContext } from '../AppData';

const styles = (theme: Theme) => createStyles({
    cardContainer: {
        padding: '50px 0',
    },
    card: {
        maxWidth: 1024,
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '5px',
        boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.4), 0px 4px 5px 0px rgba(0, 0, 0, 0.34), 0px 1px 10px 0px rgba(0, 0, 0, 0.32)',
        fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        margin: '0 auto',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    countryFlag: {
        verticalAlign: 'text-bottom',
        marginLeft: '10px',
        width: '50px',
        display: 'inline-block',
    },
    menu: {
        backgroundColor: 'rbga(255, 255, 255, 0.4)',
        top: 50,
        overflow: 'auto'
    },
    refProviderTxt: {
        fontSize: "14px",
        marginTop: '5px',
    },
    reftxt: {
        textAlign: 'right',
        padding: '10px',
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '11px',
    },
    extractContent: {
        textAlign: 'justify',
    },
});

interface ICard {
    backgroundImgUrl: string,
    countryDetailsList: any[],
    menuOpen: boolean,
    fadeChecked: boolean,
    dataGallery: string,
    dataHeader: string,
    extractContent: string,
    downloadBoxPosOffset: number,
    loaded: boolean[],
    /*
        index 0: pre-alpha 3 code
        index 1: current-alpha 3 code
    */
    alpha3Code: string,
    expanded: boolean,
    classes: any,
    apiError: boolean[],
}

export const CountryDetails = withStyles(styles)(
    class extends React.Component<{}, ICard> {
        constructor(props: any) {
            super(props);
            this.state = {
                backgroundImgUrl: "",
                countryDetailsList: [],
                menuOpen: false,
                fadeChecked: false,
                dataGallery: "",
                dataHeader: "",
                extractContent: "",
                downloadBoxPosOffset: 0,
                // details, borderFullName, extract
                loaded: [false, false, false],
                alpha3Code: props.match.params.alpha3Code.toUpperCase(),
                expanded: false,
                classes: props,
                /*
                    API Fetch error flag:
                    searchCountryDetails(): index 0
                    getCountryFullNameArray(): index 1
                    getExtract(): index 2
                */
                apiError: [false, false, false],
            }
            this.rewriteURI(props);
        }

        public toggleCardExpand = () => {
            this.setState(preState => ({ expanded: !preState.expanded }));
        };

        public toggleDownloadMenu = () => {
            this.setState(preState => ({
                menuOpen: !preState.menuOpen,
            }));
        };

        public closeDownloadMenu = () => {
            this.setState({
                menuOpen: false,
            });
        };

        public handleConfirmedDownload = () => {
            this.closeDownloadMenu();
            this.downloadTxtFile();
        }

        public setNewAlpha3Code = (newAlpha3Code: string) => {
            this.setState({
                alpha3Code: newAlpha3Code,
                apiError: [false, false, false],
                loaded: [false, false, false],
                countryDetailsList: [],
            });
        }

        public render() {
            const { classes } = this.state.classes;
            return (
                <div>
                    <HContext.Provider value={this.state.dataHeader}>
                        <Header getNewAlpha3Code={this.setNewAlpha3Code} />
                    </HContext.Provider>
                    {(this.state.apiError[0] || this.state.alpha3Code.length !== 3) ?
                        // Bad request, redirect to homepage
                        <Redirect to={'/'} />
                        :
                        // Loading extract content
                        <div className={classes.cardContainer}>
                            {/* Display loading spinner screen until the page is loaded. */}
                            {!this.state.loaded[2] && <LoadingScreen />}

                            {this.state.countryDetailsList.length > 0 && this.loadnRenderExtractCardContent()}
                        </div>
                    }
                </div>
            );
        }

        public loadnRenderExtractCardContent = () => {
            const extractContent = this.state.extractContent;
            const { classes } = this.state.classes;
            const menuOpen = this.state.menuOpen;
            return (
                <div>
                    {this.state.countryDetailsList.map(countryDetail => {
                        if (extractContent.length > 0) {
                            const extractBuf = extractContent.split('\n');
                            const extract = new Array();
                            let count = 0;
                            extractBuf.forEach((s, i) => {
                                // Filter out any empty element due to extra \n.
                                if (s.length > 0) {
                                    extract.push({ id: i, str: s });
                                }
                            });
                            return (
                                <Card
                                    id="card"
                                    key={countryDetail.alpha3Code}
                                    className={classes.card}
                                >
                                    <CardHeader
                                        avatar={
                                            <a href={countryDetail.flag} target="_blank">
                                                <img title={"Click to see the large version of this flag"} className={classes.countryFlag} src={countryDetail.flag} />
                                            </a>
                                        }
                                        action={
                                            <ClickAwayListener onClickAway={this.closeDownloadMenu}>
                                                <div>
                                                    <IconButton
                                                        onClick={this.toggleDownloadMenu}
                                                        aria-label="Download"
                                                    >
                                                        <GetApp />
                                                    </IconButton>
                                                    <Fade in={menuOpen} unmountOnExit={true}>
                                                        <Paper
                                                            style={{
                                                                position: 'absolute',
                                                                background: 'rgba(255, 255, 255, 0.7)',
                                                                right: this.state.downloadBoxPosOffset,
                                                            }}
                                                            onClick={this.handleConfirmedDownload}
                                                        >
                                                            <MenuItem>
                                                                Download country info as .txt file
                                                            </MenuItem>
                                                        </Paper>
                                                    </Fade>
                                                </div>
                                            </ClickAwayListener>
                                        }
                                        title={countryDetail.name}
                                        subheader={countryDetail.subregion.length > 0 ? "Country in " + countryDetail.subregion : ''}
                                    />
                                    <CardContent>
                                        <CContext.Provider value={JSON.stringify(this.state.countryDetailsList)}>
                                            <DetailsTables />
                                        </CContext.Provider>
                                        <GContext.Provider value={this.state.dataGallery}>
                                            <Gallery />
                                        </GContext.Provider>
                                        <div className={classes.reftxt}>
                                            Content provided by
                                            <div className={classes.refProviderTxt}>Wikipedia</div>
                                        </div>
                                        <Typography className={classes.extractContent} component="p">
                                            {extract[count++].str}
                                        </Typography>
                                    </CardContent>
                                    {extract.length > 1 &&
                                        <CardActions className={classes.actions} disableActionSpacing={true}>
                                            <IconButton
                                                className={classnames(classes.expand, {
                                                    [classes.expandOpen]: this.state.expanded,
                                                })}
                                                onClick={this.toggleCardExpand}
                                                aria-expanded={this.state.expanded}
                                                aria-label="Show more"
                                                title="Click to expand"
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                        </CardActions>
                                    }
                                    {extract.length > 1 &&
                                        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit={true}>
                                            <CardContent>
                                                <Typography className={classes.extractContent} paragraph={extract.length - 1 !== count}>
                                                    {extract[count++].str}
                                                </Typography>
                                                {extract.map((v: any, i: number) => {
                                                    // Not display the repeated contents
                                                    if (i >= count) {
                                                        return (
                                                            <Typography key={v.id} className={classes.extractContent} paragraph={extract.length - 1 !== i}>{v.str}</Typography>
                                                        );
                                                    } return
                                                })}
                                            </CardContent>
                                        </Collapse>
                                    }
                                </Card>
                            );
                        } else {
                            return;
                        }
                    })}
                </div>
            );
        }

        public rewriteURI = (props: any) => {
            // Rewrite URL parameter to upper case
            const alpha3CodeProps = props.match.params.alpha3Code;
            if (alpha3CodeProps !== alpha3CodeProps.toUpperCase() || alpha3CodeProps !== this.state.alpha3Code) {
                if (alpha3CodeProps.length === 3) {
                    props.history.push('/details/' + this.state.alpha3Code.toUpperCase());
                }
            }
        }

        public downloadBoxCssPosOffsetCal = () => {
            const cardEle: HTMLElement | null = document.getElementById('card');
            if (cardEle !== null) {
                if ((this.state.downloadBoxPosOffset) !== (window.innerWidth - cardEle.clientWidth) / 2) {
                    this.setState({
                        downloadBoxPosOffset: (window.innerWidth - cardEle.clientWidth) / 2,
                    });
                }
            }
        }

        public componentWillUnmount() {
            window.removeEventListener('resize', this.downloadBoxCssPosOffsetCal);
        }

        // Will be called if there is any component(s) updated for re-rendering
        public componentDidMount() {
            if (!this.state.loaded[0] && this.state.alpha3Code.length === 3) {
                this.searchCountryDetails(this.state.alpha3Code);
            }
            // Load extract if country detail list is loaded but have not loaded the extract
            if (this.state.countryDetailsList.length > 0 && !this.state.loaded[2]) {
                this.state.countryDetailsList.map(value => {
                    // Loading extract
                    this.getExtract(value.name);
                });
            }
            window.addEventListener('resize', this.downloadBoxCssPosOffsetCal);
        }

        public componentDidUpdate(props: any) {
            if (this.state.loaded[2]) {
                this.downloadBoxCssPosOffsetCal();
            }
            if (!this.state.loaded[0] && this.state.alpha3Code.length === 3) {
                this.searchCountryDetails(this.state.alpha3Code);
            }
            // Load extract if country detail list is loaded but have not loaded the extract
            if (this.state.countryDetailsList.length > 0 && !this.state.loaded[2]) {
                this.state.countryDetailsList.map(value => {
                    // Loading extract
                    this.getExtract(value.name);
                });
            }
            this.rewriteURI(props);
        }

        public downloadTxtFile = () => {
            const element = document.createElement('a');
            const file = new Blob([this.printNormalTxtFile(this.state.countryDetailsList)], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            let tempCountry = "";
            this.state.countryDetailsList.map((country: any) => {
                tempCountry = country.name;
            });
            element.download = tempCountry.replace(" ", "_") + ".txt";
            element.click();
        }

        public printNormalTxtFile = (countryDetailsList: any) => {
            let strOutput = "";
            countryDetailsList.map((country: any) => {
                strOutput += "\nDetails for " + country.name + ":\n\n";
                strOutput += "------- General Info -------\n\n";
                strOutput += "Population: " + country.population.toString() + "\n";
                strOutput += "Capital: ";
                strOutput += (country.capital.length > 0 ? country.capitial + "\n" : "n/a\n");
                strOutput += "Demonym: ";
                strOutput += (country.capital.length > 0 ? country.demonym + "\n" : "n/a\n");
                strOutput += "Time zone(s):\n\t" + country.timezones + "\n\n";
                strOutput += "------- Location, Area & Borders -------\n\n";
                strOutput += "Region: ";
                strOutput += country.region;
                strOutput += (country.subregion.length > 0 ? " - " + country.subregion + "\n" : "\n");
                strOutput += "Geo coordinates: ";
                strOutput += (country.latlng !== null ? country.latlng.toString() + "\n" : "No data\n");
                strOutput += "Area: ";
                strOutput += country.area !== null ? country.area + " sq km\n" : "No data\n";
                strOutput += "Country border(s): ";
                strOutput += (country.borders.length > 0 ? country.borders.toString() + "\n\n" : "No country surrounded\n\n");
                strOutput += "------- Economy -------\n\n";
                strOutput += "Gini Coefficient (%): ";
                strOutput += (country.gini !== null ? country.gini + "\n" : "No data\n");
                strOutput += "Currencies: \n";
                country.currencies.map((data: any) => {
                    if (data.name !== null) {
                        strOutput += "\t" + data.name + " " + (data.code !== null ? data.code + " " : '');
                        strOutput += (data.symbol !== null ? "(" + data.symbol + ")\n" : "\n");
                    }
                });
                strOutput += "Regional Trade BLOCs: \n"
                if (country.regionalBlocs.length > 0) {
                    country.regionalBlocs.map((data: any) => {
                        strOutput += "\t" + data.name + " (" + data.acronym + ")\n";
                    });
                } else {
                    strOutput += "\tNone\n";
                }
                strOutput += "\n------- Languages / Names -------\n\n";
                strOutput += "Original / Official Name: " + country.name + "\n";
                strOutput += "Also known as: ";
                strOutput += (country.altSpellings.length > 0 ? country.altSpellings + "\n" : "No other names\n");
                strOutput += "Native people call this country: " + country.nativeName + "\n";
                strOutput += "Language they speak: \n";
                country.languages.map((data: any) => {
                    strOutput += "\t" + data.name + "\n";
                })
                strOutput += "\n------- Code / Domain -------\n\n";
                strOutput += "Top Level Domain: ";
                strOutput += (country.topLevelDomain.length > 0 ? country.topLevelDomain.toString() + "\n" : "Not assigned yet\n");
                strOutput += "Calling code:";
                for (const i in country.callingCodes) {
                    if (country.callingCodes[0].length > 0) {
                        if (i === '0') {
                            strOutput += "\n";
                        }
                        strOutput += "\t+ " + country.callingCodes[i] + "\n";
                    } else {
                        strOutput += " Not assigned yet" + "\n";
                        break;
                    }
                }
                strOutput += "ISO code:\n";
                strOutput += "\tAlpha-2 -- " + country.alpha2Code + "\n";
                strOutput += "\tAlpha-3 -- " + country.alpha3Code + "\n";
                strOutput += "\tNumeric -- " + country.numericCode + "\n";
            });
            return strOutput;
        }

        public searchCountryDetails = (alpha3Code: string) => {
            /* Calling api from REST Countries website */
            const url = 'https://restcountries.eu/rest/v2/alpha/' + alpha3Code.toLowerCase();
            fetch(url)
                .then(response => response.json())
                .then((out) => {
                    const output = [out];
                    const nameTemp = out.name;
                    let borders = new Array();
                    output.map(value => {
                        value.name = optimizeCountryName(nameTemp, 'e');
                        borders = value.borders;
                    });
                    const dataGalleryStr = JSON.stringify({
                        name: optimizeCountryName(nameTemp, 'i'),
                        capital: out.capital
                    });
                    document.title = optimizeCountryName(nameTemp, 'e') + " | " + APP_TITLE;
                    this.setState({
                        countryDetailsList: output,
                        dataGallery: dataGalleryStr,
                        loaded: [true, this.state.loaded[1], this.state.loaded[2]]
                    });
                    if (borders.length > 0 && borders[0].length === 3) {
                        this.getCountryFullNameArray(borders);
                    }
                })
                .catch(err => {
                    if (!this.state.apiError[0]) {
                        this.setState({ apiError: [true, this.state.apiError[1], this.state.apiError[2]] });
                    }
                    return;
                });

        }

        public getCountryFullNameArray = async (countryArray: string[]) => {
            const tempArray = new Array();
            /* Calling api from REST Countries website */
            for (const i in countryArray) {
                if (countryArray.length >= 0) {
                    const url = 'https://restcountries.eu/rest/v2/alpha/' + countryArray[i] + '?fields=name';
                    await fetch(url)
                        .then(response => response.json())
                        .then((out) => {
                            if (out.status !== 404) {
                                tempArray.push(optimizeCountryName(out.name, 'e'));
                            } else {
                                // 404 Not result found error, but should not reach here
                                tempArray.push(out.message);
                            }
                        })
                        .catch(err => {
                            if (!this.state.apiError[1]) {
                                // alert('getCountryFullNameArray(): ' + err);
                                this.setState({ apiError: [this.state.apiError[0], true, this.state.apiError[2]] });
                            }
                            return;
                        });

                }
            }
            const tempCountryDetailsList = this.state.countryDetailsList;
            tempCountryDetailsList.map(value => {
                value.borders = tempArray;
            });
            this.setState(preState => ({
                countryDetailsList: tempCountryDetailsList,
                loaded: [preState.loaded[0], true, preState.loaded[2]]
            }));
        }

        public getExtract = (countryName: string) => {
            // Redirect: true - turn on to redirect automatically to content of synonyms
            const url = 'https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&exintro=1&explaintext=1&continue=&format=json&formatversion=2&redirects=1&titles=' + countryName.replace(' ', '_');
            fetch(url)
                .then(response => response.json())
                .then((out) => {
                    let extract = "";
                    // out.query.pages.extract cannot read length property
                    if (out.query.pages !== undefined) {
                        out.query.pages.map((data: any) => {
                            if (data.extract.length > 0) {
                                extract = data.extract;
                            }
                        });
                    }
                    const dataHeaderStr = JSON.stringify({
                        alpha3Code: this.state.alpha3Code,
                        name: countryName,
                        pageLoaded: this.state.loaded[2],
                    });
                    this.setState({
                        extractContent: extract,
                        dataHeader: dataHeaderStr,
                        loaded: [this.state.loaded[0], this.state.loaded[1], true]
                    });
                })
                .catch(err => {
                    if (!this.state.apiError[2]) {
                        // alert('getExtract(): ' + err);
                        this.setState(preState => ({ apiError: [preState.apiError[0], preState.apiError[1], true] }))
                    }
                    return;
                });
        }
    }
)
