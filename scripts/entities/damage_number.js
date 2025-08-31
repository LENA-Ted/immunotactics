class DamageNumber {
    constructor(x, y, amount) {
        this.x = x;
        this.y = y;
        this.text = `-${amount}`;
        this.life = 60;
        this.max_life = 60;
        this.opacity = 1.0;
        this.float_speed = 0.5;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = 'white';
        ctx.font = '16px IBM Plex Sans';
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }

    update() {
        this.y -= this.float_speed;
        this.life--;
        this.opacity = this.life / this.max_life;
    }

    is_alive() {
        return this.life > 0;
    }
}

window.DamageNumber = DamageNumber;