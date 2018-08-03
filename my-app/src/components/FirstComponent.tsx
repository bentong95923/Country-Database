import * as React from "react";
interface ICountryDetails {
        countryList : {}
}

export default class FirstComponent extends React.Component<{}, ICountryDetails> {

        constructor(props: any) {
                super(props)
                this.state = {
                        countryList : {}
                }
        }

        public render() {
                return (
                        <div className="centreText">
                                {/* React components must have a wrapper node/element */}
                                <div className="textareaFirst">
                                        Finding Country details: 
                                        <input type="text/plain" id="countryName" onKeyDown={this.handleOnChange} placeholder="Enter country name"
                                        />
                                </div>
                                <div className="displayCountry">
                                        {JSON.stringify(this.state.countryList)}
                                </div>
                        </div>
                );
        }

        public handleOnChange = (event: any) => {                
                if (event.target.value.length > 2) {
                        this.searchCountry(event.target.value);
                }
        }

        public searchCountry = (country: string) => {
                /* Calling api */
                const url = 'https://restcountries.eu/rest/v2/name/'+encodeURI(country);
                fetch(url)
                .then(response => response.json())
                .then((out) => {
                        if (out.status !== 404) {
                                this.setState({countryList : out});
                        } else {
                                // 404 Not result found
                                this.setState({countryList : out.message});
                        }
                })
                .catch(err => alert(err));

        }

}