var pdu = require('sms-pdu-node');
var SerialPort = require("serialport");
var utf8 = require('utf8');
var serialPort ;

serialPort = new SerialPort("/dev/ttyUSB0", {
    baudrate: 115200,  dataBits: 8,  parity: 'none',  stopBits: 1, parser: SerialPort.parsers.readline('\r\n')
});

st('/sms-send', function(req, res){

    console.log(req.body.username);
    if(req.body.username == 'behnam' && req.body.password == 'Persiad1')
    {
            var msg = req.body.msg;
            var num = req.body.mobile;
            console.log(msg,num);
           
            // send_sms(msg,num);
            serialPort = new SerialPort("/dev/ttyUSB0", {
                baudrate: 115200,  dataBits: 8,  parity: 'none',  stopBits: 1, flowControl: 'Hardware',  xon : true, rtscts:true, xoff:false, xany:false, parser: SerialPort.parsers.readline('\r\n')
            });

            serialPort.on("open", function () {
                    console.log('Serial communication open');

                    setTimeout(function(){
                        serialPort.write('AT+CMGF=0\r')
                        setTimeout(function(){
                            // serialPort.write('AT+CMGS="09366032534"\r');
                            var pdu_data = pdu(msg, num,null,16);
                            serialPort.write(pdu_data.command+'\r');
                            setTimeout(function(){
                                serialPort.write(pdu_data.pdu+'\r');
                                setTimeout(function(){
                                    serialPort.write('\x1A')
                                }, 100);
                            }, 100);
                        }, 100);
                    }, 100); 
                    serialPort.on('data', function(data) {
                        console.log("res: " + data);
                        // res.send("res: " + data);
                    });
            });

            setTimeout(function() {
                // serialPort.close();
                res.send("message is sent");
            }, 30000);

    }else{
        res.send("username & password is wronge ");
    }

});
console.log('trst');
