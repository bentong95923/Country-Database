import * as React from 'react';
// Pixabay API key for image search
export const API_KEY_PIXABAY = "***REMOVED***";

// Config
export const APP_TITLE = "Country Database"
export const MIN_SCREEN_WIDTH = 500; // Minimum width of screen in px to NOT consider as small screen device

// Number of letters required to enter for country search
export const MIN_NUM_INPUT = 2; // Minimum 
export const MAX_NUM_INPUT_NAME = 30; // Maximum
export const SEARCH_BAR_INPUT_PLACEHOLDER = 'Country name...';
/*
    --------- App Context ---------
    CContext: Context for Country Details
    HContext: Context of for Header

*/
export const CContext = React.createContext("");
export const HContext = React.createContext("");
