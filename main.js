import http from 'node:http';
import { PORT } from './config.js';
import { pool } from './db.js';
import fs from "node:fs/promises";
import path from "node:path";


const server = http.createServer(async (req, res) => {
    const { method, url } = req;

    if (method === 'GET') {
        switch (url) {


            case '/':
                //Esta ruta muestra un archivo html con una interfaz sencilla al usuario
                try {
                    const indexPath = path.join(process.cwd(), 'index.html');
                    const indexContent = await fs.readFile(indexPath, 'utf-8');

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(indexContent);
                } catch (error) {
                    console.error('Error al leer el archivo index.html:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Error interno del servidor' }));
                }
                break;


            case '/api/usuarios':
                //Esta ruta devolverá una lista de usuarios en formato JSON y mostrarlo en el servidor

                try {
                    const queryResult = await pool.query('SELECT * FROM usuarios');
                    console.log('Consulta exitosa. Resultados:', queryResult);


                    res.end(JSON.stringify(queryResult));
                } catch (error) {
                    console.error('Error al consultar la base de datos:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Error al obtener la lista de usuarios' }));
                }

                break;


            case '/api/usuarios/export':

                const result = await pool.query('SELECT * FROM usuarios');

                const jsonData = JSON.stringify(result, null, 2);

                // Guarda los datos en un archivo de texto llamado usuarios.csv
                fs.writeFile('usuarios.csv', jsonData, (err) => {
                    if (err) {
                        console.error('Error al escribir en el archivo:', err);
                        return;
                    }
                    console.log('Datos guardados en usuarios.csv correctamente');
                });

                break;


            case '/api/usuarios/import':
                //Esta ruta se encargará de leer el archivo “usuarios.csv” y guardar los datos en la base de datos MySQL

                try {
                    const filePath = 'usuarios.csv';
                    const fileContent = await fs.readFile(filePath, 'utf-8');
        
                    
                    const lines = fileContent.split('\n');
                    const headers = lines[0].trim().split(','); 
                    const users = [];
        
                    
                    for (let i = 1; i < lines.length; i++) {
                        const line = lines[i].trim();
                        if (line === '') continue; 
        
                        const values = line.split(',');
        
                        if (values.length !== headers.length) {
                            console.error(`Error: Número incorrecto de campos en la línea ${i}`);
                            continue;
                        }
        
                        const user = {};
                        headers.forEach((header, index) => {
                            user[header] = values[index].trim();
                        });
        
                        users.push(user);
                    }
        
                    // Insertar cada usuario en la base de datos
                    for (const user of users) {
                        await pool.query('INSERT INTO usuarios SET ?', user);
                    }
        
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Datos importados correctamente' }));
                } catch (error) {
                    console.error('Error al importar datos:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Error al importar datos' }));
                }
            
        }
    }

});

server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON http://localhost:${PORT}`);
});