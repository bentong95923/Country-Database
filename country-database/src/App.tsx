import * as React from "react";
import CountryDetails from "./components/CountryDetails";
import CountrySearchBar from "./components/CountrySearchBar";

// Exporting CContext so other Components can import this context for its use.
// Context with a component tag will render its content to the current component.
export const CContext = React.createContext({ selectedCountry3Code: "None" });

interface ISearchCountry {
    countryOptions: any[],
    selectedCountry3Code: string,
    resultFound: boolean // Flag indicates if results are found.
    confirmedQuery: boolean // Flag indicates if user confirms the input for the query
}

export default class Index extends React.Component<{}, ISearchCountry> {

    constructor(props: any) {
        super(props);
        this.state = {
            countryOptions: [],
            selectedCountry3Code: "None",
            resultFound: false,
            confirmedQuery: false
        }
    }

    public render() {
        if (this.state.confirmedQuery) {
            return (
                <div>
                    {/* Passing state to CountryDetails component*/}
                    <CContext.Provider value={this.state}>
                        <CountryDetails />
                    </CContext.Provider>
                </div>
            );
        } else {
            return (
                <div>
                    <div className="centreText">
                        {/* React components must have a wrapper node/element */}
                        <h3>Finding Country Information:</h3>
                        <input type="text/plain" id="countryName" onInput={this.handleOnInput} placeholder="Enter country name" />
                        <div className="displayCountry">
                            {this.renderCountryList(this.state.countryOptions, this.state.resultFound)}
                        </div>

                    </div>
                    <CountrySearchBar />
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
                resultFound: false,
                confirmedQuery: false
            });
        }
    }

    public handleOnInput = (event: any) => {
        // Remove anyspace from both sides of the input
        const countryInput = event.target.value.trim();
        // User are required to input at least 3 letters to display any results
        if (countryInput.length >= 3) {
            this.searchCountries(countryInput);
        } else if (countryInput.length > 0) {
            this.setState({ countryOptions: ["Keep typing..."], resultFound: false });
        } else {
            this.setState({ countryOptions: [], resultFound: false });
        }
    }

    public searchCountries = (country: string) => {
        /* Calling api from REST Countries website */
        const url = 'https://restcountries.eu/rest/v2/name/' + encodeURI(country)+'?fields=name;alpha3Code';
        fetch(url)
            .then(response => response.json())
            .then((out) => {
                if (out.status !== 404) {
                    this.setState({ countryOptions: out, resultFound: true });
                } else {
                    // 404 Not result found error, store the received message
                    this.setState({ countryOptions: out.message, resultFound: false });
                }
            })
            .catch(err => alert(err)
            );

    }

    public renderCountryList = (countryJSON: any[], resultFound: boolean) => {
        // Display result if results are found
        if (resultFound) {
            const content = countryJSON.map((value: any) =>
                // key field is a unique key required for map to display JSON
                <div key={value.alpha3Code}>
                    <h4 id={value.alpha3Code} className="countryOptions" onClick={this.handleOnClickCountry}>{value.name}</h4>
                </div>
            );
            return content;
        } else {
            // Display the no found message to user.
            return <h4>{countryJSON}</h4>;
        }
    }

    public handleOnClickCountry = (event: any) => {
        this.setState({ selectedCountry3Code: event.target.id, confirmedQuery: true });
        return;
    }


}