
/**
 * 三位7段数码管(共阳)0-999显示
 */


const Five = require('johnny-five');
var board = new Five.Board({ port: '/dev/tty.wchusbserial1d130' })

const A = 2, B = 3, C = 4, D = 5, E = 6, F = 7, G = 8, H = 9;
const X = 10, Y = 11, Z = 12;

const LOWPins = [A, B, C, D, E, F, G, H];
const HIGHPins = [Z, Y, X]

const refashSpeed = 8;  // 3ms*3 刷新率会有延迟；10ms> speed >8ms 两位正常 三位闪；  >10ms 两位闪 

// 定义灯管编码
const ledsCode = [
    [0, 0, 0, 0, 0, 0, 1, 1],  // 0
    [1, 0, 0, 1, 1, 1, 1, 1],  // 1
    [0, 0, 1, 0, 0, 1, 0, 1],  // 2
    [0, 0, 0, 0, 1, 1, 0, 1],  // 3
    [1, 0, 0, 1, 1, 0, 0, 1],  // 4
    [0, 1, 0, 0, 1, 0, 0, 1],  // 5
    [0, 1, 0, 0, 0, 0, 0, 1],  // 6
    [0, 0, 0, 1, 1, 1, 1, 1],  // 7
    [0, 0, 0, 0, 0, 0, 0, 1],  // 8
    [0, 0, 0, 0, 1, 0, 0, 1],  // 9
    [1, 1, 1, 1, 1, 1, 1, 1]   // null
]


board.on("ready", () => {

    LOWPins.forEach(pin => board.pinMode(pin, board.MODES.OUTPUT));
    HIGHPins.forEach(pin => board.pinMode(pin, board.MODES.OUTPUT));

    light = function (ledCode) {
        this.digitalWrite(A, Number(ledCode[0]));
        this.digitalWrite(B, Number(ledCode[1]));
        this.digitalWrite(C, Number(ledCode[2]));
        this.digitalWrite(D, Number(ledCode[3]));
        this.digitalWrite(E, Number(ledCode[4]));
        this.digitalWrite(F, Number(ledCode[5]));
        this.digitalWrite(G, Number(ledCode[6]));
        this.digitalWrite(H, Number(ledCode[7]));
    }

    let number = 0;
    board.loop(100, () => {
        refash(String(number));
        number++;
    })

    var timer;
    async function refash(str) {
        let len = str.length;
        let i = 0;
        clearInterval(timer)
        timer = setInterval(function () {
            board.digitalWrite(X, false);
            board.digitalWrite(Y, false);
            board.digitalWrite(Z, false);
            light.call(board, ledsCode[str[i]])
            if (len === 1) {
                board.digitalWrite(X, true)
            }
            if (len === 2) {
                board.digitalWrite(X, HIGHPins[i] === Y ? true : false)
                board.digitalWrite(Y, HIGHPins[i] === Z ? true : false)
            }
            if (len === 3) {
                board.digitalWrite(HIGHPins[i], true)
            }
            if (i === (len - 1)) { i = -1 };
            i++;
        }, refashSpeed);
    }
})
