class IntensityRewardSystem {
    constructor() {
        this.is_modal_active = false;
        this.current_choices = [];
        this.is_selection_in_progress = false;
        this.modal_element = null;
        this.card_elements = [];
        this.intensity_up_text_element = null;
    }

    initialize() {
        this.create_modal_elements();
        this.setup_event_listeners();
        this.initialize_diagonal_stripes();
    }

    initialize_diagonal_stripes() {
        this.set_css_variables();
        
        this.card_elements.forEach(card => {
            if (card) {
                card.classList.add('diagonal-stripes');
            }
        });
    }

    set_css_variables() {
        const root = document.documentElement;
        root.style.setProperty('--diagonal-stripes-opacity', GAME_CONFIG.DIAGONAL_STRIPES_OPACITY);
        root.style.setProperty('--diagonal-stripes-thickness', `${GAME_CONFIG.DIAGONAL_STRIPES_THICKNESS_PX}px`);
        root.style.setProperty('--diagonal-stripes-spacing', `${GAME_CONFIG.DIAGONAL_STRIPES_SPACING_PX}px`);
        root.style.setProperty('--diagonal-stripes-duration', `${GAME_CONFIG.DIAGONAL_STRIPES_ANIMATION_DURATION_S}s`);
    }

    create_modal_elements() {
        this.modal_element = document.getElementById('intensity_reward_modal');
        this.intensity_up_text_element = document.getElementById('intensity_up_text');
        this.card_elements = [
            document.getElementById('reward_card_1'),
            document.getElementById('reward_card_2'),
            document.getElementById('reward_card_3')
        ];
    }

    setup_event_listeners() {
        this.card_elements.forEach((card, index) => {
            if (card) {
                card.addEventListener('click', () => {
                    this.handle_card_selection(index);
                });
            }
        });
    }

    show_intensity_reward_modal() {
        if (this.is_modal_active) {
            return;
        }

        this.is_modal_active = true;
        this.is_selection_in_progress = false;
        
        this.generate_reward_choices();
        this.update_modal_content();
        
        if (window.game_state && window.game_state.ui_system) {
            window.game_state.ui_system.hide_all_gameplay_ui();
        }

        this.play_telegraph_animation();
    }

    play_telegraph_animation() {
        if (!this.intensity_up_text_element) {
            this.show_modal();
            return;
        }

        const duration_per_flicker_ms = INTENSITY_CONFIG.TELEGRAPH_DURATION_MS / INTENSITY_CONFIG.TELEGRAPH_FLICKER_COUNT;

        this.intensity_up_text_element.textContent = INTENSITY_CONFIG.TELEGRAPH_TEXT;
        this.intensity_up_text_element.style.animationIterationCount = INTENSITY_CONFIG.TELEGRAPH_FLICKER_COUNT;
        this.intensity_up_text_element.style.animationDuration = `${duration_per_flicker_ms}ms`;
        this.intensity_up_text_element.classList.add('visible');
        this.intensity_up_text_element.classList.add('flicker');

        setTimeout(() => {
            if (this.intensity_up_text_element) {
                this.intensity_up_text_element.classList.remove('flicker');
                this.intensity_up_text_element.style.animationIterationCount = '';
                this.intensity_up_text_element.style.animationDuration = '';
            }
            this.show_modal();
        }, INTENSITY_CONFIG.TELEGRAPH_DURATION_MS);
    }

    generate_reward_choices() {
        if (window.game_state && window.game_state.adaptation_system) {
            this.current_choices = window.game_state.adaptation_system.generate_intensity_reward_choices();
        } else {
            this.current_choices = [
                ADAPTATION_TYPES.NUTRIENT_GLUT,
                ADAPTATION_TYPES.NUTRIENT_GLUT,
                ADAPTATION_TYPES.NUTRIENT_GLUT
            ];
        }
    }

    update_modal_content() {
        this.card_elements.forEach((card, index) => {
            if (card && this.current_choices[index]) {
                this.update_card_content(card, this.current_choices[index]);
            }
        });
    }

