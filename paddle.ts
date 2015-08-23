namespace ZeroOne {

    export class Paddle implements IPaddleCollisionDetector {

        private element: HTMLElement;
        private timerToken;

        private height = 70;
        private initialSpeed;
        private collisionSound: HTMLAudioElement;

        constructor(id: string, private x: number, private y: number,
                    private speed: number, private bump: boolean,
                    private ball: Ball) {
            this.element = document.getElementById(id);
            this.initialSpeed = speed;
            
            var audioname;
                if (this.bump)
                 audioname = 'sound/pong2.mp3';
                else {
                    audioname = "sound/pong1.mp3";        
                    }
                this.collisionSound = new Audio(audioname);
        }
        
        dispose() {
            clearInterval(this.timerToken);
        }

        start() {
            var self = this;
            this.timerToken = setInterval(() => {
                self.y += self.speed;
                self.checkBounds();

                self.moveItem(this.element, 0, self.y);
                self.checkCollision(this.ball);
            }, 10);
        }

        changePosition(delta: number) {
            this.y += delta;
            this.speed = 0;
        }

        static moveUp(paddle: Paddle) {
            paddle.speed = -Math.abs(paddle.initialSpeed);
        }

        static moveDown(paddle: Paddle) {
            paddle.speed = Math.abs(paddle.initialSpeed);
        }

        private moveItem(element: HTMLElement, xOffset: number, yOffset: number) {
            var rect: any = this.element;
            rect.x.baseVal.valueAsString = this.x;
            rect.y.baseVal.valueAsString = this.y;

        }

        checkCollision(ball: Ball) {
            var r1: ClientRect = ball.element.getBoundingClientRect();
            var r2: ClientRect = this.element.getBoundingClientRect();

            if ((r2.left > r1.right ||
                    r2.right < r1.left ||
                    r2.top > r1.bottom ||
                    r2.bottom < r1.top) === false) {
                // collision
                this.collisionSound.play();
                ball.speedx = -ball.speedx;
                if (ball.y > this.y + this.height*0.85) {
                    ball.speedy = Math.abs(ball.speedy);
                    MessageService.debug(`Collision DOWN: speed=${ball.speedy}`);
                } else if (ball.y < this.y + this.height*.15) {
                    ball.speedy = -Math.abs(ball.speedy);
                    MessageService.debug(`Collision UP: speed=${ball.speedy}`);
                } else {
                    MessageService.debug(`Collision MIDDLE: speed=${ball.speedy}`);
                }
            }
        }

        private checkBounds() {
            if (this.y < 0) {
                this.y = 0;
                if (this.bump)
                    this.speed = -this.speed;
            }
            if (this.y > 1000 - this.height) {
                this.y = 1000 - this.height;
                if (this.bump)
                    this.speed = -this.speed;
            }
        }

    }
}