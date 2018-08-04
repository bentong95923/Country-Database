import * as React from "react";
import CountryDetails from "./CountryDetails";

// Exporting CContext so other Components can import this context for its use.
// Context with a component tag will render its content to the current component.
export const CContext = React.createContext({test: "NA"});

interface ICountryDetails {
    countryList: any[],
    test: string,
    resultFound: boolean // Variable storage for knowing if results are found.
}

export default class FirstComponent extends React.Component<{}, ICountryDetails> {

    constructor(props: any) {
        super(props);
        this.state = {
            countryList: [],
            test: "test",
            resultFound: false
        }
    }

    public render() {
        return (
            <div className="centreText">
                <CContext.Provider value={this.state}>
                    <CountryDetails />
                </CContext.Provider>
                {/* React components must have a wrapper node/element */}
                <div className="textareaFirst">
                    <h3>Finding Country details:</h3>
                    <input type="text/plain" id="countryName" onKeyUp={this.handleOnKeyUp} placeholder="Enter country name"
                    />
                </div>
                <div className="displayCountry">
                    {this.renderCountryList(this.state.countryList, this.state.resultFound)}
                </div>
            </div>
        );
    }

    public handleOnKeyUp = (event: any) => {
        // User are required to input at least 3 letters to display any results
        if (event.target.value.length >= 3) {
            this.searchCountry(event.target.value);
        } else if (event.target.value.length > 0){
            this.setState({ countryList: ["Keep typing..."], resultFound: false});
        } else {
            this.setState({ countryList: [], resultFound: false});
        }
    }

    public searchCountry = (country: string) => {
        /* Calling api from REST Countries website */
        const url = 'https://restcountries.eu/rest/v2/name/' + encodeURI(country);
        fetch(url)
            .then(response => response.json())
            .then((out) => {
                if (out.status !== 404) {
                    this.setState({ countryList: out,  resultFound: true });
                } else {
                    // 404 Not result found error, store the received message
                    this.setState({ countryList: out.message, resultFound: false });
                }
            })
            .catch(err => alert(err)
        );

    }

    public renderCountryList = (countryJSON: any[], resultFound: boolean) => {
        // Display result if results are found
        if (resultFound) {
            const content = countryJSON.map((value: any) =>
                <div key={value.alpha3Code}>
                    <h4>{value.name}</h4>
                </div>
            );
            return content;
        } else {
            // Display the no found message to user.
            return <h4>{countryJSON}</h4>;
        }
    }


}