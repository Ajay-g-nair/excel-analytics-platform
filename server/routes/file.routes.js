const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');
const auth = require('../middleware/auth.middleware');
const ExcelData = require('../models/excelData.model');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', auth, upload.single('excelFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // --- UPDATED PARSING LOGIC ---
        // This creates an array of arrays, which is better for unstructured data.
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        const newExcelData = new ExcelData({
            userId: req.user,
            filename: req.file.originalname,
            data: jsonData, // Save the new array of arrays structure
        });

        await newExcelData.save();
        console.log('--- Data saved to MongoDB successfully! ---');

        res.status(200).json({ 
            message: 'File processed and data saved successfully!',
        });

    } catch (error) {
        console.error('Error processing and saving file:', error);
        res.status(500).send('Error processing file.');
    }
});

// GET route is unchanged
router.get('/my-files', auth, async (req, res) => {
    try {
        const files = await ExcelData.find({ userId: req.user }).sort({ createdAt: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;