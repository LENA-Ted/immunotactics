class IntensityRewardSystem {
    constructor() {
        this.is_modal_active = false;
        this.current_choices = [];
        this.is_selection_in_progress = false;
        this.modal_element = null;
        this.card_elements = [];
        this.intensity_up_text_element = null;
        this.projected_level_circles = [];
        this.is_slot_selection_active = false;
        this.selected_immune_cell_reward = null;
        this.slot_selection_elements = null;
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
        root.style.setProperty('--reward-card-border-thickness', `${REWARD_CARD_CONFIG.BORDER_THICKNESS}px`);
        root.style.setProperty('--reward-card-adaptation-border-color', REWARD_CARD_CONFIG.ADAPTATION_BORDER_COLOR);
        root.style.setProperty('--reward-card-immune-cell-border-color', REWARD_CARD_CONFIG.IMMUNE_CELL_BORDER_COLOR);
        root.style.setProperty('--reward-card-description-height', `${REWARD_CARD_CONFIG.DESCRIPTION_HEIGHT}px`);
        root.style.setProperty('--reward-card-name-container-height', `${REWARD_CARD_CONFIG.NAME_CONTAINER_HEIGHT}px`);
        root.style.setProperty('--reward-card-name-font-size-base', `${REWARD_CARD_CONFIG.NAME_FONT_SIZE_BASE}em`);
        root.style.setProperty('--reward-card-name-font-size-min', `${REWARD_CARD_CONFIG.NAME_FONT_SIZE_MIN}em`);
        root.style.setProperty('--intensity-up-text-size', `${REWARD_CARD_CONFIG.INTENSITY_UP_TEXT_SIZE}em`);
        
        root.style.setProperty('--outline-projection-growth-duration', `${REWARD_CARD_CONFIG.OUTLINE_PROJECTION_GROWTH_DURATION_MS}ms`);
        root.style.setProperty('--outline-projection-fade-duration', `${REWARD_CARD_CONFIG.OUTLINE_PROJECTION_FADE_DURATION_MS}ms`);
        root.style.setProperty('--outline-projection-max-scale', REWARD_CARD_CONFIG.OUTLINE_PROJECTION_MAX_SCALE);
        
        root.style.setProperty('--level-circle-pulse-duration', `${REWARD_CARD_CONFIG.LEVEL_CIRCLE_PULSE_DURATION_MS}ms`);
        root.style.setProperty('--level-circle-pulse-delay', `${REWARD_CARD_CONFIG.LEVEL_CIRCLE_PULSE_DELAY_MS}ms`);
        
        root.style.setProperty('--card-zoom-scale', REWARD_CARD_CONFIG.CARD_ZOOM_SCALE);
        root.style.setProperty('--card-zoom-duration', `${REWARD_CARD_CONFIG.CARD_ZOOM_DURATION_MS}ms`);
    }

    create_modal_elements() {
        this.modal_element = document.getElementById('intensity_reward_modal');
        this.intensity_up_text_element = document.getElementById('intensity_up_text');
        this.card_elements = [
            document.getElementById('reward_card_1'),
            document.getElementById('reward_card_2'),
            document.getElementById('reward_card_3')
        ];
        this.create_slot_selection_elements();
    }

    create_slot_selection_elements() {
        if (!this.modal_element) {
            return;
        }

        this.slot_selection_elements = {
            container: document.createElement('div'),
            slots: [],
            labels: [],
            names: []
        };

        this.slot_selection_elements.container.id = 'slot_selection_container';
        this.slot_selection_elements.container.className = 'slot_selection_container';
        this.slot_selection_elements.container.style.display = 'none';

        for (let slot = 1; slot <= 4; slot++) {
            const slot_wrapper = document.createElement('div');
            slot_wrapper.className = 'slot_wrapper';

            const slot_circle = document.createElement('div');
            slot_circle.className = 'slot_circle';
            slot_circle.dataset.slot = slot;

            const slot_label = document.createElement('div');
            slot_label.className = 'slot_label';
            slot_label.textContent = `Slot ${slot}`;

            const slot_name = document.createElement('div');
            slot_name.className = 'slot_immune_cell_name';

            slot_wrapper.appendChild(slot_circle);
            slot_wrapper.appendChild(slot_label);
            slot_wrapper.appendChild(slot_name);

            this.slot_selection_elements.container.appendChild(slot_wrapper);
            this.slot_selection_elements.slots.push(slot_circle);
            this.slot_selection_elements.labels.push(slot_label);
            this.slot_selection_elements.names.push(slot_name);
        }

        this.modal_element.appendChild(this.slot_selection_elements.container);
    }

    setup_event_listeners() {
        this.card_elements.forEach((card, index) => {
            if (card) {
                card.addEventListener('click', () => {
                    this.handle_card_selection(index);
                });
            }
        });

        document.addEventListener('keydown', (event) => {
            this.handle_slot_selection_key(event);
        });
    }

    handle_slot_selection_key(event) {
        if (!this.is_slot_selection_active) {
            return;
        }

        const key = event.key;
        if (['1', '2', '3', '4'].includes(key)) {
            const slot = parseInt(key);
            this.handle_slot_selection(slot);
        }
    }

    show_intensity_reward_modal() {
        if (this.is_modal_active) {
            return;
        }

        this.is_modal_active = true;
        this.is_selection_in_progress = false;
        this.is_slot_selection_active = false;
        
        this.generate_reward_choices();
        this.update_modal_content();
        this.reset_card_scroll_positions();
        
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
                this.intensity_up_text_element.classList.remove('visible');
                this.intensity_up_text_element.style.animationIterationCount = '';
                this.intensity_up_text_element.style.animationDuration = '';
            }
            
            setTimeout(() => {
                this.show_modal();
            }, 200);
        }, INTENSITY_CONFIG.TELEGRAPH_DURATION_MS);
    }

    generate_reward_choices() {
        if (window.game_state && window.game_state.adaptation_system) {
            this.current_choices = window.game_state.adaptation_system.generate_reward_choices();
        } else {
            this.current_choices = [
                { type: REWARD_TYPES.ADAPTATION, content: ADAPTATION_TYPES.NUTRIENT_GLUT },
                { type: REWARD_TYPES.ADAPTATION, content: ADAPTATION_TYPES.NUTRIENT_GLUT },
                { type: REWARD_TYPES.ADAPTATION, content: ADAPTATION_TYPES.NUTRIENT_GLUT }
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

    update_card_content(card_element, reward_choice) {
        if (reward_choice.type === REWARD_TYPES.ADAPTATION) {
            this.update_adaptation_card(card_element, reward_choice.content);
        } else if (reward_choice.type === REWARD_TYPES.IMMUNE_CELL) {
            this.update_immune_cell_card(card_element, reward_choice.content, reward_choice.resource_bonus);
        }
    }

    update_adaptation_card(card_element, adaptation_type) {
        const adaptation_config = ADAPTATION_CONFIGS[adaptation_type];
        if (!adaptation_config) {
            return;
        }

        const is_generic_adaptation = this.is_generic_adaptation(adaptation_type);
        const current_adaptation = window.game_state.adaptation_system.get_adaptation(adaptation_type);
        const current_level = current_adaptation ? current_adaptation.get_level() : -1;
        const target_level = current_level + 1;
        
        const enhanced_description = this.get_enhanced_description(adaptation_config, adaptation_type, current_level, target_level);

        this.update_level_circles(card_element, target_level, is_generic_adaptation);
        this.update_adaptation_name(card_element, adaptation_config.name);
        this.update_description(card_element, enhanced_description);
        this.update_card_classes(card_element, REWARD_TYPES.ADAPTATION, is_generic_adaptation);
    }

    update_immune_cell_card(card_element, immune_cell_type, resource_bonus) {
        const immune_cell_name = IMMUNE_CELL_NAMES[immune_cell_type];
        const immune_cell_description = IMMUNE_CELL_DESCRIPTIONS[immune_cell_type];

        if (!immune_cell_name || !immune_cell_description) {
            return;
        }

        this.update_resource_bonus_display(card_element, resource_bonus);
        this.update_adaptation_name(card_element, immune_cell_name);
        this.update_description(card_element, immune_cell_description);
        this.update_card_classes(card_element, REWARD_TYPES.IMMUNE_CELL, false);
    }

    update_resource_bonus_display(card_element, resource_bonus) {
        const level_circles_container = card_element.querySelector('.level_circles_container');
        
        if (!level_circles_container) {
            return;
        }

        level_circles_container.className = 'resource_bonus_container';
        level_circles_container.innerHTML = '';

        const bonus_text = document.createElement('div');
        bonus_text.className = 'resource_bonus_text';
        bonus_text.textContent = resource_bonus.display_text;

        level_circles_container.appendChild(bonus_text);
    }

    get_enhanced_description(adaptation_config, adaptation_type, current_level, target_level) {
        const base_description = adaptation_config.descriptions[target_level] || adaptation_config.descriptions[0];
        
        if (current_level === -1) {
            return this.add_bold_formatting_to_description(base_description, adaptation_config.key_property, adaptation_config.effects[target_level]);
        }
        
        return this.add_level_up_formatting_to_description(base_description, adaptation_config, current_level, target_level);
    }

    add_bold_formatting_to_description(description, key_property, effect_data) {
        if (!key_property || !effect_data || !effect_data.hasOwnProperty(key_property)) {
            return description;
        }

        const key_value = effect_data[key_property];
        let formatted_value;

        if (this.is_duration_property(key_property)) {
            formatted_value = this.convert_duration_to_display(key_value);
        } else if (this.is_percentage_property(key_property)) {
            if (key_property.includes('multiplier')) {
                formatted_value = `${Math.round((key_value - 1) * 100)}%`;
            } else {
                formatted_value = `${Math.round(key_value * 100)}%`;
            }
        } else {
            formatted_value = key_value.toString();
        }

        return this.replace_value_in_description(description, formatted_value);
    }

    add_level_up_formatting_to_description(description, adaptation_config, current_level, target_level) {
        const current_effect = adaptation_config.effects[current_level];
        const target_effect = adaptation_config.effects[target_level];
        const key_property = adaptation_config.key_property;

        if (!current_effect || !target_effect || !key_property) {
            return this.add_bold_formatting_to_description(description, key_property, target_effect);
        }

        const current_value = current_effect[key_property];
        const target_value = target_effect[key_property];

        let current_formatted, target_formatted;

        if (this.is_duration_property(key_property)) {
            current_formatted = this.convert_duration_to_display(current_value);
            target_formatted = this.convert_duration_to_display(target_value);
        } else if (this.is_percentage_property(key_property)) {
            if (key_property.includes('multiplier')) {
                current_formatted = `${Math.round((current_value - 1) * 100)}%`;
                target_formatted = `${Math.round((target_value - 1) * 100)}%`;
            } else {
                current_formatted = `${Math.round(current_value * 100)}%`;
                target_formatted = `${Math.round(target_value * 100)}%`;
            }
        } else {
            current_formatted = current_value.toString();
            target_formatted = target_value.toString();
        }

        const change_pattern = `<span class="value_change">${current_formatted}<span class="arrow">→</span>${target_formatted}</span>`;
        return this.replace_value_in_description(description, target_formatted, change_pattern);
    }

    is_duration_property(key_property) {
        return key_property.endsWith('_ms') || key_property.endsWith('_duration');
    }

    convert_duration_to_display(duration_ms) {
        const seconds = duration_ms / 1000;
        if (seconds === 1) {
            return '1 second';
        } else if (seconds % 1 === 0) {
            return `${seconds} seconds`;
        } else {
            return `${seconds} seconds`;
        }
    }

    is_percentage_property(key_property) {
        return key_property.includes('percent') || 
               key_property.includes('chance') || 
               key_property.includes('multiplier') ||
               key_property.includes('reduction') ||
               key_property.endsWith('_percent') ||
               key_property.endsWith('_chance');
    }

    replace_value_in_description(description, search_value, replacement_value = null) {
        const replacement = replacement_value || `<span class="bold_value">${search_value}</span>`;
        
        if (description.includes(search_value)) {
            return description.replace(search_value, replacement);
        }
        
        const escaped_search = search_value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped_search}\\b`, 'g');
        
        if (regex.test(description)) {
            return description.replace(regex, replacement);
        }
        
        return description;
    }

    update_level_circles(card_element, target_level, is_generic_adaptation) {
        const level_circles_container = card_element.querySelector('.level_circles_container');
        const level_circles = card_element.querySelectorAll('.level_circle');

        if (is_generic_adaptation) {
            card_element.classList.add('generic');
            return;
        } else {
            card_element.classList.remove('generic');
        }

        const filled_circles = target_level;
        const projected_circle_index = target_level;

        level_circles.forEach((circle, index) => {
            circle.classList.remove('filled', 'projected', 'instantly_filled');
            
            if (index < filled_circles) {
                circle.classList.add('filled');
            } else if (index === projected_circle_index) {
                circle.classList.add('projected');
            }
        });
    }

    update_adaptation_name(card_element, name) {
        const name_element = card_element.querySelector('.adaptation_name');
        if (name_element) {
            name_element.textContent = name;
            this.adjust_name_font_size(name_element, name);
        }
    }

    adjust_name_font_size(name_element, name) {
        const base_font_size = REWARD_CARD_CONFIG.NAME_FONT_SIZE_BASE;
        const min_font_size = REWARD_CARD_CONFIG.NAME_FONT_SIZE_MIN;
        const max_length_for_base_size = 15;
        const max_length_for_min_size = 25;

        if (name.length <= max_length_for_base_size) {
            name_element.style.fontSize = `${base_font_size}em`;
        } else if (name.length <= max_length_for_min_size) {
            const ratio = (name.length - max_length_for_base_size) / (max_length_for_min_size - max_length_for_base_size);
            const font_size = base_font_size - (ratio * (base_font_size - min_font_size));
            name_element.style.fontSize = `${font_size}em`;
        } else {
            name_element.style.fontSize = `${min_font_size}em`;
        }
    }

    update_description(card_element, description) {
        const description_element = card_element.querySelector('.adaptation_description');
        if (description_element) {
            description_element.innerHTML = description;
        }
    }

    update_card_classes(card_element, reward_type, is_generic_adaptation) {
        card_element.classList.remove('adaptation_card', 'immune_cell_card', 'generic');
        
        if (reward_type === REWARD_TYPES.ADAPTATION) {
            card_element.classList.add('adaptation_card');
            if (is_generic_adaptation) {
                card_element.classList.add('generic');
            }
        } else if (reward_type === REWARD_TYPES.IMMUNE_CELL) {
            card_element.classList.add('immune_cell_card');
        }
    }

    is_generic_adaptation(adaptation_type) {
        return GENERIC_ADAPTATIONS.includes(adaptation_type);
    }

    reset_card_scroll_positions() {
        this.card_elements.forEach(card => {
            if (card) {
                const description_element = card.querySelector('.adaptation_description');
                if (description_element) {
                    description_element.scrollTop = 0;
                }
            }
        });
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
        const selected_reward = this.current_choices[card_index];
        const selected_card = this.card_elements[card_index];

        if (window.game_state && window.game_state.audio_system) {
            window.game_state.audio_system.play_sound('PICK_REWARD');
        }

        this.create_outline_projection(selected_card, selected_reward.type);
        this.animate_selected_card_content(selected_card, selected_reward);
        this.fade_out_other_cards(card_index);
        this.animate_selected_card(selected_card);

        if (selected_reward.type === REWARD_TYPES.ADAPTATION) {
            setTimeout(() => {
                this.apply_selected_adaptation(selected_reward.content);
                this.hide_modal();
            }, 1000);
        } else if (selected_reward.type === REWARD_TYPES.IMMUNE_CELL) {
            this.selected_immune_cell_reward = selected_reward;
            setTimeout(() => {
                this.transition_to_slot_selection();
            }, 1000);
        }
    }

    animate_selected_card_content(card_element, reward_choice) {
        if (reward_choice.type === REWARD_TYPES.ADAPTATION) {
            this.instantly_fill_projected_circle(card_element);
        } else if (reward_choice.type === REWARD_TYPES.IMMUNE_CELL) {
            this.invert_resource_bonus_display(card_element);
        }
    }

    instantly_fill_projected_circle(card_element) {
        const projected_circle = card_element.querySelector('.level_circle.projected');
        if (projected_circle) {
            projected_circle.classList.remove('projected');
            projected_circle.classList.add('instantly_filled');
        }
    }

    invert_resource_bonus_display(card_element) {
        const resource_bonus_container = card_element.querySelector('.resource_bonus_container');
        if (resource_bonus_container) {
            resource_bonus_container.classList.add('inverted');
        }
    }

    create_outline_projection(card_element, reward_type) {
        const cards_container = document.getElementById('reward_cards_container');
        if (!cards_container) {
            return;
        }

        const outline = document.createElement('div');
        outline.classList.add('card_outline_projection');
        
        if (reward_type === REWARD_TYPES.IMMUNE_CELL) {
            outline.classList.add('immune_cell_outline');
        }
        
        const card_rect = card_element.getBoundingClientRect();
        const container_rect = cards_container.getBoundingClientRect();
        
        const relative_left = card_rect.left - container_rect.left;
        const relative_top = card_rect.top - container_rect.top;
        
        outline.style.position = 'absolute';
        outline.style.left = `${relative_left}px`;
        outline.style.top = `${relative_top}px`;
        outline.style.width = `${card_rect.width}px`;
        outline.style.height = `${card_rect.height}px`;
        
        cards_container.appendChild(outline);

        setTimeout(() => {
            if (outline.parentNode) {
                outline.parentNode.removeChild(outline);
            }
        }, REWARD_CARD_CONFIG.OUTLINE_PROJECTION_GROWTH_DURATION_MS + REWARD_CARD_CONFIG.OUTLINE_PROJECTION_FADE_DURATION_MS);
    }

    create_slot_outline_projection(slot) {
        if (!this.slot_selection_elements || !this.slot_selection_elements.container) {
            return;
        }

        const slot_element = this.slot_selection_elements.slots[slot - 1];
        if (!slot_element) {
            return;
        }

        const outline = document.createElement('div');
        outline.classList.add('slot_outline_projection');
        
        const slot_rect = slot_element.getBoundingClientRect();
        const container_rect = this.slot_selection_elements.container.getBoundingClientRect();
        
        const relative_left = slot_rect.left - container_rect.left;
        const relative_top = slot_rect.top - container_rect.top;
        
        outline.style.position = 'absolute';
        outline.style.left = `${relative_left}px`;
        outline.style.top = `${relative_top}px`;
        outline.style.width = `${slot_rect.width}px`;
        outline.style.height = `${slot_rect.height}px`;
        
        this.slot_selection_elements.container.appendChild(outline);

        setTimeout(() => {
            if (outline.parentNode) {
                outline.parentNode.removeChild(outline);
            }
        }, REWARD_CARD_CONFIG.OUTLINE_PROJECTION_GROWTH_DURATION_MS + REWARD_CARD_CONFIG.OUTLINE_PROJECTION_FADE_DURATION_MS);
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

    transition_to_slot_selection() {
        this.hide_card_selection();
        setTimeout(() => {
            this.show_slot_selection();
        }, 200);
    }

    hide_card_selection() {
        const cards_container = document.getElementById('reward_cards_container');
        if (cards_container) {
            cards_container.style.display = 'none';
        }
    }

    show_slot_selection() {
        this.is_slot_selection_active = true;
        this.update_slot_selection_content();
        
        if (this.slot_selection_elements && this.slot_selection_elements.container) {
            this.slot_selection_elements.container.style.display = 'flex';
            
            setTimeout(() => {
                this.slot_selection_elements.slots.forEach(slot => {
                    slot.classList.add('visible');
                });
            }, 100);
        }
    }

    update_slot_selection_content() {
        if (!this.slot_selection_elements || !window.game_state || !window.game_state.selection_system) {
            return;
        }

        const slots_info = window.game_state.selection_system.get_equipped_slots_info();

        for (let slot = 1; slot <= 4; slot++) {
            const slot_element = this.slot_selection_elements.slots[slot - 1];
            const name_element = this.slot_selection_elements.names[slot - 1];
            const slot_info = slots_info[slot];

            if (slot_info.is_occupied) {
                slot_element.classList.add('occupied');
                slot_element.classList.remove('empty');
                name_element.textContent = slot_info.name;
            } else {
                slot_element.classList.add('empty');
                slot_element.classList.remove('occupied');
                name_element.textContent = '';
            }
        }
    }

    handle_slot_selection(slot) {
        if (!this.is_slot_selection_active || !this.selected_immune_cell_reward) {
            return;
        }

        this.is_slot_selection_active = false;
        
        if (window.game_state && window.game_state.audio_system) {
            window.game_state.audio_system.play_sound('EQUIP');
        }
        
        this.create_slot_outline_projection(slot);
        this.animate_slot_selection(slot);
        this.fade_out_other_slots(slot);

        setTimeout(() => {
            this.apply_immune_cell_reward(slot);
            this.hide_modal();
        }, 1000);
    }

    animate_slot_selection(selected_slot) {
        const slot_element = this.slot_selection_elements.slots[selected_slot - 1];
        const name_element = this.slot_selection_elements.names[selected_slot - 1];
        
        if (slot_element) {
            slot_element.classList.add('selected');
            slot_element.classList.add('occupied');
            slot_element.classList.remove('empty');
        }

        if (name_element && this.selected_immune_cell_reward) {
            const immune_cell_name = IMMUNE_CELL_NAMES[this.selected_immune_cell_reward.content];
            name_element.textContent = immune_cell_name;
        }
    }

    fade_out_other_slots(selected_slot) {
        this.slot_selection_elements.slots.forEach((slot, index) => {
            if (index !== selected_slot - 1) {
                slot.classList.add('faded');
            }
        });
    }

    apply_immune_cell_reward(slot) {
        if (!this.selected_immune_cell_reward || !window.game_state) {
            return;
        }

        if (window.game_state.selection_system) {
            window.game_state.selection_system.set_equipped_immune_cell(
                slot, 
                this.selected_immune_cell_reward.content
            );
        }

        if (window.game_state.adaptation_system && this.selected_immune_cell_reward.resource_bonus) {
            window.game_state.adaptation_system.apply_resource_bonus(
                this.selected_immune_cell_reward.resource_bonus
            );
        }
    }

    hide_modal() {
        if (this.modal_element) {
            this.modal_element.classList.remove('active');
        }

        if (this.intensity_up_text_element) {
            this.intensity_up_text_element.classList.remove('visible');
        }

        this.reset_card_states();
        this.reset_slot_selection_states();

        this.is_modal_active = false;
        this.is_selection_in_progress = false;
        this.is_slot_selection_active = false;
        this.current_choices = [];
        this.selected_immune_cell_reward = null;

        if (window.game_state) {
            window.game_state.is_game_paused = false;
        }

        if (window.game_state && window.game_state.ui_system) {
            window.game_state.ui_system.show_all_gameplay_ui();
        }
    }

    reset_card_states() {
        this.card_elements.forEach(card => {
            if (card) {
                card.classList.remove('visible', 'selected', 'faded', 'generic', 'adaptation_card', 'immune_cell_card');
                const name_element = card.querySelector('.adaptation_name');
                if (name_element) {
                    name_element.style.fontSize = '';
                }
                
                const circles = card.querySelectorAll('.level_circle');
                circles.forEach(circle => {
                    circle.classList.remove('filled', 'projected', 'instantly_filled');
                });

                const resource_bonus_container = card.querySelector('.resource_bonus_container');
                if (resource_bonus_container) {
                    resource_bonus_container.classList.remove('inverted');
                    resource_bonus_container.className = 'level_circles_container';
                    resource_bonus_container.innerHTML = `
                        <div class="level_circles">
                            <div class="level_circle"></div>
                            <div class="level_circle"></div>
                            <div class="level_circle"></div>
                        </div>
                    `;
                }
            }
        });

        const cards_container = document.getElementById('reward_cards_container');
        if (cards_container) {
            cards_container.style.display = '';
        }
    }

    reset_slot_selection_states() {
        if (this.slot_selection_elements && this.slot_selection_elements.container) {
            this.slot_selection_elements.container.style.display = 'none';
            
            this.slot_selection_elements.slots.forEach(slot => {
                slot.classList.remove('visible', 'selected', 'faded', 'occupied', 'empty');
            });

            this.slot_selection_elements.names.forEach(name => {
                name.textContent = '';
            });
        }
    }

    is_reward_modal_active() {
        return this.is_modal_active;
    }

    reset() {
        this.is_modal_active = false;
        this.current_choices = [];
        this.is_selection_in_progress = false;
        this.projected_level_circles = [];
        this.is_slot_selection_active = false;
        this.selected_immune_cell_reward = null;
        
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

        this.reset_card_states();
        this.reset_slot_selection_states();
        this.reset_card_scroll_positions();
        this.initialize_diagonal_stripes();
    }
}

window.IntensityRewardSystem = IntensityRewardSystem;