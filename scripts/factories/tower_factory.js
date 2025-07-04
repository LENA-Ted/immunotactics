class TowerFactory {
    constructor() {
        this.tower_types = new Map();
        this.register_default_towers();
    }

    register_default_towers() {
        this.register_tower_type(TOWER_TYPES.SNIPER, SniperTower);
    }

    register_tower_type(type_name, tower_class) {
        if (!TOWER_CONFIGS[type_name]) {
            console.error(`Tower config not found for type: ${type_name}`);
            return false;
        }

        this.tower_types.set(type_name, tower_class);
        return true;
    }

    create_tower(type_name, x, y) {
        if (!this.tower_types.has(type_name)) {
            console.error(`Unknown tower type: ${type_name}`);
            return null;
        }

        const tower_class = this.tower_types.get(type_name);
        const tower_id = this.generate_tower_id();
        
        return new tower_class(x, y, tower_id);
    }

    create_tower_by_type(type_name, x, y) {
        return this.create_tower(type_name, x, y);
    }

    get_tower_cost(type_name) {
        const config = TOWER_CONFIGS[type_name];
        return config ? config.cost : 0;
    }

    get_available_tower_types() {
        return Array.from(this.tower_types.keys());
    }

    is_valid_tower_type(type_name) {
        return this.tower_types.has(type_name);
    }

    generate_tower_id() {
        return Date.now() + Math.random();
    }
}

window.TowerFactory = TowerFactory;