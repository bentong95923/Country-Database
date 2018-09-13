import * as React from 'react';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import Launch from '@material-ui/icons/Launch';

import {
    CircularProgress,
    GridList, GridListTile,
    GridListTileBar,
    IconButton
} from '@material-ui/core';

import { PIC_GALLERY_HEIGHT } from '../AppConfig';
import { API_KEY_PIXABAY } from '../AppData';

// Material-UI style for Horizontal Grid List
const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        marginBottom: '20px',
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
    refTxt: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '11px',
        textAlign: 'right',
    },
    pixabay: {
        width: '100px',
        margin: '10px 0',
    }
});

// Interface
interface IGallery {
    imageList: any[],
    winWidth: number,
    winHeight: number,
    numImage: number,
    classes: any,
    finishLoading: boolean,
    apiError: boolean
}

// Customized props
interface IGalleryProps {
    data: string,
}

export const Gallery = withStyles(styles)(

    class extends React.Component<IGalleryProps, IGallery> {

        constructor(props: any) {
            super(props);
            this.state = {
                imageList: [],
                winWidth: window.innerWidth,
                winHeight: window.innerHeight,
                classes: props,
                numImage: 0,
                finishLoading: false,
                apiError: false
            }
        }

        public render() {
            const { classes } = this.state.classes;
            return (
                <div>
                    <div className={classes.root}>
                        {!this.state.finishLoading ?
                            <CircularProgress />
                            :
                            <GridList className={classes.gridList} cellHeight={PIC_GALLERY_HEIGHT} cols={this.responsiveDisplay()}>
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
                                                    <IconButton title="Click for original size of this image" onClick={this.openPicture(tile.largeImageURL)}>
                                                        <Launch className={classes.title} />
                                                    </IconButton>
                                                }
                                            />
                                        </GridListTile>
                                    );
                                })}
                            </GridList>
                        }
                    </div>
                    {this.state.numImage > 0 &&
                        <div className={classes.refTxt}>
                            Photos provided by
                            <a href="https://pixabay.com/" target="_blank">
                                <br />
                                <img
                                    src="https://pixabay.com/static/img/logo.png"
                                    className={classes.pixabay}
                                />
                            </a>
                        </div>
                    }
                </div>
            );
        }

        public updateResolution = () => {
            this.setState({ winWidth: window.innerWidth, winHeight: window.innerHeight });
        }

        public componentDidMount() {
            this.getImageList([JSON.parse(this.props.data).name, JSON.parse(this.props.data).capital], 0);
            window.addEventListener('resize', this.updateResolution);
        }

        public componentWillUnmount() {
            window.removeEventListener('resize', this.updateResolution);
        }

        // Determine maximun number of pictures allowed to be displayed in a row
        public responsiveDisplay = () => {
            let numCmp = 1;
            if (this.state.winWidth >= 720) {
                numCmp = 3;
            } else if (this.state.winWidth >= 500) {
                numCmp = 2;
            }
            return this.state.numImage < numCmp ? this.state.numImage : numCmp;
        }

        public openPicture = (url: string) => (event: any) => {
            window.open(url, "_blank");
        }

        /*
            Get a list of images from Pixabay (Recursive)
            nameNCapital: an array stores the country name and its capital name
            nthTimeToRun: a number passing into the recursive function to record number of times has been called. (First time calling then put this as 0)
        */
        public getImageList = async (nameNCapital: any[], nthTimeToRun: number) => {
            // First two times uses country name, last two time uses its capital
            const keywords = nthTimeToRun <= 1 ? nameNCapital[0] : nameNCapital[1];
            // If the function has been called at least once and the capital is not found then stop the search
            if (nameNCapital[1].length === 0 && nthTimeToRun > 0) {
                this.setState({ finishLoading: true });
                return;
            }
            const url = "https://pixabay.com/api/?key=" + API_KEY_PIXABAY + "&q=" + encodeURI(keywords) + "&image_type=photo&safesearch=true";
            await fetch(url)
                .then(response => response.json())
                .then((out) => {
                    if (out.hits !== undefined) {
                        // End search if results are found or had been run 3 times
                        if (out.hits.length >= 3 || nthTimeToRun === 2) {
                            this.setState({
                                imageList: out.hits,
                                numImage: out.hits.length,
                            });
                            // Abort search if it has already been searched twice
                            this.setState({ finishLoading: true });
                        } else {
                            // No Result
                            this.getImageList(nameNCapital, ++nthTimeToRun);
                        }
                    }
                })
                .catch(err => {
                    if (!this.state.apiError) {
                        this.setState({ apiError: true })
                    }
                });
        }

    }
)