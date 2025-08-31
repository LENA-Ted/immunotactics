const ADAPTATION_CONFIGS = {
    CYTOTOXIC_SURGE: {
        name: 'Cytotoxic Surge',
        key_property: 'damage_multiplier',
        effects: {
            0: { damage_multiplier: 1.24 },
            1: { damage_multiplier: 1.36 },
            2: { damage_multiplier: 1.48 }
        },
        get descriptions() {
            return {
                0: `Increase all Immune Cell DMG by ${Math.round((this.effects[0].damage_multiplier - 1) * 100)}%.`,
                1: `Increase all Immune Cell DMG by ${Math.round((this.effects[1].damage_multiplier - 1) * 100)}%.`,
                2: `Increase all Immune Cell DMG by ${Math.round((this.effects[2].damage_multiplier - 1) * 100)}%.`
            };
        }
    },
    REGENERATIVE_CYCLE: {
        name: 'Regenerative Cycle',
        key_property: 'core_heal_per_intensity',
        effects: {
            0: { core_heal_per_intensity: 1 },
            1: { core_heal_per_intensity: 2 },
            2: { core_heal_per_intensity: 3 }
        },
        get descriptions() {
            return {
                0: `Recover ${this.effects[0].core_heal_per_intensity} Cell Core Health (HP) every Intensity level-up.`,
                1: `Recover ${this.effects[1].core_heal_per_intensity} Cell Core Health (HP) every Intensity level-up.`,
                2: `Recover ${this.effects[2].core_heal_per_intensity} Cell Core Health (HP) every Intensity level-up.`
            };
        }
    },
    HYPERPLASIA: {
        name: 'Hyperplasia',
        key_property: 'max_hp_increase',
        effects: {
            0: { max_hp_increase: 1 },
            1: { max_hp_increase: 2 },
            2: { max_hp_increase: 3 }
        },
        get descriptions() {
            return {
                0: `Increase Max Cell Core HP by ${this.effects[0].max_hp_increase}.`,
                1: `Increase Max Cell Core HP by ${this.effects[1].max_hp_increase}.`,
                2: `Increase Max Cell Core HP by ${this.effects[2].max_hp_increase}.`
            };
        }
    },
    NECROTIC_RECYCLING: {
        name: 'Necrotic Recycling',
        key_property: 'energy_refund_percent',
        effects: {
            0: { energy_refund_percent: 0.16 },
            1: { energy_refund_percent: 0.24 },
            2: { energy_refund_percent: 0.32 }
        },
        get descriptions() {
            return {
                0: `When Immune Cells are destroyed, they refund ${Math.round(this.effects[0].energy_refund_percent * 100)}% of their ATP cost.`,
                1: `When Immune Cells are destroyed, they refund ${Math.round(this.effects[1].energy_refund_percent * 100)}% of their ATP cost.`,
                2: `When Immune Cells are destroyed, they refund ${Math.round(this.effects[2].energy_refund_percent * 100)}% of their ATP cost.`
            };
        }
    },
    ADRENAL_RESPONSE: {
        name: 'Adrenal Response',
        key_property: 'energy_cost_reduction',
        effects: {
            0: { energy_cost_reduction: 0.20 },
            1: { energy_cost_reduction: 0.30 },
            2: { energy_cost_reduction: 0.40 }
        },
        get descriptions() {
            return {
                0: `When at 2 Cell Core HP or below, all Energy (ATP) costs are reduced by ${Math.round(this.effects[0].energy_cost_reduction * 100)}%.`,
                1: `When at 2 Cell Core HP or below, all Energy (ATP) costs are reduced by ${Math.round(this.effects[1].energy_cost_reduction * 100)}%.`,
                2: `When at 2 Cell Core HP or below, all Energy (ATP) costs are reduced by ${Math.round(this.effects[2].energy_cost_reduction * 100)}%.`
            };
        }
    },
    MITOCHONDRIAL_BOOST: {
        name: 'Mitochondrial Boost',
        key_property: 'energy_regen_multiplier',
        effects: {
            0: { energy_regen_multiplier: 1.12 },
            1: { energy_regen_multiplier: 1.18 },
            2: { energy_regen_multiplier: 1.24 }
        },
        get descriptions() {
            return {
                0: `Increase Energy (ATP) Regen Rate by ${Math.round((this.effects[0].energy_regen_multiplier - 1) * 100)}%.`,
                1: `Increase Energy (ATP) Regen Rate by ${Math.round((this.effects[1].energy_regen_multiplier - 1) * 100)}%.`,
                2: `Increase Energy (ATP) Regen Rate by ${Math.round((this.effects[2].energy_regen_multiplier - 1) * 100)}%.`
            };
        }
    },
    CYTOKINE_INFUSION: {
        name: 'Cytokine Infusion',
        key_property: 'cytokine_double_chance',
        effects: {
            0: { cytokine_double_chance: 0.12 },
            1: { cytokine_double_chance: 0.18 },
            2: { cytokine_double_chance: 0.24 }
        },
        get descriptions() {
            return {
                0: `Gain a ${Math.round(this.effects[0].cytokine_double_chance * 100)}% chance to gain double Cytokine upon pickup.`,
                1: `Gain a ${Math.round(this.effects[1].cytokine_double_chance * 100)}% chance to gain double Cytokine upon pickup.`,
                2: `Gain a ${Math.round(this.effects[2].cytokine_double_chance * 100)}% chance to gain double Cytokine upon pickup.`
            };
        }
    },
    ADJUVANT_BOLUS: {
        name: 'Adjuvant Bolus',
        key_property: 'adjuvant_double_chance',
        effects: {
            0: { adjuvant_double_chance: 0.12 },
            1: { adjuvant_double_chance: 0.18 },
            2: { adjuvant_double_chance: 0.24 }
        },
        get descriptions() {
            return {
                0: `Gain a ${Math.round(this.effects[0].adjuvant_double_chance * 100)}% chance to gain double Adjuvant upon pickup.`,
                1: `Gain a ${Math.round(this.effects[1].adjuvant_double_chance * 100)}% chance to gain double Adjuvant upon pickup.`,
                2: `Gain a ${Math.round(this.effects[2].adjuvant_double_chance * 100)}% chance to gain double Adjuvant upon pickup.`
            };
        }
    },
    SPONTANEOUS_GENERATION: {
        name: 'Spontaneous Generation',
        key_property: 'free_placement_chance',
        effects: {
            0: { free_placement_chance: 0.10 },
            1: { free_placement_chance: 0.15 },
            2: { free_placement_chance: 0.20 }
        },
        get descriptions() {
            return {
                0: `Gain a ${Math.round(this.effects[0].free_placement_chance * 100)}% chance to place an Immune Cell for no cost.`,
                1: `Gain a ${Math.round(this.effects[1].free_placement_chance * 100)}% chance to place an Immune Cell for no cost.`,
                2: `Gain a ${Math.round(this.effects[2].free_placement_chance * 100)}% chance to place an Immune Cell for no cost.`
            };
        }
    },
    CHRONIC_INFLAMMATION: {
        name: 'Chronic Inflammation',
        key_property: 'status_effect_duration_multiplier',
        effects: {
            0: { status_effect_duration_multiplier: 1.20 },
            1: { status_effect_duration_multiplier: 1.30 },
            2: { status_effect_duration_multiplier: 1.40 }
        },
        get descriptions() {
            return {
                0: `Increase Immune Cell-applied status effect durations by ${Math.round((this.effects[0].status_effect_duration_multiplier - 1) * 100)}%.`,
                1: `Increase Immune Cell-applied status effect durations by ${Math.round((this.effects[1].status_effect_duration_multiplier - 1) * 100)}%.`,
                2: `Increase Immune Cell-applied status effect durations by ${Math.round((this.effects[2].status_effect_duration_multiplier - 1) * 100)}%.`
            };
        }
    },
    CATABOLIC_CONVERSION: {
        name: 'Catabolic Conversion',
        key_property: 'energy_per_kill',
        effects: {
            0: { energy_per_kill: 2 },
            1: { energy_per_kill: 3 },
            2: { energy_per_kill: 4 }
        },
        get descriptions() {
            return {
                0: `Gain ${this.effects[0].energy_per_kill} ATP per kill.`,
                1: `Gain ${this.effects[1].energy_per_kill} ATP per kill.`,
                2: `Gain ${this.effects[2].energy_per_kill} ATP per kill.`
            };
        }
    },
    EXTENDED_CHEMOTAXIS: {
        name: 'Extended Chemotaxis',
        key_property: 'range_multiplier',
        effects: {
            0: { range_multiplier: 1.20 },
            1: { range_multiplier: 1.30 },
            2: { range_multiplier: 1.40 }
        },
        get descriptions() {
            return {
                0: `Increase Immune Cell action range by ${Math.round((this.effects[0].range_multiplier - 1) * 100)}%.`,
                1: `Increase Immune Cell action range by ${Math.round((this.effects[1].range_multiplier - 1) * 100)}%.`,
                2: `Increase Immune Cell action range by ${Math.round((this.effects[2].range_multiplier - 1) * 100)}%.`
            };
        }
    },
    NECROTROPHIC_REPAIR: {
        name: 'Necrotrophic Repair',
        key_property: 'hp_per_ten_kills',
        effects: {
            0: { hp_per_ten_kills: 2 },
            1: { hp_per_ten_kills: 3 },
            2: { hp_per_ten_kills: 4 }
        },
        get descriptions() {
            return {
                0: `Recover ${this.effects[0].hp_per_ten_kills} HP for all Immune Cells for every 10 Pathogens killed.`,
                1: `Recover ${this.effects[1].hp_per_ten_kills} HP for all Immune Cells for every 10 Pathogens killed.`,
                2: `Recover ${this.effects[2].hp_per_ten_kills} HP for all Immune Cells for every 10 Pathogens killed.`
            };
        }
    },
    BIOMASS_INJECTION: {
        name: 'Biomass Injection',
        key_property: 'biomass_double_chance',
        effects: {
            0: { biomass_double_chance: 0.12 },
            1: { biomass_double_chance: 0.18 },
            2: { biomass_double_chance: 0.24 }
        },
        get descriptions() {
            return {
                0: `Gain a ${Math.round(this.effects[0].biomass_double_chance * 100)}% chance to gain double Biomass upon pickup.`,
                1: `Gain a ${Math.round(this.effects[1].biomass_double_chance * 100)}% chance to gain double Biomass upon pickup.`,
                2: `Gain a ${Math.round(this.effects[2].biomass_double_chance * 100)}% chance to gain double Biomass upon pickup.`
            };
        }
    },
    HOMEOSTATIC_POTENTIATION: {
        name: 'Homeostatic Potentiation',
        key_property: 'damage_per_core_hp_percent',
        effects: {
            0: { damage_per_core_hp_percent: 0.06 },
            1: { damage_per_core_hp_percent: 0.09 },
            2: { damage_per_core_hp_percent: 0.12 }
        },
        get descriptions() {
            return {
                0: `For each Cell Core HP you have, gain ${Math.round(this.effects[0].damage_per_core_hp_percent * 100)}% increased Immune Cell DMG.`,
                1: `For each Cell Core HP you have, gain ${Math.round(this.effects[1].damage_per_core_hp_percent * 100)}% increased Immune Cell DMG.`,
                2: `For each Cell Core HP you have, gain ${Math.round(this.effects[2].damage_per_core_hp_percent * 100)}% increased Immune Cell DMG.`
            };
        }
    },
    PARACRINE_REGENERATION: {
        name: 'Paracrine Regeneration',
        key_property: 'immune_explosion_heal',
        effects: {
            0: { immune_explosion_heal: 2 },
            1: { immune_explosion_heal: 3 },
            2: { immune_explosion_heal: 4 }
        },
        get descriptions() {
            return {
                0: `Immune Cell explosions recover ${this.effects[0].immune_explosion_heal} HP to all affected Immune Cells.`,
                1: `Immune Cell explosions recover ${this.effects[1].immune_explosion_heal} HP to all affected Immune Cells.`,
                2: `Immune Cell explosions recover ${this.effects[2].immune_explosion_heal} HP to all affected Immune Cells.`
            };
        }
    },
    STERIC_EVASION: {
        name: 'Steric Evasion',
        key_property: 'collision_resistance_chance',
        effects: {
            0: { collision_resistance_chance: 0.16 },
            1: { collision_resistance_chance: 0.24 },
            2: { collision_resistance_chance: 0.32 }
        },
        get descriptions() {
            return {
                0: `Immune Cells gain a ${Math.round(this.effects[0].collision_resistance_chance * 100)}% chance to resist collisions with Microbes.`,
                1: `Immune Cells gain a ${Math.round(this.effects[1].collision_resistance_chance * 100)}% chance to resist collisions with Microbes.`,
                2: `Immune Cells gain a ${Math.round(this.effects[2].collision_resistance_chance * 100)}% chance to resist collisions with Microbes.`
            };
        }
    },
    CATALYTIC_EFFICIENCY: {
        name: 'Catalytic Efficiency',
        key_property: 'hp_preservation_chance',
        effects: {
            0: { hp_preservation_chance: 0.14 },
            1: { hp_preservation_chance: 0.21 },
            2: { hp_preservation_chance: 0.28 }
        },
        get descriptions() {
            return {
                0: `Immune Cells gain a ${Math.round(this.effects[0].hp_preservation_chance * 100)}% chance not to expend HP upon action.`,
                1: `Immune Cells gain a ${Math.round(this.effects[1].hp_preservation_chance * 100)}% chance not to expend HP upon action.`,
                2: `Immune Cells gain a ${Math.round(this.effects[2].hp_preservation_chance * 100)}% chance not to expend HP upon action.`
            };
        }
    },
    BIDIRECTIONAL_SECRETION: {
        name: 'Bidirectional Secretion',
        key_property: 'opposite_shot_chance',
        effects: {
            0: { opposite_shot_chance: 0.20 },
            1: { opposite_shot_chance: 0.30 },
            2: { opposite_shot_chance: 0.40 }
        },
        get descriptions() {
            return {
                0: `Directional Immune Cells have a ${Math.round(this.effects[0].opposite_shot_chance * 100)}% chance to shoot again at the opposite direction.`,
                1: `Directional Immune Cells have a ${Math.round(this.effects[1].opposite_shot_chance * 100)}% chance to shoot again at the opposite direction.`,
                2: `Directional Immune Cells have a ${Math.round(this.effects[2].opposite_shot_chance * 100)}% chance to shoot again at the opposite direction.`
            };
        }
    },
    REFRACTORY_PERIOD: {
        name: 'Refractory Period',
        key_property: 'invincibility_duration_ms',
        effects: {
            0: { invincibility_duration_ms: 500 },
            1: { invincibility_duration_ms: 750 },
            2: { invincibility_duration_ms: 1000 }
        },
        get descriptions() {
            return {
                0: `After taking damage, the Cell Core becomes invincible for ${this.effects[0].invincibility_duration_ms / 1000} seconds.`,
                1: `After taking damage, the Cell Core becomes invincible for ${this.effects[1].invincibility_duration_ms / 1000} seconds.`,
                2: `After taking damage, the Cell Core becomes invincible for ${this.effects[2].invincibility_duration_ms / 1000} seconds.`
            };
        }
    },
    NUTRIENT_GLUT: {
        name: 'Nutrient Glut',
        key_property: 'biomass_gain',
        effects: {
            0: { biomass_gain: 200 },
            1: { biomass_gain: 200 },
            2: { biomass_gain: 200 }
        },
        get descriptions() {
            return {
                0: `Gain ${this.effects[0].biomass_gain} Biomass.`,
                1: `Gain ${this.effects[1].biomass_gain} Biomass.`,
                2: `Gain ${this.effects[2].biomass_gain} Biomass.`
            };
        }
    },
    CYTOKINE_CACHE: {
        name: 'Cytokine Cache',
        key_property: 'cytokine_gain',
        effects: {
            0: { cytokine_gain: 200 },
            1: { cytokine_gain: 200 },
            2: { cytokine_gain: 200 }
        },
        get descriptions() {
            return {
                0: `Gain ${this.effects[0].cytokine_gain} Cytokines.`,
                1: `Gain ${this.effects[1].cytokine_gain} Cytokines.`,
                2: `Gain ${this.effects[2].cytokine_gain} Cytokines.`
            };
        }
    },
    ADJUVANT_HOARD: {
        name: 'Adjuvant Hoard',
        key_property: 'adjuvant_gain',
        effects: {
            0: { adjuvant_gain: 200 },
            1: { adjuvant_gain: 200 },
            2: { adjuvant_gain: 200 }
        },
        get descriptions() {
            return {
                0: `Gain ${this.effects[0].adjuvant_gain} Adjuvants.`,
                1: `Gain ${this.effects[1].adjuvant_gain} Adjuvants.`,
                2: `Gain ${this.effects[2].adjuvant_gain} Adjuvants.`
            };
        }
    }
};

