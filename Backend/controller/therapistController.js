const Therapist = require('../model/Therapist');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const multer = require('multer');
// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

class TherapistController {
    constructor (db) {
        this.db = db;
    } 
    getAllTherapists = async (req, res) => {
        try {
            const therapistCollection = await this.db.getDB().collection('therapists');

            //find and also do projection
            const therapists = await therapistCollection.find({},  {
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                },
              }).toArray();
            if (!therapists.length) return res.status(204).json({ 'message': 'No therapists found' });
            res.json(therapists);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapists' });
            }
      } 
    
      getTherapistById = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapist = await therapistCollection.findOne({ _therapistId: req.params.id },
                {projection: {
                    _id: 0, 
                    userId: "$_userId", 
                    username: "$_username",
                    password: "$_password", // **Keep hashed password for security reasons**
                    email: "$_email",
                    name: "$_name",
                    dateOfBirth: "$_dateOfBirth",
                    phoneNumber: "$_phoneNumber",
                    registrationDate: "$_registrationDate",
                    profilePic: "$_profilePic",
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                    education: "$_education",
                  },
        });
        
            if (!therapist) {
                return res.status(404).json({ 'message': 'Therapist not found' });
            }
        
            res.json(therapist);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
            }
      }

    getTherapistByName = async (req, res) => {
        try {
            if (!req?.body) {
                return res.status(400).json({ 'message': 'Bad Request' });
            }
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapist = await therapistCollection.findOne({ _name: { $regex: new RegExp(req.body.name, 'i') } },
                {projection: {
                    _id: 0, 
                    userId: "$_userId", 
                    username: "$_username",
                    password: "$_password", // **Keep hashed password for security reasons**
                    email: "$_email",
                    name: "$_name",
                    dateOfBirth: "$_dateOfBirth",
                    phoneNumber: "$_phoneNumber",
                    registrationDate: "$_registrationDate",
                    profilePic: "$_profilePic",
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    availability: "$_availability",
                  },
        });
        
            if (!therapist) {
                return res.status(404).json({ 'message': 'Therapist not found' });
            }
        
            res.json(therapist);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
            }
    }

    getTherapistByAddress = async (req, res) => {
        try {
            if (!req?.body) {
                return res.status(400).json({ 'message': 'Bad Request' });
            }
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapist = await therapistCollection.findOne({ _address: req.body.address },
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                    availability: "$_availability",
                  },
        });
        
            if (!therapist) {
                return res.status(404).json({ 'message': 'Therapist not found' });
            }
        
            res.json(therapist);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
            }
    }
    getTherapistByExperience = async (req, res) => {
        try {
            if (!req?.body) {
                return res.status(400).json({ 'message': 'Bad Request' });
            }
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapist = await therapistCollection.findOne({ _experience: req.body.experience },
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                    availability: "$_availability",
                  },
        });
        
            if (!therapist) {
                return res.status(404).json({ 'message': 'Therapist not found' });
            }
        
            res.json(therapist);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
            }
    }
    getTherapistBySpecialization = async (req, res) => {
        try {
            if (!req?.body) {
                return res.status(400).json({ 'message': 'Bad Request' });
            }
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapist = await therapistCollection.findOne({ _specialization: req.body.specialization },
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
                    therapistId: "$_therapistId",
                    role: "$_role",
                    address: "$_address",
                    specialization: "$_specialization",
                    experience: "$_experience",
                    education: "$_education",
                    availability: "$_availability",
                  },
        });
        
            if (!therapist) {
                return res.status(404).json({ 'message': 'Therapist not found' });
            }
        
            res.json(therapist);
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to fetch therapist' });
            }
    }
        
    createTherapist = async (req, res) => {
        try {
            //data we get from request
            const therapistData = req.body;
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = await this.db.getDB().collection('administrators');

            //checking if the therapist has entered all the data
            if (!therapistData.username || !therapistData.password || !therapistData.email || !therapistData.name || !therapistData.dateOfBirth || !therapistData.phoneNumber || !therapistData.address || !therapistData.specialization || !therapistData.experience || !therapistData.education || !therapist.availability) {
                return res.status(400).json({ 'message': 'Missing required fields' });
            }

            //check for duplicate username
            const duplicatePatientUsername = await patientCollection.findOne({ _username: therapistData.username});
            const duplicateTherapistUsername = await therapistCollection.findOne({ _username: therapistData.username});
            const duplicateCustandCriUsername = await customerAndCrisisSupportCollection.findOne({ _username: therapistData.username});
            const duplicateAdministratorUsername = await administratorCollection.findOne({ _username: therapistData.username});
            if(duplicatePatientUsername || duplicateTherapistUsername || duplicateCustandCriUsername || duplicateAdministratorUsername) return res.status(409).json({'message' : 'A user with the same username already exists'});

            //check for duplicate email
            const duplicatePatientEmail = await patientCollection.findOne({ _email: therapistData.email});
            const duplicateTherapistEmail = await therapistCollection.findOne({ _email: therapistData.email});
            const duplicateCustandCriEmail = await customerAndCrisisSupportCollection.findOne({ _email: therapistData.email});
            const duplicateAdministratorEmail = await administratorCollection.findOne({ _email: therapistData.email});
            if(duplicatePatientEmail || duplicateTherapistEmail || duplicateCustandCriEmail || duplicateAdministratorEmail) return res.status(409).json({'message' : 'A user with the same email already exists'});

            //hash the password
            const hashedPassword = await bcrypt.hash(therapistData.password, 10);
            
            const therapist = new Therapist();
            therapist.userId = uuidv4();
            therapist.username = therapistData.username;
            therapist.password = hashedPassword;
            therapist.email = therapistData.email;
            therapist.name = therapistData.name;
            therapist.dateOfBirth = therapistData.dateOfBirth;
            therapist.phoneNumber = therapistData.phoneNumber;
            therapist.registrationDate = Date.now();
            therapist.profilePic = null
            therapist.therapistId = uuidv4();
            therapist.address = therapistData.address;
            therapist.specialization = therapistData.specialization;
            therapist.experience = therapistData.experience;
            therapist.education = therapistData.education;
            therapist.availability = therapistData.availability;

            if (req.file) {
                const profilePic = {
                    data: req.file.buffer, // Store the image buffer directly
                    contentType: req.file.mimetype // Capture the content type
                };
                therapist.profilePic = profilePic;
            }
        
            await therapistCollection.insertOne(therapist);

            res.status(201).json({ 'message': 'Therapist created successfully' });
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to create therapist' });
            }
      }
        
    updateTherapist = async (req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
        
            const therapistId = req.params.id;
            const therapistData = req.body;
        
            const patientCollection = await this.db.getDB().collection('patients');
            const therapistCollection = await this.db.getDB().collection('therapists');
            const customerAndCrisisSupportCollection = await this.db.getDB().collection('customerandcrisissupports');
            const administratorCollection = await this.db.getDB().collection('administrators');

            const existingTherapist = await therapistCollection.findOne({ _therapistId: therapistId });
        
            if (!existingTherapist) {
                return res.status(404).json({ 'message': 'Therapist not found' });
            }

            //check for duplicate username but first check if user is updating
            if (therapistData.username && therapistData.username !== existingTherapist.username) {
                const duplicatePatientUsername = await patientCollection.findOne({ _username: therapistData.username});
                const duplicateTherapistUsername = await therapistCollection.findOne({ _username: therapistData.username});
                const duplicateCustandCriUsername = await customerAndCrisisSupportCollection.findOne({ _username: therapistData.username});
                const duplicateAdministratorUsername = await administratorCollection.findOne({ _username: therapistData.username});
                if(duplicatePatientUsername || duplicateTherapistUsername || duplicateCustandCriUsername || duplicateAdministratorUsername) return res.status(409).json({'message' : 'A user with the same username already exists'});
    
            }
    
            // Check for duplicate email but first check if it is being updated
            if (therapistData.email && therapistData.email !== existingTherapist.email) {
            const duplicatePatientEmail = await patientCollection.findOne({ _email: therapistData.email});
            const duplicateTherapistEmail = await therapistCollection.findOne({ _email: therapistData.email});
            const duplicateCustandCriEmail = await customerAndCrisisSupportCollection.findOne({ _email: therapistData.email});
            const duplicateAdministratorEmail = await administratorCollection.findOne({ _email: therapistData.email});
            if(duplicatePatientEmail || duplicateTherapistEmail || duplicateCustandCriEmail || duplicateAdministratorEmail) return res.status(409).json({'message' : 'A user with the same email already exists'});

            }
            
            // to make updating optional
            const updatedTherapistData = {
                _username: therapistData.username || existingTherapist.username,
                _password: existingTherapist.password, // no or cause it is done below
                _email: therapistData.email || existingTherapist.email,
                _name: therapistData.name || existingTherapist.name,
                _dateOfBirth: therapistData.dateOfBirth || existingTherapist.dateOfBirth,
                _phoneNumber: therapistData.phoneNumber || existingTherapist.phoneNumber,
                _profilePic: existingTherapist.profilePic,
                _address: therapistData.address || existingTherapist.address,
                _specialization: therapistData.specialization || existingTherapist.specialization,
                _experience: therapistData.experience || existingTherapist.experience,
                _education: therapistData.education || existingTherapist.education,
                _availability: therapistData.availability || existingTherapist.availability,
            };
            

            //first check if the profile pic has been changed
            if (req.file) {
                const profilePic = {
                    data: req.file.buffer, // Store the image buffer directly
                    contentType: req.file.mimetype // Capture the content type
                };
                updatedTherapistData._profilePic = profilePic;
            }
            //updated password is hashed but this is done only if password is updated
            if (therapistData.password) {
                const hashedPassword = await bcrypt.hash(therapistData.password, 10);
                updatedTherapistData._password = hashedPassword;
            }


            const result = await therapistCollection.updateOne(
                { _therapistId: therapistId },
                { $set: updatedTherapistData }
            );

            // Check if the update was successful
            if (result.modifiedCount === 0) {
                return res.status(400).json({ 'message': 'No fields updated' });
            }

            res.json({ 'message': 'Therapist updated successfully', 'updatedPatient': updatedTherapistData });
            } catch (error) {
            res.status(500).json({ 'message': 'Failed to update therapist' });
            }
      }

    deleteTherapist = async (req, res) => {
        try {
            if (!req?.params?.id) {
              return res.status(400).json({ 'message': 'ID parameter is required' });
            }
      
            const therapistId = req.params.id;
            const therapistCollection = await this.db.getDB().collection('therapists');
            const therapist = await therapistCollection.findOne({ _therapistId: therapistId });

            if(!therapist) {
                return res.status(204).json({ "message": `No therapist matches ID ${req.body.id}.` })
            }
            await therapistCollection.deleteOne({ _therapistId: therapistId });
            res.json( { "message": 'Therapist successfully deleted ' });
            } catch (error) {
                res.status(500).json({ 'message': 'Failed to delete therapist' });
            }
        }
    }

    




module.exports = TherapistController;