const ADAPTATION_CONFIGS = {
    CYTOTOXIC_SURGE: {
        name: 'Cytotoxic Surge',
        effects: {
            0: { damage_multiplier: 1.18 },
            1: { damage_multiplier: 1.27 },
            2: { damage_multiplier: 1.36 }
        },
        descriptions: {
            0: 'Increase all Immune Cell DMG by 18%.',
            1: 'Increase all Immune Cell DMG by 27%.',
            2: 'Increase all Immune Cell DMG by 36%.'
        }
    },
    REGENERATIVE_CYCLE: {
        name: 'Regenerative Cycle',
        effects: {
            0: { core_heal_per_intensity: 1 },
            1: { core_heal_per_intensity: 2 },
            2: { core_heal_per_intensity: 3 }
        },
        descriptions: {
            0: 'Recover 1 Cell Core Health (HP) every Intensity level-up.',
            1: 'Recover 2 Cell Core Health (HP) every Intensity level-up.',
            2: 'Recover 3 Cell Core Health (HP) every Intensity level-up.'
        }
    },
    HYPERPLASIA: {
        name: 'Hyperplasia',
        effects: {
            0: { max_hp_increase: 1 },
            1: { max_hp_increase: 2 },
            2: { max_hp_increase: 3 }
        },
        descriptions: {
            0: 'Increase Max Cell Core HP by 1.',
            1: 'Increase Max Cell Core HP by 2.',
            2: 'Increase Max Cell Core HP by 3.'
        }
    },
    NECROTIC_RECYCLING: {
        name: 'Necrotic Recycling',
        effects: {
            0: { energy_refund_percent: 0.18 },
            1: { energy_refund_percent: 0.27 },
            2: { energy_refund_percent: 0.36 }
        },
        descriptions: {
            0: 'When Immune Cells are destroyed, they refund 18% of their ATP cost.',
            1: 'When Immune Cells are destroyed, they refund 27% of their ATP cost.',
            2: 'When Immune Cells are destroyed, they refund 36% of their ATP cost.'
        }
    },
    ADRENAL_RESPONSE: {
        name: 'Adrenal Response',
        effects: {
            0: { energy_cost_reduction: 0.24 },
            1: { energy_cost_reduction: 0.36 },
            2: { energy_cost_reduction: 0.48 }
        },
        descriptions: {
            0: 'When at 2 Cell Core HP or below, all Energy (ATP) costs are reduced by 24%.',
            1: 'When at 2 Cell Core HP or below, all Energy (ATP) costs are reduced by 36%.',
            2: 'When at 2 Cell Core HP or below, all Energy (ATP) costs are reduced by 48%.'
        }
    },
    MITOCHONDRIAL_BOOST: {
        name: 'Mitochondrial Boost',
        effects: {
            0: { energy_regen_multiplier: 1.12 },
            1: { energy_regen_multiplier: 1.18 },
            2: { energy_regen_multiplier: 1.24 }
        },
        descriptions: {
            0: 'Increase Energy (ATP) Regen Rate by 12%.',
            1: 'Increase Energy (ATP) Regen Rate by 18%.',
            2: 'Increase Energy (ATP) Regen Rate by 24%.'
        }
    },
    CYTOKINE_INFUSION: {
        name: 'Cytokine Infusion',
        effects: {
            0: { cytokine_multiplier: 1.18 },
            1: { cytokine_multiplier: 1.27 },
            2: { cytokine_multiplier: 1.36 }
        },
        descriptions: {
            0: 'Increase Cytokines by 18%.',
            1: 'Increase Cytokines by 27%.',
            2: 'Increase Cytokines by 36%.'
        }
    },
    ADJUVANT_BOLUS: {
        name: 'Adjuvant Bolus',
        effects: {
            0: { adjuvant_multiplier: 1.18 },
            1: { adjuvant_multiplier: 1.27 },
            2: { adjuvant_multiplier: 1.36 }
        },
        descriptions: {
            0: 'Increase Adjuvants by 18%.',
            1: 'Increase Adjuvants by 27%.',
            2: 'Increase Adjuvants by 36%.'
        }
    },
    NUTRIENT_GLUT: {
        name: 'Nutrient Glut',
        effects: {
            0: { biomass_gain: 200 },
            1: { biomass_gain: 200 },
            2: { biomass_gain: 200 }
        },
        descriptions: {
            0: 'Gain 200 Biomass.',
            1: 'Gain 200 Biomass.',
            2: 'Gain 200 Biomass.'
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