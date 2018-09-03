import * as React from 'react'

// Web Logos
export const WebLogoDetailed = (props: any) => {
    return (
        <img style={props.style} className={props.className} src={require('./img/webLogoL.png')} />
    );
}
export const WebLogoSimple = (props: any) => {
    return (
        <img style={props.style} className={props.className} src={require('./img/webLogoS.png')} />
    );
}