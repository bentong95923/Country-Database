/*
    --------- Api Key (Private file! Keep it safe!) ---------
    Only reveal the key in browser for publication! Don't reveal this file!
    The key is protected by API (Map Embed API only) and Application restrictions
***REMOVED***
*/

// Pixabay API key for image search
export const API_KEY_PIXABAY = fetch("https://country-database.netlify.com/.netlify/functions/GetGoogleAPIKey")
.then(res => res.json())
.then(out => alert(out));
// Google Maps Api Key (Private)
export const API_KEY_GOOGLE = fetch("https://country-database.netlify.com/.netlify/functions/GetGoogleAPIKey")
.then(res => res.json())
.then(out => alert(out));