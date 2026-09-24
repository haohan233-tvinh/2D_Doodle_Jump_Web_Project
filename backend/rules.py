RULES = {
    "rules_version": "v1",
    "finish_height": 3000,
    "max_duration_ms": 180000,
    "skins": [
        {"id": "nam", "name": "Thầy Nam", "sprite": "/images/sprites/nam.png"},
        {"id": "quang", "name": "Thầy Quang", "sprite": "/images/sprites/quang.png"},
        {"id": "son", "name": "Thầy Sơn", "sprite": "/images/sprites/son.png"},
        {"id": "viet", "name": "Thầy Việt", "sprite": "/images/sprites/viet.png"},
    ],
    "bots": [
        {"id": "teacher-son", "name": "Thầy Sơn", "base_speed": 41, "sprite_id": "son"},
        {"id": "teacher-nam", "name": "Thầy Nam", "base_speed": 48, "sprite_id": "nam"},
        {"id": "teacher-quang", "name": "Thầy Quang", "base_speed": 44, "sprite_id": "quang"},
        {"id": "teacher-viet", "name": "Thầy Việt", "base_speed": 46, "sprite_id": "viet"},
    ],
}
