import * as React from 'react';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import Launch from '@material-ui/icons/Launch';

import {
    CircularProgress,
    GridList, GridListTile,
    GridListTileBar,
    IconButton
} from '@material-ui/core';

import { API_KEY_PIXABAY } from '../AppData';

import { GContext } from '../AppData';

// Material-UI style for Horizontal Grid List
const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        // backgroundColor: theme.palette.background.paper,
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
        marginTop: '20px',
    },
    pixabay: {
        width: '100px',
        display: 'block',
        marginTop: '10px',
    }
});

interface IGallery {
    imageList: any[],
    winWidth: number,
    winHeight: number,
    numImage: number,
    classes: any,
    getImageListStatus: number,
    finishLoading: boolean,
    apiError: boolean
}

export const Gallery = withStyles(styles)(

    class extends React.Component<{}, IGallery> {

        constructor(props: any) {
            super(props);
            this.state = {
                imageList: [],
                winWidth: window.innerWidth,
                winHeight: window.innerHeight,
                classes: props,
                numImage: 0,
                /*
                    0: never called
                    1: called using country name but not enough photos
                    2: called using capital name or abort search
                */
                getImageListStatus: 0,
                finishLoading: false,
                apiError: false
            }
        }
        // Next step: use context to pass country name to ge the correct pictures. Also need to address the resource that the pics come from (PIXABAY)
        public render() {
            const { classes } = this.state.classes;
            return (
                <div>
                    <GContext.Consumer>
                        {dataGallery => {
                            switch (this.state.getImageListStatus) {
                                case 0:
                                    this.getImageList(JSON.parse(dataGallery).name);
                                    break;
                                case 1:
                                    this.getImageList(JSON.parse(dataGallery).capital);
                                    break;
                                case 2:
                                    break;
                            }
                            return '';
                        }}
                    </GContext.Consumer>
                    {this.state.numImage > 0 &&
                        <div className={classes.refTxt}>
                            Photos provided by
                            <a href="https://pixabay.com/" target="_blank">
                                <img src="https://pixabay.com/static/img/logo.png" className={classes.pixabay} />
                            </a>
                        </div>
                    }
                    <br />
                    <div className={classes.root}>
                        {!this.state.finishLoading ? <CircularProgress /> :
                            <GridList className={classes.gridList} cellHeight={220} cols={this.responsiveDisplay()}>
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
                </div>
            );
        }

        public updateResolution = () => {
            this.setState({ winWidth: window.innerWidth, winHeight: window.innerHeight });
        }

        public componentDidMount() {
            window.addEventListener('resize', this.updateResolution);
        }

        public componentWillUnmount() {
            window.removeEventListener('resize', this.updateResolution);
        }

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

        public getImageList = async (nameOrCapital: string) => {
            const url = "https://pixabay.com/api/?key=" + API_KEY_PIXABAY + "&q=" + encodeURI(nameOrCapital) + "&image_type=photo&safesearch=true";
            await fetch(url)
                .then(response => response.json())
                .then((out) => {
                    if (out.hits !== undefined) {
                        if (out.hits.length >= 3 || this.state.getImageListStatus === 2) {
                            if (nameOrCapital.length > 0) {
                                this.setState({
                                    imageList: out.hits,
                                    getImageListStatus: 2,
                                    numImage: out.hits.length,
                                });
                            }
                            // Abort search if it has already been searched twice
                            this.setState({ finishLoading: true });
                        } else if (this.state.getImageListStatus === 1) {
                            this.setState({
                                finishLoading: true,
                                getImageListStatus: 2,
                            });
                            // Else Keep searching
                        } else {
                            this.setState({ getImageListStatus: 1 });
                        }
                    }
                })
                .catch(err => {
                    if (!this.state.apiError) {
                        // alert('getImageList(): ' + err);
                        this.setState({ apiError: true })
                    }
                    return;
                });
        }

    }
)