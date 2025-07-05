class UISystem {
    constructor() {
        this.core_hp_container = document.getElementById('core_hp_container');
        this.timer_container = document.getElementById('timer_container');
        this.game_over_screen = document.getElementById('game_over_screen');
        this.start_time = 0;
    }

    initialize() {
        this.start_time = performance.now();
        this.hide_game_over_screen();
    }

    update_ui(game_state) {
        this.update_core_hp_display(game_state.core);
        this.update_timer_display();
        
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
    }

    get_elapsed_time_seconds() {
        return Math.floor((performance.now() - this.start_time) / 1000);
    }

    is_game_over_screen_visible() {
        return this.game_over_screen && this.game_over_screen.classList.contains('active');
    }
}

window.UISystem = UISystem;