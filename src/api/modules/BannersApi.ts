import {httpClient} from "../httpClient";
import {Banner} from "@/api/model/response/banner/Banner";

export const BannersApi = {
    get(): Promise<Banner[]> {
        return httpClient.getList<Banner>("/banners", Banner.fromJSON);
    }
};
