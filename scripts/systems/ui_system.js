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
        this.start_time = 0;
        this.intensity_ctx = null;
    }

    initialize() {
        this.start_time = performance.now();
        this.hide_game_over_screen();
        this.initialize_intensity_gauge();
        this.initialize_selection_ui();
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
        this.update_timer_display();
        this.update_intensity_display(game_state);
        this.update_selection_ui_from_game_state();
        
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

    update_timer_display() {
        if (!this.timer_container) {
            return;
        }

        const elapsed = Math.floor((performance.now() - this.start_time) / 1000);
        const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        
        this.timer_container.textContent = `${minutes}:${seconds}`;
    }

    update_intensity_display(game_state) {
        this.update_displayed_progress(game_state);
        this.update_intensity_gauge(game_state);
        this.update_intensity_level_number(game_state);
    }

    update_displayed_progress(game_state) {
        const target_progress = game_state.killcount / game_state.killcount_required;
        game_state.displayed_killcount_progress = MathUtils.lerp(
            game_state.displayed_killcount_progress,
            target_progress,
            0.2
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
        return Math.floor((performance.now() - this.start_time) / 1000);
    }

    is_game_over_screen_visible() {
        return this.game_over_screen && this.game_over_screen.classList.contains('active');
    }
}

window.UISystem = UISystem;