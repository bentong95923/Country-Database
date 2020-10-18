import * as React from 'react';
import { Home } from './Home';

export default class NotFound extends React.Component<{}> {
    constructor(props: any) {
        super(props);
        props.history.push("/404/");
    }

    public render() {
        // Passing boolean of not found to home component
        return (
            <Home {...this.props} notFound={true} />
        );
    }

}