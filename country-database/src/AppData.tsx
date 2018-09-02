import * as React from 'react';
// Pixabay API key for image search
export const API_KEY_PIXABAY = "***REMOVED***";

/*
    --------- App Context ---------
    CContext: Context for Country Details
    GContext: Context for Gallery
    SContext: Context for Search Bar
    LContext: Context of letting component know if the page finished loading

*/
export const CContext = React.createContext("");
export const GContext = React.createContext("");
export const SContext = React.createContext(false);
export const LContext = React.createContext(false);
// Web Logo
export const WebLogo = (props: any) => {
    return (
        <img style={props.style} className={props.className} src={require('./img/webLogo.png')} />
    );
}