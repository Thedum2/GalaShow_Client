import {httpClient} from "@/api";
import {BackgroundAsset} from "@/api/model/response/background/BackgroundAsset";

export const BackgroundApi = {
    get(): Promise<BackgroundAsset[]> {
        return httpClient.getList<BackgroundAsset>("/background", BackgroundAsset.fromJSON);
    }
};
