import uuid

import pytest

from backend.app import create_app
from backend.db import init_db


@pytest.fixture
def client(tmp_path):
    database = tmp_path / "runs.db"
    init_db(database)
    return create_app({"TESTING": True, "DATABASE": str(database)}).test_client()


def payload(**overrides):
    return {
        **{
            "run_id": str(uuid.uuid4()),
            "player_id": str(uuid.uuid4()),
            "nickname": "Tester",
            "skin_id": "nam",
            "rules_version": "v1",
            "height": 150,
            "elapsed_ms": 3000,
            "outcome": "dnf",
            "placement": 3,
        },
        **overrides,
    }


def test_save_retry_conflict_and_missing_detail(client):
    run = payload(nickname="  Tester  ")
    response = client.post("/api/runs", json=run)
    assert response.status_code == 201
    assert response.json["nickname"] == "Tester"
    assert response.json["created_at"]
    assert client.post("/api/runs", json=run).status_code == 200
    assert client.post("/api/runs", json={**run, "height": 200}).status_code == 409
    assert client.get("/api/runs/" + str(uuid.uuid4())).status_code == 404


@pytest.mark.parametrize("change", [
    {"height": True}, {"elapsed_ms": False}, {"placement": True},
    {"height": -1}, {"height": 3001}, {"elapsed_ms": 0},
    {"elapsed_ms": 180001}, {"placement": 6}, {"nickname": " "},
    {"nickname": "a" * 25}, {"skin_id": "bad"}, {"rules_version": "bad"},
    {"outcome": "finished"}, {"height": 3000}, {"run_id": "not-uuid"},
    {"nickname": []}, {"height": 1.2}, {"skin_id": {}}, {"outcome": []},
])
def test_invalid_results_rejected(client, change):
    assert client.post("/api/runs", json=payload(**change)).status_code == 422


def test_invalid_json_and_shape(client):
    assert client.post("/api/runs", data="{", content_type="application/json").status_code == 400
    assert client.post("/api/runs", json=[]).status_code == 422


def test_leaderboard_limit_and_finish_order(client):
    runs = [
        payload(nickname="DNF high", height=2500),
        payload(nickname="Winner slow", outcome="finished", height=3000, elapsed_ms=50000),
        payload(nickname="Winner fast", outcome="finished", height=3000, elapsed_ms=40000),
    ]
    runs += [payload(nickname=f"Low {index}", height=index) for index in range(12)]
    for run in runs:
        assert client.post("/api/runs", json=run).status_code == 201
    rows = client.get("/api/leaderboard?rules_version=v1").json["items"]
    assert len(rows) == 10
    assert [row["nickname"] for row in rows[:3]] == ["Winner fast", "Winner slow", "DNF high"]
    assert client.get("/api/leaderboard?rules_version=invalid").status_code == 422
