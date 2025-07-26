class EnemyFactory {
    constructor() {
        this.enemy_types = new Map();
        this.register_default_enemies();
    }

    register_default_enemies() {
        this.register_enemy_type(ENEMY_TYPES.BASIC, BasicEnemy);
        this.register_enemy_type(ENEMY_CATEGORIES.MICROBE, Microbe);
        this.register_enemy_type(PATHOGEN_TYPES.MYCETOMA, Mycetoma);
    }

    register_enemy_type(type_name, enemy_class) {
        const config = ENEMY_CONFIGS[type_name] || PATHOGEN_CONFIGS[type_name];
        
        if (!config && type_name !== ENEMY_CATEGORIES.MICROBE) {
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

    create_microbe(x, y) {
        return this.create_enemy(ENEMY_CATEGORIES.MICROBE, x, y);
    }

    create_pathogen(pathogen_type, x, y) {
        return this.create_enemy(pathogen_type, x, y);
    }

    spawn_enemy_at_random_edge(canvas_width, canvas_height, type_name = ENEMY_TYPES.BASIC) {
        const spawn_position = this.get_random_edge_position(canvas_width, canvas_height);
        return this.create_enemy(type_name, spawn_position.x, spawn_position.y);
    }

    spawn_microbe_at_random_edge(canvas_width, canvas_height) {
        const spawn_position = this.get_random_edge_position(canvas_width, canvas_height);
        return this.create_microbe(spawn_position.x, spawn_position.y);
    }

    spawn_pathogen_at_random_edge(canvas_width, canvas_height, pathogen_type) {
        const spawn_position = this.get_random_edge_position(canvas_width, canvas_height);
        return this.create_pathogen(pathogen_type, spawn_position.x, spawn_position.y);
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