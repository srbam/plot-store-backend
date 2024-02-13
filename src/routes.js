const Product = require('./models/product');

const routes = [
    {
        method: 'POST',
        path: '/products',
        handler: async (request, h) => {
            if(!request.payload.name || !request.payload.price){
                return h.response('Bad Request').code(400);
            }
            try {
                const { name, price, image } = request.payload;
                const newProduct = await Product.create({
                    name: name,
                    price: price,
                    image: image
                });
                console.log('New product created:');
                return h.response().code(201);
              } catch (error) {
                console.error('Error fetching products:', error);
                return h.response('Internal server error').code(500);
              }
        },
        options: {
            tags: ['api'],
            description: 'Creates a product in database'
        }
    },
    {
        method: 'GET',
        path: '/products',
        handler: async (request, h) => {
            try {
                const products = await Product.findAll();
                return products;
              } catch (error) {
                console.error('Error fetching products:', error);
                return h.response('Internal server error').code(500);
              }
        },
        options: {
            tags: ['api'],
            description: 'Returns all products in database'
        }
    },
    {
        method: 'GET',
        path: '/products/{id}',
        handler: async (request, h) => {
            try {
                const id = request.params.id;
                const product = await Product.findByPk(id);
                return product;
              } catch (error) {
                console.error('Error fetching products:', error);
                return h.response('Internal server error').code(500);
              }
        },
        options: {
            tags: ['api'],
            description: 'Returns product filtered by id'
        }
    },
    {
        method: 'DELETE',
        path: '/products/{id}',
        handler: async (request, h) => {
            try {
                const id = request.params.id;
                const product = await Product.findByPk(id);
                if (!product) {
                    return h.response('Product not found').code(404);
                }
                await product.destroy();
                return h.response('Product deleted successfully').code(200);
            } catch (error) {
                console.error('Error deleting product:', error);
                return h.response('Internal server error').code(500);
            }
        },
        options: {
            tags: ['api'],
            description: 'Delete product by id'
        }
    },    
];

module.exports = routes;
