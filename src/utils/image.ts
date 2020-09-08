// Class
export class Image {
  // Attributes
  private _url: string | null = null;

  // Constructor
  constructor(
    readonly blob: Blob
  ) {}

  // Static methods
  static fromDataUrl(url: string): Image {
    // Decompose url
    if (!/^data:([^;]+);base64,(.+)$/.test(url)) {
      throw Error('Invalid data URL !');
    }

    const mime = RegExp.$1;
    const data = RegExp.$2;

    // Decode
    const binary = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    const blob = new Blob([binary], { type: mime });

    return new Image(blob);
  }

  // Methods
  free() {
    if (this._url) {
      URL.revokeObjectURL(this._url);
      this._url = null;
    }
  }

  toString(): string {
    return this.url;
  }

  // Properties
  get url(): string {
    // Create url
    if (!this._url) {
      this._url = URL.createObjectURL(this.blob);
    }

    return this._url
  }
}