const ADAPTATION_TYPES = {
    CYTOTOXIC_SURGE: 'CYTOTOXIC_SURGE',
    REGENERATIVE_CYCLE: 'REGENERATIVE_CYCLE',
    HYPERPLASIA: 'HYPERPLASIA',
    NECROTIC_RECYCLING: 'NECROTIC_RECYCLING',
    ADRENAL_RESPONSE: 'ADRENAL_RESPONSE',
    MITOCHONDRIAL_BOOST: 'MITOCHONDRIAL_BOOST',
    CYTOKINE_INFUSION: 'CYTOKINE_INFUSION',
    ADJUVANT_BOLUS: 'ADJUVANT_BOLUS',
    SPONTANEOUS_GENERATION: 'SPONTANEOUS_GENERATION',
    CHRONIC_INFLAMMATION: 'CHRONIC_INFLAMMATION',
    CATABOLIC_CONVERSION: 'CATABOLIC_CONVERSION',
    EXTENDED_CHEMOTAXIS: 'EXTENDED_CHEMOTAXIS',
    NECROTROPHIC_REPAIR: 'NECROTROPHIC_REPAIR',
    BIOMASS_INJECTION: 'BIOMASS_INJECTION',
    HOMEOSTATIC_POTENTIATION: 'HOMEOSTATIC_POTENTIATION',
    PARACRINE_REGENERATION: 'PARACRINE_REGENERATION',
    STERIC_EVASION: 'STERIC_EVASION',
    CATALYTIC_EFFICIENCY: 'CATALYTIC_EFFICIENCY',
    BIDIRECTIONAL_SECRETION: 'BIDIRECTIONAL_SECRETION',
    REFRACTORY_PERIOD: 'REFRACTORY_PERIOD',
    NUTRIENT_GLUT: 'NUTRIENT_GLUT',
    CYTOKINE_CACHE: 'CYTOKINE_CACHE',
    ADJUVANT_HOARD: 'ADJUVANT_HOARD'
};

