class JoyStick {

    //Properties
    maxDistance:number = 60;
    resetSpeed:number = 2.5;
    innerStrokeColor:string = 'black';
    innerFillColor:string = 'white';
    innerSize:number = 35;
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
        joystick.draggable = false;
        joystick.addEventListener('mousedown', this.mouseDown.bind(this));
        joystick.addEventListener('mouseleave', this.mouseUp.bind(this));
        joystick.addEventListener('mouseup', this.mouseUp.bind(this));
        joystick.addEventListener('mousemove', this.mouseMove.bind(this));

        joystick.addEventListener('touchstart', this.mouseDown.bind(this));
        joystick.addEventListener('touchend', this.mouseUp.bind(this));
        joystick.addEventListener('touchmove', this.touchMove.bind(this));
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
    touchMove(e:TouchEvent) {
        console.log('touchMove')
        for(let i = 0; i < e.touches.length; i++) {
            if(e.touches[i].target === this.joystick) {
                this.mousePosition.x = e.touches[i].clientX-this.rect.left;
                this.mousePosition.y = e.touches[i].clientY-this.rect.top;
            }
        }
        //this.mousePosition.x = e.touches[0].clientX-this.rect.left;
        //this.mousePosition.y = e.touches[0].clientY-this.rect.top;
    }

    get stickPosition() {
        let x = (this.joystickPosition.x - this.joyStickCenter.x)/this.maxDistance;
        let y = (this.joystickPosition.y - this.joyStickCenter.y)/this.maxDistance;
        y = -y;
        return {x: x, y: y};

    }

    drawJoystick(){
        console.log(this.stickPosition)
        if(this.ctx) {
            this.ctx.clearRect(0, 0, this.joystick.width, this.joystick.height);
            //Draw outer circle
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

let displayX1:HTMLInputElement = document.getElementById('posDisplay1-x')! as HTMLInputElement;
let displayY1:HTMLInputElement = document.getElementById('posDisplay1-y')! as HTMLInputElement;
let displayX2:HTMLInputElement = document.getElementById('posDisplay2-x')! as HTMLInputElement;
let displayY2:HTMLInputElement = document.getElementById('posDisplay2-y')! as HTMLInputElement;

displayX1.value = '0';
displayY1.value = '0';
displayX2.value = '0';
displayY2.value = '0';

setInterval(() => {
    displayX1.value = joyStickArray[0].stickPosition.x.toFixed(2);
    displayY1.value = joyStickArray[0].stickPosition.y.toFixed(2);
    displayX2.value = joyStickArray[1].stickPosition.x.toFixed(2);
    displayY2.value = joyStickArray[1].stickPosition.y.toFixed(2);
}, 1000/60);