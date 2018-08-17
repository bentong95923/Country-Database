/* 
    Put the country name string inside the Parentheses out to the beginning of the original string
    if there are parentheses.
    E.g. Korea (Republic of) becomes Republic of Korea
    Parentheses between the string will not be modified. E.g. Cocos (Keeling) Islands
*/
export const fixCountryName = (countryName: string) => {
    // Only do name swapped if the parenthese is at the end of the string
    if (countryName.includes(')') && (countryName.indexOf(')') === countryName.length-1)) {
        // Get string between the parentheses
        const regExp = /\(([^)]+)\)/;
        const matches = regExp.exec(countryName);
        // Null pointer checking
        if (matches !== null) {
            const strInside = matches[1];
            const strBefore = countryName.split('(')[0];
            return strInside + ' ' + strBefore.trim();
        }
    }
    return (countryName);
}



/* 
    Put the country name string inside the Parentheses out to the beginning of the original string
    if there are parentheses.
    E.g. Korea (Republic of) becomes Republic of Korea
    Parentheses between the string will not be modified. E.g. Cocos (Keeling) Islands
    3 types: use for listing, getting extract or getting image
*/

/* export const fixCountryName = (countryName: string, type: string) => {
    if (nameNeedsSpecialModified(countryName)) {
        return specialModify(countryName);
        // Only do name swapped if the parenthese is at the end of the string
    } else if (countryName.includes(')') && (countryName.indexOf(')') === countryName.length - 1)) {
        // Get string before the parentheses
        const strBefore = (countryName.split('(')[0]).trim();
        // Get string between the parentheses
        const regExp = /\(([^)]+)\)/;
        const matches = regExp.exec(countryName);
        let strInside = "";
        // Null pointer checking
        if (matches !== null) {
            strInside = matches[1];
        }
        return strInside + ' ' + strBefore;
    } else {
        // Return unmodified string
        return (countryName);
    }
}

const nameNeedsSpecialModified = (countryName: string) => {
    return (
        countryName === "Bolivia (Plurinational State of)" ||
        countryName === "Korea (Democratic People's Republic of)" ||
        countryName === "Brunei Darussalam" ||
        countryName === "Cocos (Keeling) Islands" ||
        countryName === "Congo" ||
        countryName === "Falkland Islands (Malvinas)" ||
        countryName === "Georgia" ||
        countryName === "Iran (Islamic Republic of)" ||
        countryName === "Lao People's Democratic Republic" || // Laos
        countryName === "Macedonia (the former Yugoslav Republic of)" ||
        countryName === "Micronesia (Federated States of)" ||
        countryName === "Palestine, State of" ||
        countryName === "Republic of Kosovo" ||
        countryName === "Réunion" ||
        countryName === "Saint Martin (French part)" ||
        countryName === "Sint Maarten (Dutch part)" ||
        countryName === "Syrian Arab Republic" ||
        countryName === "Tanzania, United Republic of" ||
        countryName === "United Kingdom of Great Britain and Northern Ireland" ||
        countryName === "Venezuela (Bolivarian Republic of)"
    );
}

const specialModify = (countryName: string) => {
    switch (countryName) {
        case "Bolivia (Plurinational State of)":
            return "Bolivia";
        case "Korea (Democratic People's Republic of)":
            return "North Korea";
        case "Brunei Darussalam":
            return "Brunei";
        case "Cocos (Keeling) Islands":
            return "Cocos Islands";
        case "Congo":
            return "Republic of the Congo";
        case "Falkland Islands (Malvinas)":
            return "Falkland Islands";
        case "Georgia":
            return "Georgia (Country)";
        case "Iran (Islamic Republic of)":
            return "Iran";
        case "Lao People's Democratic Republic":
            return "Laos";
        case "Macedonia (the former Yugoslav Republic of)":
            return "Republic of Macedonia";
        
        
    }
} */