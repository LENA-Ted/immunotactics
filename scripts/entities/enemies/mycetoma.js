class Mycetoma extends BaseEnemy {
    constructor(x, y) {
        super(x, y, PATHOGEN_CONFIGS.MYCETOMA);
        this.pathogen_type = PATHOGEN_TYPES.MYCETOMA;
        this.pathogen_class = PATHOGEN_CLASSES.FUNGUS;
    }

    update(target, timestamp) {
        this.update_status_effects(timestamp);
        this.move_toward_target(target);
    }

    get_pathogen_type() {
        return this.pathogen_type;
    }

    get_pathogen_class() {
        return this.pathogen_class;
    }
}

window.Mycetoma = Mycetoma;