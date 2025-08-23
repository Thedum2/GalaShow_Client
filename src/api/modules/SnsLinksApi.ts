import {httpClient} from "../httpClient";
import {SnsLink} from "@/model/response/sns/SnsLink";

export const SnsLinksApi = {
    get(): Promise<SnsLink[]> {
        return httpClient.getList<SnsLink>("/sns-links", SnsLink.fromJSON);
    }
};
