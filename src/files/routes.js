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
                const imageName = uuidv4() + '.jpg';
                const imagePath = path.join(uploadsDirectory, imageName);
                fs.writeFileSync(imagePath, image, 'base64');
                return {
                    imageName: imageName
                };
            } catch (error) {
                console.error('Error saving file:', error);
                return h.response('Internal server error').code(500);
            }
        },
    },
];

module.exports = fileRoutes;
