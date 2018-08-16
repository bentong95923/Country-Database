import * as React from 'react';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import StarBorderIcon from '@material-ui/icons/StarBorder';

import {
    GridList, GridListTile,
    GridListTileBar,
    IconButton
} from '@material-ui/core';

import { CountryNameContext } from './CountryDetails';

const API_KEY_PIXABAY = "***REMOVED***";

// Material-UI style for Horizontal Grid List
const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
    title: {
        color: theme.palette.primary.light,
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
});

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */

interface IGallery {
    imageList: any[],
    classes: any,
    getImageListCalled: boolean
}

export const Gallery = withStyles(styles)(
    class extends React.Component<{}, IGallery> {

        constructor(props: any) {
            super(props);
            this.state = {
                imageList: [],
                classes: props,
                getImageListCalled: false
            }
        }
        // Next step: use context to pass country name to ge the correct pictures. Also need to address the resource that the pics come from (PIXABAY)
        public render() {
            const { classes } = this.state.classes;
            return (
                <div className={classes.root}>
                    {/* Can pass a JSON stringified string via context and then JSON parse it to read. */}
                    <CountryNameContext.Consumer>
                        {state => {
                            if (!this.state.getImageListCalled) {
                                this.getImageList(JSON.parse(state.allCountryName).name);
                            }
                            return '';
                        }}
                    </CountryNameContext.Consumer>
                    <GridList className={classes.gridList} cols={3}>
                        {this.state.imageList.map(tile => {
                            return (
                                <GridListTile key={tile.id}>
                                    <img src={tile.webformatURL} />
                                    <GridListTileBar
                                        classes={{
                                            root: classes.titleBar,
                                            title: classes.title,
                                        }}
                                        actionIcon={
                                            <IconButton>
                                                <StarBorderIcon className={classes.title} />
                                            </IconButton>
                                        }
                                    />
                                </GridListTile>
                            );
                        })}
                    </GridList>
                </div>
            );
        }

        public getImageList = (countryName: string) => {
            const url = "https://pixabay.com/api/?key=" + API_KEY_PIXABAY + "&q=" + encodeURI(countryName) + "&image_type=photo";
            fetch(url)
                .then(response => response.json())
                .then((out) => {
                    alert(JSON.stringify(out));
                    if (out.hits !== undefined) {
                        if (out.hits.length > 0) {
                            this.setState({
                                imageList: out.hits,
                                getImageListCalled: true
                            });
                        }
                    }

                })
                .catch(err => alert('getImageList(): ' + err)
                );
        }

    }
)