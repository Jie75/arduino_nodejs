
/**
 * 数码管单位显示（0-9）
 * 电子骰子（简易版）
 */

const Five = require('johnny-five');
var board = new Five.Board({ port: '/dev/tty.wchusbserial1d1320' })

const A = 2, B = 3, C = 4, D = 5, E = 6, F = 7, G = 8, H = 9;
const buzzerPin = 11;

const LOWPins = [A, B, C, D, E, F, G, H];
// const HIGHPins = [X]

// 定义灯管编码
const ledCode = [
    "0000001",  // 0
    "1001111",  // 1
    "0010010",  // 2
    "0000110",  // 3
    "1001100",  // 4
    "0100100",  // 5
    "0100000",  // 6
    "0001111",  // 7
    "0000000",  // 8
    "0000100"   // 9
]

board.on("ready", () => {

    LOWPins.forEach(pin => board.pinMode(pin, board.MODES.OUTPUT));
    // HIGHPins.forEach(pin => board.pinMode(pin, board.MODES.OUTPUT));

    // board.digitalWrite(X, true);
    var button = new Five.Button({ pin: 12, invert: false })

    light = function (ledCode) {
        this.digitalWrite(A, !Number(ledCode[0]));
        this.digitalWrite(B, !Number(ledCode[1]));
        this.digitalWrite(C, !Number(ledCode[2]));
        this.digitalWrite(D, !Number(ledCode[3]));
        this.digitalWrite(E, !Number(ledCode[4]));
        this.digitalWrite(F, !Number(ledCode[5]));
        this.digitalWrite(G, !Number(ledCode[6]));
    }
    const Buzzer = {

        run: function () {
            let isBuzzer = false;
            this.timer = setInterval(() => {
                this.digitalWrite(buzzerPin, (isBuzzer ? true : false));
                isBuzzer = !isBuzzer;
            }, 1000);
        },

        stop: function () {
            if(this.timer){
                clearInterval(this.timer)
            }
            this.digitalWrite(buzzerPin, false);
        }
    }

    function pressBtn() {
        let len = 50 || Math.ceil(Math.random() * 100)
        let num = 0;
        var timer = setInterval(() => {
            let number = (Math.floor(Math.random() * 10) % 5 + 1)
            if (num > len) {
                clearInterval(timer);
                if (number > 3) {
                    Buzzer.run.call(board)
                }
            }
            light.call(board, ledCode[number]);
            num++;
        }, 100);
    }
    light.call(board, ledCode[0]);

    board.repl.inject({
        button: button
    })

    button.on('down', function () {
        console.log('down')
        pressBtn();
        Buzzer.stop.call(board)
    })
    button.on('hold', function () {
        console.log('hold')
        // pressBtn();
    })
    button.on('up', function () {
        console.log('up')
        // pressBtn();
    })

})