import * as React from 'react';

import classnames from 'classnames';

// import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
// import CardMedia from '@material-ui/core/CardMedia';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import { Theme, withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ShareIcon from '@material-ui/icons/Share';
import { CContext } from './CountryDetails';

// import { CContext } from './CountryDetails';

const styles = (theme: Theme) => ({
    card: {
        maxWidth: 600,
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    actions: {
        display: 'flex',
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
        marginLeft: 'auto',
        [theme.breakpoints.up('sm')]: {
            marginRight: -8,
        },
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
});

interface ICard {
    expanded: boolean,
    classes: any
}

class InfoCard extends React.Component<{}, ICard> {
    constructor(props: any) {
        super(props);
        this.state = {
            expanded: false,
            classes: props
        }
    }

    public handleExpandClick = () => {
        this.setState(preState => ({ expanded: !preState.expanded }));
    };

    public render() {
        const { classes } = this.state.classes;

        return (
            <div>
                <CContext.Consumer>
                    {ctextData => {
                        if (ctextData.extractContent.length > 0) {

                            const extractBuf = ctextData.extractContent.split('\n');
                            const extract = new Array();
                            let count = 0;
                            extractBuf.forEach((s, i) => {
                                // Filter out any empty element due to extra \n.
                                if (s.length > 0) {
                                    extract.push({ id: i, str: s });
                                }
                            });
                            return (

                                <Card className={classes.card}>
                                    <CardHeader
                                        avatar={
                                            <img className="countryFlag" src="https://restcountries.eu/data/prk.svg" />
                                        }
                                        action={
                                            <IconButton>
                                                <MoreVertIcon />
                                            </IconButton>
                                        }
                                        title="Republic of Congo"
                                        subheader="Country in Eastern Asia"
                                    />

                                    <CardContent>
                                        <Typography component="p">
                                            {count + ' ' + extract[count++].str}
                                        </Typography>
                                    </CardContent>
                                    {extract.length > 1 ?
                                        <CardActions className={classes.actions} disableActionSpacing={true}>
                                            <IconButton aria-label="Share">
                                                <ShareIcon />
                                            </IconButton>
                                            <IconButton
                                                className={classnames(classes.expand, {
                                                    [classes.expandOpen]: this.state.expanded,
                                                })}
                                                onClick={this.handleExpandClick}
                                                aria-expanded={this.state.expanded}
                                                aria-label="Show more"
                                            >
                                                <ExpandMoreIcon />
                                            </IconButton>
                                            More
                                        </CardActions>
                                    : ''}
                                    {extract.length > 1 ?
                                        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit={true}>
                                            <CardContent>
                                                <Typography paragraph={extract.length - 1 !== count}>
                                                    {count + ' ' + extract[count++].str}
                                                </Typography>
                                                {extract.map((v: any, i: number) => {
                                                    // Not display the repeated contents
                                                    if (i >= count) {
                                                        return (
                                                            <Typography key={v.id} paragraph={extract.length - 1 !== i}>{v.id + ' ' + v.str}</Typography>
                                                        );
                                                    } return
                                                })}
                                            </CardContent>
                                        </Collapse>
                                    : ''}
                                </Card>
                            );
                        } else {
                            return 'Content is empty.';
                        }
                    }}
                </CContext.Consumer>
            </div>
        );
    }
}

export const ExtractCard = withStyles(styles)(InfoCard);