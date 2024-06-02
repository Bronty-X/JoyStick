


class JoyStick {

    //Properties
    maxDistance:number = 50;
    resetSpeed:number = 0.1;
    //
    joystick:HTMLElement;
    joystickInner:HTMLElement = document.createElement('div');
    joystickPosition:{x:number, y:number} = {x:0, y:0};
    addedInner:HTMLElement;
    joyStickCenter:{x:number, y:number} = {x:0, y:0};
    isTouch:boolean = false;
    mousePosition:{x:number, y:number} = {x:0, y:0};
    constructor(joystick:HTMLElement) {
        this.joystick = joystick;
        joystick.addEventListener('mousedown', this.mouseDown.bind(this));
        joystick.addEventListener('mouseup', this.mouseUp.bind(this));
        joystick.addEventListener('mousemove', this.mouseMove.bind(this));
        this.Init();

    }
    Init() {
        this.joystickInner.classList.add('joystick-inner');
        this.addedInner=this.joystick.appendChild(this.joystickInner);

        this.joyStickCenter.x = this.joystick.offsetWidth / 2;
        this.joyStickCenter.y = this.joystick.offsetHeight / 2;

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
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
    }

    drawJoystick() {
        console.log("drawJoystick")
        if(this.isTouch){
            this.addedInner.style.position = 'absolute';
            if(this.isOutSide(this.mousePosition.x, this.mousePosition.y)) {
                let closerPoint = this.getCloserPoint(this.mousePosition.x, this.mousePosition.y);
                this.joystickPosition.x = closerPoint.x;
                this.joystickPosition.y = closerPoint.y;
            } else {
                this.joystickPosition.x = this.mousePosition.x;
                this.joystickPosition.y = this.mousePosition.y;
            }
        }else{
            let distance = Math.sqrt(Math.pow(this.joystickPosition.x - this.joyStickCenter.x, 2) + Math.pow(this.joystickPosition.y - this.joyStickCenter.y, 2));
            let distanceX = this.joystickPosition.x - this.joyStickCenter.x;
            let distanceY = this.joystickPosition.y - this.joyStickCenter.y;
            let distanceRatio = {x: distanceX / distance || 0, y: distanceY / distance || 0};
            if(distance<2) {
                this.joystickPosition.x = this.joyStickCenter.x;
                this.joystickPosition.y = this.joyStickCenter.y;
            } else {
                this.joystickPosition.x -= distanceRatio.x * this.resetSpeed;
                this.joystickPosition.y -= distanceRatio.y * this.resetSpeed;
            }
        }
        this.addedInner.style.left = this.joystickPosition.x + 'px';
        this.addedInner.style.top = this.joystickPosition.y + 'px';
    }


}

let joysticks:NodeListOf<HTMLElement> = document.querySelectorAll('.joystick');
let joyStickArray:JoyStick[] = [];
joysticks.forEach(joystickElement => {
    joyStickArray.push(new JoyStick(joystickElement));
});
