class InputSystem {
    constructor(game_canvas, tower_factory, selection_system) {
        this.game_canvas = game_canvas;
        this.tower_factory = tower_factory;
        this.selection_system = selection_system;
        this.cursor_state = {
            x: 0,
            y: 0,
            displayed_energy: GAME_CONFIG.PLAYER_MAX_ENERGY,
            error_timer: 0
        };
        this.is_initialized = false;
    }

    initialize() {
        if (this.is_initialized) {
            return;
        }

        this.setup_event_listeners();
        this.is_initialized = true;
    }

    setup_event_listeners() {
        document.addEventListener('mousemove', (event) => {
            this.handle_mouse_move(event);
        });

        document.addEventListener('click', (event) => {
            this.handle_mouse_click(event);
        });

        document.addEventListener('contextmenu', (event) => {
            this.handle_right_click(event);
        });
    }

    handle_mouse_move(event) {
        const rect = this.game_canvas.getBoundingClientRect();
        this.cursor_state.x = event.clientX - rect.left;
        this.cursor_state.y = event.clientY - rect.top;
    }

    handle_mouse_click(event) {
        if (!window.game_state || window.game_state.is_game_over) {
            return;
        }

        if (window.game_state.is_game_paused || this.is_intensity_reward_modal_active()) {
            return;
        }

        if (!this.is_valid_game_click(event)) {
            return;
        }

        this.attempt_place_tower();
    }

    handle_right_click(event) {
        event.preventDefault();
        
        if (!window.game_state || window.game_state.is_game_over) {
            return;
        }

        if (window.game_state.is_game_paused || this.is_intensity_reward_modal_active()) {
            return;
        }

        if (!this.is_valid_game_click(event)) {
            return;
        }

        this.attempt_phenotype_action();
    }

    attempt_phenotype_action() {
        if (!window.game_state || !window.game_state.phenotype_system) {
            return false;
        }

        return window.game_state.phenotype_system.perform_action(
            this.cursor_state.x, 
            this.cursor_state.y
        );
    }

    is_intensity_reward_modal_active() {
        return window.game_state && 
               window.game_state.intensity_reward_system && 
               window.game_state.intensity_reward_system.is_reward_modal_active();
    }

    is_valid_game_click(event) {
        const game_container = document.getElementById('game_container');
        const game_over_screen = document.getElementById('game_over_screen');
        
        if (!game_container) {
            return false;
        }

        if (game_over_screen && game_over_screen.classList.contains('active')) {
            return false;
        }

        if (event.target.tagName === 'BUTTON') {
            return false;
        }

        if (event.target.closest('#top_left_ui_container')) {
            return false;
        }

        if (event.target.closest('#top_right_ui_container')) {
            return false;
        }

        if (!event.target.closest('#game_container')) {
            return false;
        }

        return true;
    }

    attempt_place_tower() {
        const tower_type = this.selection_system ? 
            this.selection_system.get_current_selection() : 
            TOWER_TYPES.SNIPER;
            
        const cost = this.tower_factory.get_tower_cost(tower_type);
        
        if (!window.game_state.player.can_afford(cost)) {
            this.trigger_insufficient_energy_error();
            return false;
        }

        const success = window.game_state.player.spend_energy(cost);
        if (!success) {
            this.trigger_insufficient_energy_error();
            return false;
        }

        const tower = this.tower_factory.create_tower(
            tower_type, 
            this.cursor_state.x, 
            this.cursor_state.y
        );

        if (tower && window.game_state.towers) {
            if (tower.update_range) {
                tower.update_range();
            }
            window.game_state.towers.push(tower);
            
            if (!window.game_state.player.is_in_free_placement_state()) {
                window.game_state.player.check_spontaneous_generation();
            }
            
            return true;
        }

        return false;
    }

    trigger_insufficient_energy_error() {
        this.cursor_state.error_timer = 30;
    }

    update_cursor_state(player) {
        if (this.cursor_state.error_timer > 0) {
            this.cursor_state.error_timer--;
        }

        this.cursor_state.displayed_energy = MathUtils.lerp(
            this.cursor_state.displayed_energy, 
            player.energy, 
            0.2
        );
    }

    get_cursor_position() {
        return {
            x: this.cursor_state.x,
            y: this.cursor_state.y
        };
    }

    get_cursor_state() {
        return this.cursor_state;
    }

    is_error_active() {
        return this.cursor_state.error_timer > 0;
    }
}

window.InputSystem = InputSystem;