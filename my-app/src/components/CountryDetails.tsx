import * as React from "react";
/*
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
*/
/* 
    Curely brace import only work if, in this case, CContext
    contains a named export called CContext.
*/
import {CContext} from "./FirstComponent";

interface ICountryDetails {
    countryDetailsList: any[],
    open: boolean
}

export default class CountryDetails extends React.Component<{}, ICountryDetails> {

    constructor(props: any) {
        super(props);
        this.state = {
            countryDetailsList: [],
            open: false
        }
        this.handleClick = this.handleClick.bind(this);
    }

    public handleClick(event: any) {
        this.setState((prevState) => ({
            countryDetailsList: this.state.countryDetailsList,
            open: !prevState.open
        }));  
    }

    public render() {
        return (
            <div className="centreText">                
                {/* An iframe is created for only allowing to auto-trigger the api in the searchCountryDetails() to get the country details. It is not rendered out. */}
                <CContext.Consumer>
                    {state=> <iframe className="iframeTriggerOnly" id={state.selectedCountry3Code} onLoad={this.searchCountryDetails} />}
                </CContext.Consumer>
                {/* React components must have a wrapper node/element */}
                <h2>Country Details:</h2>
                {JSON.stringify(this.state.countryDetailsList)}

                {/* This test of toggling this open flag is used for the list toggle in material ui. */}
                <button onClick={this.handleClick}>
                    {JSON.stringify(this.state.open)}
                </button>
            </div>
        );
    }

    public searchCountryDetails = (event: any) => {
        /* Calling api from REST Countries website */
        const url = 'https://restcountries.eu/rest/v2/alpha/' + event.target.id;
        fetch(url)
            .then(response => response.json())
            .then((out) => {
                if (out.status !== 404) {
                    this.setState({ countryDetailsList: out});
                } else {
                    // 404 Not result found error, but should not reach here
                    this.setState({ countryDetailsList: out.message});
                }
            })
            .catch(err => alert(err)
        );

    }

}