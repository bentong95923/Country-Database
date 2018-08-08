import * as React from "react";
import CountryTab from "./CountryTab";

export default class SecondComponent extends React.Component<{}> {

    public render() {
        return (
            <div className="centreText">
                {/* React components must have a wrapper node/element */}
                <h1>༼ つ  ͡° ͜ʖ ͡° ༽つ</h1>
                <CountryTab />
            </div>
        );
    }


}