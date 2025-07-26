class BasicEnemy extends BaseEnemy {
    constructor(x, y) {
        super(x, y, ENEMY_CONFIGS.BASIC, ENEMY_CATEGORIES.MICROBE, ENEMY_TYPES.BASIC);
    }

    update(target) {
        this.move_toward_target(target);
    }
}

window.BasicEnemy = BasicEnemy;