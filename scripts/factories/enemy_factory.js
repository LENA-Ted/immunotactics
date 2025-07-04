class EnemyFactory {
    constructor() {
        this.enemy_types = new Map();
        this.register_default_enemies();
    }

    register_default_enemies() {
        this.register_enemy_type(ENEMY_TYPES.BASIC, BasicEnemy);
    }

    register_enemy_type(type_name, enemy_class) {
        if (!ENEMY_CONFIGS[type_name]) {
            console.error(`Enemy config not found for type: ${type_name}`);
            return false;
        }

        this.enemy_types.set(type_name, enemy_class);
        return true;
    }

    create_enemy(type_name, x, y) {
        if (!this.enemy_types.has(type_name)) {
            console.error(`Unknown enemy type: ${type_name}`);
            return null;
        }

        const enemy_class = this.enemy_types.get(type_name);
        return new enemy_class(x, y);
    }

    create_enemy_by_type(type_name, x, y) {
        return this.create_enemy(type_name, x, y);
    }

    spawn_enemy_at_random_edge(canvas_width, canvas_height, type_name = ENEMY_TYPES.BASIC) {
        const spawn_position = this.get_random_edge_position(canvas_width, canvas_height);
        return this.create_enemy(type_name, spawn_position.x, spawn_position.y);
    }

    get_random_edge_position(canvas_width, canvas_height) {
        const margin = 30;
        const side = Math.floor(Math.random() * 4);
        
        switch (side) {
            case 0:
                return {
                    x: Math.random() * canvas_width,
                    y: -margin
                };
            case 1:
                return {
                    x: canvas_width + margin,
                    y: Math.random() * canvas_height
                };
            case 2:
                return {
                    x: Math.random() * canvas_width,
                    y: canvas_height + margin
                };
            case 3:
                return {
                    x: -margin,
                    y: Math.random() * canvas_height
                };
            default:
                return { x: 0, y: 0 };
        }
    }

    get_available_enemy_types() {
        return Array.from(this.enemy_types.keys());
    }

    is_valid_enemy_type(type_name) {
        return this.enemy_types.has(type_name);
    }
}

window.EnemyFactory = EnemyFactory;