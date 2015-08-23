namespace ZeroOne {

    export interface IScoreBoard {
        upScoreRight() : number;
        upScoreLeft() : number;
    }

    export interface IPaddleCollisionDetector {
        checkCollision(ball: Ball);
    }

    export class Pong implements IScoreBoard {
        private leftPaddle: Paddle;
        private rightPaddle: Paddle;
        private ball: Ball;
        private scoreLeftElement: HTMLElement;
        private scoreRightElement: HTMLElement;
        private leftScore: number;
        private rightScore: number;

        private upButton: HTMLElement;
        private downButton: HTMLElement;
        private field: HTMLElement;

        constructor() {
            this.reset();
            
            // hookup paddle control elements...
            var self = this;
            document.onwheel = (ev: WheelEvent) => { self.onWheel(ev); }
            document.onkeydown = (ev: KeyboardEvent) => { self.OnKeyDown(ev); }
            document.ontouchstart = (event) => { self.onTouchStart(event); };
            document.ontouchmove = (event) => { self.onTouchMove(event); };
            document.ontouchend = (event) => { self.onTouchEnd(event); };

            setTimeout(() => { MessageService.userMessage(""); }, 2000);
        }
        
        private reset() {
            if (this.ball) {
                this.ball.dispose();
            }
            if (this.leftPaddle) {
                this.leftPaddle.dispose();
            }
            if (this.rightPaddle) {
                 this.rightPaddle.dispose();
            }
            this.leftScore = 0;
            this.rightScore = 0;
                
            this.ball = new Ball("ball", this);
            this.leftPaddle = new Paddle("leftpaddle", 100, 100, 5, false, this.ball);
            this.rightPaddle = new Paddle("rightpaddle", 1820, 700, -5, true, this.ball);
            
            if (!this.scoreLeftElement)
                this.scoreLeftElement = document.getElementById("scoreleft");
            if (!this.scoreRightElement)
                this.scoreRightElement = document.getElementById("scoreright");
            this.scoreRightElement.textContent = "0";    
            this.scoreLeftElement.textContent = "0";    
        }

        private eventMap = new Object();
        onTouchStart(event: TouchEvent) {
            for (var i = 0; i < event.touches.length; i++) {
                var touchData: Touch = event.touches[i];
                this.eventMap[touchData.identifier.toString()] = touchData.pageY;
            }
        }

        onTouchMove(event: TouchEvent) {
            event.preventDefault();

            for (var i = 0; i < event.touches.length; i++) {
                var touchData: Touch = event.touches[i];
                var oldY = this.eventMap[touchData.identifier.toString()];
                var newY = touchData.pageY;
                var up = newY - oldY < -10;
                var down = newY - oldY > 10;

                if (up)
                    this.onCtrlUp();
                else if (down)
                    this.onCtrlDown();
            }
        }

        onTouchEnd(event: TouchEvent) {
            for (var i = 0; i < event.touches.length; i++) {
                var touchData: Touch = event.touches[i];
                delete this.eventMap[touchData.identifier];
            }
        }

        OnKeyDown(ev: KeyboardEvent) {
            ev.preventDefault();
            if (ev.keyCode === 36 || ev.keyCode === 38 || ev.keyCode === 85)
                this.onCtrlUp();
            else if (ev.keyCode === 40 || ev.keyCode === 68)
                this.onCtrlDown();
            else if (ev.keyCode == 78) { // 'n'
                MessageService.userMessage("Started a new game.")
                this.start();
            }
        }
        
        onWheel(ev: WheelEvent) {
                ev.preventDefault();

                if (ev.deltaY < 0)
                    this.onCtrlUp();
                else if (ev.deltaY > 0)
                    this.onCtrlDown();
        }

        onCtrlUp() {
            Paddle.moveUp(this.leftPaddle);
        }

        onCtrlDown() {
            Paddle.moveDown(this.leftPaddle);
        }

        upScoreRight() : number {
            this.scoreRightElement.textContent = (++this.rightScore).toString();
            if (this.rightScore >= 10) {
                this.gameOver();
            }
            var gameLevel = Math.floor(this.leftScore / 10)+1;
            return gameLevel;
        }

        upScoreLeft() : number {
            this.scoreLeftElement.textContent = (++this.leftScore).toString();
            var gameLevel = Math.floor(this.leftScore / 10)+1;
            if (this.leftScore % 10 === 0)
                MessageService.userMessage(`Congratulations, you've reached level ${gameLevel}`)
            return gameLevel;
        }
        
        gameOver() {
            MessageService.userMessage(`Game over! Your score is ${this.leftScore}. Press 'N' to start a new game.`);
            this.ball.dispose();
            delete this.ball;
            this.leftPaddle.dispose();
            delete this.leftPaddle;
            this.rightPaddle.dispose();
            delete this.rightPaddle;
        }

        start() {
            this.reset();
            
            this.leftPaddle.start();
            this.rightPaddle.start();
            this.ball.start();
        }

        stop() {
            //clearTimeout(this.timerToken);
        }
    }
    
    export class MessageService {
        static debug(text: string) {
            //MessageService.doMessage(text);
        }
        
        static userMessage(text: string) {
            MessageService.doMessage(text);
        }
        
        private static doMessage(text: string) {
            console.log(text);
            var elm = document.getElementById("messages");
            elm.innerText = text;
        }
    }

    window.onload = () => {
        var pong = new Pong();
        pong.start();
    };

}

