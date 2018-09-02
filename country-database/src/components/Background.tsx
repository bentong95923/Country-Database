import * as React from "react";
import { API_KEY_PIXABAY } from '../AppData';

interface IBackground {
    winHeight: number,
    backgroundImgUrl: string,
    apiError: boolean,
}

const searchBackgroundKeyword = "scenery";

export default class Background extends React.Component<{}, IBackground> {

    constructor(props: any) {
        super(props);
        this.state = {
            winHeight: window.innerHeight,
            backgroundImgUrl: "",
            apiError: false,
        }
    }

    public render() {
        return (
            <div id="background"
                style={{
                    backgroundImage: `url(${this.state.backgroundImgUrl})`,
                    height: this.state.winHeight,
                }}
            />
        );
    }

    public updateResolution = () => {
        this.setState({ winHeight: window.innerHeight });
    }

    public componentDidMount() {
        this.getBackgroundImage(searchBackgroundKeyword);
        window.addEventListener('resize', this.updateResolution);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.updateResolution);
    }

    /* Suggestion only: Display one of the country pic if found any pics, othervise use random pics */
    public getBackgroundImage = (keyword: string) => {
        const url = "https://pixabay.com/api/?key=" + API_KEY_PIXABAY + "&q=" + encodeURI(keyword) + "&image_type=photo&safesearch=true&editors_choice=true";
        fetch(url)
            .then(response => response.json())
            .then((out) => {
                // alert(JSON.stringify(out));
                if (out.hits !== undefined) {
                    if (out.hits.length >= 3) {
                        const randNum = Math.floor(Math.random() * out.hits.length);
                        this.setState({ backgroundImgUrl: out.hits[randNum].largeImageURL });
                    }
                }
            })
            .catch(err => {
                if (!this.state.apiError) {
                    // alert('getBackgroundImage(): ' + err);
                    this.setState({ apiError: true })
                }
                return;
            });
    }
}