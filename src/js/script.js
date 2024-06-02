const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    let x = canvas.width/2;
    let y = canvas.height/2;
    const canvasCenter = {x:canvas.width/2,y:canvas.height/2};
    let r = 40;
    let dx = 2;
    let dy = 2;
    const restorationSpeed = 3;
    const maxDistance = 100;
    const range = {
        min:{
            x:canvas.width/2 - maxDistance,
            y:canvas.height/2 - maxDistance
        },
        max:{
            x:canvas.width/2 + maxDistance,
            y:canvas.height/2 + maxDistance
        
        }
    }
    const calculateAngle = function(x,y){
        x = x - canvasCenter.x;
        y = y - canvasCenter.y;
        let angle = Math.atan2(y,x);
        return angle;
    }
    const getClosePos = function(x,y){
        let angle = calculateAngle(x,y);
        let closeX = Math.cos(angle) * maxDistance + canvasCenter.x;
        let closeY = Math.sin(angle) * maxDistance + canvasCenter.y;
        return {x:closeX,y:closeY};
    }
    const isOutRange = function(x,y){
        if(x < range.min.x || x > range.max.x || y < range.min.y || y > range.max.y){
            return true;
        }
        return false;
    }
    let mousePos = {x:NaN,y:NaN};
    let mouseClick = false;
    function draw(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fill();
        
        if(mouseClick){
           if(isOutRange(mousePos.x,mousePos.y)){
                x = getClosePos(mousePos.x,mousePos.y).x;
                y = getClosePos(mousePos.x,mousePos.y).y;
            }else{
                x = mousePos.x;
                y = mousePos.y;
            }
            
        }else{
            let distance = Math.sqrt(Math.pow(canvasCenter.x - x,2) + Math.pow(canvasCenter.y - y,2));
            let distanceX = Math.abs(canvasCenter.x - x);
            let distanceY = Math.abs(canvasCenter.y - y);
            let distanceRatio = {x: distanceX / distance || 0, y: distanceY / distance || 0};
            if(distance < 2){
                x = canvasCenter.x;
                y = canvasCenter.y;
            }
            if(x < canvasCenter.x){
                x += restorationSpeed * distanceRatio.x;
            }else if(x > canvasCenter.x){
                x -= restorationSpeed * distanceRatio.x;
            }

            if(y < canvasCenter.y){
                y += restorationSpeed * distanceRatio.y;
            }else if(y > canvasCenter.y){
                y -= restorationSpeed * distanceRatio.y;
            }
            
        }
        requestAnimationFrame(draw);
    }
    canvas.addEventListener('mousemove',function(e){
        if(mousePos.x == NaN || mousePos.y == NaN){
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        }else{
            //dx = e.clientX - mousePos.x;
            //dy = e.clientY - mousePos.y;
        }
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        
    });
    canvas.addEventListener('mousedown',function(e){
        mouseClick = true;
    });
    canvas.addEventListener('mouseup',function(e){
        mouseClick = false;
    });
    draw();