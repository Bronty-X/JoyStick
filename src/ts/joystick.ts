class JoyStick {

    //Properties
    maxDistance:number = 100;
    resetSpeed:number = 2.5;
    innerStrokeColor:string = 'black';
    innerFillColor:string = 'white';
    innerSize:number = 40;
    outerStrokeColor:string = 'black';
    outerFillColor:string = 'white';
    //
    joystick:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D|null;
    joystickPosition:{x:number, y:number} = {x:0, y:0};
    joyStickCenter:{x:number, y:number} = {x:0, y:0};
    isTouch:boolean = false;
    mousePosition:{x:number, y:number} = {x:0, y:0};
    rect:DOMRect;
    constructor(joystick:HTMLCanvasElement) {
        this.joystick = joystick;
        joystick.addEventListener('mousedown', this.mouseDown.bind(this));
        joystick.addEventListener('mouseleave', this.mouseUp.bind(this));
        joystick.addEventListener('mouseup', this.mouseUp.bind(this));
        joystick.addEventListener('mousemove', this.mouseMove.bind(this));
        this.Init();

    }
    Init() {
        
        this.ctx = this.joystick.getContext('2d');
        this.joyStickCenter.x = this.joystick.offsetWidth / 2;
        this.joyStickCenter.y = this.joystick.offsetHeight / 2;
        this.joystickPosition.x = this.joyStickCenter.x;
        this.joystickPosition.y = this.joyStickCenter.y;
        this.rect = this.joystick.getBoundingClientRect();
        setInterval(this.drawJoystick.bind(this), 1000/60)
        console.log("Init");
    }

    calculateAngle(x:number, y:number) {
        x = x - this.joyStickCenter.x;
        y = y - this.joyStickCenter.y;
        let angle = Math.atan2(y, x);
        return angle;
    }

    getCloserPoint(x:number, y:number) {
        let angle = this.calculateAngle(x, y);
        let closeX = this.joyStickCenter.x + Math.cos(angle) * this.maxDistance;
        let closeY = this.joyStickCenter.y + Math.sin(angle) * this.maxDistance;
        return {x: closeX, y: closeY};
    }

    isOutSide(x:number, y:number) { 
        let distance = Math.sqrt(Math.pow(x - this.joyStickCenter.x, 2) + Math.pow(y - this.joyStickCenter.y, 2));
        return distance > this.maxDistance;
    }
    mouseDown(e:MouseEvent) {
        this.isTouch = true;
        console.log('mouseDown');
    }
    mouseUp(e:MouseEvent) {
        this.isTouch = false;
        console.log('mouseUp');
    }

    mouseMove(e:MouseEvent) {
        console.log('mouseMove')
        this.mousePosition.x = e.clientX-this.rect.left;
        this.mousePosition.y = e.clientY-this.rect.top;

    }

    get stickPosition() {
        let x = this.joystickPosition.x - this.joyStickCenter.x;
        let y = this.joystickPosition.y - this.joyStickCenter.y;
        y = -y;
        return {x: x, y: y};

    }

    drawJoystick(){
        console.log(this.stickPosition)
        if(this.ctx) {
            this.ctx.clearRect(0, 0, this.joystick.width, this.joystick.height);
            this.ctx.beginPath();
            this.ctx.arc(this.joyStickCenter.x, this.joyStickCenter.y, this.maxDistance, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.outerStrokeColor;
            this.ctx.fillStyle = this.outerFillColor;
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();

            if(this.isTouch) {
                let closerPoint = this.getCloserPoint(this.mousePosition.x, this.mousePosition.y);
                if(this.isOutSide(this.mousePosition.x, this.mousePosition.y)) {
                    this.joystickPosition.x = closerPoint.x;
                    this.joystickPosition.y = closerPoint.y;
                } else {
                    this.joystickPosition.x = this.mousePosition.x;
                    this.joystickPosition.y = this.mousePosition.y;
                }
            } else {
                let distance = Math.sqrt(Math.pow(this.joystickPosition.x - this.joyStickCenter.x, 2) + Math.pow(this.joystickPosition.y - this.joyStickCenter.y, 2));
                let distanceX = Math.abs(this.joystickPosition.x - this.joyStickCenter.x);
                let distanceY = Math.abs(this.joystickPosition.y - this.joyStickCenter.y);
                let distanceRatio = {x: distanceX / distance || 0, y: distanceY / distance || 0};
                if(distance < 2) {
                    this.joystickPosition.x = this.joyStickCenter.x;
                    this.joystickPosition.y = this.joyStickCenter.y;    
                } 
                if(this.joystickPosition.x < this.joyStickCenter.x) {
                    this.joystickPosition.x += this.resetSpeed * distanceRatio.x;
                } else {
                    this.joystickPosition.x -= this.resetSpeed * distanceRatio.x;
                }

                if(this.joystickPosition.y < this.joyStickCenter.y) {
                    this.joystickPosition.y += this.resetSpeed * distanceRatio.y;
                } else {
                    this.joystickPosition.y -= this.resetSpeed * distanceRatio.y;
                }
            }
            this.ctx.beginPath();
            this.ctx.arc(this.joystickPosition.x, this.joystickPosition.y, this.innerSize, 0, Math.PI * 2);
            this.ctx.strokeStyle = this.innerStrokeColor;
            this.ctx.fillStyle = this.innerFillColor;
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
   

}

let joysticks:NodeListOf<HTMLCanvasElement> = document.querySelectorAll('.joystick');
let joyStickArray:JoyStick[] = [];
joysticks.forEach(joystickElement => {
    joyStickArray.push(new JoyStick(joystickElement));
});
