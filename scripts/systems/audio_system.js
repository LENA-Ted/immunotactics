const AUDIO_CONFIG = {
    BASE_PATH: 'audio/',
    FILE_EXTENSION: '.ogg',
    SOUNDS: {
        DAMAGE_CORE: 'sfx_damage_core',
        DESTROY_CORE: 'sfx_destroy_core',
        DESTROY_ENEMY: 'sfx_destroy_enemy',
        EXPLOSION: 'sfx_explode',
        HIT_PROJECTILE: 'sfx_hit_projectile',
        LEVELUP_INTENSITY: 'sfx_levelup_intensity',
        PICK_REWARD: 'sfx_pick_reward',
        PLACE_TOWER: 'sfx_place_tower',
        PROJECT_WAVE: 'sfx_project_wave',
        SHOOT_PROJECTILE: 'sfx_shoot_projectile',
        SPAWN_ENEMY: 'sfx_spawn_enemy'
    },
    DEFAULT_VOLUME: 0.7,
    MAX_CONCURRENT_INSTANCES: 5
};

class AudioSystem {
    constructor() {
        this.audio_elements = new Map();
        this.is_initialized = false;
        this.is_audio_enabled = true;
        this.master_volume = AUDIO_CONFIG.DEFAULT_VOLUME;
    }

    initialize() {
        if (this.is_initialized) {
            return Promise.resolve();
        }

        const load_promises = Object.values(AUDIO_CONFIG.SOUNDS).map(sound_name => {
            return this.load_audio_file(sound_name);
        });

        return Promise.all(load_promises)
            .then(() => {
                this.is_initialized = true;
            })
            .catch(error => {
                console.warn('Audio system initialization failed:', error);
                this.is_audio_enabled = false;
            });
    }

    load_audio_file(sound_name) {
        return new Promise((resolve, reject) => {
            const audio_pool = [];
            
            for (let i = 0; i < AUDIO_CONFIG.MAX_CONCURRENT_INSTANCES; i++) {
                const audio = new Audio();
                audio.src = `${AUDIO_CONFIG.BASE_PATH}${sound_name}${AUDIO_CONFIG.FILE_EXTENSION}`;
                audio.volume = this.master_volume;
                audio.preload = 'auto';
                
                audio.addEventListener('canplaythrough', () => {
                    if (i === 0) {
                        resolve();
                    }
                }, { once: true });
                
                audio.addEventListener('error', () => {
                    if (i === 0) {
                        reject(new Error(`Failed to load ${sound_name}`));
                    }
                }, { once: true });
                
                audio_pool.push(audio);
            }
            
            this.audio_elements.set(sound_name, audio_pool);
        });
    }

    play_sound(sound_key) {
        if (!this.is_audio_enabled || !this.is_initialized) {
            return;
        }

        const sound_name = AUDIO_CONFIG.SOUNDS[sound_key];
        if (!sound_name) {
            return;
        }

        const audio_pool = this.audio_elements.get(sound_name);
        if (!audio_pool) {
            return;
        }

        const available_audio = this.find_available_audio_instance(audio_pool);
        if (!available_audio) {
            return;
        }

        available_audio.currentTime = 0;
        available_audio.volume = this.master_volume;
        
        const play_promise = available_audio.play();
        if (play_promise) {
            play_promise.catch(error => {
                console.warn(`Failed to play sound ${sound_name}:`, error);
            });
        }
    }

    find_available_audio_instance(audio_pool) {
        for (const audio of audio_pool) {
            if (audio.paused || audio.ended) {
                return audio;
            }
        }
        
        return audio_pool[0];
    }

    set_master_volume(volume) {
        this.master_volume = Math.max(0, Math.min(1, volume));
        
        this.audio_elements.forEach(audio_pool => {
            audio_pool.forEach(audio => {
                audio.volume = this.master_volume;
            });
        });
    }

    set_audio_enabled(enabled) {
        this.is_audio_enabled = enabled;
        
        if (!enabled) {
            this.stop_all_sounds();
        }
    }

    stop_all_sounds() {
        this.audio_elements.forEach(audio_pool => {
            audio_pool.forEach(audio => {
                if (!audio.paused) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        });
    }

    unlock_audio_context() {
        if (!this.is_audio_enabled || !this.is_initialized) {
            return;
        }

        const test_audio = this.audio_elements.values().next().value;
        if (test_audio && test_audio.length > 0) {
            const audio = test_audio[0];
            const play_promise = audio.play();
            if (play_promise) {
                play_promise.then(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }).catch(() => {
                    
                });
            }
        }
    }

    reset() {
        this.stop_all_sounds();
    }

    get_master_volume() {
        return this.master_volume;
    }

    is_enabled() {
        return this.is_audio_enabled;
    }
}

window.AudioSystem = AudioSystem;
window.AUDIO_CONFIG = AUDIO_CONFIG;