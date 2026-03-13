export default interface ReviewInterface {
  _id: string;
  product: string;
  user: {
    _id: string;
    fullname: string;
    profileImageUrl?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
