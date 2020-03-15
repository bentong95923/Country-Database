import * as React from 'react'

// Web Logos
export const WebLogoDetailed = (props: any) => {
    return (
        <img {...props} src={require('./img/webLogoL.svg')} />
    );
}
export const WebLogoSimple = (props: any) => {
    return (
        <img {...props} src={require('./img/webLogoS.svg')} />
    );
}