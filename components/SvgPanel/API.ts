import {IShape} from "./ShapeHandler";

export default class API {
    private language = "en-US";
    private onError: (data: any) => void;
    private onResult: (data: any) => void;

    constructor(onResult: (data: any) => void, onError: (data: any) => void) {
        this.onError = onError;
        this.onResult = onResult;
    }

    private buildBody(strokes: IShape[], id: number) {
        return {
            language: this.language,
            'strokes': strokes.map((x: IShape, index: number) => {
                const line = x.line.substring(1).trim().replace(/[^0-9]+/g, ",");

                return {
                    'id': id + index,
                    'points': line
                }
            })
        }
    }

    public sendData(data: IShape[], id: number) {
        this.fetch(data, id).then(data => {
            if (data.recognitionUnits) {

                if (data.recognitionUnits[0]) {
                    this.onResult(data.recognitionUnits[0])
                }

                //sometimes an empty result gets parsed back
            } else {
                this.onError(data)
            }
        }).catch(error => this.onError(error));
    }


    private fetch(data: IShape[], id: number) {
        const postData = this.buildBody(data, id);

        const SUBSCRIPTION_KEY = '7f8cc438a1524b2f826b5e3fb9824633';

        return fetch('https://api.cognitive.microsoft.com/inkrecognizer/v1.0-preview/recognize', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
            },
            body: JSON.stringify(postData),
        }).then(response => response.json());
    }
}
