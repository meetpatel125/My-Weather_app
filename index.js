const http = require('http');
const fs = require('fs');
var requests = require("requests");


const homeFile = fs.readFileSync("index.html", "utf-8")

const replaceVal = (tempVal, orgVal) => {
    orgVal.main.temp = parseInt(orgVal.main.temp -273)
    orgVal.main.temp_min = parseInt(orgVal.main.temp_min -273)
    orgVal.main.temp_max = parseInt(orgVal.main.temp_max -273)
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
     temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
     temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
     temperature = temperature.replace("{%location%}", orgVal.name);
     temperature = temperature.replace("{%country%}", orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
     return temperature
}

// You can select your city.. so you change below api link vadodara to Your City  

const server = http.createServer((req,res) => {
    if (req.url == "/") {
        requests("http://api.openweathermap.org/data/2.5/weather?q=Vadodara&appid=b26916946a41fb640b0c360c92373e17")
        .on('data', (chunk) => {
            const objdata = JSON.parse(chunk);
            const arraData = [objdata]
            // console.log(arraData[0].main.temp)
            const realTimeData = arraData
            .map((val) =>  replaceVal(homeFile, val))
            .join("");
            res.write(realTimeData)
            // console.log(realTimeData)
            
        })
        
        .on('end', (err) => {
            if (err) return console.log('conection closed due to errors', err);
            res.end();
            // console.log('end');
        })
    }
})

server.listen(8000,"127.0.0.1")

// I Hope You Enjoy My Code :)