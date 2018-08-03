import * as React from "react";

interface ICountryDetails {
        countryList : any[]
}

export default class CountryDetails extends React.Component<{}, ICountryDetails> {

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
                            <h2>Country Details!</h2>
                            <div className="displayCountry">
                                    {this.state.countryList}
                            </div>
                    </div>
            );
    }

}