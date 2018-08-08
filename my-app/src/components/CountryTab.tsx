import * as React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import FavoriteIcon from '@material-ui/icons/Favorite';
import HelpIcon from '@material-ui/icons/Help';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import PhoneIcon from '@material-ui/icons/Phone';
import ShoppingBasket from '@material-ui/icons/ShoppingBasket';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';

interface Itest {
    value: number
}

function TabContainer(props: any) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

export default class CountryTab extends React.Component<{}, Itest> {

    constructor(props: any) {
        super(props);
        this.state = {
            value: 0
        }
    }

    public handleChange = (event: any, value: number) => {
        this.setState({ value });
    };
    
    public render() {
        const { value } = this.state;

        return (
            <div>
                {JSON.stringify(this.state)}
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        scrollable={true}
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Item One" icon={<PhoneIcon />} />
                        <Tab label="Item Two" icon={<FavoriteIcon />} />
                        <Tab label="Item Three" icon={<PersonPinIcon />} />
                        <Tab label="Item Four" icon={<HelpIcon />} />
                        <Tab label="Item Five" icon={<ShoppingBasket />} />
                        <Tab label="Item Six" icon={<ThumbDown />} />
                        <Tab label="Item Seven" icon={<ThumbUp />} />
                    </Tabs>
                </AppBar>
                {value === 0 && <TabContainer>Item One</TabContainer>}
                {value === 1 && <TabContainer>Item Two</TabContainer>}
                {value === 2 && <TabContainer>Item Three</TabContainer>}
                {value === 3 && <TabContainer>Item Four</TabContainer>}
                {value === 4 && <TabContainer>Item Five</TabContainer>}
                {value === 5 && <TabContainer>Item Six</TabContainer>}
                {value === 6 && <TabContainer>Item Seven</TabContainer>}
            </div>
        );
    }
}