const ADAPTATION_POOL = [
    ADAPTATION_TYPES.CYTOTOXIC_SURGE,
    ADAPTATION_TYPES.REGENERATIVE_CYCLE,
    ADAPTATION_TYPES.HYPERPLASIA,
    ADAPTATION_TYPES.NECROTIC_RECYCLING,
    ADAPTATION_TYPES.ADRENAL_RESPONSE,
    ADAPTATION_TYPES.MITOCHONDRIAL_BOOST,
    ADAPTATION_TYPES.CYTOKINE_INFUSION,
    ADAPTATION_TYPES.ADJUVANT_BOLUS,
    ADAPTATION_TYPES.SPONTANEOUS_GENERATION,
    ADAPTATION_TYPES.CHRONIC_INFLAMMATION,
    ADAPTATION_TYPES.CATABOLIC_CONVERSION,
    ADAPTATION_TYPES.EXTENDED_CHEMOTAXIS,
    ADAPTATION_TYPES.NECROTROPHIC_REPAIR,
    ADAPTATION_TYPES.BIOMASS_INJECTION,
    ADAPTATION_TYPES.HOMEOSTATIC_POTENTIATION,
    ADAPTATION_TYPES.PARACRINE_REGENERATION,
    ADAPTATION_TYPES.STERIC_EVASION,
    ADAPTATION_TYPES.CATALYTIC_EFFICIENCY,
    ADAPTATION_TYPES.BIDIRECTIONAL_SECRETION,
    ADAPTATION_TYPES.REFRACTORY_PERIOD
];

const GENERIC_ADAPTATIONS = [
    ADAPTATION_TYPES.NUTRIENT_GLUT,
    ADAPTATION_TYPES.CYTOKINE_CACHE,
    ADAPTATION_TYPES.ADJUVANT_HOARD
];

const ADAPTATION_CONFIG = {
    MAX_LEVEL: 2,
    REWARD_CHOICES_COUNT: 3
};

window.ADAPTATION_CONFIGS = ADAPTATION_CONFIGS;
window.ADAPTATION_TYPES = ADAPTATION_TYPES;
window.ADAPTATION_POOL = ADAPTATION_POOL;
window.GENERIC_ADAPTATIONS = GENERIC_ADAPTATIONS;
window.ADAPTATION_CONFIG = ADAPTATION_CONFIG;