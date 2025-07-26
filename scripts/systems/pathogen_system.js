class PathogenSystem {
    constructor() {
        this.active_pathogen_slots = [];
        this.microbe_selection_chance = PATHOGEN_SYSTEM_CONFIG.INITIAL_MICROBE_SELECTION_CHANCE;
        this.last_selection_time = 0;
        this.debug_element = null;
        this.is_initialized = false;
    }

    initialize() {
        if (this.is_initialized) {
            return;
        }

        this.create_debug_element();
        this.randomize_active_pathogen_slots();
        this.last_selection_time = performance.now();
        this.is_initialized = true;
        this.update_debug_display();
    }

    create_debug_element() {
        this.debug_element = document.createElement('div');
        this.debug_element.id = 'pathogen_debug';
        this.debug_element.style.cssText = `
            position: absolute;
            top: 10px;
            right: 120px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px;
            border-radius: 5px;
            font-size: 12px;
            font-family: monospace;
            z-index: 100;
            pointer-events: none;
        `;
        document.body.appendChild(this.debug_element);
    }

    update(timestamp) {
        if (!this.is_initialized) {
            return;
        }

        this.check_selection_timer_update(timestamp);
        this.update_debug_display();
    }

    check_selection_timer_update(timestamp) {
        if (!window.game_state || !window.game_state.get_adjusted_elapsed_time) {
            return;
        }

        const adjusted_elapsed = window.game_state.get_adjusted_elapsed_time(this.last_selection_time);
        
        if (adjusted_elapsed >= PATHOGEN_SYSTEM_CONFIG.SELECTION_TIMER_INTERVAL_MS) {
            this.randomize_active_pathogen_slots();
            this.last_selection_time = this.get_current_adjusted_time(timestamp);
        }
    }

    get_current_adjusted_time(timestamp) {
        if (window.game_state && window.game_state.get_adjusted_elapsed_time) {
            return window.game_state.get_adjusted_elapsed_time(0);
        }
        return timestamp;
    }

    randomize_active_pathogen_slots() {
        this.active_pathogen_slots = [];
        
        if (PATHOGEN_POOL.length === 0) {
            return;
        }

        const available_pathogens = [...PATHOGEN_POOL];
        const slots_to_fill = Math.min(PATHOGEN_SYSTEM_CONFIG.MAX_ACTIVE_SLOTS, available_pathogens.length);

        for (let i = 0; i < slots_to_fill; i++) {
            const random_index = Math.floor(Math.random() * available_pathogens.length);
            const selected_pathogen = available_pathogens[random_index];
            this.active_pathogen_slots.push(selected_pathogen);
            available_pathogens.splice(random_index, 1);
        }
    }

    should_spawn_microbe() {
        if (this.active_pathogen_slots.length === 0) {
            return true;
        }

        const will_spawn_microbe = Math.random() < this.microbe_selection_chance;

        if (will_spawn_microbe) {
            this.decrease_microbe_selection_chance();
        } else {
            this.reset_microbe_selection_chance();
        }

        return will_spawn_microbe;
    }

    decrease_microbe_selection_chance() {
        this.microbe_selection_chance -= PATHOGEN_SYSTEM_CONFIG.MICROBE_SELECTION_CHANCE_DECREMENT;
        this.microbe_selection_chance = Math.max(0, this.microbe_selection_chance);
    }

    reset_microbe_selection_chance() {
        this.microbe_selection_chance = PATHOGEN_SYSTEM_CONFIG.INITIAL_MICROBE_SELECTION_CHANCE;
    }

    get_random_active_pathogen_type() {
        if (this.active_pathogen_slots.length === 0) {
            return null;
        }

        const random_index = Math.floor(Math.random() * this.active_pathogen_slots.length);
        return this.active_pathogen_slots[random_index];
    }

    get_active_pathogen_slots() {
        return [...this.active_pathogen_slots];
    }

    get_microbe_selection_chance() {
        return this.microbe_selection_chance;
    }

    update_debug_display() {
        if (!this.debug_element) {
            return;
        }

        const active_slots_text = this.active_pathogen_slots.length > 0 
            ? this.active_pathogen_slots.join(', ') 
            : 'None';
        
        const microbe_chance_percentage = Math.round(this.microbe_selection_chance * 100);

        this.debug_element.innerHTML = `
            Active Pathogens: ${active_slots_text}<br>
            Microbe Chance: ${microbe_chance_percentage}%
        `;
    }

    reset() {
        this.microbe_selection_chance = PATHOGEN_SYSTEM_CONFIG.INITIAL_MICROBE_SELECTION_CHANCE;
        this.randomize_active_pathogen_slots();
        this.last_selection_time = performance.now();
        this.update_debug_display();
    }

    cleanup() {
        if (this.debug_element && this.debug_element.parentNode) {
            this.debug_element.parentNode.removeChild(this.debug_element);
            this.debug_element = null;
        }
    }
}

window.PathogenSystem = PathogenSystem;