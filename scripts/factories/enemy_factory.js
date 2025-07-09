class EnemyFactory {
    constructor() {
        this.enemy_types = new Map();
        this.pathogen_types = new Map();
        this.register_legacy_enemies();
        this.register_pathogen_types();
    }

    register_legacy_enemies() {
        this.register_enemy_type(ENEMY_TYPES.BASIC, BasicEnemy);
    }

    register_pathogen_types() {
        this.register_pathogen_type(PATHOGEN_TYPES.COCCUS, Coccus);
        this.register_pathogen_type(PATHOGEN_TYPES.BACILLUS, Bacillus);
        this.register_pathogen_type(PATHOGEN_TYPES.MYCETOMA, Mycetoma);
        this.register_pathogen_type(PATHOGEN_TYPES.BACTERIOPHAGE, Bacteriophage);
        this.register_pathogen_type(PATHOGEN_TYPES.SPIRILLUM, Spirillum);
    }

    register_enemy_type(type_name, enemy_class) {
        if (!ENEMY_CONFIGS[type_name]) {
            console.error(`Enemy config not found for type: ${type_name}`);
            return false;
        }

        this.enemy_types.set(type_name, enemy_class);
        return true;
    }

    register_pathogen_type(type_name, pathogen_class) {
        if (!PATHOGEN_CONFIGS[type_name]) {
            console.error(`Pathogen config not found for type: ${type_name}`);
            return false;
        }

        this.pathogen_types.set(type_name, pathogen_class);
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

    create_pathogen(type_name, x, y) {
        if (!this.pathogen_types.has(type_name)) {
            console.error(`Unknown pathogen type: ${type_name}`);
            return null;
        }

        const pathogen_class = this.pathogen_types.get(type_name);
        return new pathogen_class(x, y);
    }

    create_enemy_by_type(type_name, x, y) {
        return this.create_enemy(type_name, x, y);
    }

    spawn_enemy_at_random_edge(canvas_width, canvas_height, type_name = ENEMY_TYPES.BASIC) {
        const spawn_position = this.get_random_edge_position(canvas_width, canvas_height);
        return this.create_enemy(type_name, spawn_position.x, spawn_position.y);
    }

    spawn_pathogen_at_random_edge(canvas_width, canvas_height, pathogen_type = null) {
        const spawn_position = this.get_random_edge_position(canvas_width, canvas_height);
        const selected_pathogen_type = pathogen_type || this.select_random_pathogen_type();
        return this.create_pathogen(selected_pathogen_type, spawn_position.x, spawn_position.y);
    }

    select_random_pathogen_type() {
        const is_standard = Math.random() < PATHOGEN_SPAWN_CONFIG.standard_spawn_chance;
        
        if (is_standard) {
            return this.select_random_from_category(PATHOGEN_CATEGORIES.STANDARD);
        } else {
            return this.select_random_from_category(PATHOGEN_CATEGORIES.SPECIAL);
        }
    }

    select_random_from_category(category_types) {
        if (!category_types || category_types.length === 0) {
            return PATHOGEN_TYPES.COCCUS;
        }
        
        const random_index = Math.floor(Math.random() * category_types.length);
        return category_types[random_index];
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

    get_available_pathogen_types() {
        return Array.from(this.pathogen_types.keys());
    }

    is_valid_enemy_type(type_name) {
        return this.enemy_types.has(type_name);
    }

    is_valid_pathogen_type(type_name) {
        return this.pathogen_types.has(type_name);
    }
}

window.EnemyFactory = EnemyFactory;