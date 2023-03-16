const multer = require('multer');
const fs = require('fs');
const path = require('path');


const createStorageEngine = (folderName) => {
    const storage = multer.diskStorage({
        destination: async (req, file, cb) => {
            const directory = `uploads/${folderName}`;
            try {
                await fs.promises.mkdir(directory, { recursive: true });
                cb(null, directory);
            } catch (err) {
                cb(err);
            }
        },
        filename: (req, file, cb) => {

            const username = req.body.email.split('@')[0];
            if (folderName != 'profile') {
                username = file.originalname.split('.')[0];
            }
            const fileName = `${username}.jpg`;

            // Call the callback function with the filename
            cb(null, fileName);
        }
    });

    return multer({ storage: storage });
};

// upload image from data and filename as parameter and return the path
const uploadMessageImage = async (data, filename) => {

    // create uploads/messages directory if not exists
    const directory = `uploads/messages`;
    filename = `${filename}.jpg`;
    const filePath = path.join(directory, filename);
    try {
        await fs.promises.mkdir(directory, { recursive: true });

    } catch (err) {
        console.log(err);
    }
    // Write the file to the disk
    fs.writeFileSync(filePath, data);

    // Return the URL of the uploaded file
    return `${process.env.DOMAIN}/uploads/messages/${filename}`;
};

module.exports = {
    profilePictureUploader: createStorageEngine('profile'),
    uploadMessageImage,
}