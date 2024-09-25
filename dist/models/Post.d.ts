declare class Post {
    id: string;
    author: string;
    publishedAt: Date;
    title: string;
    description: string | null;
    likes: number;
    userLiked: boolean;
    imageUrl: string | null;
    dateString: string;
    constructor(id: string, author: string, publishedAt: Date, title: string, description: string | null, likes: number, userLiked?: boolean, imageUrl?: string | null);
}
export default Post;
