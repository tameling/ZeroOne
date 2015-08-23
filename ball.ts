namespace ZeroOne {

    export class Ball {

        public x: number = 960-20;
        public y: number = 100;
        public speedx: number = 3;
        public speedy: number = 3;
        public element: HTMLElement;

        public get width(): number { return 40; }

        private timerToken;
        private initialX = this.x;
        private skipIntervals = 0;
        private speedFactor = 1;
        
        private audioScore: HTMLAudioElement;

        constructor(id: string, private scoreBoard: IScoreBoard) {
            this.element = document.getElementById(id);
            this.audioScore = new Audio("sound/ping.mp3");
        }
        
        dispose() {
            clearInterval(this.timerToken);
        }

        start() {
            var self = this;
            this.timerToken = setInterval(() => {
                if (self.skipIntervals > 0) {
                    self.skipIntervals--;
                    return;
                }
                self.y += self.speedy * this.speedFactor;
                self.x += self.speedx * this.speedFactor;
                self.checkBounds();
                self.updatePosition();
            }, 10);

        }


        pause(skip=1000) {
            this.skipIntervals = 1000;
        }

        private updatePosition() {
            var ballrect: any = this.element;
            ballrect.x.baseVal.valueAsString = this.x;
            ballrect.y.baseVal.valueAsString = this.y;
        }

        private reset() {
            this.x = this.initialX;
            this.y = Math.random() * 1000 - this.width;
            this.skipIntervals = 50; // pause ball movement for 50*tick = 500 ms
        }

        private checkBounds() {
            if (this.y < 0) {
                this.y = 0;
                this.speedy = -this.speedy;
            }
            if (this.y > 1000 - this.width) {
                this.y = 1000 - this.width;
                this.speedy = -this.speedy;
            }

            if (this.x < 0) {
                this.x = 0;
                this.speedx = -this.speedx;
                this.audioScore.play();
                var level = this.scoreBoard.upScoreRight();
                this.speedFactor = level;
                //MessageService.debug(`Level ${level}, speedfactor: ${this.speedFactor}`)
                this.reset();
            }
            if (this.x > 1920 - this.width) {
                this.x = 1920 - this.width;
                this.speedx = -this.speedx;
                this.audioScore.play();
                var level = this.scoreBoard.upScoreLeft();
                this.speedFactor = level;
                //MessageService.debug(`Level ${level}, speedfactor: ${this.speedFactor}`)
                this.reset();
            }
        }

    }
}