"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Post = /** @class */ (function () {
    function Post(id, author, publishedAt, title, description, likes, userLiked, imageUrl) {
        if (userLiked === void 0) { userLiked = false; }
        if (imageUrl === void 0) { imageUrl = null; }
        this.userLiked = false;
        this.imageUrl = null;
        this.id = id;
        this.author = author;
        this.publishedAt = publishedAt;
        this.title = title;
        this.description = description;
        this.likes = likes;
        this.userLiked = userLiked;
        this.imageUrl = imageUrl;
        // format to "January 1, 2021 16:00"
        this.dateString = this.publishedAt.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
    }
    return Post;
}());
exports.default = Post;
