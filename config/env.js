export default {
    host: process.env.NODE_ENV === 'development' ? 'http://localhost:90' : 'http://47.94.165.17:90',
    imageHost: process.env.NODE_ENV === 'development' ? 'http://localhost:12300' : 'http://47.94.165.17:84'
};
