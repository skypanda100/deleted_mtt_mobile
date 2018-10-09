export default {
    host: process.env.NODE_ENV === 'developments' ? 'http://localhost:90' : 'http://47.94.165.17:90',
    imageHost: process.env.NODE_ENV === 'developments' ? 'http://localhost:12300/upload' : 'http://47.94.165.17:84'
};
