/* 
    
    3 types of keywords: use for listing or getting (e) or getting image (i)
*/
export const optimizeCountryName = (countryName: string, keyWordType: string) => {
    const keyWord = keyWordType.toLowerCase();
    // alert(countryName+' '+needSpecialKeyword(countryName)+ ' '+ keyWordType)
    if (needSpecialKeyword(countryName)) {
        return getSpecialName(countryName, keyWord);
    } else {
        return nameSwapped(countryName, '');

    }
}

/*
    The output country name from the API is defective, some official country name, such as South Korea, the server return as:
    'Korea (Republic of)', and for Tanzania becomes 'Tanzania, United Republic of'. This function aims to fix these problems
    Put the country name string inside the Parentheses out to the beginning of the original string
    if there are a pair of parentheses or a comma.
    E.g. Korea (Republic of) becomes Republic of Korea
    Parentheses between the string will not be modified. E.g. Cocos (Keeling) Islands
    Comma separated country name - E.g. Tanzania, United Republic of -> United Republic of Tanzania
    Flag: '()': Parentheses, ',': Comma, '': not specified
    If flag is not specified, the function will automatically looking for any '()' or ','
*/
const nameSwapped = (countryName: string, flag: string) => {
    let outputName = countryName;
    if (countryName.length > 0) {
        switch (flag) {
            default: // Automatically looking for any '()' or ','
            case ('()'):
                // Only do name swapped if present and the parentheses are at the end of the string
                if (countryName.includes(')') && (countryName.indexOf(')') === countryName.length - 1)) {
                    // Get string between the parentheses
                    const regExp = /\(([^)]+)\)/;
                    const matches = regExp.exec(countryName);
                    // Null pointer checking
                    if (matches !== null) {
                        const strInside = matches[1];
                        const strBefore = countryName.split('(')[0];
                        outputName = strInside + ' ' + strBefore.trim();
                    }
                }
            case (','):
                if (countryName.includes(',') && !countryName.includes(')')) {
                    const tempStr = countryName.split(',');
                    if (tempStr.length === 2) {
                        outputName = tempStr[1] + ' ' + tempStr[0];
                    }
                }
        }
    }
    return outputName;
}

const needSpecialKeyword = (countryName: string) => {
    return (
        countryName === "Bonaire, Sint Eustatius and Saba" || // Prevent swapping
        countryName === "Brunei Darussalam" || // Gallery 
        countryName === "Cocos (Keeling) Islands" || // Gallery
        countryName === "Congo" || // Extract, gallery
        countryName === "Falkland Islands (Malvinas)" || // Extract, Gallery 
        countryName === "Georgia" || // Extract
        countryName === "Guinea" ||
        countryName === "Iran (Islamic Republic of)" || // Gallery
        countryName === "Micronesia (Federated States of)" || // Gallery
        countryName === "Palestine, State of" || // Gallery
        countryName === "Republic of Kosovo" || // Gallery
        countryName === "Réunion" || // Gallery
        countryName === "Saint Helena, Ascension and Tristan da Cunha" ||
        countryName === "Saint Martin (French part)" || // Extract
        countryName === "Sint Maarten (Dutch part)" || // Extract
        countryName === "Syrian Arab Republic" || // Gallery
        countryName === "Tanzania, United Republic of" || // Gallery
        countryName === "Yemen"
    );
}

const getSpecialName = (countryName: string, keyWordType: string) => {
    // Initialize
    let outputName = "";
    switch (countryName) {
        case "Bonaire, Sint Eustatius and Saba":
            outputName = countryName;
            break;
        case "Brunei Darussalam":
            keyWordType === "i" ? outputName = "Brunei" : outputName = countryName;
            break;
        case "Cocos (Keeling) Islands":
            keyWordType === "i" ? outputName = "Cocos Islands" : outputName = countryName;
            break;
        case "Congo":
            outputName = "Republic of the Congo";
            break;
        case "Falkland Islands (Malvinas)":
            keyWordType === "i" ? outputName = "Falkland Islands" : outputName = countryName;
            break;
        case "Georgia":
            keyWordType === "e" ? outputName = countryName + " (country)" : outputName = countryName;
            break;
        case "Guinea":
            outputName = "Republic of Guinea";
            break;
        case "Iran (Islamic Republic of)":
            keyWordType === "i" ? outputName = "Iran" : outputName = nameSwapped(countryName, '()');
            break;
        case "Micronesia (Federated States of)":
            keyWordType === "i" ? outputName = "Micronesia" : outputName = nameSwapped(countryName, '()');
            break;
        case "Palestine, State of":
            keyWordType === "i" ? outputName = "Palestine" : outputName = nameSwapped(countryName, ',');
            break;
        case "Republic of Kosovo":
            keyWordType === "i" ? outputName = "Kosovo" : outputName = countryName;
            break;
        case "Réunion":
            keyWordType === "i" ? outputName = "Reunion" : outputName = countryName;
            break;
        case "Saint Helena, Ascension and Tristan da Cunha":
            outputName = "Saint Helena, Ascension and Tristan da Cunha";
            break;
        case "Saint Martin (French part)":
            outputName = "Saint Martin";
            break;
        case "Sint Maarten (Dutch part)":
            outputName = "Sint Maarten";
            break;
        case "Syrian Arab Republic":
            keyWordType === "i" ? outputName = "Syria" : outputName = countryName;
            break;
        case "Tanzania, United Republic of":
            keyWordType === "i" ? outputName = "Tanzania" : outputName = nameSwapped(countryName, ',');
            break;
        case "Yemen":
            keyWordType === "i" ? outputName = "Yemen country" : outputName = countryName;
            break;
        default:
            break;
    }
    return outputName;
}