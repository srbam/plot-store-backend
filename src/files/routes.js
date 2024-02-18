const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const uploadsDirectory = './src/uploads';

const fileRoutes = [
    {
        method: 'POST',
        path: '/files',
        handler: async (request, h) => {
            if (!request.payload.image) {
                return h.response('Bad Request').code(400);
            }
            try {
                const image = request.payload.image;
                const allowedExtensions = ['jpeg', 'jpg', 'png'];
                const matches = image.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
                if (!matches || !allowedExtensions.includes(matches[1].toLowerCase())) {
                    return h.response('Unsupported image format').code(400);
                }

                const imageData = image.replace(/^data:image\/\w+;base64,/, '');
                const imageBuffer = Buffer.from(imageData, 'base64');
                const imageName = uuidv4() + '.' + matches[1];
                const imagePath = path.join(uploadsDirectory, imageName);
                fs.writeFileSync(imagePath, imageBuffer);
                
                return {
                    imageName: imageName
                };
            } catch (error) {
                console.error('Error saving file:', error);
                return h.response('Internal server error').code(500);
            }
        },
    },
    {
        method: 'GET',
        path: '/files/{imageName}',
        handler: (request, h) => {
            try {
                const imageName = request.params.imageName;
                const imagePath = path.join(uploadsDirectory, imageName);
    
                if (!fs.existsSync(imagePath)) {
                    return h.response('File not found').code(404);
                }
    
                const extension = path.extname(imagePath).toLowerCase();
                let contentType = 'image/jpeg';
                if (extension === '.png') {
                    contentType = 'image/png';
                } else if (extension === '.jpg' || extension === '.jpeg') {
                    contentType = 'image/jpeg';
                }
    
                const fileContent = fs.readFileSync(imagePath);

                const base64Content = fileContent.toString('base64');
    
                return {
                    imageURL: base64Content
                }
            } catch (error) {
                console.error('Error retrieving file:', error);
                return h.response('Internal server error').code(500);
            }
        },
    }
    
];

module.exports = fileRoutes;
