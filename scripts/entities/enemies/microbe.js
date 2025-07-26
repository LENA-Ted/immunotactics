class Microbe extends BaseEnemy {
    constructor(x, y) {
        super(x, y, ENEMY_CONFIGS.BASIC, ENEMY_CATEGORIES.MICROBE, ENEMY_CATEGORIES.MICROBE);
    }

    update(target) {
        this.move_toward_target(target);
    }
}

window.Microbe = Microbe;