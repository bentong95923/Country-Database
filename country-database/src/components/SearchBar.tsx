import * as React from 'react';
import { components } from 'react-select';

import { Redirect } from 'react-router';

import AsyncSelect from 'react-select/lib/Async';

import Search from '@material-ui/icons/Search';

import { MAX_NUM_INPUT, MIN_NUM_INPUT, SEARCH_BAR_INPUT_PLACEHOLDER, URI_NAME_DETAILS } from '../AppConfig';
import { optimizeCountryName } from '../CountryNameOptimization';

// Declare props for this component
interface ISearchBarProps {
    onIndexPage: boolean,
    preLoadCountryData?: string,
    // Optional props for other components getting new country by user
    getNewAlpha3Code?: (newAlpha3Code: string) => void,
}

interface IState {
    countryOptions: any[],
    // Default selected country
    defaultValue: any[],
    alpha3Code: string,
    // Flag indicates if a response received from API
    responseReceived: boolean,
    // Flag indicates if user hits the enter key
    confirmedQuery: boolean,
    // Error flag of API
    apiError: boolean,
}

// React select components
const { Input, ValueContainer, Option } = components;

// Style
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
const NewOption = (props: any) => {
    // Adding its country icon for each country option
    return (
        <Option {...props}>
            <div style={{ display: 'table' }}>
                <span
                    style={{
                        display: 'table-cell',
                    }}
                >
                    <img style={countryIconStyle} src={props.data.flag} />
                </span>
                <span style={{ display: 'table-cell' }}>{props.data.label}</span>
            </div>
        </Option>
    );
}

const NewValueContainer = (props: any) => {
    return ValueContainer && (
        <ValueContainer {...props}>
            <Search style={{ color: '#333' }} />
            {props.children}
        </ValueContainer>
    );
}

const NewInput = (props: any) => {
    return Input && (
        <Input maxLength={MAX_NUM_INPUT} {...props} />
    );
}

const searchBarStyle = {
    input: (styles: any) => ({
        ...styles,
        margin: '2px 2px 2px 5px',
    }),
    singleValue: (styles: any) => ({
        ...styles,
        left: '36px',
        width: '75%',
        maxWidth: 'unset',
    }),
    placeholder: (styles: any) => ({
        ...styles,
        left: '36px',
        wordWrap: "normal",
    }),
    dropdownIndicator: () => ({
        display: 'none',
    }),
    indicatorSeparator: () => ({
        display: 'none',
    }),
}

/* const debugReactSelectInnerStyle = (styles: any, props: any) => {
    console.log(JSON.stringify(styles));
    return props;
} */

export default class SearchBar extends React.Component<ISearchBarProps, IState> {

    static defaultProps = {
        preLoadCountryData: ""
    }

    constructor(props: any) {
        super(props);
        this.state = {
            countryOptions: [],
            defaultValue: this.getDefaultValue(),
            alpha3Code: props.preLoadCountryData.length > 0 ? JSON.parse(props.preLoadCountryData).alpha3Code : "",
            responseReceived: false,
            confirmedQuery: false,
            // The 404 error does not consider an apiError for user entnering a non-existing country name
            apiError: false,
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
                        styles={searchBarStyle}
                        cacheOptions={true}
                        openMenuOnClick={false}
                        loadOptions={this.handleOnInput}
                        defaultOptions={[]}
                        placeholder={SEARCH_BAR_INPUT_PLACEHOLDER}
                        noOptionsMessage={this.getNoOptText}
                        onChange={this.getSelectedCountryDetails}
                        isOptionSelected={this.checkOptionIsSelected}
                        defaultValue={this.state.defaultValue}
                        components={{
                            Option: NewOption,
                            ValueContainer: NewValueContainer,
                            Input: NewInput,
                        }}
                    />
                </div>
                {this.state.confirmedQuery && this.props.onIndexPage &&
                    <Redirect to={"/" + URI_NAME_DETAILS + "/" + this.state.alpha3Code} />
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
                noOptTxt = "Enter a country name / alpha 2 code...";
            } else if (value.inputValue.trim().length < MIN_NUM_INPUT) {
                noOptTxt = "Keep typing...";
            } else if (this.state.apiError) {
                noOptTxt = "Server Error. Please try again.";
            } else {
                noOptTxt = "Not Found";
            }
        });
        return noOptTxt;
    }

    public handleOnInput = async (inputValue: string, callback: any) => {
        // Reset flag
        this.setState({ responseReceived: false, apiError: false });
        // Remove any space from both sides of the input
        const inputTrimmed = inputValue.trim();
        // User are required to input at least 3 letters (no space on both sides) to display any results
        if (inputTrimmed.length >= MIN_NUM_INPUT) {
            await this.getCountryList(inputTrimmed);
        }
        callback(this.loadOptions(inputTrimmed));
    }

    public loadOptions = (inputValue: string) => {
        // User are required to input the required number of charachers specified to display any results
        if (inputValue.length < MIN_NUM_INPUT) {
            return new Array();
        } else {
            // Blocking until there is an api error or result found
            while (!(this.state.responseReceived || this.state.apiError)) { continue };
            return (this.state.apiError ? new Array() : this.state.countryOptions);
        }
    }

    public getDefaultValue = () => {
        const props = this.props;
        const defaultValue = new Array();
        if (props.preLoadCountryData !== undefined && !props.onIndexPage) {
            const countryData = JSON.parse(props.preLoadCountryData);
            defaultValue.push({
                alpha3Code: countryData.alpha3Code,
                label: optimizeCountryName(countryData.name, 'e'),
            });
        }
        return defaultValue;
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
            }).catch(err => {
                // Error handling
                this.setState({ apiError: true });
            });
    }
}