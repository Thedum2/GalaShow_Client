export class UpdateViewerAvatarsRequest {
  data: Array<{
    id: number;
    order: number;
    name: string;
    gifUrl: string;
  }>;

  constructor(
    data: Array<{
      id: number;
      order: number;
      name: string;
      gifUrl: string;
    }>
  ) {
    this.data = data;
  }
}
