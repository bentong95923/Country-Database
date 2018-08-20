import * as React from 'react';
import { Redirect } from 'react-router';

import AsyncSelect from 'react-select/lib/Async';

interface IState {
    countryOptions: any[],
    alpha3Code: string,
    responseReceived: boolean, // Flag indicates if results are found.
    confirmedQuery: boolean
};

const minNumInput = 2; // Minimum number of letters to trigger the search
const placeholderString = 'Search country...';

export default class CountryDatabase extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            countryOptions: [],
            alpha3Code: "None",
            responseReceived: false,
            confirmedQuery: false
        }
    }

    public render() {
        if (this.state.confirmedQuery) {
            return <Redirect to={'/details/'+this.state.alpha3Code} />;
        } else {
            return (
                <div id="wrapper" className="searchBar">
                    <AsyncSelect
                        cacheOptions={false}
                        loadOptions={this.handleOnInput}
                        defaultOptions={true}
                        placeholder={placeholderString}
                        noOptionsMessage={this.getNoOptText}
                        onChange={this.getCountryDetails}
                        escapeClearsValue={true}
                    />
                </div>
            );
        }
    }

    // Clear state variable when refreshing the page (only after user had confirmed(and submitted) the query previosuly)
    public componentWillReceiveProps() {
        if (this.state.confirmedQuery) {
            this.setState({
                countryOptions: [],
                alpha3Code: "None",
                responseReceived: false,
                confirmedQuery: false
            });
        }
    }

    public getCountryDetails = (selectedOptValue: any) => {
        if (selectedOptValue.alpha3Code !== undefined) {
            if (selectedOptValue.alpha3Code.length === 3) {
                this.setState({
                    alpha3Code: selectedOptValue.alpha3Code,
                    confirmedQuery: true
                });
            }
        }
    }

    public getNoOptText = (data: any) => {
        let noOptTxt = '';
        const tempArray = new Array();
        tempArray.push(data);
        tempArray.map((value: any) => {
            if (value.inputValue.trim().length === 0) {
                noOptTxt = 'Enter a country or territory name...';
            } else if (value.inputValue.trim().length < minNumInput) {
                noOptTxt = 'Keep typing...';
            } else {
                noOptTxt = 'Not Found';
            }
        });

        return noOptTxt;
    }

    public handleOnInput = async (inputValue: string, callback: any) => {
        // Remove any space from both sides of the input
        const inputTrimmed = inputValue.trim();
        // User are required to input at least 3 letters (no space on both sides) to display any results
        if (inputTrimmed.length >= minNumInput) {
            await this.getCountryList(inputTrimmed);
        }
        callback(this.loadOptions(inputTrimmed));
    }

    public loadOptions = (inputValue: string) => {
        // User are required to input at least 3 letters to display any results
        if (inputValue.length < minNumInput) {
            return new Array();
        } else {
            while (!this.state.responseReceived) { continue };
            return this.state.countryOptions;
        }
    }

    public getCountryList = async (country: string) => {
        /* Calling api from REST Countries website */
        const url = 'https://restcountries.eu/rest/v2/name/' + encodeURI(country) + '?fields=name;alpha3Code';
        const output = new Array();
        await fetch(url)
            .then(response => response.json())
            .then((out) => {
                if (out.status !== 404) {
                    out.map((value: any) => {
                        output.push({
                            alpha3Code: value.alpha3Code,
                            label: value.name
                        })
                    });
                }
                this.setState({ countryOptions: output, responseReceived: true });
            })
            .catch(err => alert('getCountryList(): ' + err)
            );
    }
}