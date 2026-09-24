from flask import Blueprint, jsonify

from ..rules import RULES

config_api = Blueprint("config", __name__)


@config_api.get("/api/health")
def health():
    return jsonify(status="ok", service="doodle-jump-flask", version="0.0.1")


@config_api.get("/api/config")
def config():
    return jsonify(RULES)