    update_card_content(card_element, adaptation_type) {
        const adaptation_config = ADAPTATION_CONFIGS[adaptation_type];
        if (!adaptation_config) {
            return;
        }

        let target_level;
        let level_display;

        if (adaptation_type === ADAPTATION_TYPES.NUTRIENT_GLUT) {
            target_level = 0;
            level_display = '';
        } else {
            const current_adaptation = window.game_state.adaptation_system.get_adaptation(adaptation_type);
            target_level = current_adaptation ? current_adaptation.get_level() + 1 : 0;
            level_display = target_level > 0 ? `+${target_level}` : '';
        }

        const description = adaptation_config.descriptions[target_level] || adaptation_config.descriptions[0];

        const name_element = card_element.querySelector('.adaptation_name');
        const level_element = card_element.querySelector('.adaptation_level');
        const description_element = card_element.querySelector('.adaptation_description');

        if (name_element) {
            name_element.textContent = adaptation_config.name;
        }

        if (level_element) {
            level_element.textContent = level_display;
            level_element.style.display = level_display ? 'inline' : 'none';
        }

        if (description_element) {
            description_element.textContent = description;
        }
    }

    show_modal() {
        if (this.modal_element) {
            this.modal_element.classList.add('active');
        }
        
        setTimeout(() => {
            this.card_elements.forEach(card => {
                if (card) {
                    card.classList.add('visible');
                }
            });
        }, 100);
    }

    handle_card_selection(card_index) {
        if (this.is_selection_in_progress || card_index >= this.current_choices.length) {
            return;
        }

        this.is_selection_in_progress = true;
        const selected_adaptation = this.current_choices[card_index];
        const selected_card = this.card_elements[card_index];

        this.fade_out_other_cards(card_index);
        this.animate_selected_card(selected_card);

        setTimeout(() => {
            this.apply_selected_adaptation(selected_adaptation);
            this.hide_modal();
        }, 1000);
    }

    fade_out_other_cards(selected_index) {
        this.card_elements.forEach((card, index) => {
            if (card && index !== selected_index) {
                card.classList.add('faded');
            }
        });
    }

    animate_selected_card(card_element) {
        if (card_element) {
            card_element.classList.add('selected');
        }
    }

    apply_selected_adaptation(adaptation_type) {
        if (window.game_state && window.game_state.adaptation_system) {
            window.game_state.adaptation_system.add_adaptation(adaptation_type);
        }
    }

    hide_modal() {
        if (this.modal_element) {
            this.modal_element.classList.remove('active');
        }

        if (this.intensity_up_text_element) {
            this.intensity_up_text_element.classList.remove('visible');
        }

        this.card_elements.forEach(card => {
            if (card) {
                card.classList.remove('visible', 'selected', 'faded');
            }
        });

        this.is_modal_active = false;
        this.is_selection_in_progress = false;
        this.current_choices = [];

        if (window.game_state) {
            window.game_state.is_game_paused = false;
        }

        if (window.game_state && window.game_state.ui_system) {
            window.game_state.ui_system.show_all_gameplay_ui();
        }
    }

    is_reward_modal_active() {
        return this.is_modal_active;
    }

    reset() {
        this.is_modal_active = false;
        this.current_choices = [];
        this.is_selection_in_progress = false;
        
        if (window.game_state) {
            window.game_state.is_game_paused = false;
        }
        
        if (this.modal_element) {
            this.modal_element.classList.remove('active');
        }

        if (this.intensity_up_text_element) {
            this.intensity_up_text_element.classList.remove('visible');
            this.intensity_up_text_element.classList.remove('flicker');
            this.intensity_up_text_element.style.animationIterationCount = '';
            this.intensity_up_text_element.style.animationDuration = '';
        }

        this.card_elements.forEach(card => {
            if (card) {
                card.classList.remove('visible', 'selected', 'faded');
            }
        });

        this.initialize_diagonal_stripes();
    }
}

window.IntensityRewardSystem = IntensityRewardSystem;