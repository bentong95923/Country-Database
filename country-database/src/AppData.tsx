import * as React from 'react';
// Pixabay API key for image search
export const API_KEY_PIXABAY = "***REMOVED***";

/*
    --------- App Context ---------
    CContext: Context for Country Details
    GContext: Context for Gallery
    SContext: Context for Search Bar
    HContext: Context of for Header

*/
export const CContext = React.createContext("");
export const GContext = React.createContext("");
export const SContext = React.createContext(false);
export const HContext = React.createContext("");
