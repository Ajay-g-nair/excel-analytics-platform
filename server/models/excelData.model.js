const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const excelDataSchema = new Schema({
    // A reference to the User who uploaded the file.
    // This links the data to a specific user.
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This tells Mongoose the ID belongs to a User model
        required: true,
    },
    // The original name of the uploaded file.
    filename: {
        type: String,
        required: true,
    },
    // The actual data from the Excel file, stored as an array of objects.
    // 'mongoose.Schema.Types.Mixed' allows us to store any kind of data structure.
    data: {
        type: [mongoose.Schema.Types.Mixed],
        required: true,
    },
}, {
    timestamps: true, // Automatically add 'createdAt' and 'updatedAt' fields
});

const ExcelData = mongoose.model('ExcelData', excelDataSchema);

module.exports = ExcelData;