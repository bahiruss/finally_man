class Forum {
    constructor(forumId, forumTitle, forumDescription, forumCreatorId, forumTimeStamp, forumTotalPosts, likes) {
        this._forumId = forumId;
        this._forumTitle = forumTitle;
        this._forumDescription = forumDescription;
        this._forumCreatorId = forumCreatorId;
        this._forumTimeStamp = forumTimeStamp;
        this._forumTotalPosts = forumTotalPosts;
        this._likes = likes;
    }

    // Getters
    get forumId() {
        return this._forumId;
    }

    get forumTitle() {
        return this._forumTitle;
    }

    get forumDescription() {
        return this._forumDescription;
    }

    get forumCreatorId() {
        return this._forumCreatorId;
    }

    get forumTimeStamp() {
        return this._forumTimeStamp;
    }

    get forumTotalPosts() {
        return this._forumTotalPosts;
    }

    get likes() {
        return this._likes;
    }

    // Setters
    set forumId(value) {
        this._forumId = value;
    }

    set forumTitle(value) {
        this._forumTitle = value;
    }

    set forumDescription(value) {
        this._forumDescription = value;
    }

    set forumCreatorId(value) {
        this._forumCreatorId = value;
    }

    set forumTimeStamp(value) {
        this._forumTimeStamp = value;
    }

    set forumTotalPosts(value) {
        this._forumTotalPosts = value;
    }

    set likes(value) {
        this._likes = value;
    }
}

module.exports = Forum;