import * as React from 'react';
import { components } from 'react-select';

import { Redirect } from 'react-router';

import AsyncSelect from 'react-select/lib/Async';

import Search from '@material-ui/icons/Search';

import { optimizeCountryName } from '../CountryNameOptimization';

// Declare props for this component
interface ISearchBarProps {
    onIndexPage: boolean,
    getNewAlpha3Code?: (newAlpha3Code: string) => void, // '?' mean optional, if missing this prop then will use the default prop
}

interface IState {
    countryOptions: any[],
    alpha3Code: string, // Use to track if user selects the same country as last time
    responseReceived: boolean, // Flag indicates if results are found.
    confirmedQuery: boolean,
}

const minNumInput = 2; // Minimum number of letters to trigger the search
const placeHolderString = 'Country name...';

const { Placeholder, ValueContainer, Option, SingleValue } = components;

const countryIconStyle = {
    width: '30px',
    marginRight: '10px',
}

const searchBarPosHome = {
    textAlign: 'initial' as 'initial',
    margin: '0 auto',
}

const searchBarPosHeader = {
    width: '90%',
    textAlign: 'initial' as 'initial',
    float: 'right' as 'right',
}

// Replacing components for React Select
const IconOptions = (props: any) => {
    return (
        <Option {...props}>
            <img style={countryIconStyle} src={props.data.flag} /> {props.data.label}
        </Option>
    );
}

const ValueContainerBox = (props: any) => {
    return ValueContainer && (
        <ValueContainer {...props}>
            <Search style={{ color: '#333', marginRight: '5px' }} />
            {props.children}
        </ValueContainer>
    );
}

const PlaceholderContainer = (props: any) => {
    return Placeholder && (
        <div>
            <Placeholder {...props} />
        </div>
    );
}

const SingleValueBox = (props: any) => {
    return SingleValue && (
        <div style={{ marginRight: '5px' }}>
            <SingleValue {...props} />
        </div>
    );
}

export default class SearchBar extends React.Component<ISearchBarProps, IState> {

    constructor(props: any) {
        super(props);
        this.state = {
            countryOptions: [],
            alpha3Code: "",
            responseReceived: false,
            confirmedQuery: false,
        }
    }

    public sendDataToParent = (data: string) => {
        if (this.props.getNewAlpha3Code !== undefined) {
            this.props.getNewAlpha3Code(data);
        }
    }

    public render() {
        return (
            <div>
                <div style={this.props.onIndexPage ? searchBarPosHome : searchBarPosHeader}>
                    <AsyncSelect
                        cacheOptions={true}
                        loadOptions={this.handleOnInput}
                        defaultOptions={[]}
                        placeholder={placeHolderString}
                        noOptionsMessage={this.getNoOptText}
                        onChange={this.getSelectedCountryDetails}
                        escapeClearsValue={true}
                        components={{
                            Option: IconOptions,
                            ValueContainer: ValueContainerBox,
                            Placeholder: PlaceholderContainer,
                            SingleValue: SingleValueBox,
                        }}
                        isOptionSelected={this.checkOptionIsSelected}
                    />
                </div>
                {this.state.confirmedQuery && this.props.onIndexPage &&
                    <Redirect to={'/details/' + this.state.alpha3Code} />
                }
            </div>
        );
    }

    // Call every time upon each opton arrives
    public checkOptionIsSelected = (option: any) => {
        // To determine if the option is same as the current chosen option
        return (option.alpha3Code === this.state.alpha3Code);
    }

    public getSelectedCountryDetails = (selectedOptValue: any) => {
        if (selectedOptValue.alpha3Code !== undefined) {
            if (selectedOptValue.alpha3Code.length === 3) {
                this.setState({
                    alpha3Code: selectedOptValue.alpha3Code,
                    confirmedQuery: true,
                });
                this.sendDataToParent(selectedOptValue.alpha3Code);
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
        // User are required to input the required number of charachers specified to display any results
        if (inputValue.length < minNumInput) {
            return new Array();
        } else {
            while (!this.state.responseReceived) { continue };
            return this.state.countryOptions;
        }
    }

    public getCountryList = async (country: string) => {
        /* Calling api from REST Countries website */
        const url = 'https://restcountries.eu/rest/v2/name/' + encodeURI(country) + '?fields=name;alpha3Code;flag';
        const output = new Array();
        await fetch(url)
            .then(response => response.json())
            .then((out) => {
                if (out.status !== 404) {
                    out.map((data: any) => {
                        output.push({
                            alpha3Code: data.alpha3Code,
                            label: optimizeCountryName(data.name, 'e'),
                            flag: data.flag,
                        });
                    });
                }
                this.setState({ countryOptions: output, responseReceived: true });
            })
            .catch(err => alert('getCountryList(): ' + err)
            );
    }
}