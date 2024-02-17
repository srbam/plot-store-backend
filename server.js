const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const { testConnection, syncModels } = require('./src/models/database/database');
const productRoutes = require('./src/product/routes');
const fileRoutes = require('./src/files/routes');


const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: true
        }
    });

    const routes = [
        ...productRoutes,
        ...fileRoutes
    ]

    const swaggerOptions = {
        info: {
            title: 'PlotStore Documentation',
            version: '1.0.0',
        },
        documentationPath: '/docs',
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);

    server.route(routes);

    await testConnection();
    await syncModels();

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();
