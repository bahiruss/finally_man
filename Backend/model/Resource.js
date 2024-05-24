class Resource {
    constructor(resourceId, resourceTitle, resourceDescription, resourceCreatorId, resourceAuthor, resourceContent, resourceTimeStamp){
        this._resourceId = resourceId;
        this._resourceTitle = resourceTitle;
        this._resourceDescription = resourceDescription;
        this._resourceCreatorId = resourceCreatorId
        this._resourceAuthor = resourceAuthor;
        this._resourceContent = resourceContent;
        this._resourceTimeStamp = resourceTimeStamp;
        this._likes = likes || 0;
        this._comments = comments || [];
    }

    get resourceId() {
        return this._resourceId;
    }

    get resourceTitle() {
        return this._resourceTitle;
    }

    get resourceDescription() {
        return this._resourceDescription;
    }

    get resourceCreatorId() {
        return this._resourceCreatorId;
    }

    get resourceAuthor() {
        return this._resourceAuthor;
    }

    get resourceContent() {
        return this._resourceContent;
    }

    get resourceTimeStamp() {
        return this._resourceTimeStamp;
    }

    get likes() {
        return this._likes;
    }

    get comments() {
        return this._comments;
    }

    
    set resourceId(value) {
        this._resourceId = value;
    }

    set resourceTitle(value) {
        this._resourceTitle = value;
    }

    set resourceDescription(value) {
        this._resourceDescription = value;
    }

    set resourceCreatorId(value) {
        this._resourceCreatorId = value;
    }

    set resourceAuthor(value) {
        this._resourceAuthor = value;
    }

    set resourceContent(value) {
        this._resourceContent = value;
    }

    set resourceTimeStamp(value) {
        this._resourceTimeStamp = value;
    }

    set likes(value) {
        this._likes = value;
    }

    set comments(value) {
        this._comments = value;
    }
}

module.exports = Resource;