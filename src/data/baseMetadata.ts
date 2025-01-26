export class BaseMetadata {
  name!: string | undefined;
  description!: string | undefined;
  keywords!: string | undefined;
  canonical!: string | undefined;
  author!: string | undefined;
  generator!: string | undefined;

  constructor() {
    this.name = "";
    this.description = "";
    this.keywords = "";
    this.canonical = "";
    this.author = "";
    this.generator = "";
  }
}
