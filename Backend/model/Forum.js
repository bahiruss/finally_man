class Forum {
    constructor(forumId, forumTitle, forumDescription, forumCategory, forumCreatorId, forumCreatorName, role, forumTimeStamp, forumTotalPosts, likes, likesBy = []) {
        this._forumId = forumId;
        this._forumTitle = forumTitle;
        this._forumDescription = forumDescription;
        this._forumCategory = forumCategory;
        this._forumCreatorId = forumCreatorId;
        this._forumCreatorName = forumCreatorName;
        this._role = role;
        this._forumTimeStamp = forumTimeStamp;
        this._forumTotalPosts = forumTotalPosts;
        this._likes = likes;
        this._likesBy = likesBy;
    }

    // Getters
    get forumId() { return this._forumId; }
    get forumTitle() { return this._forumTitle; }
    get forumDescription() { return this._forumDescription; }
    get forumCategory() { return this._forumCategory; }
    get forumCreatorId() { return this._forumCreatorId; }
    get forumCreatorName() { return this._forumCreatorName; }
    get role() { return this._role; }
    get forumTimeStamp() { return this._forumTimeStamp; }
    get forumTotalPosts() { return this._forumTotalPosts; }
    get likes() { return this._likes; }
    get likesBy() { return this._likesBy; }

    // Setters
    set forumId(value) { this._forumId = value; }
    set forumTitle(value) { this._forumTitle = value; }
    set forumDescription(value) { this._forumDescription = value; }
    set forumCategory(value) { this._forumCategory = value; }
    set forumCreatorId(value) { this._forumCreatorId = value; }
    set forumCreatorName(value) { this._forumCreatorName = value; }
    set role(value) { this._role = value; }
    set forumTimeStamp(value) { this._forumTimeStamp = value; }
    set forumTotalPosts(value) { this._forumTotalPosts = value; }
    set likes(value) { this._likes = value; }
    set likesBy(value) { this._likesBy = value; }
}

module.exports = Forum;
