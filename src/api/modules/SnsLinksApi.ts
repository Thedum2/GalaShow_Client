import {httpClient} from "@/api";
import {SnsLink} from "@/api/model/response/sns/SnsLink";

export const SnsLinksApi = {
    get(): Promise<SnsLink[]> {
        return httpClient.getList<SnsLink>("/sns-links", SnsLink.fromJSON);
    }
};
