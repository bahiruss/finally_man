class ForumPost {
    constructor(postId, forumId, authorId, postContent, postTimeStamp, likes, comments) {
        this._postId = postId;
        this._forumId = forumId;
        this._authorId = authorId;
        this._postContent = postContent;
        this._postTimeStamp = postTimeStamp;
        this._likes = likes;
        this._comments = comments;
    }

     // Getters
     get postId() {
        return this._postId;
    }

    get forumId() {
        return this._forumId;
    }

    get authorId() {
        return this._authorId;
    }

    get postContent() {
        return this._postContent;
    }

    get postTimeStamp() {
        return this._postTimeStamp;
    }

    get likes() {
        return this._likes;
    }

    get comments() {
        return this._comments;
    }

    // Setters
    set postId(value) {
        this._postId = value;
    }

    set forumId(value) {
        this._forumId = value;
    }

    set authorId(value) {
        this._authorId = value;
    }

    set postContent(value) {
        this._postContent = value;
    }

    set postTimeStamp(value) {
        this._postTimeStamp = value;
    }

    set likes(value) {
        this._likes = value;
    }

    set comments(value) {
        this._comments = value;
    }
}

module.exports = ForumPost;