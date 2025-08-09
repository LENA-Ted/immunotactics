class SelectionSystem {
    constructor() {
        this.current_selection_slot = 1;
        this.equipped_immune_cell_slots = {
            1: null,
            2: null,
            3: null,
            4: null
        };
        this.input_blocked = false;
        this.input_block_duration_ms = 500;
        this.input_block_start_time = 0;
        this.is_initialized = false;
    }

    initialize() {
        if (this.is_initialized) {
            return;
        }

        this.setup_keyboard_listeners();
        this.initialize_starting_slots();
        this.is_initialized = true;
    }

    initialize_starting_slots() {
        Object.keys(STARTING_IMMUNE_CELL_SLOTS).forEach(slot => {
            const immune_cell_type = STARTING_IMMUNE_CELL_SLOTS[slot];
            this.equipped_immune_cell_slots[slot] = immune_cell_type;
        });
        
        this.current_selection_slot = this.find_first_occupied_slot() || 1;
    }

    find_first_occupied_slot() {
        for (let slot = 1; slot <= 4; slot++) {
            if (this.equipped_immune_cell_slots[slot]) {
                return slot;
            }
        }
        return null;
    }

    setup_keyboard_listeners() {
        document.addEventListener('keydown', (event) => {
            this.handle_key_press(event);
        });
    }

    handle_key_press(event) {
        if (!window.game_state || window.game_state.is_game_over) {
            return;
        }

        const key = event.key;
        
        if (['1', '2', '3', '4'].includes(key)) {
            if (this.input_blocked) {
                return;
            }
            
            const slot = parseInt(key);
            
            if (slot !== this.current_selection_slot) {
                this.change_selection_to_slot(slot);
            }
        }
    }

    change_selection_to_slot(slot) {
        if (this.equipped_immune_cell_slots[slot]) {
            this.current_selection_slot = slot;
            this.block_input();
        }
    }

    block_input() {
        this.input_blocked = true;
        this.input_block_start_time = performance.now();
    }

    update(timestamp) {
        if (this.input_blocked) {
            const elapsed = timestamp - this.input_block_start_time;
            if (elapsed >= this.input_block_duration_ms) {
                this.input_blocked = false;
            }
        }
    }

    get_current_selection() {
        const immune_cell_type = this.equipped_immune_cell_slots[this.current_selection_slot];
        return immune_cell_type || IMMUNE_CELL_TYPES.B_CELL;
    }

    get_current_selection_slot() {
        return this.current_selection_slot;
    }

    get_current_selection_name() {
        const immune_cell_type = this.get_current_selection();
        return IMMUNE_CELL_NAMES[immune_cell_type] || 'Empty';
    }

    get_current_selection_cost() {
        const immune_cell_type = this.get_current_selection();
        return IMMUNE_CELL_CONFIGS[immune_cell_type]?.cost || 0;
    }

    get_equipped_immune_cell(slot) {
        return this.equipped_immune_cell_slots[slot];
    }

    set_equipped_immune_cell(slot, immune_cell_type) {
        this.equipped_immune_cell_slots[slot] = immune_cell_type;
        
        if (immune_cell_type && this.current_selection_slot === slot) {
            
        } else if (immune_cell_type && !this.equipped_immune_cell_slots[this.current_selection_slot]) {
            this.current_selection_slot = slot;
        } else if (!immune_cell_type && this.current_selection_slot === slot) {
            const next_occupied_slot = this.find_first_occupied_slot();
            if (next_occupied_slot) {
                this.current_selection_slot = next_occupied_slot;
            }
        }
    }

    get_equipped_immune_cell_types() {
        const equipped_types = [];
        Object.values(this.equipped_immune_cell_slots).forEach(type => {
            if (type) {
                equipped_types.push(type);
            }
        });
        return equipped_types;
    }

    get_available_immune_cell_types() {
        const all_types = Object.values(IMMUNE_CELL_TYPES);
        const equipped_types = this.get_equipped_immune_cell_types();
        
        return all_types.filter(type => !equipped_types.includes(type));
    }

    get_equipped_slots_info() {
        const slots_info = {};
        for (let slot = 1; slot <= 4; slot++) {
            const immune_cell_type = this.equipped_immune_cell_slots[slot];
            slots_info[slot] = {
                immune_cell_type: immune_cell_type,
                name: immune_cell_type ? IMMUNE_CELL_NAMES[immune_cell_type] : null,
                is_occupied: !!immune_cell_type,
                is_selected: slot === this.current_selection_slot
            };
        }
        return slots_info;
    }

    is_slot_available_for_placement(slot) {
        return this.equipped_immune_cell_slots[slot] !== null;
    }

    is_input_blocked() {
        return this.input_blocked;
    }

    reset() {
        this.equipped_immune_cell_slots = {
            1: null,
            2: null,
            3: null,
            4: null
        };
        this.initialize_starting_slots();
        this.input_blocked = false;
        this.input_block_start_time = 0;
    }
}

window.SelectionSystem = SelectionSystem;