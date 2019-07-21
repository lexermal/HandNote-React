import {Dimensions} from "react-native";

export default class Utils {
    public static getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    public static getUnusedId(validation: (id: number) => boolean): number {
        let id = Utils.getRandomInt(9999999);

        while (validation(id)) {
            id = Utils.getRandomInt(9999999);
        }

        return id;
    }

    public static getWidth(): number {
        return Dimensions.get('window').width;
    }
}
