import * as React from 'react';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import Launch from '@material-ui/icons/Launch';

import {
    GridList, GridListTile,
    GridListTileBar,
    IconButton
} from '@material-ui/core';

import { API_KEY_PIXABAY } from '../ApiKey';
import { MIN_NUM_PIC_FOUND, PIC_GALLERY_HEIGHT } from '../AppConfig';

// Material-UI style for Horizontal Grid List
const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        margin: '20px 0',
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
    numImageLoaded: number,
    classes: any,
    resultFound: boolean,
    finishLoading: boolean,
    apiError: boolean
}

// Customized props
interface IGalleryProps {
    data: string,
    getFinishLoading?: (loaded: boolean) => void,
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
                numImageLoaded: 0,
                resultFound: false,
                finishLoading: false,
                apiError: false
            }
        }

        public render() {
            const { classes } = this.state.classes;
            return (
                <div>
                    <div className={classes.root}>
                        {this.state.resultFound &&
                            <GridList
                                className={classes.gridList}
                                style={{ visibility: (this.state.finishLoading) ? 'visible' : 'hidden' }}
                                cellHeight={PIC_GALLERY_HEIGHT}
                                cols={this.responsiveDisplay()}
                            >
                                {this.state.imageList.map(tile => {
                                    return (
                                        <GridListTile key={tile.id}>
                                            <img src={tile.webformatURL} onLoad={this.trackNumImageLoaded} />
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

        public runAfterFinishLoading = () => {
            this.setState({ finishLoading: true });
            this.sendDataToParent(true);
        }

        public trackNumImageLoaded = () => {
            // setState() does not immediately update the state variable
            if (this.state.numImage > 0 && this.state.numImageLoaded + 1 === this.state.numImage) {
                this.runAfterFinishLoading();
            }
            this.setState(preState => ({ numImageLoaded: preState.numImageLoaded + 1 }));
        }

        public sendDataToParent = (data: boolean) => {
            if (this.props.getFinishLoading !== undefined) {
                this.props.getFinishLoading(data);
            }
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
                this.runAfterFinishLoading();
                return;
            }
            const url = "https://pixabay.com/api/?key=" + API_KEY_PIXABAY + "&q=" + encodeURI(keywords) + "&image_type=photo&safesearch=true";
            await fetch(url)
                .then(response => response.json())
                .then((out) => {
                    if (out.hits !== undefined) {
                        // End search if minimum results are found
                        if (out.hits.length >= MIN_NUM_PIC_FOUND || nthTimeToRun === 2) {
                            if (out.hits.length >= MIN_NUM_PIC_FOUND) {
                                this.setState({
                                    imageList: out.hits,
                                    numImage: out.hits.length,
                                });
                                this.setState({ resultFound: true });
                            } else if (nthTimeToRun === 2) {
                                // Abort search if it has already been searched twice
                                this.runAfterFinishLoading();
                            }
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