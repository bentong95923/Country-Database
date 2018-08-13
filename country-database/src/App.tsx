import * as React from 'react';
import AsyncSelect from 'react-select/lib/Async';
import CountryDetails from "./components/CountryDetails";

interface IState {
    countryOptions: any[],
    selectedCountry3Code: string,
    responseReceived: boolean, // Flag indicates if results are found.
    confirmedQuery: boolean
};

const minNumInput = 2;
const placeholderString = 'Enter country name...';

// Exporting CContext so other Components can import this context for its use.
// Context with a component tag will render its content to the current component.
export const CContext = React.createContext({ selectedCountry3Code: "None" });

export default class CountrySearchBar extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            countryOptions: [],
            selectedCountry3Code: "None",
            responseReceived: false,
            confirmedQuery: false
        }
    }

    public render() {
        if (this.state.confirmedQuery) {
            return (
                <div id='wrapper'>
                    {/* Passing state to CountryDetails component*/}
                    <CContext.Provider value={this.state}>
                        <CountryDetails />
                    </CContext.Provider>
                </div>
            );
        } else {
            return (
                <div id="wrapper" className="searchBar">
                    <AsyncSelect
                        cacheOptions={false}
                        loadOptions={this.handleOnInput}
                        defaultOptions={true}
                        placeholder={placeholderString}
                        noOptionsMessage={this.getNoOptText}
                        isClearable={true}
                        onChange={this.getCountryDetails}
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
                selectedCountry3Code: "None",
                responseReceived: false,
                confirmedQuery: false
            });
        }
    }

    public getCountryDetails = (selectedOptValue: any) => {
        if (selectedOptValue.alpha3Code !== undefined) {
            if (selectedOptValue.alpha3Code.length === 3) {
                this.setState({
                    selectedCountry3Code: selectedOptValue.alpha3Code,
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
                noOptTxt = placeholderString;
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
            .catch(err => alert(err)
            );
    }
}