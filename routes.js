const routes = [
    {
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return 'Hello World!';
        }
    },
    {
        method: 'GET',
        path: '/docs',
        handler: (request, h) => {
            return h.redirect('/documentation');
        }
    }
];

module.exports = routes;
