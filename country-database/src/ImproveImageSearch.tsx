
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