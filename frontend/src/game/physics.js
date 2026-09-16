// PHYS-01 · Hoàng Hải Minh
// Cần export applyPhysics(player, dt): lưu prevY, cập nhật vy rồi y.
// Đơn vị giây, pixel và pixel/giây. Chưa viết collision trong PR đầu.

// physics
let velocityy = 0;
let initialvelocityy = -8; // initial jump velocity
let gravity = 0.4;

function applyPhysics(player, dt) {
    player.y += velocityy;
    velocityy += gravity;

    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityy < 0 && player.y < boardheight*3/5) {
            platform.y -= initialvelocityy;
        }
        if (detectCollision(player, platform) && velocityy >= 0) {
            velocityy = initialvelocityy;
        }
    }
}

function detectCollision(a,b) { // Detection formula : Detecting intersection between two rectangles a and b
    return a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x && //a's top right corner passes b's top left corner
           a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y; // a's bottom left corner passes b's top left corner
}