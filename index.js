const { ApolloServer } = require("apollo-server");
const typeDefs = require('./db/shema');
const resolvers = require('./db/resolvers');
const conectarDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env'});

// Conectar a la base de datos
conectarDB();

//servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
        //console.log(req.headers['authorization'])
        const token = req.headers['authorization'] || '';
        //console.log(token);
        if(token) {
            try {
                //console.log('entro');
                const usuario = jwt.verify(token, process.env.SECRETA );
                //console.log('usu',usuario);
                return {
                    usuario
                } 
            } catch (error) { 
                console.log('Hubo un error+',error);
            }
        }
     }
});

//arrancar el servidor
server.listen().then( ({url}) => {
    console.log(`Servidor listo en la URL ${url}`);
})