import {IShape} from "../components/SvgPanel/ShapeHandler";
import {ToastAndroid} from "react-native";

export default class API {
    private language = "de";
    private retryTime = 10000;
    private maxRetryAttempts = 5;
    private onError: (data: any) => void;
    private onResult: (data: any) => void;
    private retryAttempts = new Map<number, number>();
    private SUBSCRIPTION_KEY = '7f8cc438a1524b2f826b5e3fb9824633';

    constructor(onResult: (data: any) => void, onError: (data: any) => void) {
        this.onError = onError;
        this.onResult = onResult;
    }

    public sendData(data: IShape[], id: number) {
        id = Number(id);

        if (!data || data.length === 0) {
            return;
        }

        this.fetch(data, id).then(result => {
            if (result.recognitionUnits) {

                if (result.recognitionUnits[0]) {
                    this.onResult(result.recognitionUnits[0]);
                }

                //sometimes an empty result gets parsed back
            } else {
                this.handleError(result, data, id)
            }
        }).catch(error => {
            this.handleError(error, data, id)
        });
    }

    private handleError(error: any, data: IShape[], id: number) {
        id = Number(id);
        if (error.error && error.error.code === "429") {
            // console.log("[API] error 429", error.error.message)
            if (this.checkAttemptExceeded(id)) {
                ToastAndroid.show("Tried to submit shapes " + this.maxRetryAttempts + " but the server is overallocated.", 5000);
            } else {
                this.addAttempt(id);
                setTimeout(() => this.sendData(data, id), this.retryTime);
            }
        } else {
            this.onError(error)
        }
    }

    private addAttempt(id: number) {
        const attempts = this.retryAttempts.get(id);

        console.log(id + " attempts", attempts);
        this.retryAttempts.set(id, attempts === undefined ? 1 : attempts + 1);
    }

    private checkAttemptExceeded(id: number) {
        const attempts = this.retryAttempts.get(id);
        return attempts !== undefined && attempts > this.maxRetryAttempts;
    }

    private fetch(data: IShape[], id: number) {
        const postData = this.buildBody(data, id);

        return fetch('https://api.cognitive.microsoft.com/inkrecognizer/v1.0-preview/recognize', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': this.SUBSCRIPTION_KEY,
            },
            body: JSON.stringify(postData),
        }).then(response => response.json());
    }

    private buildBody(strokes: IShape[], id: number) {

        return {
            language: this.language,
            'strokes': strokes ? strokes.map((x: IShape, index: number) => {
                const line = x.line.substring(1).trim().replace(/[^0-9]+/g, ",");

                const posid = id.toString() + ("0" + index).slice(-2);

                return {
                    'id': Number(posid),
                    'points': line
                }
            }) : []
        }
    }
}
