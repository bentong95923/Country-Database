import * as React from "react";
/* 
    Curely brace import only work if, in this case, CContext
    contains a named export called CContext.
*/
import {CContext} from "./FirstComponent";

export default class CountryDetails extends React.Component<{}> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div className="centreText">
                {/* React components must have a wrapper node/element */}
                <h2>Country Details:</h2>
                <CContext.Consumer>
                    {state => <input value={state.test} />}
                </CContext.Consumer>
            </div>
        );
    }

}