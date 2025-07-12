const ADAPTATION_CONFIGS = {
    CYTOTOXIC_SURGE: {
        name: 'Cytotoxic Surge',
        effects: {
            0: { damage_multiplier: 1.12 },
            1: { damage_multiplier: 1.18 },
            2: { damage_multiplier: 1.24 }
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
        effects: {
            0: { energy_refund_percent: 0.08 },
            1: { energy_refund_percent: 0.12 },
            2: { energy_refund_percent: 0.16 }
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
        effects: {
            0: { energy_cost_reduction: 0.16 },
            1: { energy_cost_reduction: 0.24 },
            2: { energy_cost_reduction: 0.32 }
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
        effects: {
            0: { energy_regen_multiplier: 1.06 },
            1: { energy_regen_multiplier: 1.09 },
            2: { energy_regen_multiplier: 1.12 }
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
        effects: {
            0: { cytokine_double_chance: 0.10 },
            1: { cytokine_double_chance: 0.15 },
            2: { cytokine_double_chance: 0.20 }
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
        effects: {
            0: { adjuvant_double_chance: 0.10 },
            1: { adjuvant_double_chance: 0.15 },
            2: { adjuvant_double_chance: 0.20 }
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
        effects: {
            0: { status_effect_duration_multiplier: 1.16 },
            1: { status_effect_duration_multiplier: 1.24 },
            2: { status_effect_duration_multiplier: 1.32 }
        },
        get descriptions() {
            return {
                0: `Increase status effect durations by ${Math.round((this.effects[0].status_effect_duration_multiplier - 1) * 100)}%.`,
                1: `Increase status effect durations by ${Math.round((this.effects[1].status_effect_duration_multiplier - 1) * 100)}%.`,
                2: `Increase status effect durations by ${Math.round((this.effects[2].status_effect_duration_multiplier - 1) * 100)}%.`
            };
        }
    },
    CATABOLIC_CONVERSION: {
        name: 'Catabolic Conversion',
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
        effects: {
            0: { range_multiplier: 1.12 },
            1: { range_multiplier: 1.18 },
            2: { range_multiplier: 1.24 }
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
        effects: {
            0: { hp_per_ten_kills: 1 },
            1: { hp_per_ten_kills: 2 },
            2: { hp_per_ten_kills: 3 }
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
        effects: {
            0: { biomass_double_chance: 0.10 },
            1: { biomass_double_chance: 0.15 },
            2: { biomass_double_chance: 0.20 }
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
        effects: {
            0: { damage_per_core_hp_percent: 0.02 },
            1: { damage_per_core_hp_percent: 0.03 },
            2: { damage_per_core_hp_percent: 0.04 }
        },
        get descriptions() {
            return {
                0: `For each Cell Core HP you have, gain ${Math.round(this.effects[0].damage_per_core_hp_percent * 100)}% increased Immune Cell DMG.`,
                1: `For each Cell Core HP you have, gain ${Math.round(this.effects[1].damage_per_core_hp_percent * 100)}% increased Immune Cell DMG.`,
                2: `For each Cell Core HP you have, gain ${Math.round(this.effects[2].damage_per_core_hp_percent * 100)}% increased Immune Cell DMG.`
            };
        }
    },
    NUTRIENT_GLUT: {
        name: 'Nutrient Glut',
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
        effects: {
            0: { cytokine_gain: 100 },
            1: { cytokine_gain: 100 },
            2: { cytokine_gain: 100 }
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
        effects: {
            0: { adjuvant_gain: 100 },
            1: { adjuvant_gain: 100 },
            2: { adjuvant_gain: 100 }
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
    ADAPTATION_TYPES.HOMEOSTATIC_POTENTIATION
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