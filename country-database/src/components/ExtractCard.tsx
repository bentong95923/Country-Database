import * as React from 'react';
import { Redirect } from 'react-router';

import classnames from 'classnames';

import { optimizeCountryName } from "../CountryNameOptimization";

import Card from '@material-ui/core/Card';

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ShareIcon from '@material-ui/icons/Share';

import { DetailsTables } from './DetailsTables';
import { Gallery } from './Gallery';
import LoadingScreen from './LoadingScreen';

export const CContext = React.createContext("");
export const GContext = React.createContext("");

const styles = (theme: Theme) => createStyles({
    card: {
        maxWidth: 1024,
        margin: 'auto',
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
    wikiText: {
        margin: '30px 20px auto auto',
        color: 'rgba(0, 0, 0, 0.54)',
    },
    extractContent: {
        textAlign: 'justify',
    },
});

interface ICard {
    countryDetailsList: any[],
    dataGallery: string,
    extractContent: string,
    loaded: boolean[],
    alpha3Code: string,
    expanded: boolean,
    classes: any,
    apiError: boolean[],
}

export const ExtractCard = withStyles(styles)(
    class extends React.Component<{}, ICard> {
        constructor(props: any) {
            super(props);
            this.state = {
                countryDetailsList: [],
                dataGallery: "",
                extractContent: "",
                // details, borderFullName, extract
                loaded: [false, false, false],
                alpha3Code: props.match.params.alpha3Code,
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
            // Rewrite URL parameter to upper case
            if (props.match.params.alpha3Code.length === 3) {
                props.history.push('/details/' + props.match.params.alpha3Code.toUpperCase());
            }
        }

        public handleExpandClick = () => {
            this.setState(preState => ({ expanded: !preState.expanded }));
        };

        public render() {
            if (this.state.apiError[0] || this.state.alpha3Code.length !== 3) {
                // Bad request, redirect to homepage
                return <Redirect to={'/'} />;
            } else {
                if (this.state.countryDetailsList.length > 0) {
                    // // Loading extract
                    return (
                        <div>
                            {this.renderLoadingSpinner()}
                            {this.renderExtractCardContent()}
                        </div>
                    );
                } else {
                    // Loading contryDetailsList
                    return (
                        <div>
                            {this.renderLoadingSpinner()}
                        </div>
                    );

                }
            }
        }

        public renderLoadingSpinner = () => {
            return (
                <div>
                    {!this.state.loaded[2] && <LoadingScreen />}
                </div>
            );
        }

        public renderExtractCardContent = () => {
            const extractContent = this.state.extractContent;
            const { classes } = this.state.classes;
            return (
                <div>
                    {this.state.countryDetailsList.map(countryDetail => {
                        if (extractContent.length <= 0) {
                            if (!this.state.loaded[2]) {
                                this.getExtract(countryDetail.name)
                            }
                            return;
                        } else {
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
                                <Card key={countryDetail.alpha3Code} className={classes.card}>
                                    <CardHeader
                                        avatar={
                                            <a href={countryDetail.flag} target="_blank">
                                                <img title={"Click to see the large version of this flag"} className={classes.countryFlag} src={countryDetail.flag} />
                                            </a>
                                        }
                                        action={
                                            <Typography className={classes.wikiText}>
                                                From: <br />Wikipedia<br />REST Countries
                                            </Typography>
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
                                        <Typography className={classes.extractContent} component="p">
                                            {extract[count++].str}
                                        </Typography>
                                    </CardContent>
                                    {extract.length > 1 ?
                                        <CardActions className={classes.actions} disableActionSpacing={true}>
                                            <IconButton
                                                onClick={this.downloadTxtFile}
                                                aria-label="Share"
                                            >
                                                <ShareIcon />
                                            </IconButton>
                                            <IconButton
                                                className={classnames(classes.expand, {
                                                    [classes.expandOpen]: this.state.expanded,
                                                })}
                                                onClick={this.handleExpandClick}
                                                aria-expanded={this.state.expanded}
                                                aria-label="Show more"
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                        </CardActions>
                                        : ''}
                                    {extract.length > 1 ?
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
                                        : ''}
                                </Card>
                            );
                        }
                    })}
                </div>
            );
        }

        public componentWillMount() {
            if (!this.state.loaded[0] && this.state.alpha3Code.length === 3) {
                this.searchCountryDetails(this.state.alpha3Code);
            }
        }

        // Will be called if there is any component(s) updated for re-rendering
        public componentDidUpdate() {
            if (!this.state.loaded[1]) {
                let temp = new Array();
                this.state.countryDetailsList.map(val => {
                    temp = val.borders
                });
                // Stop calling the API if countries name for all alpha3codes are all received
                if (temp.length !== 0 && temp[0].length === 3) {
                    this.getCountryFullNameArray(temp);
                }
            }
            // Load extract if country detail list is loaded but have not loaded the extract
            if (this.state.countryDetailsList.length > 0 && !this.state.loaded[2]) {
                this.state.countryDetailsList.map(value => {
                    // Loading extract
                    this.getExtract(value.name);
                });
            }
        }

        public downloadTxtFile = () => {
            const element = document.createElement('a');

            const file = new Blob([this.printNormalTxtFile(this.state.countryDetailsList)], { type: 'text/plain' });
            element.href = URL.createObjectURL(file);
            element.download = "Details.txt";
            element.click();
        }

        public printNormalTxtFile = (countryDetailsList: any) => {
            let strOutput = "";
            countryDetailsList.map((country: any) => {
                strOutput += "\nDetails for " + country.name + ":\n\n";
                strOutput += "------- General Info -------\n\n";
                strOutput += "Population: " + country.population.toString() + "\n";
                strOutput += "Capital: ";
                country.capital.length > 0 ? strOutput += country.capitial + "\n" : strOutput += "n/a\n";
                strOutput += "Demonym: ";
                country.capital.length > 0 ? strOutput += country.demonym + "\n" : strOutput += "n/a\n";
                strOutput += "Time zone(s):\n\t" + country.timezones + "\n\n";
                strOutput += "------- Location, Area & Borders -------\n\n";
                strOutput += "Region: ";
                strOutput += country.region;
                country.subregion.length > 0 ? strOutput += " - " + country.subregion + "\n" : strOutput += "\n";
                strOutput += "Geo coordinates: " + country.latlng.toString() + "\n";
                strOutput += "Area: " + country.area.toString() + " sq km\n";
                strOutput += "Country border(s): ";
                country.borders.length > 0 ? strOutput += country.borders.toString() + "\n\n" : strOutput += "No country surrounded\n\n";
                strOutput += "------- Economy -------\n\n";
                strOutput += "Gini Coefficient (%): ";
                country.gini !== null ? strOutput += (country.gini.length > 0 ? strOutput += country.gini + "No data\n" : strOutput) : strOutput += "n/a\n";
                strOutput += "Currencies: \n";
                country.currencies.map((data: any) => {
                    strOutput += "\t" + data.name + " " + data.code;
                    data.symbol !== null ? strOutput += " (" + data.symbol + ")\n" : strOutput += "\n";
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
                country.altSpellings.length > 0 ? strOutput += country.altSpellings + "\n" : strOutput += "No other names\n";
                strOutput += "Native people call this country: " + country.nativeName + "\n";
                strOutput += "Language they speak: \n";
                country.languages.map((data: any) => {
                    strOutput += "\t"+data.name+"\n";
                })
                strOutput += "\n\n------- Code / Domain -------\n\n";
                strOutput += "Top Level Domain: ";
                country.topLevelDomain.length > 0 ? strOutput += country.topLevelDomain.toString() + "\n" : strOutput += "Not assigned yet\n";
                strOutput += "ISO code:\n";
                strOutput += "\tAlpha-2 -- " + country.alpha2Code + "\n";
                strOutput += "\tAlpha-3 -- " + country.alpha3Code + "\n";
                strOutput += "\tNumeric -- " + country.numericCode + "\n";
                strOutput += "Calling code: " + "+ " + country.callingCodes + "\n";
            });
            alert(strOutput);
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
                    output.map(value => {
                        value.name = optimizeCountryName(nameTemp, 'e');
                    });
                    const dataGalleryStr = JSON.stringify({
                        name: optimizeCountryName(nameTemp, 'i'),
                        capital: out.capital
                    });
                    this.setState({
                        countryDetailsList: output,
                        dataGallery: dataGalleryStr,
                        loaded: [true, this.state.loaded[1], this.state.loaded[2]]
                    });
                })
                .catch(err => {
                    if (!this.state.apiError[0]) {
                        // alert('searchCountryDetails(): ' + err);
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
            this.setState({ countryDetailsList: tempCountryDetailsList, loaded: [this.state.loaded[0], true, this.state.loaded[2]] });
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
                    this.setState({
                        extractContent: extract,
                        loaded: [this.state.loaded[0], this.state.loaded[1], true]
                    });
                })
                .catch(err => {
                    if (!this.state.apiError[2]) {
                        // alert('getExtract(): ' + err);
                        this.setState({ apiError: [this.state.apiError[0], this.state.apiError[1], true] })
                    }
                    return;
                });
        }
    }
)
