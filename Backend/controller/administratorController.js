const Administrator = require('../model/Administrator');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const multer = require('multer');
// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

class AdministratorController {
    constructor (db) {
        this.db = db;
    }
    getAllAdministrator = async (req, res) => {
        try {
            const administratorCollection = await this.db.getDB().collection('administrators');

            //find and also do projection
            const administrators = await administratorCollection.find({},  {
                projection: {
                    _id: 0, 
                    userId: "$_userId", 
                    username: "$_username",
                    password: "$_password",  
                    email: "$_email",
                    name: "$_name",
                    dateOfBirth: "$_dateOfBirth",
                    phoneNumber: "$_phoneNumber",
                    registrationDate: "$_registrationDate",
                    profilePic: "$_profilePic",
                    adminId: "$_adminId",
                    role: "$_role",
                },
              }).toArray();
            if (!administrators.length) return res.status(204).json({ 'message': 'No administrators found' });
            res.json(administrators);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch administrators' });
            }
      } 
    
      getAdministrator = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const administratorCollection = await this.db.getDB().collection('administrators');
            const administrator = await administratorCollection.findOne({ _adminId: req.params.id },
                {projection: {
                    _id: 0, 
                    userId: "$_userId", 
                    username: "$_username",
                    password: "$_password", 
                    email: "$_email",
                    name: "$_name",
                    dateOfBirth: "$_dateOfBirth",
                    phoneNumber: "$_phoneNumber",
                    registrationDate: "$_registrationDate",
                    profilePic: "$_profilePic",
                    adminId: "$_adminId",
                    role: "$_role",
                  },
        });
        
            if (!administrator) {
                return res.status(404).json({ 'message': 'Administrator not found' });
            }
        
