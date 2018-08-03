import * as React from "react";
interface ICountryDetails {
        countryList : {},
        length : 0
}

export default class FirstComponent extends React.Component<{}, ICountryDetails> {

        constructor(props: any) {
                super(props)
                this.state = {
                        countryList : {},
                        length : 0
                }
        }

        public render() {
                return (
                        <div className="centreText">
                                {/* React components must have a wrapper node/element */}
                                <div className="textareaFirst">
                                        Finding Country details: 
                                        <input type="text/plain" id="countryName" onKeyUp={this.handleOnKeyUp} placeholder="Enter country name"
                                        />
                                </div>
                                <div className="displayCountry">
                                        {this.state.length}
                                        {JSON.stringify(this.state.countryList)}
                                </div>
                        </div>
                );
        }

        public handleOnKeyUp = (event: any) => {
                this.setState({length : event.target.value.length });                
                if (event.target.value.length >= 3) {
                        this.searchCountry(event.target.value);
                } else {
                        this.setState({countryList : {} });
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