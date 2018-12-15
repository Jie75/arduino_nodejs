
/**
 * 数码管单位显示（0-9）
 */

const Five = require('johnny-five');
var board = new Five.Board({ port: '/dev/tty.wchusbserial1d160' })

const A = 2, B = 3, C = 4, D = 5, E = 6, F = 7, G = 8, H = 9;
const X = 10, Y = 11, Z = 12;

const LOWPins = [A, B, C, D, E, F, G, H];
const HIGHPins = [X, Y, Z]

// 定义灯管编码
const ledsCode = [
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
    HIGHPins.forEach(pin => board.pinMode(pin, board.MODES.OUTPUT));

    board.digitalWrite(X, true);

    light = function (ledCode) {
        this.digitalWrite(A, Number(ledCode[0]));
        this.digitalWrite(B, Number(ledCode[1]));
        this.digitalWrite(C, Number(ledCode[2]));
        this.digitalWrite(D, Number(ledCode[3]));
        this.digitalWrite(E, Number(ledCode[4]));
        this.digitalWrite(F, Number(ledCode[5]));
        this.digitalWrite(G, Number(ledCode[6]));
    }

    let number = 0;
    board.loop(1000, () => {
        if (number > 9) { number = 0; }
        light.call(board, ledsCode[number]);
        number++;
    })


})