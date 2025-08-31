export class PolicyLinks {
    termsOfService: string;
    privacyPolicy: string;

    private constructor(t: string, p: string) {
        this.termsOfService = t;
        this.privacyPolicy = p;
    }

    static fromJSON(j: any): PolicyLinks {
        return new PolicyLinks(String(j?.termsOfService ?? ""), String(j?.privacyPolicy ?? ""));
    }
}
