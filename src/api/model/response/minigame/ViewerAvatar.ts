export class ViewerAvatar {
  id: number;
  order: number;
  name: string;
  gifUrl: string;

  private constructor(id: number, order: number, name: string, gifUrl: string) {
    this.id = id;
    this.order = order;
    this.name = name;
    this.gifUrl = gifUrl;
  }

  static fromJSON(j: any): ViewerAvatar {
    return new ViewerAvatar(
      Number(j?.id ?? 0),
      Number(j?.order ?? 0),
      String(j?.name ?? ""),
      String(j?.gifUrl ?? "")
    );
  }
}
