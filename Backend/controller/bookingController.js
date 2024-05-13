const Booking = require('../model/Booking');
const { v4: uuidv4 } = require('uuid');

class BookingController {
    getBookingsByPatientId = async(req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const bookingCollection = await this.db.getDB().collection('bookings');
            const bookings = await bookingCollection.find({_patientId: req.params.id},{
                projection: {
                    bookingId: '$_bookingId',
                    patientId: '$_patientId',
                    patientName: '$_patientName',
                    therapistId: '$_therapistId',
                    therapistName: '$_therapistName',
                    date: '$_date',
                    timeSlot: '$_timeSlot',
                    isCanceled: '$_isCanceled',
                    canceledBy: '$_canceledBy',

                }
            }).toArray()

            if (!bookings.length) return res.status(204).json({ 'message': 'No bookings found' });
                res.json(bookings);

            } catch (error) {
                res.status(500).json({ 'message': 'Failed to fetch bookings' });
        }
}

    getBookingsBytherapistId = async(req, res) => {
        try {
            if (!req?.params?.id) {
                return res.status(400).json({ 'message': 'ID parameter is required' });
            }
            const bookingCollection = await this.db.getDB().collection('bookings');
            const bookings = await bookingCollection.find({_therapistId: req.params.id},{
                projection: {
                    bookingId: '$_bookingId',
                    patientId: '$_patientId',
                    patientName: '$_patientName',
                    therapistId: '$_therapistId',
                    therapistName: '$_therapistName',
                    date: '$_date',
                    timeSlot: '$_timeSlot',
                    isCanceled: '$_isCanceled',
                    canceledBy: '$_canceledBy',

                }
            }).toArray()

            if (!bookings.length) return res.status(204).json({ 'message': 'No bookings found' });
                res.json(bookings);

            } catch (error) {
                res.status(500).json({ 'message': 'Failed to fetch bookings' });
        }
}

    getBookingById = async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ message: 'Booking ID parameter is required' });
            }

            const bookingCollection = await this.db.getDB().collection('bookings');
            const booking = await bookingCollection.findOne({ _bookingId: req.params.id }, {
                    projection: {
                        bookingId: '$_bookingId',
                        patientId: '$_patientId',
                        patientName: '$_patientName',
                        therapistId: '$_therapistId',
                        therapistName: '$_therapistName',
                        date: '$_date',
                        timeSlot: '$_timeSlot',
                        isCanceled: '$_isCanceled',
                        canceledBy: '$_canceledBy',
    
                    }
            });

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            res.json(booking);
        } catch (error) {
            console.error('Error fetching booking:', error);
            res.status(500).json({ 'message': 'Failed to fetch booking' });
        }
    }

    createBooking = async (req, res) => {
        try {
            const bookingCollection = await this.db.getDB().collection('bookings');
            const bookingData = req.body;

            //check if all fields are there
            if(!bookingData.patientId || !bookingData.patientName ||
            !bookingData.therapistId || !bookingData.therapistName ||
            !bookingData.date || !bookingData.timeSlot || 
            !bookingData.isCanceled || !bookingData.canceledBy){
                return res.status(400).json({ 'message': 'Missing required fields' });
            }

            //check if the booking exists
            const existingBooking = await bookingCollection.findOne({
                _therapistId: bookingData.patientId,
                _date: bookingData.date,
                _timeSlot: bookingData.timeSlot
            })

            if(existingBooking) {
                return res.status(400).json({'message': 'Slot already booked'});
            }

            //create a booking object 
            const booking = new Booking();
            booking.bookingId = uuidv4()
            booking.patientId = bookingData.patientId;
            booking.patientName = bookingData.patientName; 
            booking.therapistId = bookingData.therapistId; 
            booking.therapistName = bookingData.therapistName;
            booking.date = bookingData.date; 
            booking.timeSlot = bookingData.timeSlot;
            booking.isCanceled = bookingData.isCanceled;
            booking.canceledBy = bookingData.canceledBy;

            await bookingCollection.insertOne(booking);

            res.status(201).json({ 'message': 'Booking created successfully' });
        } catch (error) {
            res.status(500).json({ 'message': 'Failed to create booking' });
        }
    }

    cancelBooking = async (req, res) => {
        try {
            const { bookingId } = req.params;
            const { canceledBy } = req.body;

            const bookingCollection = await this.db.getDB().collection('bookings');
            const booking = await bookingCollection.findOneAndUpdate(
                { _id: bookingId },
                { $set: { isCanceled: true, canceledBy } }
            );

            if (!booking) {
                return res.status(404).json({ 'message': 'Booking not found' });
            }

            res.json({ 'message': 'Booking canceled successfully' });
        } catch (error) {
            console.error('Error canceling booking:', error);
            res.status(500).json({ 'message': 'Server Error in canceling booking' });
        }
    }

}

module.exports = BookingController;