import {httpClient} from "../httpClient";
import {PolicyLinks} from "@/api/model/response/policy/PolicyLinks";

export const PoliciesApi = {
    get(): Promise<PolicyLinks> {
        return httpClient.get<PolicyLinks>("/policies", PolicyLinks.fromJSON);
    }
};
