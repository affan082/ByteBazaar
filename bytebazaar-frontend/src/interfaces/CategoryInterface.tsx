export interface CategoryInterface {
  name: string;
  slug: string;
  _id: string;
  parent?: string | { _id: string; name: string; slug?: string } | null;
  description: string;
}
