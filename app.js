var fs = require("fs")
var cors = require("cors")
var bodyParser = require("body-parser")
var express = require("express")
const readline = require('readline')
const {once} = require('events')


var app = express()

app.get('/postReadLoja/:idLeitor/:idTag/:rssiTag/:setor', (req,res) => {
	
    var dt   = new Date();
    var hoje = ("0" + dt.getDate()).slice(-2) + ("0" + (dt.getMonth() + 1)).slice(-2) + dt.getFullYear()
  
    if (req.params.idTag == 0 || req.params.idTag == "") {
  
      var stream = fs.createWriteStream("loja/" + req.params.idLeitor + "" + hoje + "" + req.params.setor + ".txt", {flags: 'w'});
      stream.once('open', (fd) => {
        //stream.write("");
        stream.end();
        res.header("Access-Control-Allow-Origin", "*");
        res.send("clear")	
    
      });
      
    } else {
        let filename = "loja/" + req.params.idLeitor + "" + hoje + "" + req.params.setor + ".csv"
        var hojeLog = ("0" + dt.getDate()).slice(-2) + "/" + ("0" + (dt.getMonth() + 1)).slice(-2) + "/" + dt.getFullYear()
        var horaLog = ("0" + dt.getHours()).slice(-2) + ":" + ("0" +dt.getMinutes()).slice(-2) + ":" + ("0" +dt.getSeconds()).slice(-2)

            let insert = true
            let itemvalue = hojeLog + ";" + horaLog + ";" + req.params.idTag + ";" + req.params.rssiTag + "^\n"
            if(fs.existsSync(filename)){
                let texto = fs.readFileSync(filename).toString()
                let textoSplited = texto.split('^\n')
                console.log(textoSplited)
                for(const item of textoSplited){
                    let itemProps = item.split(';')
                    if(itemProps[2] == req.params.idTag) insert = false
                }
                if(insert) fs.appendFileSync(filename,itemvalue)
            }
            else fs.writeFile(filename,itemvalue, err => {
                if(err){
                    console.log('Erro ao criar arquivo e gravar item.')
                }
                else console.log('Arquivo criado.')
            })
            
                  
        res.header("Access-Control-Allow-Origin", "*");
        res.send("add")    
    }
   
  })

  app.listen(8080, function(){
      console.log('Inova API')
  })