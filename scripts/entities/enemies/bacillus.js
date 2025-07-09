class Bacillus extends BaseEnemy {
    constructor(x, y) {
        super(x, y, PATHOGEN_CONFIGS.BACILLUS);
        this.pathogen_type = PATHOGEN_TYPES.BACILLUS;
        this.pathogen_class = PATHOGEN_CLASSES.BACTERIA;
        this.rotation_angle = 0;
        this.width = this.radius * this.config.width_height_ratio;
        this.height = this.radius;
    }

    update(target, timestamp) {
        this.update_status_effects(timestamp);
        this.update_rotation(target);
        this.move_toward_target(target);
    }

    update_rotation(target) {
        this.rotation_angle = MathUtils.get_angle_between(this.x, this.y, target.x, target.y);
    }

    draw_body(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation_angle);
        
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.config.stroke_color;
        ctx.lineWidth = this.config.stroke_width;
        
        const half_width = this.width / 2;
        const half_height = this.height / 2;
        const corner_radius = this.height / 2;
        
        ctx.beginPath();
        ctx.moveTo(-half_width + corner_radius, -half_height);
        ctx.lineTo(half_width - corner_radius, -half_height);
        ctx.arc(half_width - corner_radius, 0, corner_radius, -Math.PI / 2, Math.PI / 2);
        ctx.lineTo(-half_width + corner_radius, half_height);
        ctx.arc(-half_width + corner_radius, 0, corner_radius, Math.PI / 2, -Math.PI / 2);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
    }

    get_collision_bounds() {
        const half_width = this.width / 2;
        const half_height = this.height / 2;
        
        const cos_angle = Math.cos(this.rotation_angle);
        const sin_angle = Math.sin(this.rotation_angle);
        
        const corners = [
            { x: -half_width, y: -half_height },
            { x: half_width, y: -half_height },
            { x: half_width, y: half_height },
            { x: -half_width, y: half_height }
        ];
        
        const rotated_corners = corners.map(corner => ({
            x: this.x + corner.x * cos_angle - corner.y * sin_angle,
            y: this.y + corner.x * sin_angle + corner.y * cos_angle
        }));
        
        return {
            type: 'RECTANGLE',
            corners: rotated_corners,
            center_x: this.x,
            center_y: this.y,
            width: this.width,
            height: this.height,
            rotation: this.rotation_angle
        };
    }

    get_pathogen_type() {
        return this.pathogen_type;
    }

    get_pathogen_class() {
        return this.pathogen_class;
    }
}

window.Bacillus = Bacillus;