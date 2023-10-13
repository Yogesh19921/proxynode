var net = require("net");

process.on("uncaughtException", function (error) {
    console.error(error);
});


var localport = process.env.PORT;
var remotehost = "24.84.245.211";
var remoteport = 8080;

var server = net.createServer(function (localsocket) {
    var remotesocket = new net.Socket();

    remotesocket.connect(remoteport, remotehost);

    localsocket.on('connect', function (data) {
        console.log(">>> connection #%d from %s:%d",
            server.connections,
            localsocket.remoteAddress,
            localsocket.remotePort
        );
    });

    localsocket.on('data', function (data) {
        console.log("%s:%d - writing data to remote",
            localsocket.remoteAddress,
            localsocket.remotePort
        );
        var flushed = remotesocket.write(data);
        if (!flushed) {
            console.log("  remote not flushed; pausing local");
            localsocket.pause();
        }
    });

    remotesocket.on('data', function (data) {
        console.log("%s:%d - writing data to local",
            localsocket.remoteAddress,
            localsocket.remotePort
        );
        var flushed = localsocket.write(data);
        if (!flushed) {
            console.log("  local not flushed; pausing remote");
            remotesocket.pause();
        }
    });

    localsocket.on('drain', function () {
        console.log("%s:%d - resuming remote",
            localsocket.remoteAddress,
            localsocket.remotePort
        );
        remotesocket.resume();
    });

    remotesocket.on('drain', function () {
        console.log("%s:%d - resuming local",
            localsocket.remoteAddress,
            localsocket.remotePort
        );
        localsocket.resume();
    });

    localsocket.on('close', function (had_error) {
        console.log("%s:%d - closing remote",
            localsocket.remoteAddress,
            localsocket.remotePort
        );
        remotesocket.end();
    });

    remotesocket.on('close', function (had_error) {
        console.log("%s:%d - closing local",
            localsocket.remoteAddress,
            localsocket.remotePort
        );
        localsocket.end();
    });

});

server.listen(localport);

console.log("redirecting connections from 127.0.0.1:%d to %s:%d", localport, remotehost, remoteport);
