import * as React from "react";
interface ICountryDetails {
        countryList : any[]
}

export default class FirstComponent extends React.Component<{}, ICountryDetails> {

        constructor(props: any) {
                super(props)
                this.state = {
                        countryList : []
                }
        }

        public render() {
                return (
                        <div className="centreText">
                                {/* React components must have a wrapper node/element */}
                                <div className="textareaFirst">
                                        <h3>Finding Country details:</h3>
                                        <input type="text/plain" id="countryName" onKeyUp={this.handleOnKeyUp} placeholder="Enter country name"
                                        />
                                </div>
                                <div className="displayCountry">
                                        {this.state.countryList}
                                </div>
                        </div>
                );
        }

        public handleOnKeyUp = (event: any) => {              
                if (event.target.value.length >= 3) {
                        this.searchCountry(event.target.value);
                } else {
                        this.setState({countryList : [] });
                }
        }

        public searchCountry = (country: string) => {
                /* Calling api from REST Countries website */
                const url = 'https://restcountries.eu/rest/v2/name/'+encodeURI(country);
                fetch(url)
                .then(response => response.json())
                .then((out) => {
                        if (out.status !== 404) {
                                const content = out.map((value: any) => 
                                        <div key={value.alpha3Code}>
                                                <h4>{value.name}</h4>
                                        </div>
                                );                                
                                this.setState({countryList : content});
                        } else {
                                // 404 Not result found
                                this.setState({countryList : out.message});
                        }
                })
                .catch(err => alert(err));

        }
        

}