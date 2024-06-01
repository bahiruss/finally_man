const Resource = require('../model/Resource');
const { v4: uuidv4 } = require('uuid');

class ResourceController {

    constructor (db) {
        this.db = db;
    }

    getResources = async (req, res) => {
        try{
            const { page = 1, limit = 10 } = req.query; 

            const resourceCollection = await this.db.getDB().collection('resources');

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const resources = await resourceCollection.find({}, {
                projection: {
                    _id: 0,
                    resourceId: "$_resourceId",
                    resourceTitle: "$_resourceTitle",
                    resourceDescription: "$_resourceDescription",
                    resourceCreatorId: "$_resourceCreatorId",
                    resourceAuthor: "$_resourceAuthor",
                    // resourceContent: "$_resourceContent",
                    resourceTimeStamp: "$_resourceTimeStamp",
                    likes: "$_likes",
                    comments: "$_comments"
                }
            }).sort({ _resourceTimeStamp: -1 }).skip(startIndex).limit(limit).toArray();

            if (!resources.length) return res.status(204).json({ message: 'No resources found' });

            res.json(resources);

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch resources' });
        }
    }

    getResourceById = async (req, res) => {
        try{
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const resourceCollection = await this.db.getDB().collection('resources');

            const resource = await resourceCollection.findOne({ _resourceId: req.params.id }, {
                projection: {
                    _id: 0,
                    resourceId: "$_resourceId",
                    resourceTitle: "$_resourceTitle",
                    resourceDescription: "$_resourceDescription",
                    resourceCreatorId: "$_resourceCreatorId",
                    resourceAuthor: "$_resourceAuthor",
                    resourceContent: "$_resourceContent",
                    resourceTimeStamp: "$_resourceTimeStamp",
                    likes: "$_likes",
                    comments: "$_comments"
                }
            })

            if (!resource) return res.status(204).json({ message: 'No resource found' });

            res.json(resource);

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch resource' });
        }    
    }

    getResourceByTitleORAuthor = async (req, res) => {
        try{
            const { page = 1, limit = 10, search = '' } = req.query; 

            const resourceCollection = await this.db.getDB().collection('resources');

            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            //the search query
            const searchQuery = {
                $or: [
                    { _resourceTitle: { $regex: search, $options: 'i' } },
                    { _resourceAuthor: { $regex: search, $options: 'i' } }
                ]
            };

            const resources = await resourceCollection.find({searchQuery}, {
                projection: {
                    _id: 0,
                    resourceId: "$_resourceId",
                    resourceTitle: "$_resourceTitle",
                    resourceDescription: "$_resourceDescription",
                    resourceCreatorId: "$_resourceCreatorId",
                    resourceAuthor: "$_resourceAuthor",
                    // resourceContent: "$_resourceContent",
                    resourceTimeStamp: "$_resourceTimeStamp",
                    likes: "$_likes",
                    comments: "$_comments"
                }
            }).sort({ _resourceTimeStamp: -1 }).skip(startIndex).limit(limit).toArray();

            if (!resources.length) return res.status(204).json({ message: 'No resources found' });

            res.json(resources);

        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch resources' });
        }     
    }

    createResource  = async (req, res) => {
        try{
            const resourceData = req.body;

            const resourceCollection = await this.db.getDB().collection('resources');
            const therapistCollection = await this.db.getDB().collection('therapists');

            //check for missing fields
            if(!resourceData.resourceTitle || !resourceData.resourceDescription || !resourceData.resourceCreatorId || !resourceData.resourceAuthor || !resourceData.resourceContent) {
                return res.status(400).json({ message: 'Missing required fields! '});
            }

            const therapist = await therapistCollection.findOne({ _userId: resourceData.resourceCreatorId}) ;

            if(!therapist) return res.status(400).json({ message: 'User is not a therapist'});

            const resource = new Resource();
            resource.resourceId = uuidv4()
            resource.resourceTitle = resourceData.resourceTitle;  
            resource.resourceDescription = resourceData.resourceDescription;
            resource.resourceCreatorId = therapist._therapistId;
            resource.resourceAuthor = resourceData.resourceAuthor;
            resource.resourceContent = resourceData.resourceDescription.length > 60 ? resourceData.resourceDescription.substring(0, 60) + '...' : resourceData.resourceDescription;
            resource.resourceTimeStamp = new Date();

            await resourceCollection.insertOne(resource);
            res.status(201).json({ message: 'resource created successfully', 'createdResource': resource });

        } catch (error) {
            res.status(500).json({ message: 'Failed to create resource'});
        }     
    }

    updateResource  = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }

            const resourceData = req.body;
            const resourceId = req.params.id;

            const resourceCollection = await this.db.getDB().collection('resources');

            const existingResource = await resourceCollection.findOne({ _resourceId: resourceId });

            if (!existingResource) {
                return res.status(404).json({ message: 'Resource not found' });
            }

            const updatedData = { 
                resourceTitle: resourceData.resourceTitle ? resourceData.resourceTitle : existingResource.resourceTitle,
                resourceContent: resourceData.resourceContent ? resourceData.resourceContent : existingResource.resourceContent,
                resourceDescription: resourceData.resourceContent ? 
                                        (resourceData.resourceContent.length > 60 ? 
                                        resourceData.resourceContent.substring(0, 60) + '...' : 
                                        resourceData.resourceData.resourceDescription ): 
                                        existingResource.resourceDescription,
            }

            const result = await resourceCollection.updateOne(
                { _resourceId: resourceId},
                { $set: {
                    _resourceTitle: updatedData.resourceTitle ,
                    _resourceContent: updatedData.resourceContent,
                    _resourceDescription: updatedData.resourceDescription
                }}
            );
            res.json({ message: 'Resource updated successfully' , updatedResource: result})
        } catch (error) {
            res.status(500).json({ message: 'Failed to update resource' });
        }
    }

    makeComment = async (req, res) => {
        try {
            const { comment } = req.body;
            const resourceId = req.params.id;
    
            if (!comment || !resourceId) {
                return res.status(400).json({ message: 'Missing required fields!' });
            }
    
            const resourceCollection = await this.db.getDB().collection('resources');
            const existingResource = await resourceCollection.findOne({ _resourceId: resourceId });
    
            if (!existingResource) {
                return res.status(404).json({ message: 'Resource not found' });
            }
    
            await resourceCollection.updateOne(
                { _resourceId: resourceId },
                { $push: { _comments: comment } }
            );
    
            res.status(200).json({ message: 'Comment added successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add comment' });
        }
    }
    

    giveALike = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ message: 'Resource ID is required' });
            }
    
            const resourceCollection = await this.db.getDB().collection('resources');
            const existingResource = await resourceCollection.findOne({ _resourceId: req.params.id });
    
            if (!existingResource) {
                return res.status(404).json({ message: 'Resource not found' });
            }
    
            // increase like count by one
            await resourceCollection.updateOne(
                { _resourceId: req.params.id },
                { $inc: { _likes: 1 } }
            );
    
            res.status(200).json({ message: 'Liked successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to add like' });
        }
    }
    

    deleteResource =  async (req, res) => {
      try {
        if (!req?.params?.id) {
            return res.status(400).json({ message: 'Resource ID is required' });
        }

        const resourceCollection = await this.db.getDB().collection('resources');
        const existingResource = await resourceCollection.findOne({ _resourceId: req.params.id });

        if (!existingResource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        await resourceCollection.deleteOne({ _resourceId: req.params.id });
        res.json({ message: 'Resource deleted successfully'})
      } catch (error) {
        res.status(500).json({ message: 'Failed to delete message' });
      } 
    }
}

module.exports = ResourceController;