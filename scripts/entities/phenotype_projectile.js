class PhenotypeProjectile {
    constructor(x, y, target, source_phenotype = null) {
        this.x = x;
        this.y = y;
        this.start_x = x;
        this.start_y = y;
        this.radius = 4;
        this.damage = 10;
        this.speed = 8;
        this.source_phenotype = source_phenotype;
        this.max_range = source_phenotype ? source_phenotype.config.range : null;
        
        const angle = MathUtils.get_angle_between(x, y, target.x, target.y);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = 'orange';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    is_out_of_bounds(canvas_width, canvas_height) {
        const margin = 10;
        return this.x < -margin || 
               this.x > canvas_width + margin || 
               this.y < -margin || 
               this.y > canvas_height + margin;
    }

    is_out_of_range() {
        if (this.max_range === null) {
            return false;
        }
        
        const distance = MathUtils.get_distance(this.start_x, this.start_y, this.x, this.y);
        return distance > this.max_range;
    }

    get_damage() {
        return this.damage;
    }

    get_source_type() {
        return 'PHENOTYPE';
    }

    is_phenotype_projectile() {
        return true;
    }
}

window.PhenotypeProjectile = PhenotypeProjectile;