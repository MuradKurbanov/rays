const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
ctx.transform(1, 0, 0, -1, 0, canvas.height)
const keys = {};
document.addEventListener('keydown', ({key}) => keys[key] = true);
document.addEventListener('keyup', ({key}) => delete keys[key]);


let globalAngle = 1.07;
const circle = { x: canvas.width / 2, y: 200 };
const rectangles = { x: canvas.width / 4 , y: canvas.height / 2, width: 60, height: 60 };
const circles = { x: canvas.width / 1.5 , y: canvas.height / 2, r: 40 };


const Rectangle = (x, y, width, height) => {
    ctx.fillStyle = 'silver';
    ctx.fillRect(x, y, width, height);
}

const Circle = (x, y, r) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, (Math.PI * 2));
    ctx.fillStyle = 'silver';
    ctx.fill();
}

const Ray = (x2, y2) => {
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.moveTo(circle.x, circle.y);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

const controller = () => {
    if (keys['ArrowRight']) globalAngle -= .05;
    if (keys['ArrowLeft']) globalAngle += .05;
    if (keys['w']) circle.y += 3;
    if (keys['s']) circle.y -= 3;
    if (keys['d']) circle.x += 3;
    if (keys['a']) circle.x -= 3;
}

const isInsideCircle = (rayX, rayY) => {
    const circlesX = circles.x;
    const circlesY = circles.y;
    const circlesR = circles.r;

    const a = rayX - circlesX;
    const b = rayY - circlesY;
    const c2 = (a * a) + (b * b);

    return c2 <= (circlesR * circlesR);
}

const isInsideRectangle = (rayX, rayY) => {
    return rayX > rectangles.x && rayY > rectangles.y && rayX < rectangles.x + rectangles.width && rayY < rectangles.y + rectangles.height;
}

const renderRays = () => {
    let currentAngle = globalAngle;

    for (let i = 0; i < 500; i++) {
        currentAngle += 0.002;
        let ray = {x: circle.x, y: circle.y, isIntersect: false}

        const cosAngle = Math.cos(currentAngle);
        const sinAngle = Math.sin(currentAngle);

        for (let l = 0; l < 320; l++) {
            if (ray.isIntersect) break;

            ray.x += cosAngle;
            ray.y += sinAngle;

            ray.isIntersect = isInsideRectangle(ray.x, ray.y) || isInsideCircle(ray.x, ray.y);
        }

        Ray(ray.x, ray.y);
    }
}

window.setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Circle(circles.x, circles.y, circles.r);
    Rectangle(rectangles.x, rectangles.y, rectangles.width, rectangles.height);
    renderRays();
    controller();
}, 20);
