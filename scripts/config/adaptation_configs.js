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
            0: { cytokine_multiplier: 1.06 },
            1: { cytokine_multiplier: 1.09 },
            2: { cytokine_multiplier: 1.12 }
        },
        get descriptions() {
            return {
                0: `Increase Cytokine Gain Rate by ${Math.round((this.effects[0].cytokine_multiplier - 1) * 100)}%.`,
                1: `Increase Cytokine Gain Rate by ${Math.round((this.effects[1].cytokine_multiplier - 1) * 100)}%.`,
                2: `Increase Cytokine Gain Rate by ${Math.round((this.effects[2].cytokine_multiplier - 1) * 100)}%.`
            };
        }
    },
    ADJUVANT_BOLUS: {
        name: 'Adjuvant Bolus',
        effects: {
            0: { adjuvant_multiplier: 1.10 },
            1: { adjuvant_multiplier: 1.15 },
            2: { adjuvant_multiplier: 1.20 }
        },
        get descriptions() {
            return {
                0: `Increase Adjuvant Gain Rate by ${Math.round((this.effects[0].adjuvant_multiplier - 1) * 100)}%.`,
                1: `Increase Adjuvant Gain Rate by ${Math.round((this.effects[1].adjuvant_multiplier - 1) * 100)}%.`,
                2: `Increase Adjuvant Gain Rate by ${Math.round((this.effects[2].adjuvant_multiplier - 1) * 100)}%.`
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
    NUTRIENT_GLUT: 'NUTRIENT_GLUT'
};

const ADAPTATION_POOL = [
    ADAPTATION_TYPES.CYTOTOXIC_SURGE,
    ADAPTATION_TYPES.REGENERATIVE_CYCLE,
    ADAPTATION_TYPES.HYPERPLASIA,
    ADAPTATION_TYPES.NECROTIC_RECYCLING,
    ADAPTATION_TYPES.ADRENAL_RESPONSE,
    ADAPTATION_TYPES.MITOCHONDRIAL_BOOST,
    ADAPTATION_TYPES.CYTOKINE_INFUSION,
    ADAPTATION_TYPES.ADJUVANT_BOLUS
];

const ADAPTATION_CONFIG = {
    MAX_LEVEL: 2,
    REWARD_CHOICES_COUNT: 3
};

window.ADAPTATION_CONFIGS = ADAPTATION_CONFIGS;
window.ADAPTATION_TYPES = ADAPTATION_TYPES;
window.ADAPTATION_POOL = ADAPTATION_POOL;
window.ADAPTATION_CONFIG = ADAPTATION_CONFIG;