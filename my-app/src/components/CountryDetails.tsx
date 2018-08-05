import * as React from "react";
/* 
    Curely brace import only work if, in this case, CContext
    contains a named export called CContext.
*/
import {CContext} from "./FirstComponent";
interface ICountryDetails {
    countryDetailsList: any[]
}

export default class CountryDetails extends React.Component<{}, ICountryDetails> {

    constructor(props: any) {
        super(props);
        this.state = {
            countryDetailsList: []
        }
    }

    public render() {
        return (
            <div className="centreText">                
                {/* An iframe is created for only allowing to auto call the api in the searchCountryDetails() to get the country details. It is not rendered. */}
                <CContext.Consumer>
                    {state=> <iframe className="iframeTriggerOnly" id={state.selectedCountry3Code} onLoad={this.searchCountryDetails} />}
                </CContext.Consumer>
                {/* React components must have a wrapper node/element */}
                <h2>Country Details:</h2>
                {JSON.stringify(this.state.countryDetailsList)}
                

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