const multer = require('multer');
const fs = require('fs');

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

module.exports = {
    profilePictureUploader: createStorageEngine('profile'),
}