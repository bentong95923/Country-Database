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
import Map from '@material-ui/icons/Map';

import { Helmet } from 'react-helmet';
import { DetailsTables } from './DetailsTables';
import { Gallery } from './Gallery';
import { Header } from './Header';
import { LoadingLogo } from './LoadingLogo';

import { API_KEY_GOOGLE } from '../ApiKey';
import { APP_TITLE, URI_NAME_DETAILS } from '../AppConfig';
import { CContext, HContext } from '../AppContext';
import { SEOImage } from '../AppSEO';

// Styling
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
    expandExtract: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandMap: {
        marginRight: 'auto',
        marginLeft: -15,
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
    // Google map iframe
    map: {
        display: 'block',
        margin: '0 auto',
        width: '100%',
        height: '400px',
        border: 0
    },
    refProviderTxt: {
        fontSize: '13px',
        display: 'inline-block',
        marginLeft: '3px',
    },
    reftxt: {
        textAlign: 'right',
        padding: '10px',
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '11px',
    },
    extractContent: {
        textAlign: 'justify',
        margin: '10px 0',
    },
});

// Interface
interface ICard {
    // Background image URL
    backgroundImgUrl: string,
    countryDetailsList: any[],
    // Download menu toggle
    menuOpen: boolean,
    // Fade toggle
    fadeChecked: boolean,
    /*
        Stringified JSON data for Gallery
        Property: name, capital
    */
    dataGallery: string,
    /* 
        Stringified JSON data for Header
        Property: alpha3Code, name, pageLoaded
    */
    dataHeader: string,
    // Extract content from Wikipedia
    extractContent: string,
    // Offset position of download menu
    downloadBoxPosOffset: number,
    // Flag indicates if APIs are loaded.
    loaded: boolean[],
    // Current country's alpha 3 code
    alpha3Code: string,
    // Toggle expansion of content: 0 - extract, 1 - map
    expanded: boolean[],
    // Material UI style classes
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
                // APIs: details, borderFullName, extract, gallery
                loaded: [false, false, false, false],
                alpha3Code: props.match.params.alpha3Code.toUpperCase(),
                // extract, map
                expanded: [false, false],
                classes: props,
                /*
                    API Fetch error flag:
                    searchCountryDetails(): index 0
                    getCountryFullNameArray(): index 1
                    getExtract(): index 2
                */
                apiError: [false, false, false],
            }
            // Rewrite url when user inputs new country or convert the alpha 3 code to upper case if user did query via url.
            this.rewriteURI(props);
        }

        public toggleCardExpand = (item: number) => (event: any) => {
            switch (item) {
                case 0:
                    this.setState(preState => ({
                        expanded: [!preState.expanded[0], preState.expanded[1]]
                    }));
                    break;
                case 1:
                    this.setState(preState => ({
                        expanded: [preState.expanded[0], !preState.expanded[1]]
                    }));
                    break;
                default:
                    break;
            }
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

        // Clear previous state value
        public setNewAlpha3Code = (newAlpha3Code: string) => {
            this.setState({
                alpha3Code: newAlpha3Code,
                apiError: [false, false, false],
                loaded: [false, false, false, false],
                expanded: [false, false],
                countryDetailsList: [],
            });
        }

        public setGalleryLoaded = (isGalleryLoaded: boolean) => {
            this.setState(preState => ({
                loaded: [preState.loaded[0], preState.loaded[1], preState.loaded[2], isGalleryLoaded]
            }));
        }

        public render() {
            const { classes } = this.state.classes;
            let pageTitle = APP_TITLE;
            if (this.state.countryDetailsList.length > 0) {
                this.state.countryDetailsList.forEach(value => {
                    pageTitle = value.name + " | " + APP_TITLE;
                });
            }
            return (
                <>
                    <Helmet>
                        {/* <!-- Google / Search Engine Tags --> */}
                        <meta itemProp="name" content={APP_TITLE} />
                        <meta
                            itemProp="description"
                            content={this.state.extractContent}
                        />
                        <meta
                            itemProp="image"
                            content={SEOImage}
                        />
                        <title>{pageTitle}</title>
                    </Helmet>
                <div>
                    {/* Display loading spinner screen until the page is loaded. */}
                    {!this.state.loaded[3] && <LoadingLogo />}
                    <HContext.Provider value={this.state.dataHeader}>
                        <Header getNewAlpha3Code={this.setNewAlpha3Code} />
                    </HContext.Provider>
                    <span
                        style={{
                            visibility: !this.state.loaded[3] ? 'hidden' : 'visible',
                        }}
                    >
                        {(this.state.apiError[0] || this.state.alpha3Code.length !== 3) ?
                            // Bad request, redirect to not found page
                            <Redirect to={'/404/'} />
                            :
                            // Loading extract content
                            <div className={classes.cardContainer}>
                                {(this.state.countryDetailsList.length > 0 && this.state.extractContent.length > 0) && this.loadnRenderExtractCardContent()}
                            </div>
                        }
                    </span>
                    </div>
                    </>
            );
        }

        public loadnRenderExtractCardContent = () => {
            const { classes } = this.state.classes;
            const menuOpen = this.state.menuOpen;
            const extractContent = this.state.extractContent;
            const extractBuf = extractContent.split('\n');
            const extract = new Array();
            extractBuf.forEach((s, i) => {
                // Filter out any empty element due to extra \n.
                if (s.length > 0) {
                    // Assign id for each paragraph
                    extract.push({ id: i, str: s });
                }
            });
            return (
                <div>
                    {this.state.countryDetailsList.map(countryDetail => {
                        let count = 0;
                        return (
                            <Card
                                id="card"
                                key={countryDetail.alpha3Code}
                                className={classes.card}
                            >
                                <CardHeader
                                    avatar={
                                        <a rel="nofollow" href={countryDetail.flag} target="_blank">
                                            <img title={"Click to see the large version of this flag"} className={classes.countryFlag} src={countryDetail.flag} />
                                        </a>
                                    }
                                    action={
                                        this.state.loaded[1] &&
                                        <ClickAwayListener onClickAway={this.closeDownloadMenu}>
                                            <div>
                                                <IconButton onClick={this.toggleDownloadMenu} aria-label="Download">
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
                                    {this.state.dataGallery.length > 0 &&
                                        <Gallery data={this.state.dataGallery} getFinishLoading={this.setGalleryLoaded} />
                                    }
                                    <IconButton
                                        className={classes.expandMap}
                                        onClick={this.toggleCardExpand(1)}
                                        aria-expanded={this.state.expanded[1]}
                                        aria-label="Show more"
                                        title={(!this.state.expanded[1] ? "Show" : "Hide") + " map"}
                                    >
                                        <Map />
                                    </IconButton>
                                    <Collapse in={this.state.expanded[1]} timeout="auto" unmountOnExit={true}>
                                        <CardContent>
                                            {this.loadMap(countryDetail.name)}
                                        </CardContent>
                                    </Collapse>
                                    <Typography className={classes.extractContent} component="p">
                                        {extract[count++].str}
                                    </Typography>
                                </CardContent>
                                <CardActions className={classes.actions} disableActionSpacing={true}>
                                    <div className={classes.reftxt}>
                                        Content provided by
                                            <div className={classes.refProviderTxt}>Wikipedia</div>
                                    </div>
                                    {extract.length > 1 &&
                                        <IconButton
                                            className={classnames(classes.expandExtract, {
                                                [classes.expandOpen]: this.state.expanded[0],
                                            })}
                                            onClick={this.toggleCardExpand(0)}
                                            aria-expanded={this.state.expanded[0]}
                                            aria-label="Show more"
                                            title={(!this.state.expanded[0] ? "Expand" : "Hide") + " content"}
                                        >
                                            <ExpandMoreIcon />
                                        </IconButton>
                                    }
                                </CardActions>
                                {extract.length > 1 &&
                                    <Collapse in={this.state.expanded[0]} timeout="auto" unmountOnExit={true}>
                                        <CardContent>
                                            <Typography className={classes.extractContent} paragraph={extract.length - 1 !== count}>
                                                {extract[count++].str}
                                            </Typography>
                                            {extract.map((v: any, i: number) => {
                                                // Not display the repeated contents
                                                return (i >= count &&
                                                    <Typography key={v.id} className={classes.extractContent} paragraph={extract.length - 1 !== i}>{v.str}</Typography>
                                                );
                                            })}
                                        </CardContent>
                                    </Collapse>
                                }
                            </Card>
                        );
                    })}
                </div>
            );
        }

        public loadMap = (name: string) => {
            const { classes } = this.state.classes;
            let keywords = "";
            // Fix: google map cannot find South Sudan with "(country" token
            if (name === "South Sudan") {
                keywords = name;
            } else {
                keywords = name + " (country)";
            }
            return (
                <iframe
                    className={classes.map}
                    frameBorder={"0"}
                    src={"https://www.google.com/maps/embed/v1/place?key=" + API_KEY_GOOGLE + "&q=" + encodeURI(keywords)}
                    allowFullScreen={true}
                />
            );
        }

        public rewriteURI = (props: any) => {
            // Rewrite URL parameter to upper case
            const alpha3CodeProps = props.match.params.alpha3Code;
            if (alpha3CodeProps !== alpha3CodeProps.toUpperCase() || alpha3CodeProps !== this.state.alpha3Code) {
                if (alpha3CodeProps.length === 3) {
                    props.history.push("/" + URI_NAME_DETAILS + "/" + this.state.alpha3Code.toUpperCase() + "/");
                }
            }
        }

        public downloadBoxCssPosOffsetCal = () => {
            // Get card element
            const cardEle: HTMLElement | null = document.getElementById('card');
            if (cardEle !== null) {
                // Apply offset to the download menu
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
            element.download = this.state.alpha3Code + ".txt";
            element.click();
        }

        public printNormalTxtFile = (countryDetailsList: any) => {
            let strOutput = "";
            countryDetailsList.map((country: any) => {
                strOutput += "Details for " + country.name + ":\n\n";
                strOutput += "------- General Info -------\n\n";
                strOutput += "Population: " + country.population.toString() + "\n";
                strOutput += "Capital: ";
                strOutput += (country.capital.length > 0 ? country.capital + "\n" : "n/a\n");
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
                    // Store the response received from the server
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
                    // // Set title
                    // document.title = optimizeCountryName(nameTemp, 'e') + " | " + APP_TITLE;
                    this.setState(preState => ({
                        countryDetailsList: output,
                        dataGallery: dataGalleryStr,
                        loaded: [true, preState.loaded[1], preState.loaded[2], preState.loaded[3]]
                    }));
                    /*
                        As the format of country borders received from the server is alpha 3 code,
                        it is needed to be converted into country name
                    */
                    if (borders.length > 0 && borders[0].length === 3) {
                        this.getCountryFullNameArray(borders);
                    } else {
                        this.setState(preState => ({
                            loaded: [preState.loaded[0], true, preState.loaded[2], preState.loaded[3]]
                        }));
                    }
                })
                .catch(err => {
                    if (!this.state.apiError[0]) {
                        this.setState(preState => ({
                            apiError: [true, preState.apiError[1], preState.apiError[2]]
                        }));
                    }
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
                                tempArray.push(optimizeCountryName(out.name, 'e').replace(" (", "("));
                            } else {
                                // 404 Not result found error, but should not reach here
                                tempArray.push(out.message);
                            }
                        })
                        .catch(err => {
                            if (!this.state.apiError[1]) {
                                this.setState(preState => ({
                                    apiError: [preState.apiError[0], true, preState.apiError[2]]
                                }));
                            }
                        });
                }
            }
            const tempCountryDetailsList = this.state.countryDetailsList;
            tempCountryDetailsList.map(value => {
                value.borders = tempArray;
            });
            this.setState(preState => ({
                countryDetailsList: tempCountryDetailsList,
                loaded: [preState.loaded[0], true, preState.loaded[2], preState.loaded[3]]
            }));
        }

        public getExtract = (countryName: string) => {
            // Redirect: true - turn on to redirect automatically to content of synonyms
            const url = 'https://en.wikipedia.org/w/api.php?origin=*&action=query&prop=extracts&exintro=1&explaintext=1&continue=&format=json&formatversion=2&redirects=1&titles=' + countryName.replace(' ', '_');
            fetch(url)
                .then(response => response.json())
                .then((out) => {
                    let extract = "";
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
                    });
                    this.setState(preState => ({
                        extractContent: extract,
                        dataHeader: dataHeaderStr,
                        loaded: [preState.loaded[0], preState.loaded[1], true, preState.loaded[3]]
                    }));
                })
                .catch(err => {
                    if (!this.state.apiError[2]) {
                        this.setState(preState => ({ apiError: [preState.apiError[0], preState.apiError[1], true] }))
                    }
                });
        }
    }
)