            res.json(administrator);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch administrator' });
            }
      }
        
    createAdministrator = async (req, res) => {
        try {
            //data we get from request
            const administratorData = req.body;
            
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = await this.db.getDB().collection('administrators');

            //checking if the administrator has entered all the data
            if (!administratorData.username || !administratorData.password || !administratorData.email || !administratorData.name || !administratorData.dateOfBirth || !administratorData.phoneNumber) {
                return res.status(400).json({ 'message': 'Missing required fields' });
            }

            //check for duplicate username
            const duplicatePatientUsername = await patientCollection.findOne({ _username: administratorData.username});
            const duplicateTherapistUsername = await therapistCollection.findOne({ _username: administratorData.username});
            const duplicateCustandCriUsername = await customerAndCrisisSupportCollection.findOne({ _username: administratorData.username});
            const duplicateAdministratorUsername = await administratorCollection.findOne({ _username: administratorData.username});
            if(duplicatePatientUsername || duplicateTherapistUsername || duplicateCustandCriUsername || duplicateAdministratorUsername) return res.status(409).json({'message' : 'A user with the same username already exists'});

            //check for duplicate email
            const duplicatePatientEmail = await patientCollection.findOne({ _email: administratorData.email});
            const duplicateTherapistEmail = await therapistCollection.findOne({ _email: administratorData.email});
            const duplicateCustandCriEmail = await customerAndCrisisSupportCollection.findOne({ _email: administratorData.email});
            const duplicateAdministratorEmail = await administratorCollection.findOne({ _email: administratorData.email});
            if(duplicatePatientEmail || duplicateTherapistEmail || duplicateCustandCriEmail || duplicateAdministratorEmail) return res.status(409).json({'message' : 'A user with the same email already exists'});

            //hash the password
            const hashedPassword = await bcrypt.hash(administratorData.password, 10);
            
            const administrator = new Administrator();
            administrator.userId = uuidv4();
            administrator.username = administratorData.username;
            administrator.password = hashedPassword;
            administrator.email = administratorData.email;
            administrator.name = administratorData.name;
            administrator.dateOfBirth = administratorData.dateOfBirth;
            administrator.phoneNumber = administratorData.phoneNumber;
            administrator.registrationDate = Date.now();
            administrator.profilePic = null
            administrator.adminId = uuidv4();

            if (req.file) {
                const profilePic = {
                    data: req.file.buffer, // Store the image buffer directly
                    contentType: req.file.mimetype // Capture the content type
                };
                administrator.profilePic = profilePic;
            }
        
            await administratorCollection.insertOne(administrator);

            res.status(201).json({ 'message': 'Administrator created successfully' });
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to create administrator' });
            }
      }
        
    updateAdministrator = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
        
            const adminId = req.params.id;
            const administratorData = req.body;
        
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = await this.db.getDB().collection('administrators');

            const existingAdministrator = await administratorCollection.findOne({ _adminId: adminId });
        
            if (!existingAdministrator) {
                return res.status(404).json({ 'message': 'Patient not found' });
            }

            //check for duplicate username but first check if user is updating
            if (administratorData.username && administratorData.username !== existingAdministrator._username) {
                const duplicatePatientUsername = await patientCollection.findOne({ _username: administratorData.username});
                const duplicateTherapistUsername = await therapistCollection.findOne({ _username: administratorData.username});
                const duplicateCustandCriUsername = await customerAndCrisisSupportCollection.findOne({ _username: administratorData.username});
                const duplicateAdministratorUsername = await administratorCollection.findOne({ _username: administratorData.username});
                if(duplicatePatientUsername || duplicateTherapistUsername || duplicateCustandCriUsername || duplicateAdministratorUsername) return res.status(409).json({'message' : 'A user with the same username already exists'});
    
            }
    
            // Check for duplicate email but first check if it is being updated
            if (administratorData.email && administratorData.email !== existingAdministrator._email) {
            const duplicatePatientEmail = await patientCollection.findOne({ _email: administratorData.email});
            const duplicateTherapistEmail = await therapistCollection.findOne({ _email: administratorData.email});
            const duplicateCustandCriEmail = await customerAndCrisisSupportCollection.findOne({ _email: administratorData.email});
            const duplicateAdministratorEmail = await administratorCollection.findOne({ _email: administratorData.email});
            if(duplicatePatientEmail || duplicateTherapistEmail || duplicateCustandCriEmail || (duplicateAdministratorEmail && duplicateAdministratorEmail._adminId !== adminId)) return res.status(409).json({'message' : 'A user with the same email already exists'});

            }
        
            // to make updating optional
            const updatedAdministratorData = {
                _username: administratorData.username || existingAdministrator._username,
                _password: existingAdministrator._password, // no or cause it is done below
                _email: administratorData.email || existingAdministrator._email,
                _name: administratorData.name || existingAdministrator._name,
                _dateOfBirth: administratorData.dateOfBirth || existingAdministrator._dateOfBirth,
                _phoneNumber: administratorData.phoneNumber || existingAdministrator._phoneNumber,
                _profilePic: existingAdministrator._profilePic
            };

            //first check if the profile pic has been changed
            if (req.file) {
                const profilePic = {
                    data: req.file.buffer, // Store the image buffer directly
                    contentType: req.file.mimetype // Capture the content type
                };
                updatedAdministratorData._profilePic = profilePic;
            }
            //updated password is hashed but this is done only if password is updated
            if (administratorData.password) {
                const hashedPassword = await bcrypt.hash(administratorData.password, 10);
                updatedAdministratorData._password = hashedPassword;
            }


            const result = await administratorCollection.updateOne(
                { _adminId: adminId },
                { $set: updatedAdministratorData }
            );

            // Check if the update was successful
            if (result.modifiedCount === 0) {
                return res.status(400).json({ 'message': 'No fields updated' });
            }

            res.json({ 'message': 'Administrator updated successfully', 'updatedPatient': updatedAdministratorData });
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to update administrator' });
            console.log(error)
            }
      }

    deleteAdministrator = async (req, res) => {
        try {
            if (!req?.params?.id) {
              return res.status(400).json({ 'message': 'ID parameter is required' });
            }
      
            const adminId = req.params.id;
            const administratorCollection = await this.db.getDB().collection('administrators');
            const administrator = await administratorCollection.findOne({ _adminId: adminId });

            if(!administrator) {
                return res.status(404).json({ "message": `No administrator matches ID ${req.body.id}.` })
            }
            await administratorCollection.deleteOne({ _adminId: adminId });
            res.json( { "message": 'Administrator successfully deleted ' });
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to delete administrator' });
            }
        }
    }

    




module.exports = AdministratorController;