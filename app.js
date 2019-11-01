var fs = require("fs")
var cors = require("cors")
var bodyParser = require("body-parser")
var express = require("express")
const readline = require('readline')
const {once} = require('events')
const moment = require('moment')


var app = express()
moment.locale('pt-br')

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
        
        let filename = "loja/" + req.params.idLeitor + "" + hoje + "" + req.params.setor + ".txt"
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
                    if(itemProps[2] == req.params.idTag) {
                        let now = moment()
                        let start = moment(`${itemProps[0]} ${itemProps[1]}`, 'DD-MM-YYYY hh:mm:ss')
                        let interval = moment.duration(now.diff(start))
                        console.log(parseFloat(interval.asMinutes()))
                        if(!(parseFloat(interval.asMinutes()) >= 1)){
                            insert = false
                        }
                        else{true}
                    }
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

//Nesse ponto..
//if(itemProps[2] == req.params.idTag) insert = false
//Veja a possibilidade do seguinte.. após verificarmos se a tag já encontra-se no arquivo, também verificar se ela foi incluída a mais de 1 minuto, se sim, incluo novamente.
//Será uma cálculo de diferença entre horários, sendo itemProps[>>> 1 <<<<] é a hora registrada
//...mas temos um problema. Pois caso seja incluída.. na próxima verificação terá de ter o cuidado de não pegar o primeiro registro dessa tag, e sim o ultimo