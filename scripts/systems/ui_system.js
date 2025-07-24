class UISystem {
    constructor() {
        this.core_hp_container = document.getElementById('core_hp_container');
        this.timer_container = document.getElementById('timer_container');
        this.game_over_screen = document.getElementById('game_over_screen');
        this.intensity_gauge_container = document.getElementById('intensity_gauge_container');
        this.intensity_gauge_canvas = document.getElementById('intensity_gauge_canvas');
        this.intensity_level_number = document.getElementById('intensity_level_number');
        this.selection_elements = {
            1: document.getElementById('selection_1'),
            2: document.getElementById('selection_2'),
            3: document.getElementById('selection_3')
        };
        this.resource_containers = {
            cytokines: document.getElementById('cytokines_container'),
            adjuvants: document.getElementById('adjuvants_container'),
            biomass: document.getElementById('biomass_container')
        };
        this.gameplay_ui_containers = [
            document.getElementById('top_left_ui_container'),
            document.getElementById('top_right_ui_container'),
            document.getElementById('bottom_left_ui_container'),
            document.getElementById('selection_ui_container')
        ];
        this.start_time = 0;
        this.intensity_ctx = null;
        this.resource_feedback_timers = {};
        this.animated_resource_values = {
            cytokines: 0,
            adjuvants: 0,
            biomass: 0
        };
        this.last_animation_update = 0;
        this.animation_interval_ms = 100;
    }

    initialize() {
        this.start_time = performance.now();
        this.hide_game_over_screen();
        this.initialize_intensity_gauge();
        this.initialize_selection_ui();
        this.initialize_resource_feedback();
        this.initialize_diagonal_stripes();
    }

    initialize_diagonal_stripes() {
        if (this.core_hp_container) {
            this.core_hp_container.classList.add('diagonal-stripes');
        }
        if (this.timer_container) {
            this.timer_container.classList.add('diagonal-stripes');
        }
        if (this.intensity_gauge_container) {
            this.intensity_gauge_container.classList.add('diagonal-stripes');
        }
    }

    initialize_intensity_gauge() {
        if (!this.intensity_gauge_canvas || !this.intensity_gauge_container || !this.intensity_level_number) {
            return;
        }

        this.set_dynamic_gauge_sizing();
        this.intensity_ctx = this.intensity_gauge_canvas.getContext('2d');
    }

    initialize_selection_ui() {
        this.update_selection_ui(IMMUNE_CELL_TYPES.B_CELL);
    }

    initialize_resource_feedback() {
        this.resource_feedback_timers = {
            [RESOURCE_TYPES.CYTOKINES]: 0,
            [RESOURCE_TYPES.ADJUVANTS]: 0,
            [RESOURCE_TYPES.BIOMASS]: 0
        };
        
        this.animated_resource_values = {
            cytokines: 0,
            adjuvants: 0,
            biomass: 0
        };
        
        this.last_animation_update = 0;
    }

    set_dynamic_gauge_sizing() {
        const base_pill_height = 34;
        const gauge_size = base_pill_height * INTENSITY_CONFIG.GAUGE_SIZE_MULTIPLIER;
        const font_size = gauge_size * INTENSITY_CONFIG.FONT_SCALE_RATIO;

        this.intensity_gauge_container.style.width = `${gauge_size}px`;
        this.intensity_gauge_container.style.height = `${gauge_size}px`;

        this.intensity_gauge_canvas.width = gauge_size;
        this.intensity_gauge_canvas.height = gauge_size;

        this.intensity_level_number.style.fontSize = `${font_size}px`;
    }

    update_ui(game_state) {
        this.update_core_hp_display(game_state.core);
        this.update_timer_display(game_state);
        this.update_intensity_display(game_state);
        this.update_selection_ui_from_game_state();
        this.update_animated_resource_values(game_state);
        this.update_resource_display(game_state);
        this.update_resource_feedback_timers();
        
        if (game_state.is_game_over) {
            this.show_game_over_screen();
        }
    }

    update_core_hp_display(core) {
        if (!this.core_hp_container) {
            return;
        }

        this.core_hp_container.innerHTML = '';

        for (let i = 0; i < core.max_hp; i++) {
            const circle = document.createElement('div');
            circle.classList.add('hp_circle');
            
            if (i < core.hp) {
                circle.classList.add('filled');
            } else {
                circle.classList.add('outlined');
            }
            
            this.core_hp_container.appendChild(circle);
        }
    }

    update_timer_display(game_state) {
        if (!this.timer_container) {
            return;
        }

        let elapsed_ms;
        if (game_state && game_state.get_adjusted_elapsed_time) {
            elapsed_ms = game_state.get_adjusted_elapsed_time(this.start_time);
        } else {
            elapsed_ms = performance.now() - this.start_time;
        }

        const elapsed_seconds = Math.floor(elapsed_ms / 1000);
        const minutes = String(Math.floor(elapsed_seconds / 60)).padStart(2, '0');
        const seconds = String(elapsed_seconds % 60).padStart(2, '0');
        
        this.timer_container.textContent = `${minutes}:${seconds}`;
    }

    update_intensity_display(game_state) {
        this.update_displayed_progress(game_state);
        this.update_intensity_gauge(game_state);
        this.update_intensity_level_number(game_state);
    }

    update_displayed_progress(game_state) {
        const target_progress = game_state.killcount / game_state.killcount_required;
        game_state.displayed_killcount_progress = MathUtils.dynamic_ease_lerp(
            game_state.displayed_killcount_progress,
            target_progress,
            GAME_CONFIG.GAUGE_ANIMATION_BASE_SPEED,
            GAME_CONFIG.GAUGE_ANIMATION_DISTANCE_MULTIPLIER
        );
    }

    update_intensity_gauge(game_state) {
        if (!this.intensity_ctx) {
            return;
        }

        game_state.intensity_gauge_pulsate.update();

        const canvas = this.intensity_gauge_canvas;
        const ctx = this.intensity_ctx;
        const center_x = canvas.width / 2;
        const center_y = canvas.height / 2;
        const radius = (canvas.width / 2) - 8;
        const gauge_scale = game_state.intensity_gauge_pulsate.get_scale();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(center_x, center_y);
        ctx.scale(gauge_scale, gauge_scale);
        ctx.translate(-center_x, -center_y);

        const progress_angle = game_state.displayed_killcount_progress * Math.PI * 2;

        ctx.beginPath();
        ctx.arc(center_x, center_y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${GAME_CONFIG.COLOR_INTENSITY_PROGRESS}40`;
        ctx.lineWidth = 8;
        ctx.stroke();

        if (game_state.displayed_killcount_progress > 0) {
            ctx.beginPath();
            ctx.arc(center_x, center_y, radius, -Math.PI / 2, -Math.PI / 2 + progress_angle);
            ctx.strokeStyle = GAME_CONFIG.COLOR_INTENSITY_PROGRESS;
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        ctx.restore();
    }

    update_intensity_level_number(game_state) {
        if (!this.intensity_level_number) {
            return;
        }

        game_state.intensity_level_pulsate.update();
        const level_scale = game_state.intensity_level_pulsate.get_scale();

        this.intensity_level_number.textContent = game_state.intensity_level;
        this.intensity_level_number.style.transform = `scale(${level_scale})`;
    }

    update_selection_ui_from_game_state() {
        if (window.game_state && window.game_state.selection_system) {
            const current_selection = window.game_state.selection_system.get_current_selection();
            this.update_selection_ui(current_selection);
        }
    }

    update_selection_ui(selected_type) {
        const selection_map = {
            [IMMUNE_CELL_TYPES.B_CELL]: 1,
            [IMMUNE_CELL_TYPES.MAST_CELL]: 2,
            [IMMUNE_CELL_TYPES.INTERFERON]: 3
        };

        const selected_number = selection_map[selected_type];

        Object.keys(this.selection_elements).forEach(key => {
            const element = this.selection_elements[key];
            if (!element) return;

            if (parseInt(key) === selected_number) {
                element.classList.add('selected');
            } else {
                element.classList.remove('selected');
            }
        });
    }

    update_resource_display(game_state) {
        if (!game_state.resource_system) {
            return;
        }

        this.update_resource_container('cytokines', this.animated_resource_values.cytokines);
        this.update_resource_container('adjuvants', this.animated_resource_values.adjuvants);
        this.update_resource_container('biomass', this.animated_resource_values.biomass);
    }

    update_animated_resource_values(game_state) {
        if (!game_state.resource_system) {
            return;
        }

        const current_time = performance.now();
        
        if (current_time - this.last_animation_update < this.animation_interval_ms) {
            return;
        }

        this.last_animation_update = current_time;

        const target_values = {
            cytokines: game_state.resource_system.get_cytokines(),
            adjuvants: game_state.resource_system.get_adjuvants(),
            biomass: game_state.resource_system.get_biomass()
        };

        Object.keys(this.animated_resource_values).forEach(resource_type => {
            const current_animated = this.animated_resource_values[resource_type];
            const target = target_values[resource_type];

            if (current_animated !== target) {
                const step_size = this.calculate_animation_step_size(current_animated, target);
                
                if (current_animated < target) {
                    this.animated_resource_values[resource_type] = Math.min(current_animated + step_size, target);
                } else {
                    this.animated_resource_values[resource_type] = Math.max(current_animated - step_size, target);
                }
            }
        });
    }

    calculate_animation_step_size(current_value, target_value) {
        const difference = Math.abs(target_value - current_value);
        
        if (difference <= 1) {
            return 1;
        }
        
        if (difference <= 5) {
            return 2;
        }
        
        if (difference <= 20) {
            return Math.ceil(difference * 0.3);
        }
        
        if (difference <= 100) {
            return Math.ceil(difference * 0.2);
        }
        
        return Math.ceil(difference * 0.15);
    }

    update_resource_container(resource_type, value) {
        const container = this.resource_containers[resource_type];
        if (!container) {
            return;
        }

        const symbol_element = container.querySelector('.resource_symbol');
        const value_element = container.querySelector('.resource_value');

        if (symbol_element && value_element) {
            value_element.textContent = Math.floor(value);
        }
    }

    update_resource_feedback_timers() {
        const current_time = performance.now();

        Object.keys(this.resource_feedback_timers).forEach(resource_type => {
            const timer_info = this.resource_feedback_timers[resource_type];
            
            if (timer_info && timer_info.end_time && current_time >= timer_info.end_time) {
                this.end_resource_feedback(resource_type);
                this.resource_feedback_timers[resource_type] = 0;
            }
        });
    }

    trigger_resource_feedback(resource_type) {
        const container_map = {
            [RESOURCE_TYPES.CYTOKINES]: 'cytokines',
            [RESOURCE_TYPES.ADJUVANTS]: 'adjuvants',
            [RESOURCE_TYPES.BIOMASS]: 'biomass'
        };

        const container_key = container_map[resource_type];
        const container = this.resource_containers[container_key];

        if (!container) {
            return;
        }

        container.classList.add('feedback_active');

        this.resource_feedback_timers[resource_type] = {
            end_time: performance.now() + RESOURCE_CONFIG.UI_FEEDBACK_DURATION_MS
        };
    }

    end_resource_feedback(resource_type) {
        const container_map = {
            [RESOURCE_TYPES.CYTOKINES]: 'cytokines',
            [RESOURCE_TYPES.ADJUVANTS]: 'adjuvants',
            [RESOURCE_TYPES.BIOMASS]: 'biomass'
        };

        const container_key = container_map[resource_type];
        const container = this.resource_containers[container_key];

        if (!container) {
            return;
        }

        container.classList.remove('feedback_active');
    }

    hide_all_gameplay_ui() {
        this.gameplay_ui_containers.forEach(container => {
            if (container) {
                container.style.display = 'none';
            }
        });
    }

    show_all_gameplay_ui() {
        this.gameplay_ui_containers.forEach(container => {
            if (container) {
                container.style.display = '';
            }
        });
    }

    show_game_over_screen() {
        if (this.game_over_screen) {
            this.game_over_screen.classList.add('active');
        }
    }

    hide_game_over_screen() {
        if (this.game_over_screen) {
            this.game_over_screen.classList.remove('active');
        }
    }

    reset_timer() {
        this.start_time = performance.now();
    }

    reset() {
        this.reset_timer();
        this.hide_game_over_screen();
        this.reset_intensity_display();
        this.initialize_selection_ui();
        this.initialize_resource_feedback();
        this.clear_resource_feedback_states();
        this.show_all_gameplay_ui();
        this.initialize_diagonal_stripes();
    }

    clear_resource_feedback_states() {
        Object.values(this.resource_containers).forEach(container => {
            if (container) {
                container.classList.remove('feedback_active');
            }
        });
    }

    reset_intensity_display() {
        if (this.intensity_level_number) {
            this.intensity_level_number.textContent = '0';
            this.intensity_level_number.style.transform = 'scale(1)';
        }

        if (this.intensity_ctx) {
            this.intensity_ctx.clearRect(0, 0, this.intensity_gauge_canvas.width, this.intensity_gauge_canvas.height);
        }

        if (window.game_state) {
            window.game_state.displayed_killcount_progress = 0;
        }
    }

    get_elapsed_time_seconds() {
        if (window.game_state && window.game_state.get_adjusted_elapsed_time) {
            return Math.floor(window.game_state.get_adjusted_elapsed_time(this.start_time) / 1000);
        }
        return Math.floor((performance.now() - this.start_time) / 1000);
    }

    is_game_over_screen_visible() {
        return this.game_over_screen && this.game_over_screen.classList.contains('active');
    }
}

window.UISystem = UISystem;