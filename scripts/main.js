class Game {
    constructor() {
        this.game_canvas = document.getElementById('game_canvas');
        this.cursor_canvas = document.getElementById('cursor_canvas');
        this.is_initialized = false;
        
        this.tower_factory = null;
        this.enemy_factory = null;
        this.spawn_system = null;
        this.collision_system = null;
        this.ui_system = null;
        this.input_system = null;
        this.rendering_system = null;
        this.selection_system = null;
        this.game_loop = null;
        
        this.game_state = null;
    }

    initialize() {
        this.set_canvas_sizes();
        this.create_factories();
        this.create_systems();
        this.create_initial_game_state();
        this.setup_systems();
        this.is_initialized = true;
    }

    set_canvas_sizes() {
        const width = Math.min(window.innerWidth * 0.9, 1280);
        const height = Math.min(window.innerHeight * 0.9, 720);
        
        this.game_canvas.width = width;
        this.game_canvas.height = height;
        this.cursor_canvas.width = width;
        this.cursor_canvas.height = height;
    }

    create_factories() {
        this.tower_factory = new TowerFactory();
        this.enemy_factory = new EnemyFactory();
    }

    create_systems() {
        this.spawn_system = new SpawnSystem(
            this.enemy_factory, 
            this.game_canvas.width, 
            this.game_canvas.height
        );
        this.collision_system = new CollisionSystem();
        this.ui_system = new UISystem();
        this.selection_system = new SelectionSystem();
        this.input_system = new InputSystem(this.game_canvas, this.tower_factory, this.selection_system);
        this.rendering_system = new RenderingSystem(this.game_canvas, this.cursor_canvas);
        this.game_loop = new GameLoop();
    }

    create_initial_game_state() {
        this.game_state = {
            player: new Player(),
            core: new Core(this.game_canvas.width, this.game_canvas.height),
            towers: [],
            enemies: [],
            projectiles: [],
            damage_numbers: [],
            effects: [],
            screen_shake: new ScreenShake(),
            is_game_over: false,
            last_tower_damage_time: {},
            intensity_level: 0,
            killcount: 0,
            total_killcount: 0,
            killcount_required: INTENSITY_CONFIG.INITIAL_KILLCOUNT_REQUIREMENT,
            displayed_killcount_progress: 0,
            intensity_gauge_pulsate: new PulsateEffect(),
            intensity_level_pulsate: new PulsateEffect(),
            canvas_width: this.game_canvas.width,
            canvas_height: this.game_canvas.height
        };
    }

    setup_systems() {
        this.ui_system.initialize();
        this.input_system.initialize();
        this.selection_system.initialize();

        const systems = {
            spawn: this.spawn_system,
            collision: this.collision_system,
            ui: this.ui_system,
            input: this.input_system,
            rendering: this.rendering_system,
            selection: this.selection_system
        };

        this.game_loop.initialize(systems, this.game_state);
    }

    start() {
        if (!this.is_initialized) {
            this.initialize();
        }

        this.reset_game_state();
        this.game_loop.start();
        this.spawn_system.start();
    }

    reset_game_state() {
        this.game_state.towers = [];
        this.game_state.enemies = [];
        this.game_state.projectiles = [];
        this.game_state.damage_numbers = [];
        this.game_state.effects = [];
        this.game_state.last_tower_damage_time = {};

        this.game_state.player = new Player();

        this.game_state.core = new Core(this.game_canvas.width, this.game_canvas.height);

        this.game_state.screen_shake = new ScreenShake();

        this.game_state.is_game_over = false;

        this.game_state.intensity_level = 0;
        this.game_state.killcount = 0;
        this.game_state.total_killcount = 0;
        this.game_state.killcount_required = INTENSITY_CONFIG.INITIAL_KILLCOUNT_REQUIREMENT;
        this.game_state.displayed_killcount_progress = 0;
        this.game_state.intensity_gauge_pulsate = new PulsateEffect();
        this.game_state.intensity_level_pulsate = new PulsateEffect();

        this.game_state.canvas_width = this.game_canvas.width;
        this.game_state.canvas_height = this.game_canvas.height;

        if (this.spawn_system) {
            this.spawn_system.reset();
        }
        if (this.ui_system) {
            this.ui_system.reset();
        }
        if (this.selection_system) {
            this.selection_system.reset();
        }
    }

    stop() {
        if (this.game_loop) {
            this.game_loop.stop();
        }
        if (this.spawn_system) {
            this.spawn_system.stop();
        }
    }

    restart() {
        this.stop();
        this.start();
    }

    is_running() {
        return this.game_loop && this.game_loop.is_game_loop_running();
    }
}

let game_instance = null;

function init() {
    if (!game_instance) {
        game_instance = new Game();
    }
    game_instance.restart();
}

function handle_play_again_click(event) {
    event.stopPropagation();
    init();
}

window.addEventListener('load', () => {
    init();
});

window.init = init;
window.handle_play_again_click = handle_play_again_click;