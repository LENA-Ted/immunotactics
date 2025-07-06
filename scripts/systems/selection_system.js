class SelectionSystem {
    constructor() {
        this.current_selection = IMMUNE_CELL_TYPES.B_CELL;
        this.selection_map = {
            1: IMMUNE_CELL_TYPES.B_CELL,
            2: IMMUNE_CELL_TYPES.MAST_CELL,
            3: IMMUNE_CELL_TYPES.INTERFERON
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
        this.is_initialized = true;
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
        
        if (this.selection_map.hasOwnProperty(key)) {
            if (this.input_blocked) {
                return;
            }
            
            const new_selection = this.selection_map[key];
            
            if (new_selection !== this.current_selection) {
                this.change_selection(new_selection);
            }
        }
    }

    change_selection(new_selection) {
        this.current_selection = new_selection;
        this.block_input();
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
        return this.current_selection;
    }

    get_current_selection_name() {
        return IMMUNE_CELL_NAMES[this.current_selection];
    }

    get_current_selection_cost() {
        return IMMUNE_CELL_CONFIGS[this.current_selection].cost;
    }

    is_input_blocked() {
        return this.input_blocked;
    }

    reset() {
        this.current_selection = IMMUNE_CELL_TYPES.B_CELL;
        this.input_blocked = false;
        this.input_block_start_time = 0;
    }
}

window.SelectionSystem = SelectionSystem;