export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(slug: string) {
    return new Slug(slug);
  }

  /**
   * Reveives a string and normaliz it as a slud
   *
   * Example: "An exemple Title" => "an-example-title"
   *
   * @param text
   */

  static creteFromText(text: string) {
    const slugText = text
      .normalize("NFKD")
      // NFKD desmonsta caracteres os diferenciando das partes especiais, já o NFKC ele monta os caracteres as suas pastes especiais.
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/_/g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/g, "");

    return new Slug(slugText);
  }
}
