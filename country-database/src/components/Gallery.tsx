import * as React from 'react';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import StarBorderIcon from '@material-ui/icons/StarBorder';

import {
    GridList, GridListTile,
    GridListTileBar,
    IconButton
} from '@material-ui/core';

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

/* const tileData = [
    {
        "largeImageURL": "https://pixabay.com/get/eb30b0082ef1023ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_1280.jpg",
        "webformatHeight": 426,
        "webformatWidth": 640,
        "likes": 476,
        "imageWidth": 5472,
        "id": 2517653,
        "user_id": 5937035,
        "views": 193599,
        "comments": 51,
        "pageURL": "https://pixabay.com/en/clouds-hong-kong-night-mist-haze-2517653/",
        "imageHeight": 3648,
        "webformatURL": "https://pixabay.com/get/eb30b0082ef1023ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_640.jpg",
        "type": "photo",
        "previewHeight": 99,
        "tags": "clouds, hong kong, night",
        "downloads": 149683,
        "user": "carloyuen",
        "favorites": 509,
        "imageSize": 3462723,
        "previewWidth": 150,
        "userImageURL": "https://cdn.pixabay.com/user/2017/07/30/16-59-05-675_250x250.jpg",
        "previewURL": "https://cdn.pixabay.com/photo/2017/07/19/01/41/clouds-2517653_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/e83cb80f2af2093ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_1280.jpg",
        "webformatHeight": 360,
        "webformatWidth": 640,
        "likes": 582,
        "imageWidth": 2200,
        "id": 1990268,
        "user_id": 12019,
        "views": 142643,
        "comments": 74,
        "pageURL": "https://pixabay.com/en/hong-kong-city-urban-skyscrapers-1990268/",
        "imageHeight": 1238,
        "webformatURL": "https://pixabay.com/get/e83cb80f2af2093ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_640.jpg",
        "type": "photo",
        "previewHeight": 84,
        "tags": "hong kong, city, urban",
        "downloads": 74916,
        "user": "12019",
        "favorites": 603,
        "imageSize": 1137669,
        "previewWidth": 150,
        "userImageURL": "",
        "previewURL": "https://cdn.pixabay.com/photo/2017/01/18/16/46/hong-kong-1990268_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/e133b50720f01c22d2524518b74a4296e172e3d404b0144291f3c27da0e4b4_1280.jpg",
        "webformatHeight": 225,
        "webformatWidth": 640,
        "likes": 151,
        "imageWidth": 4670,
        "id": 864884,
        "user_id": 272447,
        "views": 32384,
        "comments": 32,
        "pageURL": "https://pixabay.com/en/hong-kong-skyline-night-architecture-asi-864884/",
        "imageHeight": 1644,
        "webformatURL": "https://pixabay.com/get/e133b50720f01c22d2524518b74a4296e172e3d404b0144291f3c27da0e4b4_640.jpg",
        "type": "photo",
        "previewHeight": 52,
        "tags": "hong kong skyline night architecture asia skyscraper china downtown panorama harbor port cityscape buildings city landscape scenic metropolis towers modern hong kong hong kong hong kong hong kong hong kong",
        "downloads": 12587,
        "user": "skeeze",
        "favorites": 127,
        "imageSize": 3340553,
        "previewWidth": 150,
        "userImageURL": "https://cdn.pixabay.com/user/2015/02/10/03-58-30-79_250x250.jpg",
        "previewURL": "https://cdn.pixabay.com/photo/2015/07/28/20/24/hong-kong-864884_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/e835b90e2ff4053ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_1280.jpg",
        "webformatHeight": 360,
        "webformatWidth": 640,
        "likes": 96,
        "imageWidth": 5760,
        "id": 1081704,
        "user_id": 242387,
        "views": 27761,
        "comments": 10,
        "pageURL": "https://pixabay.com/en/hong-kong-china-night-cityscape-coastlin-1081704/",
        "imageHeight": 3240,
        "webformatURL": "https://pixabay.com/get/e835b90e2ff4053ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_640.jpg",
        "type": "photo",
        "previewHeight": 84,
        "tags": "hong kong china night cityscape coastline coast ocean panorama panoramic sunset skyscraper waterfront hong kong hong kong hong kong hong kong hong kong",
        "downloads": 10395,
        "user": "Free-Photos",
        "favorites": 92,
        "imageSize": 5245916,
        "previewWidth": 150,
        "userImageURL": "https://cdn.pixabay.com/user/2014/05/07/00-10-34-2_250x250.jpg",
        "previewURL": "https://cdn.pixabay.com/photo/2015/12/08/00/26/cityscape-1081704_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/e034b2072ff61c22d2524518b74a4296e172e3d404b0144291f3c27da0e4b4_1280.jpg",
        "webformatHeight": 160,
        "webformatWidth": 640,
        "likes": 76,
        "imageWidth": 2900,
        "id": 913872,
        "user_id": 272447,
        "views": 17662,
        "comments": 16,
        "pageURL": "https://pixabay.com/en/hong-kong-skyline-night-architecture-asi-913872/",
        "imageHeight": 725,
        "webformatURL": "https://pixabay.com/get/e034b2072ff61c22d2524518b74a4296e172e3d404b0144291f3c27da0e4b4_640.jpg",
        "type": "photo",
        "previewHeight": 37,
        "tags": "hong kong skyline night architecture asia skyscraper china downtown panorama harbor port cityscape buildings city landscape scenic metropolis towers modern hong kong hong kong hong kong hong kong hong kong",
        "downloads": 6563,
        "user": "skeeze",
        "favorites": 94,
        "imageSize": 782665,
        "previewWidth": 150,
        "userImageURL": "https://cdn.pixabay.com/user/2015/02/10/03-58-30-79_250x250.jpg",
        "previewURL": "https://cdn.pixabay.com/photo/2015/08/30/06/38/hong-kong-913872_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/ef30b50b28f01c22d2524518b74a4296e172e3d404b0144291f3c27da0e4b4_1280.jpg",
        "webformatHeight": 160,
        "webformatWidth": 640,
        "likes": 53,
        "imageWidth": 4000,
        "id": 654404,
        "user_id": 266274,
        "views": 8846,
        "comments": 15,
        "pageURL": "https://pixabay.com/en/china-hong-kong-city-travel-landmark-cit-654404/",
        "imageHeight": 1000,
        "webformatURL": "https://pixabay.com/get/ef30b50b28f01c22d2524518b74a4296e172e3d404b0144291f3c27da0e4b4_640.jpg",
        "type": "photo",
        "previewHeight": 37,
        "tags": "china hong kong city travel landmark cityscape architecture view tower building night asian water colourful reflection light tourism business asia sea colorful chinese famous hong kong hong kong hong kong hong kong hong kong",
        "downloads": 4306,
        "user": "DesignNPrint",
        "favorites": 50,
        "imageSize": 962863,
        "previewWidth": 150,
        "userImageURL": "https://cdn.pixabay.com/user/2017/12/21/12-40-53-410_250x250.jpg",
        "previewURL": "https://cdn.pixabay.com/photo/2015/03/01/05/55/china-654404_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/eb31b20d2efd1c22d2524518b74a4296e172e3d404b0144291f3c27da0e4b4_1280.jpg",
        "webformatHeight": 426,
        "webformatWidth": 640,
        "likes": 42,
        "imageWidth": 3456,
        "id": 243269,
        "user_id": 99559,
        "views": 9561,
        "comments": 34,
        "pageURL": "https://pixabay.com/en/the-peak-hong-kong-scenic-romantic-kowlo-243269/",
        "imageHeight": 2304,
        "webformatURL": "https://pixabay.com/get/eb31b20d2efd1c22d2524518b74a4296e172e3d404b0144291f3c27da0e4b4_640.jpg",
        "type": "photo",
        "previewHeight": 99,
        "tags": "the peak hong kong scenic romantic kowloon city beauty attraction city amazing skyline beautiful night view travel china winter peaks mountains scene landscape peak cold tourism hong kong hong kong hong kong hong kong hong kong",
        "downloads": 4166,
        "user": "sharonang",
        "favorites": 45,
        "imageSize": 2760096,
        "previewWidth": 150,
        "userImageURL": "https://cdn.pixabay.com/user/2017/05/22/08-22-52-242_250x250.jpg",
        "previewURL": "https://cdn.pixabay.com/photo/2014/01/13/07/34/the-peak-243269_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/ea32b7082ff31c22d2524518b74a4296e172e3d404b0144291f3c27da0e4b4_1280.jpg",
        "webformatHeight": 423,
        "webformatWidth": 640,
        "likes": 48,
        "imageWidth": 4928,
        "id": 376777,
        "user_id": 132388,
        "views": 9856,
        "comments": 16,
        "pageURL": "https://pixabay.com/en/hong-kong-skyline-china-night-city-light-376777/",
        "imageHeight": 3264,
        "webformatURL": "https://pixabay.com/get/ea32b7082ff31c22d2524518b74a4296e172e3d404b0144291f3c27da0e4b4_640.jpg",
        "type": "photo",
        "previewHeight": 99,
        "tags": "hong kong skyline china night city lights evening skyscraper quiet sea port building boats mirroring sky skyscrapers water night photograph romantic silhouette lighting mood darkness dark atmosphere light architecture lightshow lanterns house facade house facade window high masonry bowever tourist attraction asia hong kong hong kong hong kong hong kong hong kong",
        "downloads": 3206,
        "user": "teetasse",
        "favorites": 38,
        "imageSize": 4346880,
        "previewWidth": 150,
        "userImageURL": "https://cdn.pixabay.com/user/2015/11/18/03-51-11-456_250x250.jpg",
        "previewURL": "https://cdn.pixabay.com/photo/2014/06/24/23/40/hong-kong-376777_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/eb30b50a2ef2043ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_1280.jpg",
        "webformatHeight": 426,
        "webformatWidth": 640,
        "likes": 52,
        "imageWidth": 5472,
        "id": 2545665,
        "user_id": 692575,
        "views": 8620,
        "comments": 4,
        "pageURL": "https://pixabay.com/en/hong-kong-city-night-china-asia-2545665/",
        "imageHeight": 3648,
        "webformatURL": "https://pixabay.com/get/eb30b50a2ef2043ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_640.jpg",
        "type": "photo",
        "previewHeight": 99,
        "tags": "hong kong, city, night",
        "downloads": 3863,
        "user": "stokpic",
        "favorites": 40,
        "imageSize": 6794121,
        "previewWidth": 150,
        "userImageURL": "https://cdn.pixabay.com/user/2015/01/09/17-53-17-220_250x250.jpg",
        "previewURL": "https://cdn.pixabay.com/photo/2017/07/27/15/22/hong-kong-2545665_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/e835b20e2df2093ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_1280.jpg",
        "webformatHeight": 426,
        "webformatWidth": 640,
        "likes": 35,
        "imageWidth": 4714,
        "id": 1031568,
        "user_id": 242387,
        "views": 9730,
        "comments": 2,
        "pageURL": "https://pixabay.com/en/hong-kong-cityscape-china-night-city-pan-1031568/",
        "imageHeight": 3143,
        "webformatURL": "https://pixabay.com/get/e835b20e2df2093ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_640.jpg",
        "type": "photo",
        "previewHeight": 99,
        "tags": "hong kong cityscape china night city panorama urban scene urban skyline city skyline metropolis skyscraper dusk view panoramic hong kong hong kong hong kong hong kong hong kong china",
        "downloads": 4155,
        "user": "Free-Photos",
        "favorites": 39,
        "imageSize": 3317000,
        "previewWidth": 150,
        "userImageURL": "https://cdn.pixabay.com/user/2014/05/07/00-10-34-2_250x250.jpg",
        "previewURL": "https://cdn.pixabay.com/photo/2015/11/07/11/51/cityscape-1031568_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/e83cb80f2af2063ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_1280.jpg",
        "webformatHeight": 426,
        "webformatWidth": 640,
        "likes": 33,
        "imageWidth": 2200,
        "id": 1990267,
        "user_id": 12019,
        "views": 6830,
        "comments": 0,
        "pageURL": "https://pixabay.com/en/hong-kong-city-urban-cityscape-downtown--1990267/",
        "imageHeight": 1467,
        "webformatURL": "https://pixabay.com/get/e83cb80f2af2063ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_640.jpg",
        "type": "photo",
        "previewHeight": 99,
        "tags": "hong kong city urban cityscape downtown skyline skyscrapers buildings architecture sky clouds haze fog smog modern lights glow night evening hdr hong kong hong kong hong kong hong kong hong kong",
        "downloads": 2521,
        "user": "12019",
        "favorites": 38,
        "imageSize": 909425,
        "previewWidth": 150,
        "userImageURL": "",
        "previewURL": "https://cdn.pixabay.com/photo/2017/01/18/16/46/hong-kong-1990267_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/eb34b50d2af3023ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_1280.jpg",
        "webformatHeight": 425,
        "webformatWidth": 640,
        "likes": 29,
        "imageWidth": 4592,
        "id": 2142273,
        "user_id": 386023,
        "views": 5715,
        "comments": 0,
        "pageURL": "https://pixabay.com/en/hong-kong-lantau-island-buddha-religion--2142273/",
        "imageHeight": 3056,
        "webformatURL": "https://pixabay.com/get/eb34b50d2af3023ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_640.jpg",
        "type": "photo",
        "previewHeight": 99,
        "tags": "hong kong lantau island buddha religion temple statue landmark china travel hong kong hong kong hong kong hong kong hong kong buddha buddha buddha temple china",
        "downloads": 2606,
        "user": "tee2tee",
        "favorites": 34,
        "imageSize": 3540994,
        "previewWidth": 150,
        "userImageURL": "",
        "previewURL": "https://cdn.pixabay.com/photo/2017/03/14/08/25/hong-kong-2142273_150.jpg"
    },
    {
        "largeImageURL": "https://pixabay.com/get/eb35b50720f1093ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_1280.jpg",
        "webformatHeight": 479,
        "webformatWidth": 640,
        "likes": 36,
        "imageWidth": 2272,
        "id": 2048858,
        "user_id": 686414,
        "views": 5673,
        "comments": 1,
        "pageURL": "https://pixabay.com/en/hammock-girl-hong-kong-relaxation-no-fea-2048858/",
        "imageHeight": 1703,
        "webformatURL": "https://pixabay.com/get/eb35b50720f1093ed1584d05fb1d4092e375e7d418ac104496f4c27aa3eabcb9_640.jpg",
        "type": "photo",
        "previewHeight": 112,
        "tags": "hammock girl hong kong relaxation no fear of heights relax courageous crazy young woman risk view height swing hammock hong kong hong kong hong kong hong kong hong kong relax relax crazy crazy crazy risk",
        "downloads": 1927,
        "user": "Alexas_Fotos",
        "favorites": 28,
        "imageSize": 676832,
        "previewWidth": 150,
        "userImageURL": "https://cdn.pixabay.com/user/2018/05/31/00-43-58-804_250x250.jpg",
        "previewURL": "https://cdn.pixabay.com/photo/2017/02/08/13/19/hammock-2048858_150.jpg"
    }
]
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

        public componentWillMount() {
            this.getImageList(encodeURI('Hong Kong'));
        }

        public getImageList(countryName: string) {
            const url = "https://pixabay.com/api/?key=" + API_KEY_PIXABAY + "&q=" + countryName + "&image_type=photo";
            fetch(url)
                .then(response => response.json())
                .then((out) => {
                    if (out.hits !== undefined) {
                        if (out.hits.length > 0) {
                            this.setState({ imageList: out.hits });
                        }
                    }
                    
                })
                .catch(err => alert('getImageList(): ' + err)
                );
        }

    }
)