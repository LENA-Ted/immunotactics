class Mycetoma extends BaseEnemy {
    constructor(x, y) {
        super(x, y, PATHOGEN_CONFIGS.MYCETOMA, ENEMY_CATEGORIES.PATHOGEN, PATHOGEN_TYPES.MYCETOMA);
    }

    update(target, timestamp) {
        this.update_status_effects(timestamp);
        this.move_toward_target(target);
    }
}

window.Mycetoma = Mycetoma;