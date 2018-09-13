import * as React from "react";
import { SEARCH_BACKGROUND_KEYWORD } from "../AppConfig";
import { API_KEY_PIXABAY } from '../AppData';

// Interface
interface IBackground {
    winHeight: number,
    backgroundImgUrl: string,
    apiError: boolean,
}

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
        this.getBackgroundImage(SEARCH_BACKGROUND_KEYWORD);
        window.addEventListener('resize', this.updateResolution);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.updateResolution);
    }

    public getBackgroundImage = (keyword: string) => {
        const url = "https://pixabay.com/api/?key=" + API_KEY_PIXABAY + "&q=" + encodeURI(keyword) + "&image_type=photo&safesearch=true&editors_choice=true";
        fetch(url)
            .then(response => response.json())
            .then((out) => {
                if (out.hits !== undefined) {
                    if (out.hits.length >= 3) {
                        const randNum = Math.floor(Math.random() * out.hits.length);
                        this.setState({ backgroundImgUrl: out.hits[randNum].largeImageURL });
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