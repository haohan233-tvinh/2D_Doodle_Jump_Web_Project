"""Nguyễn Đăng Đạt: triển khai BE-01 theo docs/API.md."""
import uuid
from flask import Blueprint, jsonify, request

from ..db import get_db
from ..errors import APIError

runs_api = Blueprint("runs", __name__)


def not_implemented():
    return jsonify(error={
        "code": "not_implemented",
        "message": "V0.0 chưa triển khai lưu kết quả. Xem nhiệm vụ BE-01 trong docs/FIRST_TASKS.md.",
        "details": {},
    }), 501


@runs_api.get("/api/runs")
def get_runs():
    player_id = request.args.get("player_id")
    if not player_id:
        raise APIError(
            code="invalid_run",
            message="Dữ liệu chưa hợp lệ.",
            details={"player_id": "Thiếu mã người chơi (player_id)."},
            status_code=422,
        )

    try:
        val = uuid.UUID(player_id.strip())
        canonical_player_id = str(val)
    except (ValueError, TypeError, AttributeError):
        raise APIError(
            code="invalid_run",
            message="Dữ liệu chưa hợp lệ.",
            details={"player_id": "Mã người chơi phải là chuỗi UUID hợp lệ."},
            status_code=422,
        )

    db = get_db()
    cursor = db.execute(
        """
        SELECT run_id, player_id, nickname, skin_id, rules_version,
               height, elapsed_ms, outcome, placement, created_at
        FROM runs
        WHERE player_id = ?
        ORDER BY created_at DESC, run_id ASC
        LIMIT 20
        """,
        (canonical_player_id,),
    )
    rows = cursor.fetchall()
    return jsonify(items=[dict(row) for row in rows])


@runs_api.post("/api/runs")
def post_runs():
    return not_implemented()


@runs_api.get("/api/runs/<run_id>")
def run_detail(run_id):
    return not_implemented()


@runs_api.get("/api/leaderboard")
def leaderboard():
    return not_implemented()
