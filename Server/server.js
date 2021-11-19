const express = require('express');
const cors = require('cors');
const app = express();
const sql = require("mssql");

const config = {
  server: 'localhost',
  database: 'exact_bd',
  user: 'exact_bd',
  password: 'uni4540',
  port: 1433,
  options:{
    encrypt:false,
  }
}

app.use(express.json());
app.use(cors());

app.get('/login', async (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", 'GET','OPTIONS');
	let user = req.query.user;
	let password = req.query.password;
	result = await sql.connect(config).then(() => {
		return sql.query("SELECT USU_LOGIN AS usuario, USU_SENHA_ATUAL AS senha FROM tab_usuarios WHERE USU_LOGIN = '"+user+"' AND USU_SENHA_ATUAL = '"+password+"'")
	}).then(result => {
		return result;
	}).catch(err => {		
		console.log("Erro: " + err);
		return err;
	})
	if(result.recordset.length == 0){
		res.status(204).send("Usuário ou Senha não foram encotrados ou estão incorretos");
	}else{
		res.send(result.recordset);
	}
})

app.get('/leituras', async (req, res) =>{
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", 'GET','OPTIONS');
	result = await sql.connect(config).then(() => {
		return sql.query`SELECT tab_leituras_real.LEIT_REAL_ID AS id, tab_sensores.SENS_DESCRICAO AS nome, tab_sensores.SENS_DESCRICAO_ALIAS AS alias, tab_leituras_real.LEIT_TEMPERATURA_1 AS leitura, tab_grandezas_sensores.GRAND_DESCRICAO_REDUZIDA AS grandeza, convert(varchar(15), tab_leituras_real.LEIT_COR_SENSOR) AS cor FROM tab_grandezas_sensores, tab_sensores INNER JOIN tab_leituras_real on tab_leituras_real.SENS_ID = tab_sensores.SENS_ID WHERE tab_sensores.GRAND_ID = tab_grandezas_sensores.GRAND_ID`
	}).then(result => {
		return result;
	}).catch(err => {
		console.log("Erro: " + err);
		return err;
	})
	if(result.recordset.length === 0){
		res.status(204).send("Nenhuma Leitura Encontrada!");
	}else{
		res.send(result.recordset);
	}	
})

app.get('/sensores', async (req, res) =>{
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", 'GET','OPTIONS');
	result = await sql.connect(config).then(() => {
		return sql.query`SELECT TOP 100 SENS_DESCRICAO AS sensor FROM tab_sensores`
	}).then(result => {
		return result;
	}).catch(err => {
		console.log("Erro: " + err);
		return err;
	})
	if(result.recordset.length === 0){
		res.status(204).send("Nenhuma Leitura Encontrada!");
	}else{
		res.send(result.recordset);
	}	
})

app.get('/graficos', async (req, res) =>{
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", 'GET','OPTIONS');
	let horas = parseInt(req.query.horas);
	let sensor = req.query.sensor;
	result = await sql.connect(config).then(() => {
		return sql.query`SELECT TOP 10000 CONVERT(VARCHAR, LEIT_DATA_HORA, 8) AS x, LEIT_TEMPERATURA_1 AS y FROM tab_leituras, tab_sensores WHERE LEIT_DATA_HORA >= DATEADD(hour, -${horas}, GETDATE()) AND SENS_DESCRICAO = ${sensor} AND tab_leituras.SENS_ID = tab_sensores.SENS_ID ORDER BY LEIT_ID ASC`
	}).then(result => {
		return result.recordset;
	}).catch(err => {
		console.log("Erro: " + err);
		return err;
	})
	if(result.length === 0){
		res.status(204).send("Nenhuma Leitura Encontrada!");
	}else{
		res.send(result);
	}
})

app.listen(3000, function(){
	console.log("Server is Running");
});