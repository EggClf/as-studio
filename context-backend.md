This file is a merged representation of the entire codebase, combined into a single document by Repomix.

<file_summary>
This section contains a summary of this file.

<purpose>
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.
</purpose>

<file_format>
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  - File path as an attribute
  - Full contents of the file
</file_format>

<usage_guidelines>
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
</usage_guidelines>

<notes>
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)
</notes>

</file_summary>

<directory_structure>
flux-new-reason/
  app/
    agents/
      helpers/
        task_assigner.py
      strategic_agent.py
      tactical_agent.py
    api/
      cell_context_snapshot.py
      historical_alarm.py
      historical_kpi.py
      intent.py
      network_scan.py
      plan.py
    core/
      docling/
        __init__.py
        chunker.py
        client.py
        custom_hybrid_chunking.py
      highlight.py
      milvus.py
      postgres.py
      redis.py
      s3.py
      searxng.py
      stream.py
    models/
      schemas.py
    utils/
      conversion.py
      event.py
      file.py
      streaming.py
      yaml.py
    workflows/
      system.py
    main.py
    serve.py
  icflow/
    dt-legacy/
      create_models.py
      main.py
      model_service.py
    models/
      es_model.pkl
      mro_model.pkl
    utils/
      __init__.py
      llm.py
      postgres.py
      s3.py
      searxng.py
    __init__.py
    context_schema.py
    extract_features.py
    features.py
    generate_dataset.py
    model_service.py
    pseudo_labels.py
    README.md
    reasoning.py
    scan_network.py
    schemas.py
    train_models.py
  .env.example
  .gitignore
  .python-version
  ALLCELL.txt
  context.txt
  main.py
  pyproject.toml
  README.md
</directory_structure>

<files>
This section contains the contents of the repository's files.

<file path="flux-new-reason/app/agents/helpers/task_assigner.py">
"""
Help functions for assigning tasks to tactical agents.
"""
import logging
import asyncio
from typing import List, Dict, Optional, Callable
from datetime import datetime
import json
from icflow.schemas import TaskType
from app.models.typed_dict import CellLonLatInfo, StationInfo
from app.core.postgres import get_lon_lat_by_cellnames, get_station_by_cellnames, save_assign_history
# from app.core.redis import multi_lock, multi_release  # disabled for testing
from app.core.cluster_algo import latlon_to_xy, cluster_by_radius

logger = logging.getLogger(__name__)

async def handle_es(cell_ids: List[str], intent_id: str) -> List[dict]:
    print(f"[ES] Processing cells: {cell_ids} for intent_id: {intent_id}")
    cells: List[CellLonLatInfo] = await get_lon_lat_by_cellnames(cell_ids)
    map_idx_cell_name: Dict[int, str] = {
        idx: cell["cell_name"]
        for idx, cell in enumerate(cells)
    }
    lon_lat_points = [
        (cell["longitude"], cell["latitude"])
        for cell in cells
    ]
    point_xy = [latlon_to_xy(lon, lat) for lon, lat in lon_lat_points]
    x_meter = 3000
    clusters = cluster_by_radius(point_xy, x_meter)
    clusters_cells: List[List[str]] = [
        [map_idx_cell_name[idx] for idx in cluster]
        for cluster in clusters
    ]
    payloads: List[dict] = []
    for cluster_item in clusters_cells:
        payloads.append(await send_to_worker_es(cluster_item, intent_id))
    return payloads

async def handle_mro(cell_ids: List[str], intent_id: str) -> List[dict]:
    print(f"[MRO] Processing cells: {cell_ids} for intent_id: {intent_id}")
    stations: List[StationInfo] = await get_station_by_cellnames(cell_ids)
    checkDataStation(stations)
    map_idx_station_name: Dict[int, str] = {
        idx: station["station_name"]
        for idx, station in enumerate(stations)
    }
    lon_lat_points = [
        (station["longitude"], station["latitude"])
        for station in stations
    ]
    point_xy = [latlon_to_xy(lon, lat) for lon, lat in lon_lat_points]
    x_meter = 3000
    clusters = cluster_by_radius(point_xy, x_meter)
    clusters_stations: List[List[str]] = [
        [map_idx_station_name[idx] for idx in cluster]
        for cluster in clusters
    ]
    payloads: List[dict] = []
    for cluster_item in clusters_stations:
        payloads.append(await send_to_worker_mro(cluster_item, intent_id))
    return payloads

async def send_to_worker_es(cell_ids: List[str], intent_id: str) -> dict:
    status = "SUCCESS"
    message = "ASSIGN SUCCESS"
    # lock_keys = ["ES:cell:" + cell_id for cell_id in cell_ids]  # disabled for testing
    # try:
    #     multi_lock(lock_keys)
    #     try:
    payload: dict = {
        "intent_id": intent_id,
        "target_ids": cell_ids,
    }
    #     except Exception as e:
    #         multi_release(lock_keys)
    #         raise e
    # except Exception as e:
    #     logger.exception(f"Failed to dispatch ES task for cells {cell_ids} and intent_id {intent_id}: {e}")
    #     status = "FAILED"
    #     message = str(e)
    await save_assign_history("ES", "cell", intent_id, cell_ids, status, message)
    return payload

async def send_to_worker_mro(station_names: List[str], intent_id: str) -> dict:
    status = "SUCCESS"
    message = "ASSIGN SUCCESS"
    # lock_keys = ["MRO:station:" + station_name for station_name in station_names]  # disabled for testing
    # try:
    #     multi_lock(lock_keys)
    #     try:
    payload: dict = {
        "intent_id": intent_id,
        "target_ids": station_names,
    }
    #     except Exception as e:
    #         multi_release(lock_keys)
    #         raise e
    # except Exception as e:
    #     logger.exception(f"Failed to dispatch MRO task for stations {station_names} and intent_id {intent_id}: {e}")
    #     status = "FAILED"
    #     message = str(e)
    await save_assign_history("MRO", "station", intent_id, station_names, status, message)
    return payload
    

def checkDataStation(stations: List [StationInfo]) -> None:
    station_names: Set[str] = {s["station_name"] for s in stations}
    for s in stations:
        if is_blank(s["city_name"]) or is_blank(s["city_number_id"]):
            raise ValueError(f"Station {s['station_name']} has incomplete data: city_name or city_number_id is blank.")
    
    if len(station_names) != len(stations):
        raise ValueError("Duplicate station names found in the input data.")
    

def is_blank(s: str | None) -> bool:
    return not s or not s.strip()

TASK_HANDLERS: dict[TaskType, Callable[[List[str], str], List[dict]]] = {
    TaskType.ES: handle_es,
    TaskType.MRO: handle_mro,
}

async def assign_task(
    task_type: TaskType,
    cell_ids: List[str],
    intent_id: str
) -> List[dict]:
    if not cell_ids:
        raise ValueError("cell_ids list cannot be empty")
    
    if is_blank(intent_id):
        raise ValueError("intent_id cannot be blank")
    
    handler = TASK_HANDLERS.get(task_type)
    if not handler:
        raise ValueError(f"No handler defined for task type: {task_type}")
    
    return await handler(cell_ids, intent_id)

# asyncio.run(assign_task(
#     task_type=TaskType.ES,
#     cell_ids=["gBT00578_10n411", "gBT00578_10n412"],
#     intent_id="intent_12345",
# ))
</file>

<file path="flux-new-reason/app/agents/strategic_agent.py">
# -*- coding: utf-8 -*-
"""Strategic Agent – scan + task assignment.

Runs ``icflow.scan_network.scan_network`` to get per-cell decisions, then
dispatches ``assign_task`` for every positive cell.  No LLM.

Input  msg.metadata  → type: SCAN_REQUEST
Output msg.metadata  → type: STRATEGIC_RESULT

SCAN_REQUEST fields:
    task_type         TaskType        MRO | ES
    cells             list[str]
    timestamp         str             ISO-8601 (default: now)
    kpi_dir           str | None
    start_date        str | None      ISO-8601, forwarded to assign_task
    end_date          str | None      ISO-8601, forwarded to assign_task
    enable_web_search bool            default True
    save_to_db        bool            default True

STRATEGIC_RESULT fields:
    task_type         str
    intent_id         str
    timestamp         str
    assigned_cells    list[str]       target_ids from task_assigner payloads
"""
from __future__ import annotations

import asyncio
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

import pandas as pd
from agentscope.agent import AgentBase
from agentscope.message import Msg
from agentscope.tracing import trace_reply

from app.agents.helpers.task_assigner import assign_task
from app.core.stream import AsyncEmitter
from icflow.scan_network import scan_network
from icflow.schemas import TaskType

logger = logging.getLogger(__name__)

# Default KPI directory (resolved relative to repo root)
_DEFAULT_KPI_DIR = Path(__file__).parent.parent.parent / "app" / "data" / "KPI" / "v3"


class StrategicAgent(AgentBase):
    """Runs a network scan and dispatches task assignments for positive cells.

    Stateless – a single instance can be reused across multiple requests.
    """

    def __init__(self, name: str = "StrategicAgent") -> None:
        super().__init__()
        self.name = name

    async def observe(self, msg: Msg | list[Msg] | None) -> None:
        """No persistent memory – each request is independent."""

    @trace_reply
    async def reply(self, msg: Msg | None = None, **kwargs: Any) -> Msg:
        """Scan network and assign tasks for every positive cell.

        Raises
        ------
        ValueError
            If the incoming message is not a valid SCAN_REQUEST.
        """
        emitter: AsyncEmitter | None = kwargs.get("emitter")

        if msg is None or msg.metadata.get("type") != "SCAN_REQUEST":
            raise ValueError(
                f"{self.name} expects a 'SCAN_REQUEST' message, "
                f"got: {msg.metadata if msg else None}"
            )

        meta: dict = msg.metadata

        task_type: TaskType = meta["task_type"]
        cells: list[str] = meta["cells"]
        timestamp: str = meta.get("timestamp") or datetime.now().isoformat()
        kpi_dir = Path(meta["kpi_dir"]) if meta.get("kpi_dir") else _DEFAULT_KPI_DIR
        enable_web_search: bool = meta.get("enable_web_search", True)
        save_to_db: bool = meta.get("save_to_db", True)
        start_date: Optional[datetime] = (
            datetime.fromisoformat(meta["start_date"]) if meta.get("start_date") else None
        )
        end_date: Optional[datetime] = (
            datetime.fromisoformat(meta["end_date"]) if meta.get("end_date") else None
        )

        # ── Step 1: Scan ──────────────────────────────────────────────────────
        logger.info(
            "[%s] Scanning %d cells | task=%s | ts=%s",
            self.name, len(cells), task_type.value, timestamp,
        )
        if emitter:
            emitter.emit("scanning", f"Scanning {len(cells)} cells for {task_type.value} action...")

        df: pd.DataFrame = await scan_network(
            task_type=task_type,
            cells=cells,
            timestamp=timestamp,
            kpi_dir=kpi_dir,
            output_dir=kpi_dir.parent / "scan_results",
            enable_web_search=enable_web_search,
            save_to_db=save_to_db,
            emitter=emitter,
        )

        intent_id: Optional[str] = df["intent_id"].iloc[0] if len(df) > 0 else None
        positive_cells: list[str] = (
            df.loc[df["decision"] == True, "cellname"].tolist()
            if "decision" in df.columns and len(df) > 0
            else []
        )

        logger.info(
            "[%s] Scan done – %d/%d positive",
            self.name, len(positive_cells), len(cells),
        )
        if emitter:
            emitter.emit(
                "scan_done",
                f"Scan complete – {len(positive_cells)}/{len(cells)} cells need attention.",
            )

        # ── Step 2: Assign ────────────────────────────────────────────────────
        all_payloads: list[dict] = []
        failed_cells: list[str] = []

        if emitter and positive_cells:
            emitter.emit("assigning", f"Assigning tasks to {len(positive_cells)} cell(s)...")

        async def _assign_one(cell: str) -> tuple[list[dict], Exception | None]:
            try:
                return await assign_task(
                    task_type=task_type,
                    cell_ids=[cell],
                    intent_id=intent_id or "",
                ), None
            except Exception as exc:  # noqa: BLE001
                logger.warning("[%s] assign_task failed for %s: %s", self.name, cell, exc)
                return [], exc

        results = await asyncio.gather(*(_assign_one(c) for c in positive_cells))
        for cell, (payloads, exc) in zip(positive_cells, results):
            if exc is None:
                all_payloads.extend(payloads)
            else:
                failed_cells.append(cell)

        assigned_cells: list[str] = [
            target_id
            for payload in all_payloads
            for target_id in payload.get("target_ids", [])
        ]

        logger.info(
            "[%s] Assignment done – %d targets assigned, %d cells failed",
            self.name, len(assigned_cells), len(failed_cells),
        )
        if emitter:
            emitter.emit(
                "strategic_done",
                f"Strategic phase done – {len(assigned_cells)} targets assigned, {len(failed_cells)} failed.",
            )

        return Msg(
            name=self.name,
            content=(
                f"{len(positive_cells)}/{len(cells)} cells positive; "
                f"{len(assigned_cells)} targets assigned, {len(failed_cells)} failed."
            ),
            role="assistant",
            metadata={
                "type": "STRATEGIC_RESULT",
                "task_type": task_type.value,
                "intent_id": intent_id,
                "timestamp": timestamp,
                "assigned_cells": assigned_cells,
            },
        )
</file>

<file path="flux-new-reason/app/agents/tactical_agent.py">
# -*- coding: utf-8 -*-
"""Tactical Agent – action plan generator.

Calls the KServe-style ML inference service to trigger plan generation
(MRO / ES).  The ML pipeline notifies completion via a callback POST to
``/tactical/callback?token=<token>`` and includes the plan data directly
in the callback payload.

Input  msg.metadata  → type: STRATEGIC_RESULT  (from StrategicAgent)
Output msg.metadata  → type: PLAN_RESULT

STRATEGIC_RESULT fields consumed:
    task_type         str
    intent_id         str
    timestamp         str             ISO-8601 (date part used for date label)
    assigned_cells    list[str]

PLAN_RESULT fields:
    intent_id         str
    task_type         str
    date              str             YYYY-MM-DD
    plan              dict            artefacts delivered via callback payload

Callback payload (``data`` field)
---------------------------------
  MRO  {"mro_plan":   {"file_path": str, "data": [...], "shape": [...]}}
  ES   {"schedule":   {"file_path": str, "data": [...], "shape": [...]},
        "forecast":   {"file_path": str, "data": [...], "shape": [...]}}
"""
from __future__ import annotations

import asyncio
import logging
import os
import uuid
from datetime import datetime
from typing import Any

import httpx
from agentscope.agent import AgentBase
from agentscope.message import Msg
from agentscope.tracing import trace_reply

from app.core.stream import AsyncEmitter
from icflow.utils.postgres import get_postgres_client

logger = logging.getLogger(__name__)

_ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "http://localhost:12324")
_SERVE_BASE_URL = os.getenv("SERVE_BASE_URL", "http://localhost:8099")
_PREDICT_TIMEOUT  = 60.0   # seconds – just the HTTP trigger call
_CALLBACK_TIMEOUT = 600.0  # seconds – wait for ML pipeline to finish

# Shared event registry: intent_id → (asyncio.Event, result_dict)
# The callback endpoint in serve.py sets the event and writes the body.
_pending: dict[str, tuple[asyncio.Event, dict]] = {}


async def _trigger_prediction(
    task_type: str,
    assigned_cells: list[str],
    callback_url: str,
) -> None:
    """POST to the KServe-style predict endpoint to kick off plan generation."""
    url = f"{_ML_SERVICE_URL}/v1/models/{task_type.lower()}:predict"
    payload = {
        "instances": [{"target_ids": assigned_cells}],
        "callback_url": callback_url,
    }
    async with httpx.AsyncClient(verify=False, timeout=_PREDICT_TIMEOUT) as client:
        resp = await client.post(url, json=payload)
        resp.raise_for_status()
    logger.debug("[TacticalAgent] predict response %d from %s", resp.status_code, url)



class TacticalAgent(AgentBase):
    """Triggers ML-based plan generation and retrieves resulting artefacts from MinIO."""

    def __init__(self, name: str = "TacticalAgent") -> None:
        super().__init__()
        self.name = name

    async def observe(self, msg: Msg | list[Msg] | None) -> None:
        """No persistent state needed (plans are derived on demand)."""

    @trace_reply
    async def reply(self, msg: Msg | None = None, **kwargs: Any) -> Msg:
        """Trigger plan generation, await callback, load from MinIO.

        Raises
        ------
        ValueError
            If the message is not a STRATEGIC_RESULT.
        httpx.HTTPStatusError
            If the ML service returns a non-2xx response.
        asyncio.TimeoutError
            If the ML pipeline does not call back within ``_CALLBACK_TIMEOUT``.
        """
        emitter: AsyncEmitter | None = kwargs.get("emitter")

        if msg is None or msg.metadata.get("type") != "STRATEGIC_RESULT":
            raise ValueError(
                f"{self.name} expects a 'STRATEGIC_RESULT' message, "
                f"got: {msg.metadata if msg else None}"
            )

        meta: dict = msg.metadata
        task_type: str      = meta["task_type"]
        intent_id: str      = meta.get("intent_id") or ""
        assigned_cells: list[str] = meta.get("assigned_cells", [])

        raw_ts: str  = meta.get("timestamp") or datetime.now().isoformat()
        date_str: str = datetime.fromisoformat(raw_ts).strftime("%Y-%m-%d")

        logger.info(
            "[%s] Triggering %s plan for %d cells (intent=%s, date=%s)",
            self.name, task_type, len(assigned_cells), intent_id, date_str,
        )
        if emitter:
            emitter.emit(
                "generating_plan",
                f"Triggering {task_type} plan generation for {len(assigned_cells)} cell(s)...",
            )

        # ── Step 1: Register callback event ───────────────────────────────────
        event = asyncio.Event()
        result_slot: dict = {}
        token = str(uuid.uuid4())          # unique per request; stable across calls
        _pending[token] = (event, result_slot)
        # Embed the token in the URL – the ML service doesn’t need to echo it back.
        callback_url = f"{_SERVE_BASE_URL}/tactical/callback?token={token}"

        try:
            # ── Step 2: Kick off ML workflow ───────────────────────────────────
            await _trigger_prediction(task_type, assigned_cells, callback_url)

            # ── Step 3: Wait for ML pipeline to signal completion ──────────────
            logger.info(
                "[%s] Waiting for callback (timeout=%ss, url=%s)",
                self.name, _CALLBACK_TIMEOUT, callback_url,
            )
            if emitter:
                emitter.emit("awaiting_callback", "Waiting for ML pipeline to complete...")
            await asyncio.wait_for(event.wait(), timeout=_CALLBACK_TIMEOUT)

            cb_status = result_slot.get("status", "success")
            if cb_status != "success":
                raise RuntimeError(
                    f"ML pipeline reported failure for intent {intent_id!r}: "
                    f"{result_slot.get('error_message')}"
                )

        finally:
            _pending.pop(token, None)

        # ── Step 4: Retrieve plan artefacts from callback payload ──────────────
        if emitter:
            emitter.emit("loading_plan", "Loading plan artefacts from callback payload...")
        plan: dict[str, Any] = result_slot.get("data") or {}

        logger.info(
            "[%s] Plan loaded from MinIO – keys: %s",
            self.name, list(plan.keys()),
        )

        if emitter:
            for key, value in plan.items():
                emitter.emit_data("plan_field", task_type=task_type, key=key, value=value)

        # ── Step 5: Persist tactical dispatch record ───────────────────────────
        endpoint = f"{_ML_SERVICE_URL}/v1/models/{task_type.lower()}:predict"
        try:
            db = get_postgres_client()
            await db.save_tactical_dispatch(
                intent_id=intent_id,
                task_type=task_type,
                tactical_agent_endpoint=endpoint,
                target_cells=assigned_cells,
                tactical_response={"status": "success", "plan_keys": list(plan.keys())},
            )
        except Exception as exc:  # non-fatal – plan is already retrieved
            logger.warning("[%s] Failed to persist tactical dispatch: %s", self.name, exc)

        return Msg(
            name=self.name,
            content=f"Plan ready for intent {intent_id} ({task_type}, {date_str}).",
            role="assistant",
            metadata={
                "type": "PLAN_RESULT",
                "intent_id": intent_id,
                "task_type": task_type,
                "date": date_str,
                "plan": plan,
            },
        )
</file>

<file path="flux-new-reason/app/api/cell_context_snapshot.py">
"""
Cell Context Snapshot API.

Exposes read-oriented endpoints over the cell_context_snapshot table (spec v3).
Each endpoint is anchored to a concrete operational/business question.
"""

import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from icflow.utils.postgres import get_postgres_client, PostgresClient

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/cell-snapshots",
    tags=["cell-snapshots"],
    responses={404: {"description": "Not found"}},
)


# ---------------------------------------------------------------------------
# Dependency
# ---------------------------------------------------------------------------

async def get_db() -> PostgresClient:
    client = get_postgres_client()
    await client.connect()
    return client


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------

class SnapshotSummary(BaseModel):
    """Lightweight snapshot row — no heavy JSONB payloads."""
    context_snapshot_id: str
    cell_name: str
    time_bucket: str
    minio_path: Optional[str]
    created_at: str
    updated_at: str


class SnapshotDetail(SnapshotSummary):
    """Full snapshot including all JSONB context fields."""
    metadata: Optional[Dict[str, Any]]
    common_sense: Optional[Dict[str, Any]]
    kpi: Optional[Dict[str, Any]]
    alarm: Optional[Dict[str, Any]]
    history_command: Optional[Dict[str, Any]]


class SnapshotFieldSummary(BaseModel):
    """Summary stats computed from a single JSONB context field across snapshots."""
    cell_name: str
    time_bucket: str
    field: str
    value: Optional[Any]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "",
    response_model=List[SnapshotSummary],
    summary="List cell context snapshots",
    description=(
        "**Business question:** Which cells have context snapshots captured in the "
        "system and when were they last recorded? Useful for monitoring data freshness "
        "and identifying gaps in context collection coverage."
    ),
)
async def list_snapshots(
    cell_name: Optional[str] = Query(None, description="Filter by exact cell name"),
    time_bucket_from: Optional[str] = Query(
        None, description="Start of time_bucket range (ISO timestamp, inclusive)"
    ),
    time_bucket_to: Optional[str] = Query(
        None, description="End of time_bucket range (ISO timestamp, inclusive)"
    ),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: PostgresClient = Depends(get_db),
):
    conditions: List[str] = []
    params: List[Any] = []
    idx = 1

    if cell_name:
        conditions.append(f"cell_name = ${idx}")
        params.append(cell_name)
        idx += 1
    if time_bucket_from:
        conditions.append(f"time_bucket >= ${idx}::timestamp")
        params.append(time_bucket_from)
        idx += 1
    if time_bucket_to:
        conditions.append(f"time_bucket <= ${idx}::timestamp")
        params.append(time_bucket_to)
        idx += 1

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    query = f"""
        SELECT context_snapshot_id::text, cell_name, time_bucket,
               minio_path, created_at, updated_at
        FROM cell_context_snapshot
        {where}
        ORDER BY time_bucket DESC, cell_name
        LIMIT ${idx} OFFSET ${idx + 1}
    """
    params += [limit, offset]

    async with db.acquire() as conn:
        rows = await conn.fetch(query, *params)

    return [_row_to_dict(r) for r in rows]


@router.get(
    "/cells/{cell_name}/latest",
    response_model=SnapshotDetail,
    summary="Latest context snapshot for a cell",
    description=(
        "**Business question:** What is the most current operational context available "
        "for this cell — including its KPIs, active alarms, weather/event scores, and "
        "recent command history? Use this before making any intervention decision."
    ),
)
async def get_latest_snapshot(cell_name: str, db: PostgresClient = Depends(get_db)):
    query = """
        SELECT context_snapshot_id::text, cell_name, time_bucket,
               metadata, common_sense, kpi, alarm, history_command,
               minio_path, created_at, updated_at
        FROM cell_context_snapshot
        WHERE cell_name = $1
        ORDER BY time_bucket DESC
        LIMIT 1
    """
    async with db.acquire() as conn:
        row = await conn.fetchrow(query, cell_name)

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No context snapshot found for cell '{cell_name}'",
        )
    return _row_to_dict(row)


@router.get(
    "/cells/{cell_name}/history",
    response_model=List[SnapshotSummary],
    summary="Context snapshot history for a cell",
    description=(
        "**Business question:** How has the context capture cadence evolved for this "
        "cell over time? Which time buckets are present and which are missing, "
        "indicating potential collection failures or coverage gaps?"
    ),
)
async def list_cell_snapshot_history(
    cell_name: str,
    time_bucket_from: Optional[str] = Query(None, description="Start range (ISO timestamp)"),
    time_bucket_to: Optional[str] = Query(None, description="End range (ISO timestamp)"),
    limit: int = Query(100, ge=1, le=1000),
    db: PostgresClient = Depends(get_db),
):
    conditions = ["cell_name = $1"]
    params: List[Any] = [cell_name]
    idx = 2

    if time_bucket_from:
        conditions.append(f"time_bucket >= ${idx}::timestamp")
        params.append(time_bucket_from)
        idx += 1
    if time_bucket_to:
        conditions.append(f"time_bucket <= ${idx}::timestamp")
        params.append(time_bucket_to)
        idx += 1

    query = f"""
        SELECT context_snapshot_id::text, cell_name, time_bucket,
               minio_path, created_at, updated_at
        FROM cell_context_snapshot
        WHERE {' AND '.join(conditions)}
        ORDER BY time_bucket DESC
        LIMIT ${idx}
    """
    params.append(limit)

    async with db.acquire() as conn:
        rows = await conn.fetch(query, *params)

    return [_row_to_dict(r) for r in rows]


@router.get(
    "/{context_snapshot_id}",
    response_model=SnapshotDetail,
    summary="Get full context snapshot",
    description=(
        "**Business question:** What is the complete operational context — KPIs, "
        "alarms, weather/event scores, static metadata, and command history — "
        "captured for a specific cell at a specific point in time? Use this to "
        "audit or replay the exact inputs that drove an ML model decision."
    ),
)
async def get_snapshot(context_snapshot_id: str, db: PostgresClient = Depends(get_db)):
    query = """
        SELECT context_snapshot_id::text, cell_name, time_bucket,
               metadata, common_sense, kpi, alarm, history_command,
               minio_path, created_at, updated_at
        FROM cell_context_snapshot
        WHERE context_snapshot_id = $1::uuid
    """
    async with db.acquire() as conn:
        row = await conn.fetchrow(query, context_snapshot_id)

    if not row:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Context snapshot not found"
        )
    return _row_to_dict(row)


@router.get(
    "/{context_snapshot_id}/kpi",
    response_model=Optional[Dict[str, Any]],
    summary="KPI payload of a snapshot",
    description=(
        "**Business question:** Which KPI metrics were recorded for this cell at "
        "snapshot time, and do any of them breach known thresholds that would "
        "justify an MRO or QoS intervention?"
    ),
)
async def get_snapshot_kpi(context_snapshot_id: str, db: PostgresClient = Depends(get_db)):
    return await _get_snapshot_field(context_snapshot_id, "kpi", db)


@router.get(
    "/{context_snapshot_id}/alarm",
    response_model=Optional[Dict[str, Any]],
    summary="Alarm payload of a snapshot",
    description=(
        "**Business question:** What alarm activity was present for this cell when "
        "the snapshot was captured? Which alarm types dominated, and does the "
        "severity distribution suggest an urgent intervention?"
    ),
)
async def get_snapshot_alarm(context_snapshot_id: str, db: PostgresClient = Depends(get_db)):
    return await _get_snapshot_field(context_snapshot_id, "alarm", db)


@router.get(
    "/{context_snapshot_id}/common-sense",
    response_model=Optional[Dict[str, Any]],
    summary="Common-sense context of a snapshot",
    description=(
        "**Business question:** What external factors (weather, local events, "
        "crowd-source scores) were present at snapshot time? Could any of these "
        "contextual signals explain the observed KPI degradation?"
    ),
)
async def get_snapshot_common_sense(
    context_snapshot_id: str, db: PostgresClient = Depends(get_db)
):
    return await _get_snapshot_field(context_snapshot_id, "common_sense", db)


@router.get(
    "/{context_snapshot_id}/history-command",
    response_model=Optional[Dict[str, Any]],
    summary="Command history payload of a snapshot",
    description=(
        "**Business question:** What configuration commands had been applied to this "
        "cell prior to this snapshot? Is this cell over-tuned or recently changed, "
        "which might warrant caution before issuing further commands?"
    ),
)
async def get_snapshot_history_command(
    context_snapshot_id: str, db: PostgresClient = Depends(get_db)
):
    return await _get_snapshot_field(context_snapshot_id, "history_command", db)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _get_snapshot_field(
    context_snapshot_id: str, field: str, db: PostgresClient
) -> Optional[Dict[str, Any]]:
    """Fetch a single JSONB field from a snapshot row."""
    query = f"""
        SELECT {field}
        FROM cell_context_snapshot
        WHERE context_snapshot_id = $1::uuid
    """
    async with db.acquire() as conn:
        row = await conn.fetchrow(query, context_snapshot_id)

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Context snapshot not found"
        )
    return _row_to_dict(row).get(field)


def _row_to_dict(row) -> Dict[str, Any]:
    """Convert asyncpg Record to a plain dict.

    - Casts datetime/date/UUID to strings.
    - Deserialises JSONB fields that asyncpg returns as raw JSON strings.
    """
    import json

    d = dict(row)
    for k, v in d.items():
        if hasattr(v, "isoformat"):               # datetime / date
            d[k] = v.isoformat()
        elif hasattr(v, "hex"):                   # UUID
            d[k] = str(v)
        elif isinstance(v, str) and v and v[0] in ("{", "["):
            try:
                d[k] = json.loads(v)
            except (json.JSONDecodeError, ValueError):
                pass
    return d
</file>

<file path="flux-new-reason/app/api/historical_alarm.py">
"""
Historical Alarm Data Extraction API.

Provides endpoints to extract historical alarm data based on time window.
Data is read from locally stored CSV files collected via collect_historical_alarm.py script.
"""

import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Optional

import pandas as pd
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/historical-alarm",
    tags=["historical-alarm"],
    responses={404: {"description": "Not found"}},
)

# Alarm data directory
ALARM_DATA_DIR = Path(__file__).parent.parent / "data" / "alarm"

# Pre-defined alarm columns
ALARM_COLUMNS = [
    "event_id",
    "event_name",
    "initial_instant",
    "trigger_instant",
    "source_name",
    "severity",
    "specific_problem",
    "additional_info",
]


class HistoricalAlarmRequest(BaseModel):
    """Request model for historical alarm extraction."""
    
    timestamp: str = Field(
        ...,
        description="Target timestamp in ISO format (e.g., '2024-01-15T14:30:00')",
        example="2024-01-15T14:30:00"
    )
    time_window_hours: float = Field(
        ...,
        description="Time window in hours to look back from timestamp",
        example=24.0,
        gt=0
    )
    source_names: Optional[List[str]] = Field(
        None,
        description="Optional list of source names (network elements) to filter",
        example=["SITE001", "SITE002"]
    )
    severities: Optional[List[str]] = Field(
        None,
        description="Optional list of severities to filter (e.g., 'CRITICAL', 'MAJOR', 'MINOR', 'WARNING')",
        example=["CRITICAL", "MAJOR"]
    )
    event_names: Optional[List[str]] = Field(
        None,
        description="Optional list of event names to filter",
        example=["RRC_CONNECTION_FAILURE", "HANDOVER_FAILURE"]
    )


class HistoricalAlarmResponse(BaseModel):
    """Response model for historical alarm extraction."""
    
    timestamp: str
    time_window_hours: float
    start_time: str
    end_time: str
    records_count: int
    alarm_columns: List[str]
    source_names_included: List[str]
    severities_included: List[str]
    data: List[dict]


class CurrentAlarmResponse(BaseModel):
    """Response model for current active alarm retrieval."""
    
    records_count: int
    alarm_columns: List[str]
    source_names_included: List[str]
    severities_included: List[str]
    data: List[dict]


@router.get("/current", response_model=CurrentAlarmResponse)
async def get_current_alarms(
    source_names: Optional[List[str]] = Query(
        None,
        description="Optional list of source names (network elements) to filter",
        example=["SITE001", "SITE002"]
    ),
    severities: Optional[List[str]] = Query(
        None,
        description="Optional list of severities to filter (e.g., 'CRITICAL', 'MAJOR', 'MINOR', 'WARNING')",
        example=["CRITICAL", "MAJOR"]
    ),
    event_names: Optional[List[str]] = Query(
        None,
        description="Optional list of event names to filter",
        example=["RRC_CONNECTION_FAILURE", "HANDOVER_FAILURE"]
    )
):
    """
    Get current active alarms from alarm_current.csv.
    
    This endpoint reads the alarm_current.csv file (collected via collect_historical_alarm_parquet.py)
    and returns active alarms with optional filtering by source name, severity, and event name.
    
    The file is populated by running:
        python scripts/collect_historical_alarm_parquet.py
    
    Note: If no alarm data is available, the CSV will be empty (0 rows) and this endpoint
    will return an empty result with records_count=0.
    
    Args:
        source_names: Optional list of source names to filter
        severities: Optional list of severities to filter
        event_names: Optional list of event names to filter
        
    Returns:
        CurrentAlarmResponse with current active alarm data
        
    Raises:
        HTTPException: If alarm_current.csv file is not found
    """
    alarm_file = ALARM_DATA_DIR / "alarm_current.csv"
    
    if not alarm_file.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Current alarm data not found at {alarm_file}. Run collect_historical_alarm_parquet.py to collect data."
        )
    
    try:
        df = pd.read_csv(alarm_file)
        
        # Filter to only include pre-defined columns that exist in the file
        available_columns = [col for col in ALARM_COLUMNS if col in df.columns]
        if available_columns:
            df = df[available_columns]
        
        # Apply optional filters
        if source_names:
            if 'source_name' in df.columns:
                df = df[df['source_name'].isin(source_names)]
        
        if severities:
            if 'severity' in df.columns:
                df = df[df['severity'].isin(severities)]
        
        if event_names:
            if 'event_name' in df.columns:
                df = df[df['event_name'].isin(event_names)]
        
        # Make a copy to avoid SettingWithCopyWarning
        df = df.copy()
        
        # Track metadata
        source_names_included = df['source_name'].unique().tolist() if 'source_name' in df.columns and not df.empty else []
        severities_included = df['severity'].unique().tolist() if 'severity' in df.columns and not df.empty else []
        
        # Convert datetime columns to string for JSON serialization
        for col in ['trigger_instant', 'initial_instant']:
            if col in df.columns:
                # Try to convert to datetime if not already
                try:
                    if not pd.api.types.is_datetime64_any_dtype(df[col]):
                        df[col] = pd.to_datetime(df[col], errors='coerce')
                    if pd.api.types.is_datetime64_any_dtype(df[col]):
                        df[col] = df[col].dt.strftime('%Y-%m-%d %H:%M:%S')
                except Exception as e:
                    logger.warning(f"Could not convert {col} to datetime: {e}")
        
        # Convert to list of dictionaries
        data_records = df.to_dict('records')
        
        return CurrentAlarmResponse(
            records_count=len(data_records),
            alarm_columns=ALARM_COLUMNS,
            source_names_included=source_names_included,
            severities_included=severities_included,
            data=data_records
        )
        
    except Exception as e:
        logger.error(f"Error reading alarm_current.csv: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error reading current alarm data: {str(e)}"
        )


@router.post("/extract", response_model=HistoricalAlarmResponse)
async def extract_historical_alarm(request: HistoricalAlarmRequest):
    """
    Extract historical alarm data within a time window.
    
    This endpoint:
    1. Determines date range from timestamp and time window
    2. Loads data from local CSV files for required dates
    3. Filters data by timestamp range and optional filters (source, severity, event name)
    4. Returns filtered alarm data as structured response
    
    Timestamp Field:
    - Uses 'trigger_instant' as the primary timestamp for filtering
    
    Args:
        request: HistoricalAlarmRequest with timestamp, time_window, and optional filters
        
    Returns:
        HistoricalAlarmResponse with filtered alarm data
        
    Raises:
        HTTPException: If data files are missing or timestamp format is invalid
    """
    # Parse timestamp
    try:
        end_time = datetime.fromisoformat(request.timestamp)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid timestamp format. Use ISO format (e.g., '2024-01-15T14:30:00')"
        )
    
    # Calculate start time
    start_time = end_time - timedelta(hours=request.time_window_hours)
    
    # Determine date range for file loading
    dates_to_load = _get_date_range(start_time, end_time)
    
    # Load and combine data from multiple files
    try:
        combined_df = _load_alarm_files(dates_to_load)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"Alarm data not found: {str(e)}"
        )
    
    # Filter by timestamp range (using trigger_instant)
    if 'trigger_instant' in combined_df.columns:
        try:
            combined_df['trigger_instant'] = pd.to_datetime(combined_df['trigger_instant'], errors='coerce')
            filtered_df = combined_df[
                (combined_df['trigger_instant'] >= start_time) &
                (combined_df['trigger_instant'] <= end_time)
            ]
            # Drop rows with NaT (invalid timestamps)
            filtered_df = filtered_df.dropna(subset=['trigger_instant'])
        except Exception as e:
            logger.error(f"Error parsing trigger_instant: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Error parsing trigger_instant column: {str(e)}"
            )
    else:
        # Fallback to initial_instant if trigger_instant not available
        if 'initial_instant' in combined_df.columns:
            try:
                combined_df['initial_instant'] = pd.to_datetime(combined_df['initial_instant'], errors='coerce')
                filtered_df = combined_df[
                    (combined_df['initial_instant'] >= start_time) &
                    (combined_df['initial_instant'] <= end_time)
                ]
                # Drop rows with NaT (invalid timestamps)
                filtered_df = filtered_df.dropna(subset=['initial_instant'])
            except Exception as e:
                logger.error(f"Error parsing initial_instant: {e}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Error parsing initial_instant column: {str(e)}"
                )
        else:
            raise HTTPException(
                status_code=500,
                detail="No valid timestamp column found in alarm data"
            )
    
    # Apply optional filters
    if request.source_names:
        if 'source_name' in filtered_df.columns:
            filtered_df = filtered_df[filtered_df['source_name'].isin(request.source_names)]
    
    if request.severities:
        if 'severity' in filtered_df.columns:
            filtered_df = filtered_df[filtered_df['severity'].isin(request.severities)]
    
    if request.event_names:
        if 'event_name' in filtered_df.columns:
            filtered_df = filtered_df[filtered_df['event_name'].isin(request.event_names)]
    
    # Make a copy to avoid SettingWithCopyWarning
    filtered_df = filtered_df.copy()
    
    # Track metadata
    source_names_included = filtered_df['source_name'].unique().tolist() if 'source_name' in filtered_df.columns and not filtered_df.empty else []
    severities_included = filtered_df['severity'].unique().tolist() if 'severity' in filtered_df.columns and not filtered_df.empty else []
    
    # Convert datetime columns to string for JSON serialization
    for col in ['trigger_instant', 'initial_instant']:
        if col in filtered_df.columns:
            # Check if column is actually datetime type before using .dt accessor
            if pd.api.types.is_datetime64_any_dtype(filtered_df[col]):
                filtered_df[col] = filtered_df[col].dt.strftime('%Y-%m-%d %H:%M:%S')
    
    # Convert to list of dictionaries
    data_records = filtered_df.to_dict('records')
    
    return HistoricalAlarmResponse(
        timestamp=request.timestamp,
        time_window_hours=request.time_window_hours,
        start_time=start_time.isoformat(),
        end_time=end_time.isoformat(),
        records_count=len(data_records),
        alarm_columns=ALARM_COLUMNS,
        source_names_included=source_names_included,
        severities_included=severities_included,
        data=data_records
    )


@router.get("/columns")
async def get_alarm_columns():
    """
    Get the pre-defined alarm columns.
    
    Returns:
        Dictionary with alarm column list
    """
    return {
        "columns": ALARM_COLUMNS
    }


@router.get("/statistics")
async def get_alarm_statistics(
    date: str = Query(..., description="Date in format YYYY-MM-DD", example="2024-01-15")
):
    """
    Get statistics for alarm data on a specific date.
    
    Returns counts by severity, event name, and source name.
    
    Args:
        date: Date string in YYYY-MM-DD format
        
    Returns:
        Statistics dictionary with counts and breakdowns
    """
    try:
        datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD"
        )
    
    file_path = ALARM_DATA_DIR / f"alarm_{date}.csv"
    
    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"No alarm data found for date {date}"
        )
    
    try:
        df = pd.read_csv(file_path)
        
        stats = {
            "date": date,
            "total_alarms": len(df),
            "by_severity": df['severity'].value_counts().to_dict() if 'severity' in df.columns else {},
            "by_event_name": df['event_name'].value_counts().head(10).to_dict() if 'event_name' in df.columns else {},
            "unique_sources": df['source_name'].nunique() if 'source_name' in df.columns else 0,
            "columns_available": df.columns.tolist()
        }
        
        return stats
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading alarm data: {str(e)}"
        )


def _get_date_range(start_time: datetime, end_time: datetime) -> List[str]:
    """
    Get list of dates (YYYY-MM-DD) between start and end time.
    
    Args:
        start_time: Start datetime
        end_time: End datetime
        
    Returns:
        List of date strings in YYYY-MM-DD format
    """
    dates = []
    current = start_time.date()
    end_date = end_time.date()
    
    while current <= end_date:
        dates.append(current.strftime("%Y-%m-%d"))
        current += timedelta(days=1)
    
    return dates


def _load_alarm_files(dates: List[str]) -> pd.DataFrame:
    """
    Load and combine alarm data from multiple CSV files.
    
    Args:
        dates: List of date strings (YYYY-MM-DD) to load
        
    Returns:
        Combined DataFrame with alarm data
        
    Raises:
        FileNotFoundError: If any required file is missing
    """
    dfs = []
    missing_files = []
    
    for date in dates:
        file_path = ALARM_DATA_DIR / f"alarm_{date}.csv"
        
        if not file_path.exists():
            missing_files.append(str(file_path))
            continue
        
        try:
            # Read CSV file - load all columns, then filter to ALARM_COLUMNS if they exist
            df = pd.read_csv(file_path)
            
            # Filter to only include pre-defined columns that exist in the file
            available_columns = [col for col in ALARM_COLUMNS if col in df.columns]
            if available_columns:
                df = df[available_columns]
            
            dfs.append(df)
        except Exception as e:
            logger.warning(f"Error reading {file_path}: {e}")
            continue
    
    if not dfs:
        if missing_files:
            raise FileNotFoundError(
                f"No alarm data files found for dates {dates}. "
                f"Missing files: {missing_files[:3]}..."
            )
        else:
            raise FileNotFoundError(f"Failed to load any alarm data for dates {dates}")
    
    # Log if some files are missing
    if missing_files:
        logger.warning(f"Missing {len(missing_files)} alarm files: {missing_files[:3]}...")
    
    # Combine all dataframes
    combined_df = pd.concat(dfs, ignore_index=True)
    
    return combined_df
</file>

<file path="flux-new-reason/app/api/historical_kpi.py">
"""
Historical KPI Data Extraction API.

Provides endpoints to extract historical KPI data based on task type and time window.
Data is read from locally stored CSV files collected via collect_historical_kpi.py script.
"""

import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Optional

import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/historical-kpi",
    tags=["historical-kpi"],
    responses={404: {"description": "Not found"}},
)

# KPI data directory
KPI_DATA_DIR = Path(__file__).parent.parent / "data" / "KPI" / "v3"

# Task type to KPI columns mapping (aligned with evaluation.md)
TASK_KPI_MAPPING = {
    "MRO": [
        "datetime", "ne_name", "cellname",
        "TU PRB DL (%)",
        "NR DL User Throughput Mbps (Mbps)",
        "EN-DC CDR (%)",
        "PSCell Change Inter-SgNB Att (#)",
        "PSCell Change Inter-SgNB Succ (#)",
        "PSCell Change Intra-SgNB Att (#)",
        "PSCell Change Intra-SgNB Succ (#)",
    ],
    "ES": [
        "datetime", "ne_name", "cellname",
        "TU PRB DL (%)",
        "NR DL User Throughput Mbps (Mbps)",
        "EN-DC CDR (%)",
        "PSCell Change Inter-SgNB Att (#)",
        "PSCell Change Inter-SgNB Succ (#)",
        "PSCell Change Intra-SgNB Att (#)",
        "PSCell Change Intra-SgNB Succ (#)",
        "Power Consumption (Wh)",
        "TU PRB UL (%)",
        "Max RRC Connected SA User (UE)",
    ],
    "all": [
        "datetime", "ne_name", "cellname",
        "Average Latency DL MAC (ms)",
        "EN-DC CDR (%)",
        "KV2_DL Packet Loss (%)",
        "KV2_UL Packet Loss (%)",
        "Max RRC Connected SA User (UE)",
        "NR DL User Throughput Mbps (Mbps)",
        "NR UL User Throughput (Mbps) (Mbps)",
        "PSCell Change Inter-SgNB Att (#)",
        "PSCell Change Inter-SgNB Succ (#)",
        "PSCell Change Intra-SgNB Att (#)",
        "PSCell Change Intra-SgNB Succ (#)",
        "TU PRB DL (%)",
        "TU PRB UL (%)",
        "Power Consumption (Wh)",
    ],
}


class HistoricalKPIRequest(BaseModel):
    """Request model for historical KPI extraction."""
    
    timestamp: str = Field(
        ...,
        description="Target timestamp in ISO format (e.g., '2024-01-15T14:30:00')",
        example="2024-01-15T14:30:00"
    )
    time_window_hours: float = Field(
        ...,
        description="Time window in hours to look back from timestamp",
        example=24.0,
        gt=0
    )
    task_type: str = Field(
        ...,
        description="Task type: 'MRO' (Mobility Robustness Optimization) or 'ES' (Energy Saving)",
        example="MRO"
    )
    ne_names: Optional[List[str]] = Field(
        None,
        description="Optional list of network element names to filter",
        example=["SITE001", "SITE002"]
    )
    cellnames: Optional[List[str]] = Field(
        None,
        description="Optional list of cell names to filter",
        example=["CELL001", "CELL002"]
    )
    aggregate: bool = Field(
        False,
        description="If True, aggregate metrics across all selected cells using mean"
    )


class HistoricalKPIResponse(BaseModel):
    """Response model for historical KPI extraction."""
    
    task_type: str
    timestamp: str
    time_window_hours: float
    start_time: str
    end_time: str
    records_count: int
    kpi_columns: List[str]
    aggregated: bool
    cells_included: List[str]
    data: List[dict]


@router.post("/extract", response_model=HistoricalKPIResponse)
async def extract_historical_kpi(request: HistoricalKPIRequest):
    """
    Extract historical KPI data for MRO or ES optimization tasks within a time window.
    
    This endpoint:
    1. Validates task type (MRO/ES) and maps to relevant KPI columns per evaluation.md
    2. Determines date range from timestamp and time window
    3. Loads data from local CSV files for required dates
    4. Filters data by timestamp range and optional site/cell lists
    5. Optionally aggregates metrics across cells using mean
    6. Calculates derived metrics (PSCell success rates)
    7. Returns filtered KPI data as structured response
    
    Task Types:
    - **MRO** (Mobility Robustness Optimization): Handover and mobility KPIs
    - **ES** (Energy Saving): Energy efficiency and load KPIs
    - **all**: All available KPIs from kpi_list_v2.txt
    
    Args:
        request: HistoricalKPIRequest with timestamp, time_window, task_type, filters, aggregate
        
    Returns:
        HistoricalKPIResponse with filtered/aggregated KPI data
        
    Raises:
        HTTPException: If task type is invalid or data files are missing
    """
    # Validate task type
    if request.task_type not in TASK_KPI_MAPPING:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid task_type. Must be one of: {list(TASK_KPI_MAPPING.keys())}"
        )
    
    # Parse timestamp
    try:
        end_time = datetime.fromisoformat(request.timestamp)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid timestamp format. Use ISO format (e.g., '2024-01-15T14:30:00')"
        )
    
    # Calculate start time
    start_time = end_time - timedelta(hours=request.time_window_hours)
    
    # Get required KPI columns
    kpi_columns = TASK_KPI_MAPPING[request.task_type]
    
    # Determine date range for file loading
    dates_to_load = _get_date_range(start_time, end_time)
    
    # Load and combine data from multiple files
    try:
        combined_df = _load_kpi_files(dates_to_load, kpi_columns)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=404,
            detail=f"KPI data not found: {str(e)}"
        )
    
    # Filter by timestamp range
    combined_df['datetime'] = pd.to_datetime(combined_df['datetime'])
    filtered_df = combined_df[
        (combined_df['datetime'] >= start_time) &
        (combined_df['datetime'] <= end_time)
    ]
    
    # Apply optional filters for sites/cells
    if request.ne_names:
        filtered_df = filtered_df[filtered_df['ne_name'].isin(request.ne_names)]
    
    if request.cellnames:
        filtered_df = filtered_df[filtered_df['cellname'].isin(request.cellnames)]
    
    # Track cells included
    cells_included = filtered_df['cellname'].unique().tolist() if not filtered_df.empty else []
    
    # Aggregate if requested
    if request.aggregate and not filtered_df.empty:
        filtered_df = _aggregate_kpi_data(filtered_df)
    
    # Calculate derived metrics (success rates)
    filtered_df = _calculate_derived_metrics(filtered_df)
    
    # Convert to list of dictionaries
    filtered_df['datetime'] = filtered_df['datetime'].dt.strftime('%Y-%m-%d %H:%M:%S')
    data_records = filtered_df.to_dict('records')
    
    return HistoricalKPIResponse(
        task_type=request.task_type,
        timestamp=request.timestamp,
        time_window_hours=request.time_window_hours,
        start_time=start_time.isoformat(),
        end_time=end_time.isoformat(),
        records_count=len(data_records),
        kpi_columns=kpi_columns,
        aggregated=request.aggregate,
        cells_included=cells_included,
        data=data_records
    )


@router.get("/task-types")
async def get_task_types():
    """
    Get available task types and their associated KPI columns.
    
    Returns:
        Dictionary mapping task types to KPI column lists
    """
    return {
        "task_types": list(TASK_KPI_MAPPING.keys()),
        "mappings": TASK_KPI_MAPPING
    }


def _get_date_range(start_time: datetime, end_time: datetime) -> List[str]:
    """
    Get list of dates (YYYY-MM-DD) between start and end time.
    
    Args:
        start_time: Start datetime
        end_time: End datetime
        
    Returns:
        List of date strings in YYYY-MM-DD format
    """
    dates = []
    current = start_time.date()
    end_date = end_time.date()
    
    while current <= end_date:
        dates.append(current.strftime("%Y-%m-%d"))
        current += timedelta(days=1)
    
    return dates


def _load_kpi_files(dates: List[str], columns: List[str]) -> pd.DataFrame:
    """
    Load and combine KPI data from multiple CSV files.
    
    Args:
        dates: List of date strings (YYYY-MM-DD) to load
        columns: List of KPI columns to extract
        
    Returns:
        Combined DataFrame with specified columns
        
    Raises:
        FileNotFoundError: If any required file is missing
    """
    dfs = []
    missing_files = []
    
    for date in dates:
        file_path = KPI_DATA_DIR / f"kpi_5min_{date}.csv"
        
        if not file_path.exists():
            missing_files.append(str(file_path))
            continue
        
        try:
            # Read only required columns for efficiency
            df = pd.read_csv(file_path, usecols=lambda col: col in columns)
            dfs.append(df)
        except Exception as e:
            logger.warning(f"Error reading {file_path}: {e}")
            continue
    
    if not dfs:
        if missing_files:
            raise FileNotFoundError(
                f"No KPI data files found for dates {dates}. "
                f"Missing files: {missing_files[:3]}..."
            )
        else:
            raise FileNotFoundError(f"Failed to load any KPI data for dates {dates}")
    
    # Log if some files are missing
    if missing_files:
        logger.warning(f"Missing {len(missing_files)} KPI files: {missing_files[:3]}...")
    
    # Combine all dataframes
    combined_df = pd.concat(dfs, ignore_index=True)
    
    return combined_df


def _aggregate_kpi_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Aggregate KPI data across multiple cells using mean for numeric columns.
    Groups by datetime and computes mean of all numeric KPIs.
    
    Args:
        df: DataFrame with KPI data
        
    Returns:
        Aggregated DataFrame with mean values per timestamp
    """
    # Identify numeric columns (exclude datetime, ne_name, cellname)
    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    
    # Group by datetime and aggregate
    agg_dict = {col: 'mean' for col in numeric_cols}
    aggregated = df.groupby('datetime', as_index=False).agg(agg_dict)
    
    # Add metadata columns
    aggregated['ne_name'] = 'AGGREGATED'
    aggregated['cellname'] = 'AGGREGATED'
    
    return aggregated


def _calculate_derived_metrics(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate derived metrics like success rates from raw counters.
    
    Adds:
    - PSCell Change Inter-SgNB SR (%) = Succ / Att * 100
    - PSCell Change Intra-SgNB SR (%) = Succ / Att * 100
    
    Args:
        df: DataFrame with KPI data
        
    Returns:
        DataFrame with added derived metrics
    """
    df = df.copy()
    
    # Calculate Inter-SgNB Success Rate
    if 'PSCell Change Inter-SgNB Succ (#)' in df.columns and 'PSCell Change Inter-SgNB Att (#)' in df.columns:
        df['PSCell Change Inter-SgNB SR (%)'] = np.where(
            df['PSCell Change Inter-SgNB Att (#)'] > 0,
            (df['PSCell Change Inter-SgNB Succ (#)'] / df['PSCell Change Inter-SgNB Att (#)']) * 100,
            np.nan
        )
    
    # Calculate Intra-SgNB Success Rate
    if 'PSCell Change Intra-SgNB Succ (#)' in df.columns and 'PSCell Change Intra-SgNB Att (#)' in df.columns:
        df['PSCell Change Intra-SgNB SR (%)'] = np.where(
            df['PSCell Change Intra-SgNB Att (#)'] > 0,
            (df['PSCell Change Intra-SgNB Succ (#)'] / df['PSCell Change Intra-SgNB Att (#)']) * 100,
            np.nan
        )
    
    return df
</file>

<file path="flux-new-reason/app/api/intent.py">
"""
Intent Management API.

Exposes read-oriented endpoints over the vulcan agent database schema (spec v3).
Each endpoint is anchored to a concrete operational/business question.
"""

import json
import logging
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel

from icflow.utils.postgres import get_postgres_client, PostgresClient

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/intents",
    tags=["intents"],
    responses={404: {"description": "Not found"}},
)


# ---------------------------------------------------------------------------
# Dependency
# ---------------------------------------------------------------------------

async def get_db() -> PostgresClient:
    client = get_postgres_client()
    await client.connect()
    return client


# ---------------------------------------------------------------------------
# Response models
# ---------------------------------------------------------------------------

class IntentSummary(BaseModel):
    """Row from the intent_summary view."""
    intent_id: str
    actor: str
    task_type: str
    target_type: str
    target_count: int
    start_time: Optional[str]
    end_time: Optional[str]
    execution_mode: Optional[str]
    has_trigger: bool
    has_kpi: bool
    duration_hours: Optional[float]
    time_bucket: str
    created_at: str


class IntentDetail(IntentSummary):
    """Full intent row with raw trigger/kpi payloads."""
    trigger: Optional[Dict[str, Any]]
    kpi: Optional[Dict[str, Any]]
    note: Optional[str]


class TargetCell(BaseModel):
    """Cell targeted by an intent, with its decision when available."""
    cell_name: str
    sequence_order: int
    decision: Optional[bool]
    decision_score: Optional[float]


class CellDecision(BaseModel):
    """ML model decision for a single cell within an intent."""
    cell_name: str
    decision: bool
    decision_score: float
    explain_path: Optional[List[Dict[str, Any]]]
    model_version: Optional[str]
    context_snapshot_id: Optional[str]
    created_at: str


class DispatchRecord(BaseModel):
    """Tactical dispatch record for an intent."""
    dispatch_id: str
    task_type: str
    tactical_agent_endpoint: str
    target_cells: List[str]
    tactical_response: Optional[Dict[str, Any]]
    created_at: str
    updated_at: str


class IntentSnapshotSummary(BaseModel):
    """Cell context snapshot linked to a target cell within an intent."""
    context_snapshot_id: str
    cell_name: str
    time_bucket: str
    minio_path: Optional[str]
    created_at: str


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get(
    "",
    response_model=List[IntentSummary],
    summary="List intent requests",
    description=(
        "**Business question:** Which intents are active in the system, "
        "broken down by task type and actor? Useful for an operational dashboard."
    ),
)
async def list_intents(
    task_type: Optional[str] = Query(None, description="Filter by task type: MRO, ES, QoS, TS"),
    actor: Optional[str] = Query(None, description="Filter by actor (agent or user e-mail)"),
    date: Optional[str] = Query(None, description="Filter by time_bucket date (YYYY-MM-DD)"),
    limit: int = Query(50, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: PostgresClient = Depends(get_db),
):
    conditions: List[str] = []
    params: List[Any] = []
    idx = 1

    if task_type:
        conditions.append(f"task_type = ${idx}")
        params.append(task_type.upper())
        idx += 1
    if actor:
        conditions.append(f"actor ILIKE ${idx}")
        params.append(f"%{actor}%")
        idx += 1
    if date:
        conditions.append(f"time_bucket::date = ${idx}::date")
        params.append(date)
        idx += 1

    where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
    query = f"""
        SELECT intent_id, actor, task_type, target_type, target_count,
               start_time, end_time, execution_mode, has_trigger, has_kpi,
               duration_hours, time_bucket, created_at
        FROM intent_summary
        {where}
        ORDER BY created_at DESC
        LIMIT ${idx} OFFSET ${idx + 1}
    """
    params += [limit, offset]

    async with db.acquire() as conn:
        rows = await conn.fetch(query, *params)

    return [_row_to_dict(r) for r in rows]


@router.get(
    "/{intent_id}",
    response_model=IntentDetail,
    summary="Get intent detail",
    description=(
        "**Business question:** What is the full configuration of this intent — "
        "its target scope, scheduling mode, trigger conditions, and KPI targets?"
    ),
)
async def get_intent(intent_id: str, db: PostgresClient = Depends(get_db)):
    query = """
        SELECT ir.intent_id, ir.actor, ir.task_type, ir.target_type,
               ir.start_time, ir.end_time, ir.execution_mode,
               ir.trigger, ir.kpi, ir.note, ir.time_bucket, ir.created_at,
               COUNT(DISTINCT itc.cell_name)                            AS target_count,
               (ir.trigger IS NOT NULL)                                 AS has_trigger,
               (ir.kpi    IS NOT NULL)                                  AS has_kpi,
               EXTRACT(EPOCH FROM (ir.end_time - ir.start_time)) / 3600 AS duration_hours
        FROM intent_request ir
        LEFT JOIN intent_target_cells itc ON ir.intent_id = itc.intent_id
        WHERE ir.intent_id = $1
        GROUP BY ir.intent_id
    """
    async with db.acquire() as conn:
        row = await conn.fetchrow(query, intent_id)

    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intent not found")

    return _row_to_dict(row)


@router.get(
    "/{intent_id}/cells",
    response_model=List[TargetCell],
    summary="List target cells with decisions",
    description=(
        "**Business question:** Of all cells targeted by this intent, "
        "which were approved vs. rejected by the ML model — and at what confidence?"
    ),
)
async def list_intent_cells(intent_id: str, db: PostgresClient = Depends(get_db)):
    await _require_intent(intent_id, db)

    query = """
        SELECT itc.cell_name, itc.sequence_order,
               cd.decision, cd.decision_score
        FROM intent_target_cells itc
        LEFT JOIN cell_decision cd
               ON cd.intent_id = itc.intent_id AND cd.cell_name = itc.cell_name
        WHERE itc.intent_id = $1
        ORDER BY itc.sequence_order
    """
    async with db.acquire() as conn:
        rows = await conn.fetch(query, intent_id)

    return [_row_to_dict(r) for r in rows]


@router.get(
    "/{intent_id}/decisions",
    response_model=List[CellDecision],
    summary="Cell-level ML decisions",
    description=(
        "**Business question:** Which cells did the model approve for intervention, "
        "what reasoning path was taken, and which model version scored them?"
    ),
)
async def list_decisions(
    intent_id: str,
    approved_only: bool = Query(False, description="Return only decision=true cells"),
    db: PostgresClient = Depends(get_db),
):
    await _require_intent(intent_id, db)

    conditions = ["intent_id = $1"]
    params: List[Any] = [intent_id]
    if approved_only:
        conditions.append("decision = TRUE")

    query = f"""
        SELECT cell_name, decision, decision_score,
               explain_path, model_version, context_snapshot_id, created_at
        FROM cell_decision
        WHERE {' AND '.join(conditions)}
        ORDER BY decision_score DESC
    """
    async with db.acquire() as conn:
        rows = await conn.fetch(query, *params)

    return [_row_to_dict(r) for r in rows]


@router.get(
    "/{intent_id}/dispatch",
    response_model=List[DispatchRecord],
    summary="Tactical dispatch records",
    description=(
        "**Business question:** Was the tactical agent dispatched for this intent, "
        "to which endpoint, and what was the response payload?"
    ),
)
async def get_dispatch(intent_id: str, db: PostgresClient = Depends(get_db)):
    await _require_intent(intent_id, db)

    query = """
        SELECT dispatch_id, task_type, tactical_agent_endpoint,
               target_cells, tactical_response, created_at, updated_at
        FROM tactical_dispatch
        WHERE intent_id = $1
        ORDER BY created_at DESC
    """
    async with db.acquire() as conn:
        rows = await conn.fetch(query, intent_id)

    return [_row_to_dict(r) for r in rows]


@router.get(
    "/{intent_id}/snapshots",
    response_model=List[IntentSnapshotSummary],
    summary="Context snapshots for intent target cells",
    description=(
        "**Business question:** At the time this intent was evaluated, what operational "
        "context snapshots were captured for each of its target cells? Use this to audit "
        "the exact data inputs — KPIs, alarms, external signals — that were available to "
        "the ML model when it produced its cell-level decisions."
    ),
)
async def list_intent_snapshots(
    intent_id: str,
    db: PostgresClient = Depends(get_db),
):
    await _require_intent(intent_id, db)

    query = """
        SELECT ccs.context_snapshot_id::text, ccs.cell_name, ccs.time_bucket,
               ccs.minio_path, ccs.created_at
        FROM intent_target_cells itc
        JOIN cell_context_snapshot ccs
               ON ccs.cell_name = itc.cell_name
        JOIN intent_request ir ON ir.intent_id = itc.intent_id
        WHERE itc.intent_id = $1
          AND ccs.time_bucket = ir.time_bucket
        ORDER BY itc.sequence_order
    """
    async with db.acquire() as conn:
        rows = await conn.fetch(query, intent_id)

    return [_row_to_dict(r) for r in rows]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _require_intent(intent_id: str, db: PostgresClient) -> None:
    """Raise 404 if intent_id does not exist."""
    async with db.acquire() as conn:
        exists = await conn.fetchval(
            "SELECT 1 FROM intent_request WHERE intent_id = $1", intent_id
        )
    if not exists:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Intent not found")


def _row_to_dict(row) -> Dict[str, Any]:
    """Convert asyncpg Record to a plain dict.

    - Casts datetime/date to ISO strings.
    - Deserialises JSONB fields that asyncpg returns as raw JSON strings.
    """
    d = dict(row)
    for k, v in d.items():
        if hasattr(v, "isoformat"):          # datetime / date
            d[k] = v.isoformat()
        elif isinstance(v, str) and v and v[0] in ("{", "["):
            try:
                d[k] = json.loads(v)
            except (json.JSONDecodeError, ValueError):
                pass
    return d
</file>

<file path="flux-new-reason/app/api/network_scan.py">
"""
Network Scan API endpoint.

This endpoint provides daily network scanning functionality:
- Scans all 36 default cells (no cell selection required)
- Extracts features for MRO and ES task types
- Returns dataframes directly (no file saving)
"""

import logging
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
import ulid

from icflow.schemas import IntentObject, TaskType
from icflow.extract_features import extract_features_batch

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/network-scan",
    tags=["network-scan"],
    responses={404: {"description": "Not found"}},
)


# Default cell list for network scanning
DEFAULT_CELLS = [
    'gHM00356_10n411', 'gHM00356_20n411', 'gHM00356_30n411',
    'gHM00293_10n411', 'gHM00293_20n411', 'gHM00293_30n411',
    'gHM00072_10n411', 'gHM00072_20n411', 'gHM00072_30n411',
    'gKH00788_10n411', 'gKH00788_20n411', 'gKH00788_30n411',
    'gKH00505_10n411', 'gKH00505_20n411', 'gKH00505_30n411',
    'gKH00472_10n411', 'gKH00472_20n411', 'gKH00472_30n411',
    'gKH00412_10n411', 'gKH00412_20n411', 'gKH00412_30n411',
    'gKH00243_10n411', 'gKH00243_20n411', 'gKH00243_30n411',
    'gKH00231_10n411', 'gKH00231_20n411', 'gKH00231_30n411',
    'gKH00190_10n411', 'gKH00190_20n411', 'gKH00190_30n411',
    'gKH00112_10n411', 'gKH00112_20n411', 'gKH00112_30n411',
    'gKH00018_10n411', 'gKH00018_20n411', 'gKH00018_30n411'
]


class NetworkScanRequest(BaseModel):
    """Request model for network scan."""
    
    timestamp: Optional[str] = Field(
        default=None,
        description="Target timestamp for scan (ISO format: 2024-01-15T10:00). If not provided, uses current time."
    )
    enable_web_search: bool = Field(
        default=False,
        description="Enable web search for weather/events (slower but more accurate)"
    )


class NetworkScanResponse(BaseModel):
    """Response model for network scan."""
    
    scan_time: str = Field(description="When the scan was executed")
    target_timestamp: str = Field(description="Target timestamp for the scan")
    total_cells: int = Field(description="Number of cells scanned")
    mro_features: List[Dict[str, Any]] = Field(description="MRO features for each cell")
    es_features: List[Dict[str, Any]] = Field(description="ES features for each cell")
    summary: Dict[str, Any] = Field(description="Summary statistics")


def create_scan_intents(
    cells: List[str],
    timestamp: str,
    tasks: List[TaskType] = None
) -> List[IntentObject]:
    """
    Create intent objects for network scanning.
    
    Args:
        cells: List of cell names to scan
        timestamp: ISO format timestamp for the scan
        tasks: List of task types (default: [MRO, ES])
    
    Returns:
        List of IntentObject instances (one per cell per task)
    """
    if tasks is None:
        tasks = [TaskType.MRO, TaskType.ES]
    
    intents = []
    for cell in cells:
        for task in tasks:
            intent = IntentObject(
                intent_id=str(ulid.new()),
                actor="api_scanner",
                task_type=task,
                target_type="cell",
                target_id=[cell],
                start_time=timestamp
            )
            intents.append(intent)
    
    return intents


@router.post("/scan", response_model=NetworkScanResponse)
async def scan_network(request: NetworkScanRequest):
    """
    Scan all network cells and return extracted features.
    
    This endpoint:
    1. Scans all 36 default cells (no cell input required)
    2. Extracts features for MRO and ES task types
    3. Returns dataframes as JSON (no file saving)
    
    Args:
        request: Optional timestamp and web search settings
        
    Returns:
        NetworkScanResponse with MRO and ES features
    """
    try:
        # Use current time if timestamp not provided
        timestamp = request.timestamp or datetime.now().isoformat()
        
        logger.info(f"🔍 [SCAN] Starting network scan")
        logger.info(f"  - Timestamp: {timestamp}")
        logger.info(f"  - Cells: {len(DEFAULT_CELLS)}")
        logger.info(f"  - Web search: {request.enable_web_search}")
        
        # Create intents
        logger.info("📝 [SCAN] Creating scan intents...")
        intents = create_scan_intents(DEFAULT_CELLS, timestamp)
        logger.info(f"  ✓ Created {len(intents)} intents")
        
        # Get KPI directory
        kpi_dir = Path(__file__).parent.parent.parent / "app" / "data" / "KPI" / "v3"
        
        if not kpi_dir.exists():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"KPI directory not found: {kpi_dir}"
            )
        
        # Extract features
        logger.info("⚙️ [SCAN] Extracting features...")
        df_mro, df_es = await extract_features_batch(
            intents,
            kpi_dir,
            enable_web_search=request.enable_web_search,
            verbose=False,
            show_progress=False
        )
        
        # Convert DataFrames to list of dicts
        mro_features = df_mro.to_dict('records') if len(df_mro) > 0 else []
        es_features = df_es.to_dict('records') if len(df_es) > 0 else []
        
        logger.info(f"✓ [SCAN] Extraction complete:")
        logger.info(f"  - MRO features: {len(mro_features)} cells")
        logger.info(f"  - ES features: {len(es_features)} cells")
        
        # Calculate summary statistics
        summary = {
            "total_intents": len(intents),
            "mro_extracted": len(mro_features),
            "es_extracted": len(es_features),
            "web_search_enabled": request.enable_web_search
        }
        
        # Add key statistics if features exist
        if len(mro_features) > 0 and 'Handover Failure Pressure' in mro_features[0]:
            high_hf = sum(1 for f in mro_features if f.get('Handover Failure Pressure', 0) > 0.03)
            med_hf = sum(1 for f in mro_features 
                        if 0.02 < f.get('Handover Failure Pressure', 0) <= 0.03)
            summary['mro_stats'] = {
                'high_hf_pressure': high_hf,
                'medium_hf_pressure': med_hf
            }
        
        if len(es_features) > 0 and 'Persistent Low Load Score' in es_features[0]:
            low_load = sum(1 for f in es_features if f.get('Persistent Low Load Score', 0) > 0.7)
            summary['es_stats'] = {
                'persistent_low_load': low_load
            }
        
        return NetworkScanResponse(
            scan_time=datetime.now().isoformat(),
            target_timestamp=timestamp,
            total_cells=len(DEFAULT_CELLS),
            mro_features=mro_features,
            es_features=es_features,
            summary=summary
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Network scan error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Network scan failed: {str(e)}"
        )


@router.get("/cells")
async def get_default_cells():
    """
    Get the list of default cells used for scanning.
    
    Returns:
        List of cell names
    """
    return {
        "total": len(DEFAULT_CELLS),
        "cells": DEFAULT_CELLS
    }
</file>

<file path="flux-new-reason/app/api/plan.py">
"""
Plan Data API.

Provides endpoints to load plan data from MinIO for different task types (MRO, ES).
"""

import json
import logging
import tempfile
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any, Dict

import pandas as pd
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.core.s3 import S3Client

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/plan",
    tags=["plan"],
    responses={404: {"description": "Not found"}},
)


class TaskType(str, Enum):
    """Supported task types for plan data."""
    MRO = "MRO"
    ES = "ES"


class PlanRequest(BaseModel):
    """Request model for plan data retrieval."""
    
    task_type: TaskType = Field(
        ...,
        description="Task type (MRO or ES)",
        example="MRO"
    )
    date: str = Field(
        ...,
        description="Date in YYYY-MM-DD format",
        example="2024-01-15"
    )


class PlanResponse(BaseModel):
    """Response model for plan data."""
    
    task_type: str
    date: str
    data: Dict[str, Any]


@router.post("/load", response_model=PlanResponse)
async def load_plan(request: PlanRequest):
    """
    Load plan data from MinIO based on task type and date.
    
    - **MRO**: Returns cell_names JSON object and config_plan CSV table
    - **ES**: Returns schedule CSV table and forecast CSV table
    """
    try:
        # Initialize S3 client
        s3_client = S3Client(endpoint="https://172.20.1.109:30444")
        bucket_name = "planes"
        task_prefix = request.task_type.value.lower()
        
        # Parse and format date
        try:
            date_obj = datetime.strptime(request.date, "%Y-%m-%d")
            date_str = date_obj.strftime("%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid date format. Expected YYYY-MM-DD, got {request.date}"
            )
        
        result_data = {}
        
        if request.task_type == TaskType.MRO:
            # Load MRO data: cell_names JSON and config_plan CSV
            with tempfile.TemporaryDirectory() as tmpdir:
                tmpdir_path = Path(tmpdir)
                
                # Load cell_names JSON
                cell_names_key = f"{task_prefix}/cell_names_{date_str}.json"
                cell_names_file = tmpdir_path / f"cell_names_{date_str}.json"
                try:
                    s3_client.download_file(bucket_name, cell_names_key, str(cell_names_file))
                    with open(cell_names_file, 'r') as f:
                        result_data['cell_names'] = json.load(f)
                except Exception as e:
                    logger.error(f"Failed to load {cell_names_key}: {e}")
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"File {cell_names_key} not found in bucket {bucket_name}"
                    )
                
                # Load config_plan CSV
                config_plan_key = f"{task_prefix}/config_plan_{date_str}.csv"
                config_plan_file = tmpdir_path / f"config_plan_{date_str}.csv"
                try:
                    s3_client.download_file(bucket_name, config_plan_key, str(config_plan_file))
                    df = pd.read_csv(config_plan_file)
                    result_data['config_plan'] = df.to_dict(orient='records')
                except Exception as e:
                    logger.error(f"Failed to load {config_plan_key}: {e}")
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"File {config_plan_key} not found in bucket {bucket_name}"
                    )
        
        elif request.task_type == TaskType.ES:
            # Load ES data: schedule CSV and forecast CSV
            with tempfile.TemporaryDirectory() as tmpdir:
                tmpdir_path = Path(tmpdir)
                
                # Load schedule CSV
                schedule_key = f"{task_prefix}/schedule_{date_str}.csv"
                schedule_file = tmpdir_path / f"schedule_{date_str}.csv"
                try:
                    s3_client.download_file(bucket_name, schedule_key, str(schedule_file))
                    df = pd.read_csv(schedule_file)
                    result_data['schedule'] = df.to_dict(orient='records')
                except Exception as e:
                    logger.error(f"Failed to load {schedule_key}: {e}")
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"File {schedule_key} not found in bucket {bucket_name}"
                    )
                
                # Load forecast CSV
                forecast_key = f"{task_prefix}/forecast_{date_str}.csv"
                forecast_file = tmpdir_path / f"forecast_{date_str}.csv"
                try:
                    s3_client.download_file(bucket_name, forecast_key, str(forecast_file))
                    df = pd.read_csv(forecast_file)
                    result_data['forecast'] = df.to_dict(orient='records')
                except Exception as e:
                    logger.error(f"Failed to load {forecast_key}: {e}")
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"File {forecast_key} not found in bucket {bucket_name}"
                    )
        
        return PlanResponse(
            task_type=request.task_type.value,
            date=date_str,
            data=result_data
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error loading plan data: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load plan data: {str(e)}"
        )
</file>

<file path="flux-new-reason/app/core/docling/__init__.py">
from .client import DoclingClient
from .chunker import DoclingHybridChunker

__all__ = [
    "DoclingClient",
    "DoclingHybridChunker",
]
</file>

<file path="flux-new-reason/app/core/docling/chunker.py">
#!/usr/bin/env python3
"""
Document Chunking Framework

Provides a flexible, strategy-based chunking system for RAG document processing.
Supports multiple chunking strategies including Docling hybrid chunking and simple text splitting.
"""

from __future__ import annotations

import json
import os
import re
from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any

from langchain_core.documents import Document
from docling_core.types.doc.document import DoclingDocument
from docling_core.transforms.chunker.hybrid_chunker import HybridChunker
from docling_core.transforms.chunker.tokenizer.huggingface import HuggingFaceTokenizer
from transformers import AutoTokenizer

from app.core.docling.custom_hybrid_chunking import (
    DEFAULT_MAX_TOKENS,
    DEFAULT_MIN_TOKENS,
    CustomSerializerProvider,
    merge_undersized_chunks,
)


class BaseChunker(ABC):
    """
    Abstract base class for document chunking strategies.
    
    Provides common interface and utilities for all chunker implementations.
    Each concrete chunker should implement the chunk() method.
    """
    
    def __init__(
        self,
        max_tokens: int = DEFAULT_MAX_TOKENS,
        min_tokens: int = DEFAULT_MIN_TOKENS,
        **kwargs
    ):
        """
        Initialize the chunker with token limits.
        
        Args:
            max_tokens: Maximum tokens per chunk
            min_tokens: Minimum tokens per chunk (undersized chunks will be merged)
            **kwargs: Additional chunker-specific parameters
        """
        self.max_tokens = max_tokens
        self.min_tokens = min_tokens
        self.kwargs = kwargs
    
    @abstractmethod
    def chunk(
        self,
        text: str = None,
        doc: DoclingDocument = None,
        **kwargs
    ) -> List[str]:
        """
        Chunk document content into text strings.
        
        Args:
            text: Plain text content to chunk (for simple chunkers)
            doc: Document object (e.g., DoclingDocument for advanced chunkers)
            **kwargs: Additional chunking parameters
            
        Returns:
            List of chunked text strings
        """
        pass
    
    def chunk_file(
        self,
        file_path: str,
        group: Optional[str] = None,
        original_file_url: Optional[str] = None,
        **kwargs
    ) -> List[Document]:
        """
        Convenience method to chunk a file and create Document objects.
        
        Loads the file, calls chunk(), and wraps results in Document objects
        with metadata.
        
        Args:
            file_path: Path to the file to chunk (used for metadata)
            group: Optional group/category for the document
            original_file_url: Optional URL to the original file (for reference)
            **kwargs: Additional chunking parameters (e.g., json_path, doc, text)
            
        Returns:
            List of LangChain Document objects with text and metadata
        """
        # Subclasses can override this for file-specific loading logic
        raise NotImplementedError(
            f"{self.__class__.__name__} must implement chunk_file() "
            "or use the default implementation with appropriate kwargs"
        )
    
    def _create_base_metadata(
        self,
        file_path: str,
        chunk_index: int,
        group: Optional[str] = None,
        original_file_url: Optional[str] = None,
        **extra_metadata
    ) -> Dict[str, Any]:
        """
        Create base metadata dictionary for a chunk.
        
        Args:
            file_path: Path to the source file
            chunk_index: Index of the chunk within the document
            group: Optional group/category
            original_file_url: Optional URL to original file
            **extra_metadata: Additional metadata fields
            
        Returns:
            Metadata dictionary
        """
        filename = os.path.basename(file_path)
        file_type = os.path.splitext(file_path)[1][1:].lower()
        
        metadata = {
            "source": file_path,
            "filename": filename,
            "file_type": file_type,
            "chunk_index": chunk_index,
        }
        
        if group:
            metadata["group"] = group
        
        if original_file_url:
            metadata["original_file_url"] = original_file_url
        
        # Add any extra metadata
        metadata.update(extra_metadata)
        
        return metadata
    
    def _extract_images_from_text(self, text: str) -> tuple[List[Dict[str, str]], str]:
        """
        Extract image references from markdown text.
        
        Args:
            text: Markdown text containing image references
            
        Returns:
            Tuple of (images_list, images_json_string)
        """
        image_pattern = r"!\[(.*?)\]\((.*?)\)"
        chunk_images = re.findall(image_pattern, text)
        images_data = [{"alt": alt, "url": url} for alt, url in chunk_images]
        images_json = json.dumps(images_data)
        return images_data, images_json


class DoclingHybridChunker(BaseChunker):
    """
    Docling-based hybrid chunking strategy.
    
    Uses Docling's HybridChunker with custom table serialization and
    intelligent merging of undersized chunks. Supports Excel sheet boundaries
    and table-aware chunking.
    
    Features:
    - Token-budget aware chunking
    - Table-aware splitting with header propagation
    - Excel sheet boundary detection
    - Merge undersized chunks while respecting document structure
    - Image reference extraction and metadata
    """
    
    def __init__(
        self,
        max_tokens: int = DEFAULT_MAX_TOKENS,
        min_tokens: int = DEFAULT_MIN_TOKENS,
        embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        merge_peers: bool = True,
        emit_sheet_header: bool = True,
        **kwargs
    ):
        """
        Initialize Docling hybrid chunker.
        
        Args:
            max_tokens: Maximum tokens per chunk
            min_tokens: Minimum tokens per chunk
            embedding_model_name: HuggingFace model for tokenization
            merge_peers: Whether to merge peer chunks in HybridChunker
            emit_sheet_header: Whether to emit sheet headers for Excel files
            **kwargs: Additional parameters
        """
        super().__init__(max_tokens, min_tokens, **kwargs)
        self.embedding_model_name = embedding_model_name
        self.merge_peers = merge_peers
        self.emit_sheet_header = emit_sheet_header
        
        # Initialize tokenizer
        self.tokenizer = HuggingFaceTokenizer(
            tokenizer=AutoTokenizer.from_pretrained(embedding_model_name),
            max_tokens=max_tokens,
        )
    
    def chunk(
        self,
        text: str = None,
        doc: DoclingDocument = None,
        **kwargs
    ) -> List[str]:
        """
        Chunk a DoclingDocument into text strings.
        
        Args:
            text: Not used (DoclingDocument required)
            doc: DoclingDocument to chunk
            **kwargs: Additional parameters
            
        Returns:
            List of chunked text strings
            
        Raises:
            ValueError: If doc is not provided
        """
        if doc is None:
            raise ValueError("DoclingDocument (doc) is required for DoclingHybridChunker")
        
        # Initialize HybridChunker with custom serializer
        chunker = HybridChunker(
            tokenizer=self.tokenizer,
            merge_peers=self.merge_peers,
            serializer_provider=CustomSerializerProvider(
                max_tokens_per_chunk=self.max_tokens,
                tokenizer=self.tokenizer,
                emit_sheet_header=self.emit_sheet_header,
            )
        )
        
        # Generate chunks
        chunk_iter = chunker.chunk(dl_doc=doc)
        chunks = list(chunk_iter)
        
        # Get enriched texts
        enriched_texts = []
        for chunk in chunks:
            if not chunk.text.strip():
                continue
            enriched_text = chunker.contextualize(chunk=chunk)
            enriched_texts.append(enriched_text)
        
        # Apply min_tokens merging
        merged_texts = merge_undersized_chunks(
            enriched_texts,
            self.min_tokens,
            self.max_tokens,
            self.tokenizer.tokenizer,
            verbose=kwargs.get('verbose', True)
        )
        
        return merged_texts
    
    def chunk_file(
        self,
        file_path: str,
        json_path: str = None,
        doc: DoclingDocument = None,
        group: Optional[str] = None,
        original_file_url: Optional[str] = None,
        **kwargs
    ) -> List[Document]:
        """
        Chunk a document file using Docling's HybridChunker.
        
        Args:
            file_path: Path to the source file (for metadata)
            json_path: Path to Docling JSON output (optional if doc provided)
            doc: Pre-loaded DoclingDocument (optional if json_path provided)
            group: Optional document group
            original_file_url: Optional URL to original file
            **kwargs: Additional parameters
            
        Returns:
            List of LangChain Document objects
            
        Raises:
            ValueError: If neither json_path nor doc is provided
            FileNotFoundError: If json_path doesn't exist
        """
        # Load DoclingDocument if not provided
        if doc is None:
            if not json_path or not os.path.exists(json_path):
                raise FileNotFoundError(
                    f"JSON file not found: {json_path}. "
                    "Provide either json_path or doc parameter."
                )
            doc = DoclingDocument.load_from_json(json_path)
        
        # Chunk the document
        merged_texts = self.chunk(doc=doc, **kwargs)
        
        # Create Document objects
        documents = []
        for i, text in enumerate(merged_texts):
            if not text.strip():
                continue
            
            # Extract images
            images_data, images_json = self._extract_images_from_text(text)
            
            # Create metadata
            metadata = self._create_base_metadata(
                file_path=file_path,
                chunk_index=i,
                group=group,
                original_file_url=original_file_url,
                token_count=len(self.tokenizer.tokenizer.encode(text)),
                image_count=len(images_data),
                images_json=images_json,
            )
            
            # Create Document
            documents.append(Document(page_content=text, metadata=metadata))
        
        filename = os.path.basename(file_path)
        print(
            f"Processed {len(documents)} chunks from {filename} "
            f"using DoclingHybridChunker (max_tokens={self.max_tokens}, "
            f"min_tokens={self.min_tokens}, group: {group or 'none'})"
        )
        
        return documents


class SimpleTextChunker(BaseChunker):
    """
    Simple text-based chunking strategy.
    
    Splits text by character count with optional overlap.
    Useful for plain text files or when Docling is not available.
    """
    
    def __init__(
        self,
        max_tokens: int = DEFAULT_MAX_TOKENS,
        min_tokens: int = DEFAULT_MIN_TOKENS,
        overlap: int = 100,
        **kwargs
    ):
        """
        Initialize simple text chunker.
        
        Args:
            max_tokens: Maximum tokens per chunk
            min_tokens: Minimum tokens per chunk
            overlap: Character overlap between chunks
            **kwargs: Additional parameters
        """
        super().__init__(max_tokens, min_tokens, **kwargs)
        self.overlap = overlap
        # Rough estimate: 4 chars per token
        self.chunk_size = max_tokens * 4
    
    def chunk(
        self,
        text: str = None,
        doc: Any = None,
        **kwargs
    ) -> List[str]:
        """
        Chunk plain text into strings.
        
        Args:
            text: Plain text content to chunk
            doc: Not used (text required)
            **kwargs: Additional parameters
            
        Returns:
            List of chunked text strings
            
        Raises:
            ValueError: If text is not provided
        """
        if text is None:
            raise ValueError("text parameter is required for SimpleTextChunker")
        
        # Split into chunks
        chunks = []
        start = 0
        while start < len(text):
            end = start + self.chunk_size
            chunk_text = text[start:end]
            
            if chunk_text.strip():
                chunks.append(chunk_text)
            
            start = end - self.overlap
        
        return chunks
    
    def chunk_file(
        self,
        file_path: str,
        text: str = None,
        group: Optional[str] = None,
        original_file_url: Optional[str] = None,
        **kwargs
    ) -> List[Document]:
        """
        Chunk a text file using simple character-based splitting.
        
        Args:
            file_path: Path to the file to chunk (for metadata)
            text: Pre-loaded text content (optional, will read from file_path if not provided)
            group: Optional document group
            original_file_url: Optional URL to original file
            **kwargs: Additional parameters
            
        Returns:
            List of LangChain Document objects
        """
        # Load text if not provided
        if text is None:
            with open(file_path, 'r', encoding='utf-8') as f:
                text = f.read()
        
        # Chunk the text
        chunks = self.chunk(text=text, **kwargs)
        
        # Create Document objects
        documents = []
        for i, chunk_text in enumerate(chunks):
            metadata = self._create_base_metadata(
                file_path=file_path,
                chunk_index=i,
                group=group,
                original_file_url=original_file_url,
            )
            documents.append(Document(page_content=chunk_text, metadata=metadata))
        
        filename = os.path.basename(file_path)
        print(
            f"Processed {len(documents)} chunks from {filename} "
            f"using SimpleTextChunker (chunk_size={self.chunk_size}, "
            f"overlap={self.overlap}, group: {group or 'none'})"
        )
        
        return documents


# Convenience factory function
def create_chunker(
    strategy: str = "docling",
    max_tokens: int = DEFAULT_MAX_TOKENS,
    min_tokens: int = DEFAULT_MIN_TOKENS,
    **kwargs
) -> BaseChunker:
    """
    Factory function to create a chunker instance.
    
    Args:
        strategy: Chunking strategy ("docling" or "simple")
        max_tokens: Maximum tokens per chunk
        min_tokens: Minimum tokens per chunk
        **kwargs: Strategy-specific parameters
        
    Returns:
        Configured chunker instance
        
    Example:
        >>> chunker = create_chunker("docling", max_tokens=1024, embedding_model_name="...")
        >>> chunks = chunker.chunk_file("doc.pdf", json_path="doc.json")
    """
    strategies = {
        "docling": DoclingHybridChunker,
        "simple": SimpleTextChunker,
    }
    
    if strategy not in strategies:
        raise ValueError(
            f"Unknown strategy: {strategy}. "
            f"Available strategies: {list(strategies.keys())}"
        )
    
    chunker_class = strategies[strategy]
    return chunker_class(max_tokens=max_tokens, min_tokens=min_tokens, **kwargs)
</file>

<file path="flux-new-reason/app/core/docling/client.py">
"""
Docling API Client

A minimal, reusable client for interacting with Docling Serve API.
Handles document conversion, image processing, and asset management.
"""

from __future__ import annotations

import io
import logging
import mimetypes
import os
import shutil
import zipfile
from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import requests

_log = logging.getLogger(__name__)


class ConversionStatus(Enum):
    """Status of document conversion."""
    SUCCESS = "success"
    PARTIAL_SUCCESS = "partial_success"
    FAILURE = "failure"


@dataclass
class ConversionResult:
    """Result of a document conversion operation."""
    file_path: str
    status: ConversionStatus
    markdown_path: Optional[str] = None
    json_path: Optional[str] = None
    original_file_url: Optional[str] = None
    error: Optional[str] = None


class DoclingClient:
    """Client for interacting with Docling Serve API."""
    
    def __init__(
        self,
        api_url: str,
        static_assets_path: Optional[str] = None,
        static_assets_url: Optional[str] = None,
        default_ocr_langs: Optional[List[str]] = None,
    ):
        """
        Initialize DoclingClient.
        
        Args:
            api_url: Docling API endpoint URL
            static_assets_path: Local path for storing static assets (images, files)
            static_assets_url: Public URL base for accessing static assets
            default_ocr_langs: Default OCR languages (e.g., ['en', 'vi'])
        """
        self.api_url = api_url
        self.static_assets_path = static_assets_path
        self.static_assets_url = static_assets_url
        self.default_ocr_langs = default_ocr_langs or ['en']
    
    def convert(
        self,
        file_path: str,
        output_dir: str,
        original_file_path: Optional[str] = None,
        group: Optional[str] = None,
        do_ocr: bool = True,
        force_ocr: bool = False,
        ocr_engine: str = 'easyocr',
        ocr_langs: Optional[List[str]] = None,
        pdf_backend: str = 'dlparse_v4',
        table_mode: str = 'accurate',
        include_images: bool = True,
        image_scale: float = 2.0,
    ) -> Tuple[str, str, Optional[str]]:
        """
        Convert document using Docling API.
        
        Args:
            file_path: Path to file to convert
            output_dir: Directory to store conversion outputs
            original_file_path: Original source file path (for raw file references)
            group: Optional group/category for organizing assets
            do_ocr: Enable OCR processing
            force_ocr: Force OCR even on digital PDFs
            ocr_engine: OCR engine to use
            ocr_langs: OCR languages (defaults to instance default_ocr_langs)
            pdf_backend: PDF parsing backend
            table_mode: Table extraction mode
            include_images: Include images in output
            image_scale: Image export scale factor
            
        Returns:
            Tuple of (markdown_path, json_path, original_file_url)
        """
        filename = os.path.basename(file_path)
        
        # Clean up output directory
        if os.path.exists(output_dir):
            shutil.rmtree(output_dir)
        os.makedirs(output_dir, exist_ok=True)
        
        # Call Docling API
        zip_content = self._call_api(
            file_path=file_path,
            do_ocr=do_ocr,
            force_ocr=force_ocr,
            ocr_engine=ocr_engine,
            ocr_langs=ocr_langs or self.default_ocr_langs,
            pdf_backend=pdf_backend,
            table_mode=table_mode,
            include_images=include_images,
            image_scale=image_scale,
        )
        
        # Extract and process outputs
        md_path, json_path = self._extract_outputs(zip_content, output_dir, filename)
        
        # Handle assets (images, original file)
        original_file_url = None
        if self.static_assets_path and self.static_assets_url:
            original_file_url = self._process_assets(
                md_path=md_path,
                json_path=json_path,
                output_dir=output_dir,
                filename=filename,
                original_file_path=original_file_path or file_path,
                group=group,
            )
        
        return md_path, json_path, original_file_url
    
    def convert_batch(
        self,
        file_paths: List[str],
        output_base_dir: str,
        original_file_paths: Optional[List[str]] = None,
        group: Optional[str] = None,
        do_ocr: bool = True,
        force_ocr: bool = False,
        ocr_engine: str = 'easyocr',
        ocr_langs: Optional[List[str]] = None,
        pdf_backend: str = 'dlparse_v4',
        table_mode: str = 'accurate',
        include_images: bool = True,
        image_scale: float = 2.0,
        raises_on_error: bool = False,
    ) -> List[ConversionResult]:
        """
        Convert multiple documents in batch.
        
        Args:
            file_paths: List of file paths to convert
            output_base_dir: Base directory for storing conversion outputs
            original_file_paths: Optional list of original source file paths (same length as file_paths)
            group: Optional group/category for organizing assets
            do_ocr: Enable OCR processing
            force_ocr: Force OCR even on digital PDFs
            ocr_engine: OCR engine to use
            ocr_langs: OCR languages (defaults to instance default_ocr_langs)
            pdf_backend: PDF parsing backend
            table_mode: Table extraction mode
            include_images: Include images in output
            image_scale: Image export scale factor
            raises_on_error: If True, raise exception on first error; if False, continue processing
            
        Returns:
            List of ConversionResult objects
        """
        if original_file_paths and len(original_file_paths) != len(file_paths):
            raise ValueError("original_file_paths must have same length as file_paths")
        
        results = []
        success_count = 0
        failure_count = 0
        
        _log.info(f"Starting batch conversion of {len(file_paths)} documents")
        
        for idx, file_path in enumerate(file_paths):
            filename = os.path.basename(file_path)
            original_file_path = original_file_paths[idx] if original_file_paths else None
            
            # Create unique output directory for each file
            file_output_dir = os.path.join(output_base_dir, os.path.splitext(filename)[0])
            
            try:
                _log.info(f"[{idx + 1}/{len(file_paths)}] Converting: {filename}")
                
                md_path, json_path, original_url = self.convert(
                    file_path=file_path,
                    output_dir=file_output_dir,
                    original_file_path=original_file_path,
                    group=group,
                    do_ocr=do_ocr,
                    force_ocr=force_ocr,
                    ocr_engine=ocr_engine,
                    ocr_langs=ocr_langs,
                    pdf_backend=pdf_backend,
                    table_mode=table_mode,
                    include_images=include_images,
                    image_scale=image_scale,
                )
                
                results.append(ConversionResult(
                    file_path=file_path,
                    status=ConversionStatus.SUCCESS,
                    markdown_path=md_path,
                    json_path=json_path,
                    original_file_url=original_url,
                ))
                success_count += 1
                _log.info(f"✓ Successfully converted: {filename}")
                
            except Exception as e:
                error_msg = f"Failed to convert {filename}: {str(e)}"
                _log.error(error_msg)
                
                results.append(ConversionResult(
                    file_path=file_path,
                    status=ConversionStatus.FAILURE,
                    error=error_msg,
                ))
                failure_count += 1
                
                if raises_on_error:
                    raise RuntimeError(error_msg) from e
        
        _log.info(
            f"Batch conversion complete: {success_count} succeeded, "
            f"{failure_count} failed out of {len(file_paths)} total"
        )
        
        return results
    
    def _call_api(
        self,
        file_path: str,
        do_ocr: bool,
        force_ocr: bool,
        ocr_engine: str,
        ocr_langs: List[str],
        pdf_backend: str,
        table_mode: str,
        include_images: bool,
        image_scale: float,
    ) -> io.BytesIO:
        """Call Docling API and return response as BytesIO."""
        filename = os.path.basename(file_path)
        
        # Detect MIME type
        mime_type, _ = mimetypes.guess_type(file_path)
        if mime_type is None:
            mime_type = "application/octet-stream"
        
        # Prepare request
        files = {'files': (filename, open(file_path, 'rb'), mime_type)}
        data = {
            'target_type': 'zip',
            'to_formats': ['md', 'json'],
            'image_export_mode': 'referenced',
            'do_ocr': str(do_ocr).lower(),
            'force_ocr': str(force_ocr).lower(),
            'ocr_engine': ocr_engine,
            'ocr_lang': ocr_langs,
            'pdf_backend': pdf_backend,
            'table_mode': table_mode,
            'include_images': str(include_images).lower(),
            'image_scale': str(image_scale),
        }
        headers = {'Accept': 'application/json'}
        
        # Send request
        try:
            response = requests.post(
                self.api_url,
                files=files,
                data=data,
                headers=headers,
                stream=True,
                timeout=300,
            )
            response.raise_for_status()
            return io.BytesIO(response.content)
        except requests.RequestException as e:
            raise RuntimeError(f"Docling API request failed for {filename}: {e}") from e
    
    def _extract_outputs(
        self,
        zip_content: io.BytesIO,
        output_dir: str,
        filename: str,
    ) -> Tuple[str, str]:
        """Extract markdown and JSON from Docling zip output."""
        with zipfile.ZipFile(zip_content, 'r') as zip_ref:
            zip_ref.extractall(output_dir)
        
        base_name = os.path.splitext(filename)[0]
        md_path = os.path.join(output_dir, f"{base_name}.md")
        json_path = os.path.join(output_dir, f"{base_name}.json")
        
        if not os.path.exists(md_path) or not os.path.exists(json_path):
            raise RuntimeError(f"Expected outputs not found for {filename}")
        
        return md_path, json_path
    
    def _process_assets(
        self,
        md_path: str,
        json_path: str,
        output_dir: str,
        filename: str,
        original_file_path: str,
        group: Optional[str],
    ) -> str:
        """
        Process and organize static assets (images, original file).
        
        Returns:
            URL of the original file
        """
        doc_id = os.path.splitext(filename)[0]
        
        # Determine asset directory structure
        if group:
            doc_assets_dir = os.path.join(self.static_assets_path, "documents", group, doc_id)
            url_path = f"documents/{group}/{doc_id}"
        else:
            doc_assets_dir = os.path.join(self.static_assets_path, "documents", doc_id)
            url_path = f"documents/{doc_id}"
        
        os.makedirs(doc_assets_dir, exist_ok=True)
        
        # Copy original file
        original_filename = os.path.basename(original_file_path)
        original_file_dest = os.path.join(doc_assets_dir, original_filename)
        shutil.copy2(original_file_path, original_file_dest)
        original_file_url = f"{self.static_assets_url}/{url_path}/{original_filename}"
        
        # Process images
        image_mapping = self._process_images(output_dir, doc_assets_dir, url_path)
        
        # Update markdown and JSON with image URLs
        self._update_file_paths(md_path, image_mapping)
        self._update_file_paths(json_path, image_mapping)
        
        # Save markdown to assets
        md_asset_path = os.path.join(doc_assets_dir, f"{doc_id}.md")
        shutil.copy2(md_path, md_asset_path)
        
        return original_file_url
    
    def _process_images(
        self,
        output_dir: str,
        doc_assets_dir: str,
        url_path: str,
    ) -> Dict[str, str]:
        """
        Process images from artifacts directory.
        
        Returns:
            Mapping of relative paths to web URLs
        """
        image_mapping = {}
        artifacts_dir = os.path.join(output_dir, "artifacts")
        
        if not os.path.exists(artifacts_dir):
            return image_mapping
        
        image_counter = 1
        for image_file in sorted(os.listdir(artifacts_dir)):
            if not image_file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.svg')):
                continue
            
            # Generate standardized image filename
            ext = os.path.splitext(image_file)[1]
            new_image_name = f"image_{image_counter:03d}{ext}"
            
            # Copy image to assets
            src = os.path.join(artifacts_dir, image_file)
            dest = os.path.join(doc_assets_dir, new_image_name)
            shutil.copy2(src, dest)
            
            # Create URL mapping
            relative_path = f"artifacts/{image_file}"
            web_url = f"{self.static_assets_url}/{url_path}/{new_image_name}"
            image_mapping[relative_path] = web_url
            
            image_counter += 1
        
        return image_mapping
    
    def _update_file_paths(self, file_path: str, path_mapping: Dict[str, str]):
        """Update file content with path mappings."""
        if not path_mapping:
            return
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for old_path, new_path in path_mapping.items():
            content = content.replace(old_path, new_path)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
    
    def cleanup_assets_by_groups(
        self,
        groups: Optional[List[str]] = None,
        reset: bool = False,
    ):
        """
        Clean up static assets for specific groups.
        
        Args:
            groups: List of groups to clean. If None, cleans all.
            reset: Only clean if reset is True
        """
        if not reset or not self.static_assets_path:
            return
        
        documents_dir = os.path.join(self.static_assets_path, "documents")
        if not os.path.exists(documents_dir):
            return
        
        if not groups:
            # Clean all
            shutil.rmtree(documents_dir)
            print(f"🧹 Cleaned up all static assets")
            return
        
        # Clean specific groups
        for group in groups:
            group_dir = os.path.join(documents_dir, group)
            if os.path.exists(group_dir):
                shutil.rmtree(group_dir)
                print(f"🧹 Cleaned up static assets for group: {group}")
</file>

<file path="flux-new-reason/app/core/docling/custom_hybrid_chunking.py">
#!/usr/bin/env python3
"""
Document Chunking Module

This module provides custom chunking functionality for RAG document processing,
including table-aware chunking with token budget management and Excel sheet handling.
"""

from __future__ import annotations
import re
from typing import List, Optional
import pandas as pd
from typing_extensions import override

from docling_core.transforms.chunker.hierarchical_chunker import (
    ChunkingDocSerializer,
    ChunkingSerializerProvider,
)
from docling_core.transforms.serializer.base import BaseDocSerializer, SerializationResult
from docling_core.transforms.serializer.common import create_ser_result
from docling_core.transforms.serializer.markdown import (
    MarkdownParams,
    MarkdownTableSerializer,
)
from docling_core.types.doc import ImageRefMode, TableItem, GroupItem


# ============================================================================
# Constants
# ============================================================================

# Default token limits for chunking
DEFAULT_MAX_TOKENS = 1024
DEFAULT_MIN_TOKENS = 256

# Minimum token count for valid chunks (used in validation)
MIN_VALID_TOKENS = 50


# ============================================================================
# Markdown Table Utilities
# ============================================================================

# Regex pattern to match table separator lines (e.g., |---|---|)
_sep_line_re = re.compile(r'^\s*\|?\s*[:\-\s\|]+\s*\|?\s*$')


def _force_single_dash_header_seps(md_line: str) -> str:
    """
    Normalize header-separator line to use single dashes.
    
    Converts any header-separator line into '|-|-|-|' format with the same cell count.
    
    Args:
        md_line: A markdown table separator line
        
    Returns:
        Normalized separator line with single dashes
        
    Example:
        >>> _force_single_dash_header_seps('| --- | ----- | -- |')
        '|-|-|-|'
    """
    raw_cells = md_line.strip().strip("|").split("|")
    new_cells = ["-" for _ in raw_cells if _.strip() != "" or len(raw_cells) == 1]
    return "|" + "|".join(new_cells) + "|"


def _strip_md_row_cells(md_line: str) -> str:
    """
    Trim whitespace from each cell in a markdown table row.
    
    Preserves internal spaces within cells but removes leading/trailing whitespace.
    Does not modify separator lines.
    
    Args:
        md_line: A markdown table row
        
    Returns:
        Row with trimmed cells and tight pipes
        
    Example:
        >>> _strip_md_row_cells('|  Name  |  Age  |')
        '|Name|Age|'
    """
    if "|" not in md_line or _sep_line_re.match(md_line):
        return md_line
    cells = md_line.strip().strip("|").split("|")
    return "|" + "|".join(c.strip() for c in cells) + "|"


def _df_header_and_sep(df: pd.DataFrame) -> tuple[str, str]:
    """
    Build compact header row and normalized separator for a DataFrame.
    
    Args:
        df: DataFrame to extract headers from
        
    Returns:
        Tuple of (header_line, separator_line)
        
    Example:
        For a DataFrame with columns ['Name', 'Age']:
        Returns: ('|Name|Age|', '|-|-|')
    """
    header_cells = [str(c).strip() for c in df.columns]
    header_line = "|" + "|".join(header_cells) + "|"
    sep_line = "|" + "|".join("-" for _ in header_cells) + "|"
    return _strip_md_row_cells(header_line), sep_line


def _row_to_md_line(row: pd.Series) -> str:
    """
    Convert a DataFrame row to a markdown table line.
    
    Args:
        row: DataFrame row to convert
        
    Returns:
        Markdown table row string
        
    Example:
        >>> row = pd.Series(['John', 30])
        >>> _row_to_md_line(row)
        '|John|30|'
    """
    vals = [("" if pd.isna(v) else str(v)) for v in row.tolist()]
    line = "|" + "|".join(vals) + "|"
    return _strip_md_row_cells(line)


# ============================================================================
# Token Counting
# ============================================================================

def count_tokens(text: str, tokenizer) -> int:
    """
    Count tokens in text using the provided tokenizer.
    
    Supports both HuggingFaceTokenizer wrappers and raw AutoTokenizer objects.
    Falls back to character-based estimation if tokenization fails.
    
    Args:
        text: Text to count tokens for
        tokenizer: Tokenizer object (HuggingFaceTokenizer or AutoTokenizer)
        
    Returns:
        Number of tokens in the text
        
    Note:
        Falls back to ~4 characters per token estimate on error.
    """
    if not text.strip():
        return 0
    
    try:
        # Check if it's a HuggingFaceTokenizer wrapper or raw AutoTokenizer
        if hasattr(tokenizer, 'count_tokens'):
            # HuggingFaceTokenizer wrapper (preferred for consistency)
            return tokenizer.count_tokens(text)
        else:
            # Raw AutoTokenizer fallback
            tokens = tokenizer.encode(text)
            return len(tokens)
    except Exception as e:
        # Fallback to rough estimate: ~4 characters per token
        return len(text) // 4


# ============================================================================
# Excel Sheet Detection
# ============================================================================

def extract_sheet_name_from_item(item, doc) -> Optional[str]:
    """
    Extract sheet name from a document item by walking up the parent chain.
    
    Walks up the real parent chain (resolving RefItem references) and returns
    the first GroupItem.name that looks like a sheet label.
    
    Accepted formats:
    - 'sheet: <name>' (preferred, case-insensitive)
    - Any group name that starts with 'sheet' if no colon present
    
    Args:
        item: Document item (typically a TableItem)
        doc: Parent document
        
    Returns:
        Sheet name if found, None otherwise
        
    Example:
        >>> extract_sheet_name_from_item(table_item, doc)
        'Tổng hợp'
    """
    cur = item  # TableItem (NodeItem subclass)
    hops = 0
    max_hops = 64  # Prevent infinite loops
    
    while cur is not None and hops < max_hops:
        # Move to the real parent node if a RefItem is present
        pref = getattr(cur, "parent", None)
        if pref is None:
            break
        cur = pref.resolve(doc)  # RefItem -> concrete node

        # Found a group? Check its name
        if isinstance(cur, GroupItem):
            name = getattr(cur, "name", None)
            if isinstance(name, str):
                low = name.strip().lower()
                if low.startswith("sheet:"):
                    return name.split(":", 1)[1].strip() or name
                if low.startswith("sheet"):
                    # Fallback if producer omitted the colon
                    return name.strip()
        hops += 1
    
    return None


def extract_sheet_name_from_text(text: str) -> Optional[str]:
    """
    Extract sheet name from chunk text if it starts with 'sheet: <name>'.
    
    Args:
        text: The chunk text to parse
    
    Returns:
        Sheet name if found, None otherwise
        
    Example:
        >>> extract_sheet_name_from_text("sheet: Tổng hợp\\n|Name|Age|")
        'Tổng hợp'
    """
    lines = text.strip().split('\n')
    if lines and lines[0].strip().lower().startswith('sheet:'):
        sheet_line = lines[0].strip()
        # Extract everything after 'sheet:'
        sheet_name = sheet_line.split(':', 1)[1].strip()
        return sheet_name if sheet_name else None
    return None


# ============================================================================
# Sheet Boundary Logic
# ============================================================================

def should_force_group_completion(group_sheet: Optional[str], chunk_sheet: Optional[str]) -> bool:
    """
    Determine if we should force completion of current group due to sheet boundaries.
    
    Args:
        group_sheet: Sheet name of current group (None if no sheet info)
        chunk_sheet: Sheet name of current chunk (None if no sheet info)
    
    Returns:
        True if group should be completed due to different sheets
        
    Logic:
        - If group has no sheet info (PDF, DOCX, MD) → False (no restrictions)
        - If group has sheet but chunk doesn't → False (table fragment)
        - Both have sheet info → True if different sheets
    """
    # If group has no sheet info (PDF, DOCX, MD, etc.) - no sheet boundary restrictions
    if group_sheet is None:
        return False
    
    # If group has sheet info but chunk doesn't - this is a table fragment, don't force completion
    if chunk_sheet is None:
        return False
    
    # Both have sheet info - force completion if different sheets
    return group_sheet != chunk_sheet


def should_force_add_to_group(group_sheet: Optional[str], chunk_sheet: Optional[str]) -> bool:
    """
    Determine if we should force adding chunk to current group (bypassing completion rules).
    
    Args:
        group_sheet: Sheet name of current group (None if no sheet info)
        chunk_sheet: Sheet name of current chunk (None if no sheet info)
    
    Returns:
        True if chunk should be forced into current group
        
    Logic:
        - If group has sheet info but chunk doesn't → True (table fragment, force add)
        - Otherwise → False
    """
    # If group has sheet info but chunk doesn't - this is a table fragment, force add
    if group_sheet is not None and chunk_sheet is None:
        return True
    
    return False


def can_merge_chunks(group_sheet: Optional[str], chunk_sheet: Optional[str]) -> bool:
    """
    Check if chunks can be merged based on sheet compatibility.
    
    Args:
        group_sheet: Sheet name of current group (None if no sheet info)
        chunk_sheet: Sheet name of current chunk (None if no sheet info)
    
    Returns:
        True if chunks are compatible for merging
        
    Logic:
        - Neither has sheet info (PDF, DOCX, MD) → True
        - Group has sheet but chunk doesn't → True (table fragment)
        - Group has no sheet but chunk does → False (different types)
        - Both have sheet info → True if they match
    """
    # If neither has sheet info (PDF, DOCX, MD, etc.), they can be merged
    if group_sheet is None and chunk_sheet is None:
        return True
    
    # If group has sheet but chunk doesn't - table fragment, can merge
    if group_sheet is not None and chunk_sheet is None:
        return True
    
    # If group has no sheet but chunk does - different document types, cannot merge
    if group_sheet is None and chunk_sheet is not None:
        return False
    
    # Both have sheet info - check if they match
    return group_sheet == chunk_sheet


# ============================================================================
# Duplicate Heading Removal
# ============================================================================

def remove_duplicate_headings(text1: str, text2: str) -> tuple[str, str]:
    """
    Remove duplicate headings from the beginning of two texts when merging.
    
    Uses plain longest common prefix of lines - no heuristics.
    
    Args:
        text1: First text chunk
        text2: Second text chunk
    
    Returns:
        Tuple of (cleaned_text1, cleaned_text2)
        
    Example:
        >>> t1 = "# Header\\nContent1"
        >>> t2 = "# Header\\nContent2"
        >>> remove_duplicate_headings(t1, t2)
        ('# Header\\nContent1', 'Content2')
    """
    lines1 = text1.split('\n')
    lines2 = text2.split('\n')
    
    # Find longest common prefix of lines
    common_prefix_length = 0
    max_check = min(len(lines1), len(lines2))
    
    for i in range(max_check):
        if lines1[i] == lines2[i]:  # Exact line match
            common_prefix_length += 1
        else:
            break  # Stop at first difference
    
    # If we found common prefix, remove it from the second text
    if common_prefix_length > 0:
        cleaned_text2 = '\n'.join(lines2[common_prefix_length:])
        return text1, cleaned_text2
    
    return text1, text2


# ============================================================================
# Chunk Merging
# ============================================================================

def merge_group_texts(texts: List[str]) -> str:
    """
    Merge a group of texts, removing duplicate headings between adjacent texts.
    
    Args:
        texts: List of text chunks to merge
    
    Returns:
        Merged text with duplicate headings removed
        
    Example:
        >>> texts = ["# Header\\nChunk1", "# Header\\nChunk2"]
        >>> merge_group_texts(texts)
        '# Header\\nChunk1\\n\\nChunk2'
    """
    if not texts:
        return ""
    
    if len(texts) == 1:
        return texts[0]
    
    # Start with first text
    merged = texts[0]
    
    # Merge each subsequent text, removing duplicates
    for text in texts[1:]:
        cleaned_merged, cleaned_text = remove_duplicate_headings(merged, text)
        merged = cleaned_merged + "\n\n" + cleaned_text
    
    return merged


def merge_undersized_chunks(
    enriched_texts: List[str],
    min_tokens: int,
    max_tokens: int,
    tokenizer,
    verbose: bool = True
) -> List[str]:
    """
    Merge undersized chunks using optimal partitioning algorithm.
    
    Groups adjacent chunks sequentially until each group reaches min_tokens,
    minimizing the average excess over min_tokens while respecting Excel sheet boundaries.
    Removes duplicate headings when merging chunks.
    
    Args:
        enriched_texts: List of enriched text chunks
        min_tokens: Minimum tokens required per chunk
        max_tokens: Maximum tokens per chunk (can be exceeded when merging undersized chunks)
        tokenizer: Tokenizer for counting tokens
        verbose: Whether to print progress information
    
    Returns:
        List of merged chunks
        
    Algorithm:
        1. Start a new group with the first chunk
        2. Add chunks to group until:
           - min_tokens is reached, OR
           - Sheet boundary is encountered (for Excel)
        3. Force add table fragments (chunks without sheet headers)
        4. Complete group and start new one
        5. Attach small leftover groups to previous group if compatible
    """
    if not enriched_texts or min_tokens <= 0:
        return enriched_texts
    
    # Check if merging is possible
    total_tokens = sum(count_tokens(text, tokenizer) for text in enriched_texts)
    if total_tokens < min_tokens:
        if verbose:
            print(f"⚠️ Total tokens ({total_tokens}) less than min_tokens ({min_tokens}). Cannot merge.")
        return enriched_texts
    
    groups = []
    current_group = []
    current_tokens = 0
    group_sheet = None  # Sheet name of current group (from first chunk)
    
    if verbose:
        print(f"Starting optimal merge: {len(enriched_texts)} chunks, min_tokens={min_tokens}")
    
    for text in enriched_texts:
        text_tokens = count_tokens(text, tokenizer)
        chunk_sheet = extract_sheet_name_from_text(text)
        
        # If this is the first chunk in a new group, set the group sheet
        if not current_group:
            group_sheet = chunk_sheet
        
        # Check Excel sheet-specific rules
        force_completion = should_force_group_completion(group_sheet, chunk_sheet)
        force_add = should_force_add_to_group(group_sheet, chunk_sheet)
        
        # Force completion if different Excel sheets
        if current_group and force_completion:
            # Complete current group due to sheet boundary
            merged_text = merge_group_texts(current_group)
            groups.append(merged_text)
            
            if verbose:
                final_tokens = count_tokens(merged_text, tokenizer)
                sheet_info = f" (sheet: {group_sheet})" if group_sheet else ""
                print(f"  Group {len(groups)}: {len(current_group)} chunks -> {final_tokens} tokens (sheet boundary){sheet_info}")
            
            # Start new group
            current_group = [text]
            current_tokens = text_tokens
            group_sheet = chunk_sheet
            continue
        
        # Add current chunk to group
        current_group.append(text)
        current_tokens += text_tokens
        
        # Check if we should complete the group
        should_complete = False
        
        if force_add:
            # Force add table fragments - don't complete yet
            if verbose:
                print(f"    Added table fragment ({text_tokens} tokens) to group")
        elif current_tokens >= min_tokens:
            # Group meets minimum requirement - complete it
            should_complete = True
        
        if should_complete:
            merged_text = merge_group_texts(current_group)
            groups.append(merged_text)
            
            if verbose:
                final_tokens = count_tokens(merged_text, tokenizer)
                excess = final_tokens - min_tokens
                sheet_info = f" (sheet: {group_sheet})" if group_sheet else ""
                print(f"  Group {len(groups)}: {len(current_group)} chunks -> {final_tokens} tokens (+{excess} excess){sheet_info}")
            
            # Reset for next group
            current_group = []
            current_tokens = 0
            group_sheet = None
    
    # Handle leftover chunks
    if current_group:
        if groups and current_tokens > 0:
            # Attach leftover to last group if compatible
            last_group_text = groups[-1]
            last_group_sheet = extract_sheet_name_from_text(last_group_text)
            
            if can_merge_chunks(last_group_sheet, group_sheet):
                # Merge with last group
                groups[-1] = merge_group_texts([last_group_text] + current_group)
                
                if verbose:
                    final_tokens = count_tokens(groups[-1], tokenizer)
                    excess = final_tokens - min_tokens
                    sheet_info = f" (sheet: {last_group_sheet or group_sheet})" if (last_group_sheet or group_sheet) else ""
                    print(f"  Final group (merged with previous): {len(current_group) + 1} chunks -> {final_tokens} tokens (+{excess} excess){sheet_info}")
            else:
                # Different sheets - keep as separate group
                merged_text = merge_group_texts(current_group)
                groups.append(merged_text)
                
                if verbose:
                    final_tokens = count_tokens(merged_text, tokenizer)
                    excess = final_tokens - min_tokens
                    sheet_info = f" (sheet: {group_sheet})" if group_sheet else ""
                    status = "✓" if final_tokens >= min_tokens else "✗"
                    print(f"  Final group {status}: {len(current_group)} chunks -> {final_tokens} tokens (+{excess} excess){sheet_info}")
        else:
            # First and only group
            merged_text = merge_group_texts(current_group)
            groups.append(merged_text)
            
            if verbose:
                final_tokens = count_tokens(merged_text, tokenizer)
                excess = final_tokens - min_tokens
                sheet_info = f" (sheet: {group_sheet})" if group_sheet else ""
                status = "✓" if final_tokens >= min_tokens else "✗"
                print(f"  Final group {status}: {len(current_group)} chunks -> {final_tokens} tokens (+{excess} excess){sheet_info}")
    
    # Calculate statistics
    if groups and verbose:
        total_final_tokens = sum(count_tokens(chunk, tokenizer) for chunk in groups)
        avg_excess = (total_final_tokens / len(groups)) - min_tokens
        sheet_boundaries = sum(1 for g in groups if extract_sheet_name_from_text(g) is not None)
        
        print(f"✅ Optimal merge complete: {len(enriched_texts)} -> {len(groups)} chunks")
        print(f"   📈 Average excess: {avg_excess:.1f} tokens per chunk")
        if sheet_boundaries > 0:
            print(f"   📋 Excel sheet groups: {sheet_boundaries}")
    
    return groups


# ============================================================================
# Custom Table Serializer
# ============================================================================

class HeaderPropagatingMarkdownTableSerializer(MarkdownTableSerializer):
    """
    Budget-aware table chunker for Excel sheets.
    
    Features:
    - Each chunk begins with an inline sheet header line if available: 'sheet: <name>'
    - Then one table header + '|-|-|-|' separator
    - Strip-only cells; tight pipes; single-dash header separators
    - Token budget management to control chunk sizes
    
    Attributes:
        max_tokens_per_chunk: Maximum tokens allowed per chunk
        emit_sheet_header: Whether to emit sheet context headers
        tokenizer: Tokenizer for counting tokens
    """
    
    def __init__(
        self,
        *,
        max_tokens_per_chunk: int = 512,
        emit_sheet_header: bool = True,
        tokenizer=None
    ):
        """
        Initialize the table serializer.
        
        Args:
            max_tokens_per_chunk: Maximum tokens per chunk (min 50)
            emit_sheet_header: Whether to include sheet headers
            tokenizer: Tokenizer for token counting
        """
        super().__init__()
        self.max_tokens_per_chunk = max(MIN_VALID_TOKENS, int(max_tokens_per_chunk))
        self.emit_sheet_header = emit_sheet_header
        self.tokenizer = tokenizer

    @override
    def serialize(
        self,
        *,
        item: TableItem,
        doc_serializer: BaseDocSerializer,
        doc,
        **kwargs,
    ) -> SerializationResult:
        """
        Serialize a table item into token-budget-aware chunks.
        
        Args:
            item: Table item to serialize
            doc_serializer: Document serializer for post-processing
            doc: Parent document
            **kwargs: Additional arguments
            
        Returns:
            Serialization result with chunked markdown text
        """
        df: pd.DataFrame = item.export_to_dataframe(doc=doc)

        if df.empty:
            text = doc_serializer.post_process(text="")
            return create_ser_result(text=text, span_source=item)

        # Sheet context (from Docling group name like 'sheet: Tổng hợp')
        sheet_name = extract_sheet_name_from_item(item, doc)
        sheet_line = f"sheet: {sheet_name}" if (self.emit_sheet_header and sheet_name) else None

        header_line, sep_line = _df_header_and_sep(df)

        chunks: list[str] = []
        cur_lines: list[str] = []
        cur_len = 0

        def _start_new_chunk():
            """Initialize a new chunk with headers."""
            nonlocal cur_lines, cur_len
            cur_lines = []
            cur_len = 0
            if sheet_line:
                cur_lines.append(sheet_line)
            cur_lines.append(header_line)
            cur_lines.append(sep_line)
            # Count tokens for the entire chunk content so far (including newlines)
            chunk_text = "\n".join(cur_lines)
            cur_len = count_tokens(chunk_text, self.tokenizer)

        _start_new_chunk()

        for _, row in df.iterrows():
            row_line = _row_to_md_line(row)
            
            # Calculate token count for the chunk if we add this row
            test_lines = cur_lines + [row_line]
            test_text = "\n".join(test_lines)
            test_len = count_tokens(test_text, self.tokenizer)

            if test_len > self.max_tokens_per_chunk:
                # If no data rows yet in this chunk, emit oversized row alone under header (+sheet)
                if (len(cur_lines) == (3 if sheet_line else 2)):
                    chunks.append("\n".join(cur_lines + [row_line]))
                    _start_new_chunk()
                    continue

                chunks.append("\n".join(cur_lines))
                _start_new_chunk()
                # Recalculate for the new chunk with this row
                test_lines = cur_lines + [row_line]
                test_text = "\n".join(test_lines)
                test_len = count_tokens(test_text, self.tokenizer)

            cur_lines.append(row_line)
            cur_len = test_len  # Update current length to the actual token count

        if len(cur_lines) > 0:
            chunks.append("\n".join(cur_lines))

        md = "\n\n".join(chunks)

        # Final safety pass - normalize all separator lines and strip cells
        fixed_lines = []
        for line in md.splitlines():
            if _sep_line_re.match(line):
                fixed_lines.append(_force_single_dash_header_seps(line))
            else:
                fixed_lines.append(_strip_md_row_cells(line))
        md = "\n".join(fixed_lines)

        text = doc_serializer.post_process(text=md)
        return create_ser_result(text=text, span_source=item)


# ============================================================================
# Custom Serializer Provider
# ============================================================================

class CustomSerializerProvider(ChunkingSerializerProvider):
    """
    Markdown-only provider that emits self-contained table chunks.
    
    Features:
    - Optional 'sheet: <name>' context line
    - One-dash header separators
    - Strip-only cells
    - Token-budget packing
    
    Attributes:
        max_tokens_per_chunk: Maximum tokens per chunk
        emit_sheet_header: Whether to emit sheet headers
        tokenizer: Tokenizer for token counting
    """
    
    def __init__(
        self,
        *,
        max_tokens_per_chunk: int = 512,
        emit_sheet_header: bool = True,
        tokenizer=None
    ):
        """
        Initialize the serializer provider.
        
        Args:
            max_tokens_per_chunk: Maximum tokens per chunk
            emit_sheet_header: Whether to include sheet headers
            tokenizer: Tokenizer for token counting
        """
        self.max_tokens_per_chunk = max_tokens_per_chunk
        self.emit_sheet_header = emit_sheet_header
        self.tokenizer = tokenizer

    def get_serializer(self, doc):
        """
        Get the document serializer for a given document.
        
        Args:
            doc: Document to serialize
            
        Returns:
            ChunkingDocSerializer configured with custom table serializer
        """
        table_ser = HeaderPropagatingMarkdownTableSerializer(
            max_tokens_per_chunk=self.max_tokens_per_chunk,
            emit_sheet_header=self.emit_sheet_header,
            tokenizer=self.tokenizer,
        )
        return ChunkingDocSerializer(
            doc=doc,
            table_serializer=table_ser,
            params=MarkdownParams(image_mode=ImageRefMode.REFERENCED),
        )
</file>

<file path="flux-new-reason/app/core/highlight.py">
"""
Highlighting service for matching enriched chunk content against original documents.

This service finds the best matching location in the original document for a given
chunk content (which may be semantically enriched during retrieval) and returns
highlighted HTML with precise alignment.
"""

import os
import re
import logging
import markdown
import requests
from typing import Dict, Any, Optional, List, Tuple
from difflib import SequenceMatcher
from functools import lru_cache
from bs4 import BeautifulSoup
from urllib.parse import unquote

logger = logging.getLogger(__name__)


class HighlightService:
    """
    Service for finding and highlighting content in original documents.
    
    Strategy:
    1. Load original document (convert to markdown if needed)
    2. Split into semantic chunks (by headings, tables, paragraphs)
    3. Find best match using sequence alignment
    4. Generate highlighted HTML with auto-scroll
    """
    
    def __init__(self, cache_size: int = 100):
        self.cache_size = cache_size
    
    @lru_cache(maxsize=100)
    def _load_document(self, file_path: str) -> str:
        """Load document content from file or URL (cached)."""
        file_path = unquote(file_path)
        
        # Convert to .md if not already
        root, ext = os.path.splitext(file_path)
        md_path = root + ".md" if ext.lower() != ".md" else file_path
        
        try:
            if md_path.startswith(("http://", "https://")):
                r = requests.get(md_path, timeout=10)
                r.encoding = "utf-8"
                r.raise_for_status()
                return r.text
            else:
                with open(md_path, "r", encoding="utf-8") as f:
                    return f.read()
        except Exception as e:
            logger.error(f"Failed to load document {md_path}: {e}")
            raise
    
    def _split_into_chunks(self, md_text: str) -> List[Dict[str, Any]]:
        """
        Split markdown into semantic chunks.
        
        Returns list of dicts with:
        - text: plain text content
        - html: rendered HTML
        - type: chunk type (heading, paragraph, table)
        - start_line: approximate line number
        """
        lines = md_text.splitlines()
        chunks = []
        current_block = []
        current_type = "paragraph"
        start_line = 0
        
        for i, line in enumerate(lines):
            # Detect chunk boundaries
            is_heading = re.match(r'^#+\s+.+', line)
            is_separator = line.strip() in ("---", "***", "___")
            
            if (is_heading or is_separator) and current_block:
                # Finalize previous chunk
                block_text = "\n".join(current_block)
                if block_text.strip():
                    chunks.append({
                        "text": block_text.strip(),
                        "html": markdown.markdown(block_text, extensions=["tables"]),
                        "type": current_type,
                        "start_line": start_line
                    })
                current_block = []
                start_line = i
                current_type = "heading" if is_heading else "paragraph"
            
            current_block.append(line)
        
        # Final chunk
        if current_block:
            block_text = "\n".join(current_block)
            if block_text.strip():
                chunks.append({
                    "text": block_text.strip(),
                    "html": markdown.markdown(block_text, extensions=["tables"]),
                    "type": current_type,
                    "start_line": start_line
                })
        
        return chunks
    
    def _find_best_match(
        self, 
        target_content: str, 
        chunks: List[Dict[str, Any]]
    ) -> Optional[Tuple[int, float, List[Tuple[int, int, int]]]]:
        """
        Find best matching chunk using sequence alignment.
        
        Returns:
        - chunk_index: index of best matching chunk
        - score: similarity ratio (0-1)
        - matching_blocks: list of (i, j, n) tuples for alignment
        """
        target_lower = target_content.lower()
        best_idx = -1
        best_score = 0.0
        best_blocks = []
        
        for idx, chunk in enumerate(chunks):
            chunk_lower = chunk["text"].lower()
            
            # Use SequenceMatcher for precise alignment
            matcher = SequenceMatcher(None, target_lower, chunk_lower)
            ratio = matcher.ratio()
            
            if ratio > best_score:
                best_score = ratio
                best_idx = idx
                best_blocks = matcher.get_matching_blocks()
        
        if best_idx >= 0 and best_score >= 0.3:  # Minimum threshold
            return best_idx, best_score, best_blocks
        
        return None
    
    def _highlight_html(
        self, 
        html: str, 
        chunk_type: str,
        is_excel: bool = False
    ) -> str:
        """
        Wrap HTML in highlighting markup.
        
        For tables: highlight entire table with special styling
        For text: wrap in <mark> tags
        """
        soup = BeautifulSoup(html, "html.parser")
        
        if is_excel or chunk_type == "table":
            # Highlight tables with special styling
            for table in soup.find_all("table"):
                table["class"] = table.get("class", []) + ["highlight-table"]
        
        # Wrap in highlight container
        highlighted = f'<div id="highlight-target" class="highlight-container">{str(soup)}</div>'
        return highlighted
    
    def generate_highlighted_html(
        self, 
        file_path: str, 
        chunk_content: str
    ) -> Dict[str, Any]:
        """
        Main method: generate full HTML page with highlighting.
        
        Args:
            file_path: Path or URL to original document (.docx, .xlsx, etc.)
            chunk_content: Enriched chunk content to match
        
        Returns:
            Dict with:
            - html: Full HTML page with highlighting
            - matched: Whether a match was found
            - score: Similarity score
            - chunk_index: Index of matched chunk
        """
        try:
            # Load and parse document
            md_text = self._load_document(file_path)
            chunks = self._split_into_chunks(md_text)
            
            # Find best match
            match_result = self._find_best_match(chunk_content, chunks)
            
            if not match_result:
                # No good match found - return full document without highlight
                full_html = markdown.markdown(md_text, extensions=["tables"])
                return {
                    "html": self._wrap_in_page(full_html, highlighted=False),
                    "matched": False,
                    "score": 0.0,
                    "chunk_index": None
                }
            
            chunk_idx, score, matching_blocks = match_result
            matched_chunk = chunks[chunk_idx]
            
            # Detect file type
            is_excel = file_path.lower().endswith((".xlsx", ".xls"))
            
            # Build full HTML with highlighting
            html_parts = []
            for i, chunk in enumerate(chunks):
                if i == chunk_idx:
                    # Highlight this chunk
                    highlighted = self._highlight_html(
                        chunk["html"], 
                        chunk["type"],
                        is_excel
                    )
                    html_parts.append(highlighted)
                else:
                    html_parts.append(chunk["html"])
            
            full_html = "\n".join(html_parts)
            
            return {
                "html": self._wrap_in_page(full_html, highlighted=True),
                "matched": True,
                "score": round(score, 4),
                "chunk_index": chunk_idx,
                "chunk_type": matched_chunk["type"],
                "start_line": matched_chunk.get("start_line")
            }
            
        except Exception as e:
            logger.error(f"Highlighting failed: {e}")
            raise
    
    def _wrap_in_page(self, body_html: str, highlighted: bool = False) -> str:
        """Wrap content in full HTML page with styles and auto-scroll."""
        scroll_script = """
        <script>
        window.onload = function() {
            var el = document.getElementById("highlight-target");
            if (el) {
                el.scrollIntoView({behavior: "smooth", block: "center"});
            }
        }
        </script>
        """ if highlighted else ""
        
        return f"""
<!DOCTYPE html>
<html class="light">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <title>Document Highlight</title>
    <style>
        /* Open WebUI-inspired Design System */
        :root {{
            --color-gray-50: #f9f9f9;
            --color-gray-100: #ececec;
            --color-gray-200: #e3e3e3;
            --color-gray-300: #cdcdcd;
            --color-gray-800: #333;
            --color-gray-850: #262626;
            --color-gray-900: #171717;
            --color-gray-950: #0d0d0d;
        }}
        
        * {{
            box-sizing: border-box;
        }}
        
        html {{
            font-size: 16px;
        }}
        
        body {{
            font-family: 'Archivo', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif;
            line-height: 1.6;
            padding: 1.5rem;
            max-width: 1200px;
            margin: 0 auto;
            background: #fff;
            color: #000;
            transition: background-color 0.2s ease, color 0.2s ease;
        }}
        
        /* Dark mode styles */
        @media (prefers-color-scheme: dark) {{
            html {{
                background: var(--color-gray-900);
            }}
            
            body {{
                background: var(--color-gray-900);
                color: #eee;
            }}
            
            h1, h2, h3, h4, h5, h6 {{
                color: #f0f0f0 !important;
            }}
            
            p, li {{
                color: #d0d0d0;
            }}
            
            table {{
                background: var(--color-gray-850);
                border-color: rgba(255, 255, 255, 0.1);
            }}
            
            th, td {{
                border-color: rgba(255, 255, 255, 0.1);
                color: #d0d0d0;
            }}
            
            th {{
                background-color: var(--color-gray-800);
                color: #e0e0e0;
            }}
            
            tr:nth-child(even) {{
                background-color: rgba(255, 255, 255, 0.02);
            }}
            
            .highlight-container {{
                background: rgba(251, 191, 36, 0.15);
                border-color: rgba(251, 191, 36, 0.5);
            }}
            
            .highlight-table {{
                background: rgba(251, 191, 36, 0.08) !important;
                border-color: rgba(251, 191, 36, 0.6) !important;
            }}
            
            .highlight-table th {{
                background-color: rgba(251, 191, 36, 0.15) !important;
            }}
            
            mark {{
                background-color: rgba(251, 191, 36, 0.3);
                color: #fef3c7;
            }}
            
            code {{
                background: var(--color-gray-800);
                color: #f87171;
            }}
            
            pre {{
                background: var(--color-gray-850);
                border-color: rgba(255, 255, 255, 0.1);
            }}
        }}
        
        h1, h2, h3, h4, h5, h6 {{
            color: #1f2937;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
        }}
        
        h1 {{ font-size: 2rem; }}
        h2 {{ font-size: 1.5rem; }}
        h3 {{ font-size: 1.25rem; }}
        h4 {{ font-size: 1.125rem; }}
        
        p {{
            margin: 0.5rem 0;
            color: #374151;
        }}
        
        /* Table styling inspired by Open WebUI */
        table {{
            border-collapse: collapse;
            margin: 1rem 0;
            width: 100%;
            background: white;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            border-radius: 0.5rem;
            overflow: hidden;
            font-size: 0.875rem;
        }}
        
        th, td {{
            border: 1px solid rgba(0, 0, 0, 0.05);
            padding: 0.75rem;
            text-align: left;
        }}
        
        th {{
            background-color: var(--color-gray-50);
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            color: #4b5563;
            letter-spacing: 0.05em;
        }}
        
        tr:nth-child(even) {{
            background-color: rgba(0, 0, 0, 0.01);
        }}
        
        tr:hover {{
            background-color: rgba(0, 0, 0, 0.02);
        }}
        
        img {{
            max-width: 100%;
            height: auto;
            margin: 0.75rem 0;
            border-radius: 0.5rem;
        }}
        
        /* Highlight styling with animation */
        .highlight-container {{
            background: rgba(254, 243, 199, 0.5);
            border: 2px solid #fbbf24;
            border-radius: 0.75rem;
            padding: 1.25rem;
            margin: 1.5rem 0;
            box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
            animation: highlightPulse 2s ease-in-out;
        }}
        
        @keyframes highlightPulse {{
            0%, 100% {{ box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2); }}
            50% {{ box-shadow: 0 4px 20px rgba(251, 191, 36, 0.4); }}
        }}
        
        .highlight-table {{
            border: 3px solid #fbbf24 !important;
            background: rgba(254, 243, 199, 0.3) !important;
            box-shadow: 0 4px 12px rgba(251, 191, 36, 0.25) !important;
        }}
        
        .highlight-table th {{
            background-color: rgba(251, 191, 36, 0.2) !important;
        }}
        
        mark {{
            background-color: #fef3c7;
            color: #92400e;
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-weight: 500;
        }}
        
        /* Code styling */
        code {{
            font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
            font-size: 0.875em;
            padding: 0.2rem 0.4rem;
            background: var(--color-gray-100);
            color: #dc2626;
            border-radius: 0.375rem;
            font-weight: 600;
        }}
        
        pre {{
            background: var(--color-gray-50);
            border: 1px solid var(--color-gray-200);
            border-radius: 0.5rem;
            padding: 1rem;
            overflow-x: auto;
            margin: 1rem 0;
        }}
        
        pre code {{
            background: transparent;
            padding: 0;
            color: inherit;
        }}
        
        /* Scrollbar styling */
        ::-webkit-scrollbar {{
            height: 0.45rem;
            width: 0.45rem;
        }}
        
        ::-webkit-scrollbar-track {{
            background-color: transparent;
            border-radius: 9999px;
        }}
        
        ::-webkit-scrollbar-thumb {{
            background-color: rgba(215, 215, 215, 0.6);
            border-color: rgba(255, 255, 255, 1);
            border-radius: 9999px;
            border-width: 1px;
        }}
        
        @media (prefers-color-scheme: dark) {{
            ::-webkit-scrollbar-thumb {{
                background-color: rgba(67, 67, 67, 0.6);
                border-color: rgba(0, 0, 0, 1);
            }}
        }}
        
        /* Lists */
        ul, ol {{
            margin: 0.5rem 0;
            padding-left: 1.5rem;
        }}
        
        li {{
            margin: 0.25rem 0;
            color: #374151;
        }}
        
        /* Links */
        a {{
            color: #2563eb;
            text-decoration: underline;
            transition: color 0.2s ease;
        }}
        
        a:hover {{
            color: #1d4ed8;
        }}
        
        @media (prefers-color-scheme: dark) {{
            a {{
                color: #60a5fa;
            }}
            
            a:hover {{
                color: #93c5fd;
            }}
        }}
        
        /* Responsive design */
        @media (max-width: 768px) {{
            body {{
                padding: 1rem;
            }}
            
            table {{
                font-size: 0.75rem;
            }}
            
            th, td {{
                padding: 0.5rem;
            }}
        }}
    </style>
</head>
<body>
{body_html}
{scroll_script}
</body>
</html>
        """.strip()
</file>

<file path="flux-new-reason/app/core/milvus.py">
"""
MilvusClient vector store using OpenAI dense embeddings and BM25 sparse embeddings.

This module provides a reusable Milvus vector store implementation that supports:
- Hybrid search (OpenAI dense + BM25 sparse vectors)
- Document insertion with automatic embedding generation
- Multiple search strategies (dense, sparse, hybrid)
- Collection management and metadata filtering
- Built-in BM25 function for automatic sparse vector generation
"""

import os
import logging
from typing import List, Dict, Any, Optional
from pymilvus import (
    connections,
    utility,
    FieldSchema,
    CollectionSchema,
    DataType,
    Collection,
    AnnSearchRequest,
    WeightedRanker,
    RRFRanker,
    Function,
    FunctionType,
    db,
)
from pymilvus.model.dense import OpenAIEmbeddingFunction
from langchain_core.documents import Document

logger = logging.getLogger(__name__)


class MilvusClient:
    """Custom Milvus vector store using OpenAI dense embeddings and BM25 sparse embeddings for hybrid retrieval."""
    
    # Single source of truth for output fields across all queries and searches
    OUTPUT_FIELDS = [
        "pk", "text", "source", "filename", "group", "chunk_index", 
        "file_type", "image_count", "images_json", "original_file_url"
    ]
    
    def __init__(
        self, 
        uri: str, 
        db_name: str, 
        collection_name: str,
        openai_api_key: str,
        openai_base_url: str = "https://integrate.api.nvidia.com/v1",
        openai_model_name: str = "baai/bge-m3",
        embedding_dimensions: int = None,
        alias: str = 'default'
    ):
        """
        Initialize MilvusClient with connection and embedding functions.
        
        Args:
            uri: Milvus server URI
            db_name: Database name
            collection_name: Collection name
            openai_base_url: OpenAI API base URL (default: 'https://integrate.api.nvidia.com/v1')
            openai_api_key: OpenAI API key for dense embeddings
            openai_model_name: OpenAI model name (default: 'baai/bge-m3')
            embedding_dimensions: Embedding dimensions for OpenAI model (default: 1024)
            alias: Connection alias (default: 'default')
        """
        self.alias = alias
        self.db_name = db_name
        self.collection_name = collection_name
        self.embedding_dimensions = embedding_dimensions
        
        # Connect to Milvus
        connections.connect(uri=uri, alias=alias)
        
        # Initialize OpenAI embedding function for dense vectors
        self.openai_ef = OpenAIEmbeddingFunction(
            model_name=openai_model_name,
            base_url=openai_base_url,
            api_key=openai_api_key,
            dimensions=None # workaround, nim does not allow extra parameters
        )
        
        # Setup database
        self._setup_database()
        
        # Get or create collection
        self.collection = self._get_or_create_collection()
        
        logger.info(f"MilvusClient initialized with OpenAI model '{openai_model_name}' (dim={embedding_dimensions}) and BM25 sparse embeddings")

    def _setup_database(self):
        """Setup Milvus database."""
        existing_dbs = db.list_database()
        if self.db_name not in existing_dbs:
            db.create_database(self.db_name)
            logger.info(f"Created database: {self.db_name}")
        db.using_database(self.db_name)

    def _get_or_create_collection(self) -> Collection:
        """Get existing collection or create new one with hybrid schema."""
        if utility.has_collection(self.collection_name):
            collection = Collection(self.collection_name)
            collection.load()
            logger.info(f"Connected to existing collection '{self.collection_name}'")
            return collection
        
        return self._create_new_collection()

    def _create_new_collection(self) -> Collection:
        """Create new collection with hybrid vector schema using OpenAI + BM25."""
        fields = [
            FieldSchema(name="pk", dtype=DataType.VARCHAR, is_primary=True, auto_id=True, max_length=100),
            FieldSchema(name="text", dtype=DataType.VARCHAR, max_length=65535, enable_analyzer=True),
            FieldSchema(name="source", dtype=DataType.VARCHAR, max_length=1000),
            FieldSchema(name="filename", dtype=DataType.VARCHAR, max_length=500),
            FieldSchema(name="group", dtype=DataType.VARCHAR, max_length=100),
            FieldSchema(name="chunk_index", dtype=DataType.INT64),
            FieldSchema(name="file_type", dtype=DataType.VARCHAR, max_length=50),
            FieldSchema(name="image_count", dtype=DataType.INT64),
            FieldSchema(name="images_json", dtype=DataType.VARCHAR, max_length=10000),
            FieldSchema(name="original_file_url", dtype=DataType.VARCHAR, max_length=1000),
            # Sparse vector field for BM25 (auto-generated by BM25 function)
            FieldSchema(name="sparse_vector", dtype=DataType.SPARSE_FLOAT_VECTOR),
            # Dense vector field for OpenAI embeddings
            FieldSchema(name="dense_vector", dtype=DataType.FLOAT_VECTOR, dim=self.embedding_dimensions),
        ]
        schema = CollectionSchema(fields)

        # Add BM25 function to automatically generate sparse vectors from text
        bm25_function = Function(
            name="text_bm25_emb",
            input_field_names=["text"],
            output_field_names=["sparse_vector"],
            function_type=FunctionType.BM25,
        )
        schema.add_function(bm25_function)

        collection = Collection(self.collection_name, schema, consistency_level="Strong")
        
        # Create indexes
        # Sparse index for BM25 full-text search
        sparse_index = {"index_type": "SPARSE_INVERTED_INDEX", "metric_type": "BM25"}
        collection.create_index("sparse_vector", sparse_index)
        
        # Dense index for OpenAI semantic search
        dense_index = {"index_type": "AUTOINDEX", "metric_type": "COSINE"}
        collection.create_index("dense_vector", dense_index)
        
        collection.load()
        
        logger.info(f"Created new collection '{self.collection_name}' with OpenAI + BM25 hybrid schema")
        return collection

    # ==================== Insertion Methods ====================

    def insert_documents(self, documents: List[Document], batch_size: int = 50):
        """
        Insert documents with automatic hybrid embedding generation.
        
        Args:
            documents: List of LangChain Document objects
            batch_size: Number of documents to insert per batch
        """
        if not documents:
            logger.warning("No documents to insert")
            return

        total_batches = (len(documents) + batch_size - 1) // batch_size
        logger.info(f"Inserting {len(documents)} documents in {total_batches} batches...")

        for i in range(0, len(documents), batch_size):
            batch = documents[i:i + batch_size]
            batch_num = i // batch_size + 1
            
            # Extract texts and metadata
            texts = [doc.page_content for doc in batch]
            
            # Generate dense embeddings using OpenAI
            dense_embeddings = self.openai_ef.encode_documents(texts)
            
            # Note: BM25 sparse vectors are auto-generated by the BM25 function
            # We don't need to provide them manually
            
            # Prepare data for insertion
            data = [
                texts,
                [doc.metadata.get('source', '') for doc in batch],
                [doc.metadata.get('filename', '') for doc in batch],
                [doc.metadata.get('group', '') for doc in batch],
                [doc.metadata.get('chunk_index', 0) for doc in batch],
                [doc.metadata.get('file_type', '') for doc in batch],
                [doc.metadata.get('image_count', 0) for doc in batch],
                [doc.metadata.get('images_json', '[]') for doc in batch],
                [doc.metadata.get('original_file_url', '') for doc in batch],
                # sparse_vector is auto-generated, so we skip it
                dense_embeddings,
            ]
            
            # Insert into collection
            self.collection.insert(data)
            logger.info(f"Batch {batch_num}/{total_batches}: Inserted {len(batch)} documents")

        self.collection.flush()
        logger.info(f"Successfully inserted {len(documents)} documents into '{self.collection_name}'")

    # ==================== Search Methods ====================

    def dense_search(self, query: str, limit: int = 5, group_filter: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        Search using dense vectors only (OpenAI semantic search).
        
        Args:
            query: Search query
            limit: Number of results to return
            group_filter: Optional list of groups to filter by
            
        Returns:
            List of search results with metadata
        """
        # Generate query embedding using OpenAI
        query_dense_embedding = self.openai_ef.encode_queries([query])[0]
        search_params = {"metric_type": "COSINE", "params": {}}
        
        # Build filter expression if groups specified
        expr = self._build_group_filter(group_filter)
        
        res = self.collection.search(
            [query_dense_embedding],
            anns_field="dense_vector",
            limit=limit,
            output_fields=self.OUTPUT_FIELDS,
            param=search_params,
            expr=expr
        )[0]
        
        return self._format_search_results(res, include_scores=True)

    def sparse_search(self, query: str, limit: int = 5, group_filter: Optional[List[str]] = None) -> List[Dict[str, Any]]:
        """
        Search using sparse vectors only (BM25 full-text search).
        
        Args:
            query: Search query text
            limit: Number of results to return
            group_filter: Optional list of groups to filter by
            
        Returns:
            List of search results with metadata
        """
        # For BM25 search, we pass the text query directly
        # Milvus will automatically convert it to sparse vector using BM25
        search_params = {"metric_type": "BM25", "params": {}}
        
        # Build filter expression if groups specified  
        expr = self._build_group_filter(group_filter)
        
        res = self.collection.search(
            [query],  # Pass raw text for BM25 search
            anns_field="sparse_vector",
            limit=limit,
            output_fields=self.OUTPUT_FIELDS,
            param=search_params,
            expr=expr
        )[0]
        
        return self._format_search_results(res, include_scores=True)

    def hybrid_search(
        self, 
        query: str, 
        sparse_weight: float = 0.4, 
        dense_weight: float = 0.6, 
        limit: int = 5, 
        group_filter: Optional[List[str]] = None,
        use_rrf: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Search using hybrid approach with weighted ranking or RRF.
        
        Args:
            query: Search query
            sparse_weight: Weight for sparse (BM25) vector search
            dense_weight: Weight for dense (OpenAI) vector search
            limit: Number of results to return
            group_filter: Optional list of groups to filter by
            use_rrf: Use RRF (Reciprocal Rank Fusion) instead of weighted ranking
            
        Returns:
            List of search results with metadata
        """
        # Generate dense query embedding using OpenAI
        query_dense_embedding = self.openai_ef.encode_queries([query])[0]
        
        # Build filter expression if groups specified
        expr = self._build_group_filter(group_filter)
        
        # Create dense search request (semantic search with OpenAI)
        dense_search_params = {"metric_type": "COSINE", "params": {}}
        dense_req = AnnSearchRequest(
            [query_dense_embedding], "dense_vector", dense_search_params, limit=limit, expr=expr
        )
        
        # Create sparse search request (BM25 full-text search)
        sparse_search_params = {"metric_type": "BM25", "params": {}}
        sparse_req = AnnSearchRequest(
            [query],  # Pass raw text for BM25
            "sparse_vector", 
            sparse_search_params, 
            limit=limit, 
            expr=expr
        )
        
        # Choose ranker: RRF or Weighted
        if use_rrf:
            rerank = RRFRanker()
        else:
            rerank = WeightedRanker(sparse_weight, dense_weight)
        
        # Perform hybrid search with reranking
        res = self.collection.hybrid_search(
            [sparse_req, dense_req], 
            rerank=rerank, 
            limit=limit, 
            output_fields=self.OUTPUT_FIELDS
        )[0]
        
        return self._format_search_results(res, include_scores=True)

    def concatenate_dense_sparse_search(
        self, 
        query: str, 
        sparse_limit: int = 4, 
        dense_limit: int = 1, 
        group_filter: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search combining sparse and dense results, removing duplicates.
        
        Args:
            query: Search query
            sparse_limit: Number of sparse (BM25) results
            dense_limit: Number of dense (OpenAI) results
            group_filter: Optional list of groups to filter by
            
        Returns:
            Combined list of search results
        """
        sparse_results = self.sparse_search(query=query, limit=sparse_limit, group_filter=group_filter)
        dense_results = self.dense_search(query=query, limit=dense_limit, group_filter=group_filter)
        
        # Combine results, avoiding duplicates based on text content
        seen_texts = set()
        combined_results = []
        
        # Add sparse results first
        for result in sparse_results:
            if result['content'] not in seen_texts:
                seen_texts.add(result['content'])
                combined_results.append(result)
        
        # Add dense results if not already present
        for result in dense_results:
            if result['content'] not in seen_texts:
                seen_texts.add(result['content'])
                combined_results.append(result)
        
        # Pad with empty results if needed to maintain expected length
        target_length = sparse_limit + dense_limit
        while len(combined_results) < target_length:
            combined_results.append({
                'content': '',
                'source': '',
                'score': 0.0,
                'metadata': {}
            })
        
        return combined_results

    # ==================== Collection Management Methods ====================

    def get_collection_info(self) -> Dict[str, Any]:
        """Get collection statistics."""
        try:
            collection_stats = {
                "name": self.collection_name,
                "entities": self.collection.num_entities if hasattr(self.collection, 'num_entities') else 0
            }
            return collection_stats
        except Exception as e:
            logger.error(f"Error getting collection info: {e}")
            return {"name": self.collection_name, "entities": 0}

    def get_available_groups(self) -> List[str]:
        """Get all unique groups in the collection."""
        try:
            query_results = self.collection.query(
                expr="group != ''",
                output_fields=["group"],
                limit=16384
            )
            
            # Extract unique groups
            groups = set()
            for result in query_results:
                if result.get('group'):
                    groups.add(result['group'])
            
            return sorted(list(groups))
        except Exception as e:
            logger.error(f"Error getting available groups: {e}")
            return []

    def get_all_chunks(
        self, 
        limit: Optional[int] = None, 
        offset: int = 0, 
        group_filter: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Retrieve all chunks from the collection.
        
        Args:
            limit: Maximum number of chunks to return (None for default Milvus limit)
            offset: Number of chunks to skip
            group_filter: Optional list of groups to filter by
            
        Returns:
            List of chunks with metadata
        """
        try:
            # Build filter expression if groups specified
            expr = self._build_group_filter(group_filter)
            if expr is None:
                expr = "pk != ''"
            
            # Set limit - use Milvus query limit if not specified
            query_limit = limit if limit is not None else 16384
            
            query_results = self.collection.query(
                expr=expr,
                output_fields=self.OUTPUT_FIELDS,
                limit=query_limit,
                offset=offset
            )
            
            # Format results
            formatted_results = []
            for entity in query_results:
                metadata = {
                    'source': entity.get('source', ''),
                    'filename': entity.get('filename', ''),
                    'group': entity.get('group', ''),
                    'chunk_index': entity.get('chunk_index', 0),
                    'file_type': entity.get('file_type', ''),
                    'image_count': entity.get('image_count', 0),
                    'images_json': entity.get('images_json', '[]'),
                    'original_file_url': entity.get('original_file_url', '')
                }
                
                formatted_results.append({
                    'pk': entity.get('pk', ''),
                    'content': entity.get('text', ''),
                    'source': entity.get('source', ''),
                    'metadata': metadata
                })
            
            return formatted_results
        except Exception as e:
            logger.error(f"Error getting all chunks: {e}")
            raise

    def get_chunk_by_pk(self, pk: str) -> Dict[str, Any]:
        """
        Retrieve a single chunk by its primary key.
        
        Args:
            pk: Primary key of the chunk
            
        Returns:
            Chunk data with metadata
        """
        try:
            expr = f'pk == "{pk}"'
            
            query_results = self.collection.query(
                expr=expr,
                output_fields=self.OUTPUT_FIELDS,
                limit=1
            )
            
            if not query_results:
                return None
            
            entity = query_results[0]
            metadata = {
                'source': entity.get('source', ''),
                'filename': entity.get('filename', ''),
                'group': entity.get('group', ''),
                'chunk_index': entity.get('chunk_index', 0),
                'file_type': entity.get('file_type', ''),
                'image_count': entity.get('image_count', 0),
                'images_json': entity.get('images_json', '[]'),
                'original_file_url': entity.get('original_file_url', '')
            }
            
            return {
                'pk': entity.get('pk', ''),
                'content': entity.get('text', ''),
                'source': entity.get('source', ''),
                'metadata': metadata
            }
        except Exception as e:
            logger.error(f"Error getting chunk by pk '{pk}': {e}")
            raise

    def delete_by_groups(self, groups: List[str]):
        """
        Delete documents with specified group metadata from the collection.
        
        Args:
            groups: List of group names to delete
        """
        if not groups:
            return
        
        try:
            self.collection.load()
            
            for group in groups:
                expr = f'group == "{group}"'
                self.collection.delete(expr)
                logger.info(f"Deleted documents from group: {group}")
            
            self.collection.flush()
            logger.info(f"Successfully deleted documents from groups: {', '.join(groups)}")
            
        except Exception as e:
            logger.error(f"Error deleting groups: {e}")
            raise

    def disconnect(self):
        """Disconnect from Milvus server."""
        connections.disconnect(self.alias)
        logger.info("Disconnected from Milvus")

    # ==================== Helper Methods ====================

    def _build_group_filter(self, group_filter: Optional[List[str]]) -> Optional[str]:
        """Build filter expression for group filtering."""
        if group_filter:
            group_list = ", ".join([f'"{group}"' for group in group_filter])
            return f"group in [{group_list}]"
        return None

    def _format_search_results(self, search_results, include_scores: bool = False) -> List[Dict[str, Any]]:
        """Format Milvus search results into standard format."""
        formatted_results = []
        
        for hit in search_results:
            # Extract metadata
            metadata = {
                'source': hit.entity.get('source', ''),
                'filename': hit.entity.get('filename', ''),
                'group': hit.entity.get('group', ''),
                'chunk_index': hit.entity.get('chunk_index', 0),
                'file_type': hit.entity.get('file_type', ''),
                'image_count': hit.entity.get('image_count', 0),
                'images_json': hit.entity.get('images_json', '[]'),
                'original_file_url': hit.entity.get('original_file_url', '')
            }
            
            result = {
                'pk': hit.entity.get('pk', ''),
                'content': hit.entity.get('text', ''),
                'source': hit.entity.get('source', ''),
                'metadata': metadata
            }
            
            if include_scores:
                result['score'] = hit.score
            
            formatted_results.append(result)
        
        return formatted_results
</file>

<file path="flux-new-reason/app/core/postgres.py">
"""
PostgreSQL database connection and operations for Network Manager.

Provides connection pooling and intent persistence functionality.
"""

import os
import json
import logging
from typing import Optional
from datetime import datetime
from contextlib import asynccontextmanager

import asyncpg
from asyncpg.pool import Pool

from app.agents.schemas.network_manager import IntentObject

logger = logging.getLogger(__name__)


class PostgresClient:
    """Async PostgreSQL client with connection pooling."""
    
    def __init__(self):
        self.pool: Optional[Pool] = None
        self._dsn = self._build_dsn()
    
    def _build_dsn(self) -> str:
        """Build PostgreSQL DSN from environment variables."""
        host = os.getenv("DB_HOST", "localhost")
        port = os.getenv("DB_PORT", "5432")
        database = os.getenv("DB_NAME", "network_manager")
        user = os.getenv("DB_USER", "app")
        password = os.getenv("DB_PASSWORD", "appsecret")
        
        return f"postgresql://{user}:{password}@{host}:{port}/{database}"
    
    async def connect(self):
        """Initialize connection pool."""
        if self.pool is None:
            try:
                self.pool = await asyncpg.create_pool(
                    self._dsn,
                    min_size=2,
                    max_size=10,
                    command_timeout=60
                )
                logger.info("PostgreSQL connection pool created")
            except Exception as e:
                logger.error(f"Failed to create PostgreSQL pool: {e}")
                raise
    
    async def close(self):
        """Close connection pool."""
        if self.pool:
            await self.pool.close()
            self.pool = None
            logger.info("PostgreSQL connection pool closed")
    
    @asynccontextmanager
    async def acquire(self):
        """Acquire connection from pool."""
        if self.pool is None:
            await self.connect()
        
        async with self.pool.acquire() as conn:
            yield conn
    
    async def save_intent(self, intent: IntentObject) -> str:
        """
        Save an IntentObject to the database (spec 3.1 aligned).
        
        Args:
            intent: The IntentObject to save
            
        Returns:
            The intent_id from the intent object
        """
        # Parse start/end times if provided
        start_time = None
        end_time = None
        if intent.start_time:
            start_time = datetime.fromisoformat(intent.start_time)
        if intent.end_time:
            end_time = datetime.fromisoformat(intent.end_time)
        
        query = """
        INSERT INTO intent_history (
            intent_id, actor, task_type, target_type, target_id,
            execution_mode, start_time, end_time, trigger, kpi, note, raw_json
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (intent_id) DO UPDATE SET
            actor = EXCLUDED.actor,
            task_type = EXCLUDED.task_type,
            target_type = EXCLUDED.target_type,
            target_id = EXCLUDED.target_id,
            execution_mode = EXCLUDED.execution_mode,
            start_time = EXCLUDED.start_time,
            end_time = EXCLUDED.end_time,
            trigger = EXCLUDED.trigger,
            kpi = EXCLUDED.kpi,
            note = EXCLUDED.note,
            raw_json = EXCLUDED.raw_json,
            updated_at = CURRENT_TIMESTAMP
        RETURNING intent_id
        """
        
        try:
            async with self.acquire() as conn:
                result = await conn.fetchval(
                    query,
                    intent.intent_id,
                    intent.actor,
                    intent.task_type.value,
                    intent.target_type.value,
                    json.dumps(intent.target_id),  # Convert list to JSON
                    intent.execution_mode.value,
                    start_time,
                    end_time,
                    json.dumps(intent.trigger) if intent.trigger else None,  # Convert dict to JSON
                    json.dumps(intent.kpi) if intent.kpi else None,  # Convert dict to JSON
                    intent.note,
                    intent.model_dump_json()
                )
                logger.info(f"Saved intent: {result}")
                return result
        except Exception as e:
            logger.error(f"Failed to save intent: {e}")
            raise


# Global instance
_postgres_client: Optional[PostgresClient] = None


def get_postgres_client() -> PostgresClient:
    """Get or create global PostgreSQL client."""
    global _postgres_client
    if _postgres_client is None:
        _postgres_client = PostgresClient()
    return _postgres_client


async def save_intent(intent: IntentObject) -> str:
    """
    Convenience function to save an intent.
    
    Args:
        intent: The IntentObject to save
        
    Returns:
        The generated intent_id
    """
    client = get_postgres_client()
    return await client.save_intent(intent)
</file>

<file path="flux-new-reason/app/core/redis.py">
import redis

_redis_client = None

MULTI_LOCK_SCRIPT = """
for i = 1, #KEYS do
    local ok = redis.call('SET', KEYS[i], "true", "NX", "EX", ARGV[1])
    if not ok then
        -- rollback previously set locks
        for j = 1, i - 1 do
            redis.call('DEL', KEYS[j])
        end
        return {err="Item is assigned and is processing. Lock key: " .. KEYS[i]}
    end
end

return 1
"""

MULTI_RELEASE_SCRIPT = """
for i = 1, #KEYS do
    redis.call('DEL', KEYS[i])
end
return 1
"""


def get_redis():
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.Redis(
            host="172.20.1.109",
            port=30379,
            db=0,
            decode_responses=True,
            max_connections=50
        )
    return _redis_client

def multi_lock(lst: list[str]):
    r = get_redis()
    multi_lock_scr = r.register_script(MULTI_LOCK_SCRIPT)
    multi_lock_scr(keys=lst, args=[86400])  # lock for 24 hours

def multi_release(lst: list[str]):
    r = get_redis()
    multi_release_scr = r.register_script(MULTI_RELEASE_SCRIPT)
    multi_release_scr(keys=lst)
</file>

<file path="flux-new-reason/app/core/s3.py">
import boto3
from botocore.client import Config

class S3Client:
    def __init__(self, 
        endpoint="https://172.20.1.109:30444", 
        access_key="minioadmin", 
        secret_key="minioadmin123"
    ):
        self.s3 = boto3.client(
            's3',
            endpoint_url=endpoint,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            config=Config(signature_version='s3v4'),
            verify=False
        )

    def upload_file(self, file_path, bucket_name, object_name=None):
        """
        Upload a file to an S3 bucket.
        """
        if object_name is None:
            object_name = file_path.split('/')[-1]
        self.s3.upload_file(file_path, bucket_name, object_name)
        return f"s3://{bucket_name}/{object_name}"
    
    def download_file(self, bucket_name, object_name, file_path):
        """
        Download a file from an S3 bucket.
        """
        self.s3.download_file(bucket_name, object_name, file_path)
        return file_path
    
    def list_files(self, bucket_name, prefix=''):
        """
        List files in an S3 bucket.
        """
        response = self.s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        return [item['Key'] for item in response.get('Contents', [])]
    
    def delete_file(self, bucket_name, object_name):
        """
        Delete a file from an S3 bucket.
        """
        self.s3.delete_object(Bucket=bucket_name, Key=object_name)
        return True
    
    def create_bucket(self, bucket_name):
        """
        Create an S3 bucket.
        """
        self.s3.create_bucket(Bucket=bucket_name)
        return True

    def delete_bucket(self, bucket_name):
        """
        Delete an S3 bucket.
        """
        self.s3.delete_bucket(Bucket=bucket_name)
        return True
    
# Example usage:
# s3_client = S3Client(
#     endpoint='http://localhost:9000',
#     access_key='minioadmin',
#     secret_key='minioadmin'
# )
# s3_client.upload_file('local_file.txt', 'my-bucket', 'remote_file.txt')
</file>

<file path="flux-new-reason/app/core/searxng.py">
"""
SearXNG Web Search Client

Provides a client for interacting with a self-hosted SearXNG instance.
Designed for agent use, returns JSON responses by default.
"""

from typing import Any, Dict, List, Optional

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


class SearXNGClient:
    """Client for interacting with SearXNG search engine."""

    def __init__(self, base_url: str = "http://localhost:2222"):
        """
        Initialize the SearXNG client.

        Args:
            base_url: Base URL of the SearXNG instance
        """
        self.base_url = base_url.rstrip("/")
        self.search_endpoint = f"{self.base_url}/search"

        # Configure session with retry logic
        self.session = requests.Session()
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

    def search(
        self,
        query: str,
        language: str = "auto",
        time_range: str = "",
        safesearch: int = 0,
        categories: str = "general",
        max_results: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Perform a search query using SearXNG.

        Args:
            query: Search query string
            language: Language code (e.g., 'en', 'auto')
            time_range: Time range filter ('day', 'week', 'month', 'year', '')
            safesearch: Safe search level (0=None, 1=Moderate, 2=Strict)
            categories: Comma-separated categories (general, images, videos, news, etc.)
            max_results: Maximum number of results to return (None for all)

        Returns:
            Dictionary containing search results and metadata in SearXNG JSON format

        Raises:
            ConnectionError: If unable to connect to SearXNG
            TimeoutError: If request times out
            RuntimeError: If request fails for other reasons
        """
        params = {
            "q": query,
            "language": language,
            "time_range": time_range,
            "safesearch": safesearch,
            "categories": categories,
            "format": "json",
        }

        try:
            response = self.session.get(
                self.search_endpoint, params=params, timeout=10
            )
            response.raise_for_status()
            data = response.json()

            # Limit results if requested
            if max_results is not None and "results" in data:
                data["results"] = data["results"][:max_results]

            return data

        except requests.exceptions.ConnectionError:
            raise ConnectionError(
                f"Failed to connect to SearXNG at {self.base_url}. "
                "Make sure the service is running."
            )
        except requests.exceptions.Timeout:
            raise TimeoutError(
                f"Request to SearXNG timed out. The service may be overloaded."
            )
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Search request failed: {e}")

    def search_simple(
        self,
        query: str,
        max_results: int = 10,
        time_range: str = "",
    ) -> List[Dict[str, str]]:
        """
        Simplified search that returns only essential information.

        Args:
            query: Search query string
            max_results: Maximum number of results (default: 10)
            time_range: Time range filter ('day', 'week', 'month', 'year', '')

        Returns:
            List of dictionaries with keys: title, url, content, engines

        Raises:
            ConnectionError: If unable to connect to SearXNG
            TimeoutError: If request times out
            RuntimeError: If request fails
        """
        full_results = self.search(
            query=query,
            max_results=max_results,
            time_range=time_range,
        )

        simplified = []
        for result in full_results.get("results", []):
            simplified.append({
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "content": result.get("content", ""),
                "engines": result.get("engines", []),
                "score": result.get("score", 0),
            })

        return simplified

    def health_check(self) -> bool:
        """
        Check if the SearXNG service is healthy.

        Returns:
            True if service is healthy, False otherwise
        """
        try:
            response = self.session.get(
                f"{self.base_url}/healthz", timeout=5
            )
            return response.status_code == 200
        except requests.RequestException:
            return False

    def get_suggestions(self, query: str) -> List[str]:
        """
        Get search suggestions for a query.

        Args:
            query: Partial search query

        Returns:
            List of suggested search terms
        """
        try:
            results = self.search(query=query, max_results=1)
            return results.get("suggestions", [])
        except Exception:
            return []
</file>

<file path="flux-new-reason/app/core/stream.py">
# -*- coding: utf-8 -*-
"""Async SSE emitter for streaming agentic workflow progress."""
from __future__ import annotations

import asyncio
import json
from typing import Any, AsyncIterator

_ICONS: dict[str, str] = {
    "start":             "🚀",
    "scanning":          "🔍",
    "scan_done":         "📊",
    "assigning":         "📋",
    "strategic_done":    "✅",
    "generating_plan":   "⚙️",
    "awaiting_callback": "⏳",
    "loading_plan":      "📥",
    "done":              "🎉",
    "error":             "❌",
}

_SENTINEL = object()


class AsyncEmitter:
    """Thread-safe SSE event emitter backed by asyncio.Queue.

    Usage::

        emitter = AsyncEmitter()

        async def run():
            await do_work(emitter=emitter)
            emitter.done()

        asyncio.create_task(run())
        async for chunk in emitter.iter_sse():
            yield chunk          # StreamingResponse body
    """

    def emit(self, type: str, text: str) -> None:
        """Enqueue a progress SSE event (safe to call from any coroutine)."""
        event = {"channel": "progress", "type": type, "icon": _ICONS.get(type, "•"), "text": text}
        self._queue.put_nowait(event)

    def emit_data(self, type: str, **data: Any) -> None:
        """Enqueue a content SSE event for streaming structured results."""
        event = {"channel": "content", "type": type, **data}
        self._queue.put_nowait(event)

    def done(self) -> None:
        """Signal end-of-stream (must be called exactly once)."""
        self._queue.put_nowait(_SENTINEL)

    # ── Lifecycle ──────────────────────────────────────────────────────────────

    def __init__(self) -> None:
        self._queue: asyncio.Queue = asyncio.Queue()

    async def iter_sse(self) -> AsyncIterator[str]:
        """Yield ``data: <json>\n\n`` SSE frames until sentinel received."""
        while True:
            item = await self._queue.get()
            if item is _SENTINEL:
                break
            yield f"data: {json.dumps(item)}\n\n"
</file>

<file path="flux-new-reason/app/models/schemas.py">
"""
Pydantic models for RAG API request and response schemas.

These models define the structure and validation rules for API endpoints.
Organized by domain: retrieval, documents, collections, chat, and health.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


# =============================================================================
# RETRIEVAL SCHEMAS
# =============================================================================

class RetrievalQueryInput(BaseModel):
    """Input model for document retrieval queries."""
    
    queries: List[str] = Field(
        ..., 
        description="List of queries", 
        min_length=1, 
        max_length=10
    )
    k: Optional[int] = Field(
        None,
        description="Number of documents to retrieve per query",
        ge=1,
        le=50
    )
    search_type: Optional[str] = Field(
        None,
        description="Search type: 'dense', 'sparse', 'hybrid', or 'concatenate'",
        pattern="^(dense|sparse|hybrid|concatenate)$"
    )
    dense_weight: Optional[float] = Field(
        None,
        description="Weight for dense vector search (unnormalized). Used for 'hybrid' and 'concatenate' search types",
        ge=0.0
    )
    sparse_weight: Optional[float] = Field(
        None,
        description="Weight for sparse vector search (unnormalized). Used for 'hybrid' and 'concatenate' search types",
        ge=0.0
    )
    groups: Optional[List[str]] = Field(
        None,
        description="Filter results by document groups. If provided, only documents from these groups will be returned",
        max_length=20
    )


class RetrievedDoc(BaseModel):
    """Model for retrieved documents for a single query."""
    
    query: str = Field(
        ..., 
        description="Original query"
    )
    results: List["DocumentResult"] = Field(
        ..., 
        description="Retrieved documents"
    )
    total_results: int = Field(
        ..., 
        description="Number of results returned"
    )


class RetrievalResponse(BaseModel):
    """Response model for retrieval endpoint."""
    
    responses: List[RetrievedDoc] = Field(
        ..., 
        description="Query responses"
    )
    status: str = Field(
        ..., 
        description="Response status"
    )
    message: Optional[str] = Field(
        None, 
        description="Additional information"
    )


# =============================================================================
# DOCUMENT SCHEMAS
# =============================================================================

class DocumentResult(BaseModel):
    """Model for a single document result."""
    
    pk: Optional[str] = Field(
        None,
        description="Primary key of the chunk"
    )
    content: str = Field(
        ..., 
        description="Document content"
    )
    source: Optional[str] = Field(
        None, 
        description="Document source"
    )
    score: Optional[float] = Field(
        None, 
        description="Similarity score"
    )
    metadata: Optional[Dict[str, Any]] = Field(
        None,
        description="Document metadata including group, filename, images, etc."
    )


class AllChunksResponse(BaseModel):
    """Response model for all chunks endpoint."""
    
    chunks: List[DocumentResult] = Field(
        ...,
        description="All chunks in the collection"
    )
    total_chunks: int = Field(
        ...,
        description="Total number of chunks returned"
    )
    offset: int = Field(
        ...,
        description="Offset used for pagination"
    )
    limit: Optional[int] = Field(
        None,
        description="Limit used for pagination"
    )
    status: str = Field(
        ...,
        description="Response status"
    )
    message: Optional[str] = Field(
        None,
        description="Additional information"
    )


# =============================================================================
# COLLECTION SCHEMAS
# =============================================================================

class CollectionInfo(BaseModel):
    """Model for collection information."""
    
    name: str
    database: str
    embedding_model: str
    entities: int


class GroupsResponse(BaseModel):
    """Response model for available groups endpoint."""
    
    groups: List[str]
    total_groups: int
    status: str


# =============================================================================
# CHAT SCHEMAS
# =============================================================================

class ChatMessage(BaseModel):
    """Model for a chat message."""
    
    role: str = Field(
        ...,
        description="Role of the message sender: 'system', 'user', or 'assistant'",
        pattern="^(system|user|assistant)$"
    )
    content: str = Field(
        ...,
        description="Content of the message"
    )


class ChatRequest(BaseModel):
    """Request model for chat completion."""
    
    messages: List[ChatMessage] = Field(
        ...,
        description="Conversation history",
        min_length=1
    )
    model: Optional[str] = Field(
        None,
        description="Model to use (OpenAI-compatible)"
    )
    temperature: Optional[float] = Field(
        None,
        ge=0.0,
        le=2.0,
        description="Sampling temperature"
    )
    top_p: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Nucleus sampling parameter"
    )
    max_tokens: Optional[int] = Field(
        None,
        ge=1,
        le=4096,
        description="Maximum tokens to generate"
    )
    stream: Optional[bool] = Field(
        False,
        description="Whether to stream the response"
    )
    
    # RAG-specific parameters
    rag_enabled: Optional[bool] = Field(
        True,
        description="Enable document retrieval"
    )
    k: Optional[int] = Field(
        None,
        ge=1,
        le=20,
        description="Number of documents to retrieve"
    )
    search_type: Optional[str] = Field(
        None,
        pattern="^(dense|sparse|hybrid|concatenate)$",
        description="Search type for retrieval"
    )
    dense_weight: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Weight for dense search"
    )
    sparse_weight: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="Weight for sparse search"
    )
    groups: Optional[List[str]] = Field(
        None,
        description="Filter documents by groups"
    )
    uploaded_files: Optional[List[str]] = Field(
        None,
        description="List of uploaded filenames"
    )


class ChatResponse(BaseModel):
    """Response model for chat completion."""
    
    content: str = Field(
        ...,
        description="Generated response content"
    )
    model: str = Field(
        ...,
        description="Model used"
    )
    retrieved_docs: Optional[List[DocumentResult]] = Field(
        None,
        description="Documents retrieved for context (if RAG enabled)"
    )
    status: str = Field(
        ...,
        description="Response status"
    )


# =============================================================================
# HIGHLIGHT SCHEMAS
# =============================================================================

class HighlightRequest(BaseModel):
    """Request model for document highlighting."""
    
    file_path: str = Field(
        ...,
        description="Path or URL to original document (will be converted to .md)"
    )
    chunk_content: str = Field(
        ...,
        description="Enriched chunk content to match against original document",
        min_length=1
    )


class HighlightResponse(BaseModel):
    """Response model for document highlighting."""
    
    html: str = Field(
        ...,
        description="Full HTML page with highlighted content"
    )
    matched: bool = Field(
        ...,
        description="Whether a match was found"
    )
    score: float = Field(
        ...,
        description="Similarity score (0-1)"
    )
    chunk_index: Optional[int] = Field(
        None,
        description="Index of matched chunk in document"
    )
    chunk_type: Optional[str] = Field(
        None,
        description="Type of matched chunk (heading, paragraph, table)"
    )
    start_line: Optional[int] = Field(
        None,
        description="Approximate line number of match"
    )
    status: str = Field(
        ...,
        description="Response status"
    )
    message: Optional[str] = Field(
        None,
        description="Additional information"
    )


# =============================================================================
# HEALTH SCHEMAS
# =============================================================================

class HealthResponse(BaseModel):
    """Response model for health check endpoint."""
    
    status: str
    vector_store_connected: bool
    embedding_model: str
    collection_info: Optional[Dict[str, Any]] = None
</file>

<file path="flux-new-reason/app/utils/conversion.py">
"""
File conversion and encoding utilities for document preprocessing.

Provides reusable functions for:
- Converting Office documents (Word, Excel, PowerPoint) to modern formats
- Converting text encodings to UTF-8
- Normalizing filenames (spaces, Vietnamese characters)
"""

import os
import platform
import shutil
import subprocess
import unicodedata
from charset_normalizer import from_path
from pathlib import Path
from typing import Optional, List

# Windows-specific imports
if platform.system() == 'Windows':
    try:
        import win32com.client
        WINDOWS_COM_AVAILABLE = True
    except ImportError:
        WINDOWS_COM_AVAILABLE = False
else:
    WINDOWS_COM_AVAILABLE = False


def detect_encoding(file_path: str) -> str:
    """
    Detect file encoding using charset-normalizer.
    
    Args:
        file_path: Path to file to detect encoding for
    
    Returns:
        Detected encoding name (defaults to 'utf-8' if detection fails)
    """
    try:
        result = from_path(file_path).best()
        return result.encoding if result else 'utf-8'
    except Exception:
        return 'utf-8'


def convert_to_utf8(file_path: Path) -> bool:
    """
    Convert file encoding to UTF-8.
    
    Args:
        file_path: Path to file to convert
    
    Returns:
        True if successful, False otherwise
    """
    encoding = detect_encoding(file_path)
    
    if encoding.lower() in ['utf-8', 'ascii']:
        return True
    
    try:
        # Read with detected encoding
        with open(file_path, 'r', encoding=encoding) as f:
            content = f.read()
        
        # Write back as UTF-8
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"  ✓ Converted {file_path.name} from {encoding} to UTF-8")
        return True
    except Exception as e:
        print(f"  ✗ Failed to convert {file_path.name}: {e}")
        return False


def normalize_encodings(docs_dir: Path, text_extensions: Optional[List[str]] = None) -> None:
    """
    Normalize encodings for text files to UTF-8.
    
    Args:
        docs_dir: Directory containing files to normalize
        text_extensions: List of file extensions to process (default: common text formats)
    """
    if text_extensions is None:
        text_extensions = ['.md', '.txt', '.csv', '.xml', '.html', '.css', 
                          '.js', '.py', '.sh', '.conf', '.log']
    
    print("\n🔤 Normalizing file encodings to UTF-8...")
    
    for ext in text_extensions:
        for file_path in docs_dir.rglob(f'*{ext}'):
            convert_to_utf8(file_path)
    
    # Also check files without extensions
    for file_path in docs_dir.iterdir():
        if (file_path.is_file() and 
            not file_path.suffix and 
            not file_path.name.startswith('.')):
            # Simple heuristic: try to read as text
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    f.read(100)  # Try to read first 100 chars
                convert_to_utf8(file_path)
            except Exception:
                pass  # Not a text file


def convert_office_docs_windows(docs_dir: Path) -> None:
    """
    Convert Office documents using Windows COM automation.
    Requires pywin32 package on Windows.
    
    Args:
        docs_dir: Directory containing Office documents to convert
    """
    if not WINDOWS_COM_AVAILABLE:
        print("⚠ Windows COM automation not available. Install pywin32: pip install pywin32")
        return
    
    print("\n📄 Converting Office documents using Windows COM...")
    
    # Word conversions (.doc -> .docx)
    word_files = list(docs_dir.rglob('*.doc'))
    if word_files:
        try:
            word_app = win32com.client.Dispatch("Word.Application")
            word_app.Visible = False
            word_app.DisplayAlerts = False
            
            for file_path in word_files:
                print(f"Converting {file_path.name}...")
                try:
                    # Open document
                    doc = word_app.Documents.Open(str(file_path.absolute()))
                    
                    # Save as .docx (format 16 = wdFormatXMLDocument)
                    new_path = file_path.with_suffix('.docx')
                    doc.SaveAs2(str(new_path.absolute()), FileFormat=16)
                    doc.Close()
                    
                    # Remove original file
                    file_path.unlink()
                    print(f"  ✓ {file_path.name} → {new_path.name}")
                    
                except Exception as e:
                    print(f"  ✗ Error converting {file_path.name}: {e}")
                    try:
                        doc.Close()
                    except:
                        pass
            
            word_app.Quit()
            
        except Exception as e:
            print(f"  ✗ Failed to initialize Word application: {e}")
    
    # Excel conversions (.xls -> .xlsx)
    excel_files = list(docs_dir.rglob('*.xls'))
    if excel_files:
        try:
            excel_app = win32com.client.Dispatch("Excel.Application")
            excel_app.Visible = False
            excel_app.DisplayAlerts = False
            
            for file_path in excel_files:
                print(f"Converting {file_path.name}...")
                try:
                    # Open workbook
                    wb = excel_app.Workbooks.Open(str(file_path.absolute()))
                    
                    # Save as .xlsx (format 51 = xlOpenXMLWorkbook)
                    new_path = file_path.with_suffix('.xlsx')
                    wb.SaveAs(str(new_path.absolute()), FileFormat=51)
                    wb.Close()
                    
                    # Remove original file
                    file_path.unlink()
                    print(f"  ✓ {file_path.name} → {new_path.name}")
                    
                except Exception as e:
                    print(f"  ✗ Error converting {file_path.name}: {e}")
                    try:
                        wb.Close()
                    except:
                        pass
            
            excel_app.Quit()
            
        except Exception as e:
            print(f"  ✗ Failed to initialize Excel application: {e}")
    
    # PowerPoint conversions (.ppt -> .pptx)
    ppt_files = list(docs_dir.rglob('*.ppt'))
    if ppt_files:
        try:
            ppt_app = win32com.client.Dispatch("PowerPoint.Application")
            ppt_app.Visible = False
            
            for file_path in ppt_files:
                print(f"Converting {file_path.name}...")
                try:
                    # Open presentation
                    pres = ppt_app.Presentations.Open(str(file_path.absolute()))
                    
                    # Save as .pptx (format 24 = ppSaveAsOpenXMLPresentation)
                    new_path = file_path.with_suffix('.pptx')
                    pres.SaveAs(str(new_path.absolute()), FileFormat=24)
                    pres.Close()
                    
                    # Remove original file
                    file_path.unlink()
                    print(f"  ✓ {file_path.name} → {new_path.name}")
                    
                except Exception as e:
                    print(f"  ✗ Error converting {file_path.name}: {e}")
                    try:
                        pres.Close()
                    except:
                        pass
            
            ppt_app.Quit()
            
        except Exception as e:
            print(f"  ✗ Failed to initialize PowerPoint application: {e}")


def convert_office_docs_libreoffice(docs_dir: Path) -> None:
    """
    Convert Office documents using LibreOffice (fallback method).
    Works on Windows, Linux, and macOS.
    
    Args:
        docs_dir: Directory containing Office documents to convert
    """
    conversions = [
        ('.doc', '.docx'),
        ('.xls', '.xlsx'), 
        ('.ppt', '.pptx')
    ]
    
    # Check if LibreOffice is available
    try:
        subprocess.run(['libreoffice', '--version'], 
                      capture_output=True, check=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("⚠ LibreOffice not found. Skipping Office document conversion.")
        return
    
    print("\n📄 Converting Office documents using LibreOffice...")
    
    for old_ext, new_ext in conversions:
        for file_path in docs_dir.rglob(f'*{old_ext}'):
            print(f"Converting {file_path.name}...")
            
            try:
                # Convert using LibreOffice (output to same directory as source file)
                result = subprocess.run([
                    'libreoffice', '--headless', '--convert-to', 
                    new_ext.lstrip('.'), '--outdir', str(file_path.parent), str(file_path)
                ], capture_output=True, text=True)
                
                if result.returncode == 0:
                    file_path.unlink()  # Remove original
                    new_file = file_path.with_suffix(new_ext)
                    print(f"  ✓ {file_path.name} → {new_file.name}")
                else:
                    print(f"  ✗ Failed to convert {file_path.name}")
            except Exception as e:
                print(f"  ✗ Error converting {file_path.name}: {e}")


def convert_office_docs(docs_dir: Path) -> None:
    """
    Convert Office documents using the best available method.
    Tries Windows COM automation first (if available), then falls back to LibreOffice.
    
    Args:
        docs_dir: Directory containing Office documents to convert
    """
    # Check what files need conversion
    office_files = (
        list(docs_dir.rglob('*.doc')) + 
        list(docs_dir.rglob('*.xls')) + 
        list(docs_dir.rglob('*.ppt'))
    )
    
    if not office_files:
        print("\n📄 No Office documents found to convert.")
        return
    
    # Use Windows COM if available and on Windows
    if platform.system() == 'Windows' and WINDOWS_COM_AVAILABLE:
        convert_office_docs_windows(docs_dir)
    else:
        # Fallback to LibreOffice
        if platform.system() == 'Windows' and not WINDOWS_COM_AVAILABLE:
            print("⚠ Windows COM not available. Install pywin32 for better Office document support:")
            print("  pip install pywin32")
            print("  Falling back to LibreOffice...")
        convert_office_docs_libreoffice(docs_dir)


def convert_text_to_markdown(docs_dir: Path, extensions: Optional[List[str]] = None) -> None:
    """
    Convert text files to markdown by renaming extensions.
    
    Args:
        docs_dir: Directory containing text files to convert
        extensions: List of extensions to convert (default: common text formats)
    """
    if extensions is None:
        extensions = ['.txt', '.config', '.property', '.json']
    
    print("\n📝 Converting text files to markdown...")
    
    for ext in extensions:
        for file_path in docs_dir.rglob(f'*{ext}'):
            print(f"Converting {file_path.name}...")
            
            # Create new markdown file
            new_path = file_path.with_suffix('.md')
            shutil.move(str(file_path), str(new_path))
            print(f"  ✓ {file_path.name} → {new_path.name}")


def vietnamese_to_ascii(text: str) -> str:
    """
    Convert Vietnamese characters in text to ASCII equivalents.
    
    Args:
        text: Text containing Vietnamese characters
    
    Returns:
        Text with Vietnamese characters replaced by ASCII equivalents
    """
    # Vietnamese character mappings
    vietnamese_map = {
        'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        'đ': 'd',
        # Uppercase variants
        'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
        'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
        'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
        'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
        'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
        'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
        'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
        'Đ': 'D'
    }
    
    # First try the manual mapping for Vietnamese characters
    result = ''
    for char in text:
        result += vietnamese_map.get(char, char)
    
    # Then use unicodedata to handle any remaining accented characters
    result = unicodedata.normalize('NFD', result)
    result = ''.join(char for char in result if unicodedata.category(char) != 'Mn')
    
    return result


def convert_vietnamese_filenames_to_ascii(docs_dir: Path) -> None:
    """
    Convert Vietnamese characters in filenames to ASCII equivalents.
    
    Args:
        docs_dir: Directory containing files to rename
    """
    print("\n🇻🇳 Converting Vietnamese filenames to ASCII...")
    
    renamed_count = 0
    
    for file_path in docs_dir.rglob('*'):
        if file_path.is_file():
            original_name = file_path.name
            ascii_name = vietnamese_to_ascii(original_name)
            
            # Only rename if there's a difference
            if original_name != ascii_name:
                new_path = file_path.parent / ascii_name
                
                # Handle potential conflicts
                counter = 1
                original_new_path = new_path
                while new_path.exists():
                    stem = original_new_path.stem
                    suffix = original_new_path.suffix
                    new_path = file_path.parent / f"{stem}_{counter}{suffix}"
                    counter += 1
                
                try:
                    file_path.rename(new_path)
                    print(f"  ✓ Converted: {original_name} → {new_path.name}")
                    renamed_count += 1
                except Exception as e:
                    print(f"  ✗ Failed to convert {original_name}: {e}")
    
    if renamed_count == 0:
        print("  No Vietnamese filenames found to convert.")
    else:
        print(f"  ✓ Converted {renamed_count} Vietnamese filename(s) to ASCII.")


def rename_files_with_spaces(docs_dir: Path) -> None:
    """
    Rename files and first-level directories by replacing spaces with underscores.
    
    Args:
        docs_dir: Directory containing files and subdirectories to rename
    """
    print("\n📝 Renaming files and first-level directories (replacing spaces with underscores)...")
    
    # First, rename first-level directories only (document groups)
    # These are the immediate subfolders within docs_dir
    for dir_path in docs_dir.iterdir():
        if dir_path.is_dir() and ' ' in dir_path.name:
            # Create new directory name with underscores instead of spaces
            new_name = dir_path.name.replace(' ', '_')
            new_path = dir_path.parent / new_name
            
            # Handle potential conflicts
            counter = 1
            original_new_path = new_path
            while new_path.exists():
                new_path = dir_path.parent / f"{new_name}_{counter}"
                counter += 1
            
            try:
                dir_path.rename(new_path)
                print(f"  ✓ Renamed group directory: {dir_path.name} → {new_path.name}")
            except Exception as e:
                print(f"  ✗ Failed to rename group directory {dir_path.name}: {e}")
    
    # Then rename files (all files recursively)
    for file_path in docs_dir.rglob('*'):
        if file_path.is_file() and ' ' in file_path.name:
            # Create new filename with underscores instead of spaces
            new_name = file_path.name.replace(' ', '_')
            new_path = file_path.parent / new_name
            
            # Handle potential conflicts
            counter = 1
            original_new_path = new_path
            while new_path.exists():
                stem = original_new_path.stem
                suffix = original_new_path.suffix
                new_path = file_path.parent / f"{stem}_{counter}{suffix}"
                counter += 1
            
            try:
                file_path.rename(new_path)
                print(f"  ✓ Renamed file: {file_path.name} → {new_path.name}")
            except Exception as e:
                print(f"  ✗ Failed to rename file {file_path.name}: {e}")
</file>

<file path="flux-new-reason/app/utils/event.py">
"""
Event utilities for Open WebUI-compatible event emission.

Provides reusable functions for creating event dictionaries that can be
yielded from agents/pipelines to provide real-time UI updates.

Event types supported:
- status: Show progress/status updates (✅ works in all modes)
- citation: Add source citations (✅ works in all modes)
- notification: Show toast notifications (✅ works in all modes)
- message: Append content to message (⚠️ default mode only)
- replace: Replace message content (⚠️ default mode only)
- files: Attach files to message (✅ works in all modes)

Quick Start Example:
    from app.utils.events import status_event, citation_event
    
    async def my_agent_run(self, messages):
        # Show progress
        yield status_event("Processing your request...")
        
        # Do some work
        results = await fetch_data()
        
        # Add source citation
        yield citation_event(
            content=results['text'],
            source_name="data_source.pdf"
        )
        
        # Complete
        yield status_event("Done!", done=True)
        yield "Here are your results..."
"""

from typing import Dict, Any, List, Optional


def status_event(description: str, done: bool = False, hidden: bool = False) -> Dict[str, Any]:
    """
    Create a status event for progress updates.
    
    Status events show live updates above the message content and are
    compatible with both default and native function calling modes.
    
    Args:
        description: Status message to display
        done: True if this represents completion
        hidden: True to auto-hide when done
        
    Returns:
        Event dictionary ready to yield
        
    Example:
        yield status_event("Processing data...", done=False)
        # ... do work ...
        yield status_event("Processing complete!", done=True)
    """
    return {
        "event": {
            "type": "status",
            "data": {
                "description": description,
                "done": done,
                "hidden": hidden
            }
        }
    }


def citation_event(
    content: str,
    source_name: str,
    metadata: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Create a citation event for source references.
    
    Citation events add clickable source references to the chat interface
    and are compatible with both default and native function calling modes.
    
    Args:
        content: The content/text from the source
        source_name: Name of the source (filename, URL, etc.)
        metadata: Optional metadata dict (e.g., page number, author)
        
    Returns:
        Event dictionary ready to yield
        
    Example:
        yield citation_event(
            content="Relevant document text...",
            source_name="technical_guide.pdf",
            metadata={"page": 5}
        )
    """
    meta = metadata or {}
    meta["source"] = source_name
    
    return {
        "event": {
            "type": "citation",
            "data": {
                "document": [content],
                "metadata": [meta],
                "source": {"name": source_name}
            }
        }
    }


def grouped_citation_event(
    documents: List[str],
    source_name: str,
    metadata_list: Optional[List[Dict[str, Any]]] = None,
    distances: Optional[List[float]] = None,
    source_url: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a grouped citation event for multiple chunks from the same source.
    
    This is useful when you have multiple chunks/pages from the same document
    and want to group them under a single citation. The frontend will show
    all chunks when the user clicks on the citation.
    
    Args:
        documents: List of content strings (one per chunk)
        source_name: Name of the source (filename, URL, etc.)
        metadata_list: Optional list of metadata dicts (one per chunk)
        distances: Optional list of relevance scores (one per chunk)
        source_url: Optional URL for the source (for web sources or file links)
        
    Returns:
        Event dictionary ready to yield
        
    Example:
        # Multiple chunks from same PDF
        yield grouped_citation_event(
            documents=["Content from page 1...", "Content from page 5..."],
            source_name="guide.pdf",
            metadata_list=[
                {"page": 1, "chunk_index": 0},
                {"page": 5, "chunk_index": 1}
            ],
            distances=[0.95, 0.87]
        )
        
        # Web source with multiple excerpts
        yield grouped_citation_event(
            documents=["First excerpt...", "Second excerpt..."],
            source_name="https://example.com/article",
            source_url="https://example.com/article",
            distances=[0.92, 0.88]
        )
    """
    # Ensure metadata_list matches documents length
    if metadata_list is None:
        metadata_list = [{"source": source_name} for _ in documents]
    else:
        # Add source to each metadata dict
        for meta in metadata_list:
            if "source" not in meta:
                meta["source"] = source_name
    
    citation_data = {
        "document": documents,
        "metadata": metadata_list,
        "source": {"name": source_name}
    }
    
    if distances:
        citation_data["distances"] = distances
        citation_data["scores"] = distances  # Duplicate for compatibility
    
    if source_url:
        citation_data["source"]["url"] = source_url
    
    return {
        "event": {
            "type": "citation",
            "data": citation_data
        }
    }


def notification_event(
    content: str,
    notification_type: str = "info"
) -> Dict[str, Any]:
    """
    Create a notification event for toast messages.
    
    Notification events show brief toast messages and are compatible
    with both default and native function calling modes.
    
    Args:
        content: Notification message
        notification_type: Type of notification - "info", "success", "warning", "error"
        
    Returns:
        Event dictionary ready to yield
        
    Example:
        yield notification_event("Task completed!", "success")
        yield notification_event("Warning: Rate limit approaching", "warning")
    """
    return {
        "event": {
            "type": "notification",
            "data": {
                "type": notification_type,
                "content": content
            }
        }
    }


def message_event(content: str) -> Dict[str, Any]:
    """
    Create a message event to append content.
    
    ⚠️ WARNING: Only works in DEFAULT function calling mode.
    Content will be overwritten in native mode.
    
    Args:
        content: Content to append to message
        
    Returns:
        Event dictionary ready to yield
        
    Example:
        yield message_event("Partial response... ")
        yield message_event("more content...")
    """
    return {
        "event": {
            "type": "message",
            "data": {
                "content": content
            }
        }
    }


def replace_event(content: str) -> Dict[str, Any]:
    """
    Create a replace event to replace entire message content.
    
    ⚠️ WARNING: Only works in DEFAULT function calling mode.
    Content will be overwritten in native mode.
    
    Args:
        content: New content to replace message with
        
    Returns:
        Event dictionary ready to yield
        
    Example:
        yield replace_event("## Updated Dashboard\\n\\nNew content here...")
    """
    return {
        "event": {
            "type": "replace",
            "data": {
                "content": content
            }
        }
    }


def files_event(files: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Create a files event to attach files to message.
    
    Files events are compatible with both default and native function calling modes.
    
    Args:
        files: List of file dicts with 'name' and 'url' keys
        
    Returns:
        Event dictionary ready to yield
        
    Example:
        yield files_event([
            {"name": "report.pdf", "url": "/files/report.pdf"},
            {"name": "data.csv", "url": "/files/data.csv"}
        ])
    """
    return {
        "event": {
            "type": "files",
            "data": {
                "files": files
            }
        }
    }


def title_event(title: str) -> Dict[str, Any]:
    """
    Create a title event to update chat title.
    
    Title events are compatible with both default and native function calling modes.
    
    Args:
        title: New chat title
        
    Returns:
        Event dictionary ready to yield
        
    Example:
        yield title_event("Market Analysis - Q4 2024")
    """
    return {
        "event": {
            "type": "chat:title",
            "data": {
                "title": title
            }
        }
    }


def tags_event(tags: List[str]) -> Dict[str, Any]:
    """
    Create a tags event to update chat tags.
    
    Tags events are compatible with both default and native function calling modes.
    
    Args:
        tags: List of tag strings
        
    Returns:
        Event dictionary ready to yield
        
    Example:
        yield tags_event(["research", "analysis", "completed"])
    """
    return {
        "event": {
            "type": "chat:tags",
            "data": {
                "tags": tags
            }
        }
    }
</file>

<file path="flux-new-reason/app/utils/file.py">
"""
File handling utilities for document processing.

Provides reusable functions for file discovery, path manipulation,
backup operations, and file organization across document processing pipelines.
"""

import os
import glob
import shutil
from typing import List, Optional, Set
from datetime import datetime
from pathlib import Path
import json


# Supported file extensions for document processing
SUPPORTED_EXTENSIONS: Set[str] = {
    ".md", ".txt", ".pdf", ".doc", ".docx", ".xls", ".xlsx",
    ".htm", ".html", ".csv", ".json", ".config", ".property"
}


def get_file_paths(
    doc_path: str,
    groups: Optional[List[str]] = None,
    offset: int = 0,
    limit: Optional[int] = None,
    extensions: Optional[Set[str]] = None
) -> List[str]:
    """
    Get list of supported files to process with pagination support.
    
    Args:
        doc_path: Root directory or file path to process
        groups: Optional list of subdirectory names to filter by
        offset: Number of files to skip from the beginning
        limit: Maximum number of files to return
        extensions: Set of file extensions to include (default: SUPPORTED_EXTENSIONS)
    
    Returns:
        Sorted list of file paths matching criteria
    """
    if extensions is None:
        extensions = SUPPORTED_EXTENSIONS
    
    # Handle single file case
    if os.path.isfile(doc_path):
        file_paths = [doc_path]
    else:
        # Handle directory with optional group filtering
        if groups:
            file_paths = []
            for group in groups:
                group_path = os.path.join(doc_path, group)
                if os.path.isdir(group_path):
                    group_files = glob.glob(os.path.join(group_path, "**", "*"), recursive=True)
                    group_files = [
                        f for f in group_files 
                        if os.path.isfile(f) and os.path.splitext(f)[1] in extensions
                    ]
                    file_paths.extend(group_files)
                    print(f"Found {len(group_files)} files in group '{group}'")
                else:
                    print(f"Warning: Group '{group}' not found in {doc_path}")
        else:
            # Process all supported files recursively
            file_paths = glob.glob(os.path.join(doc_path, "**", "*"), recursive=True)
            file_paths = [
                f for f in file_paths 
                if os.path.isfile(f) and os.path.splitext(f)[1] in extensions
            ]
    
    # Sort for consistent ordering
    file_paths.sort()
    
    # Apply pagination
    total_files = len(file_paths)
    print(f"Found {total_files} total files")
    
    if offset > 0:
        if offset >= total_files:
            print(f"⚠️ Offset {offset} >= total files {total_files}. No files to process.")
            return []
        file_paths = file_paths[offset:]
        print(f"📍 Starting from file {offset + 1} (skipped {offset} files)")
    
    if limit is not None:
        file_paths = file_paths[:limit]
        print(f"📝 Limited to {limit} files for this run")
    
    end_index = offset + len(file_paths)
    print(f"📊 Processing files {offset + 1}-{end_index} of {total_files} total")
    
    return file_paths


def get_document_group(file_path: str, base_path: str) -> str:
    """
    Extract the group (immediate subfolder) from a file path.
    
    Args:
        file_path: Full path to the file
        base_path: Base directory path to calculate relative path from
    
    Returns:
        Group name (subfolder), 'uncategorized' if at root, or 'external' if outside base_path
    """
    try:
        rel_path = os.path.relpath(file_path, base_path)
        path_parts = rel_path.split(os.sep)
        
        if len(path_parts) > 1:
            return path_parts[0]  # First directory is the group
        else:
            return "uncategorized"  # File at root level
    except ValueError:
        return "external"  # File outside base_path


def get_raw_file_path(
    doc_file_path: str,
    doc_path: str,
    raw_path: Optional[str] = None,
    extension_fallbacks: Optional[dict] = None
) -> str:
    """
    Map a processed file path to its original raw file path.
    
    Handles extension mapping for files that may have been converted
    (e.g., .doc -> .docx during processing).
    
    Args:
        doc_file_path: Path to processed file in docs directory
        doc_path: Base path of docs directory
        raw_path: Base path of raw directory (default: sibling 'raw' folder)
        extension_fallbacks: Dict mapping extensions to fallback extensions to try
    
    Returns:
        Path to original raw file, or doc_file_path if raw file not found
    """
    if extension_fallbacks is None:
        extension_fallbacks = {
            '.docx': ['.doc', '.docx'],
            '.doc': ['.doc', '.docx'],
            '.xlsx': ['.xls', '.xlsx'],
            '.xls': ['.xls', '.xlsx'],
            '.pptx': ['.ppt', '.pptx'],
            '.ppt': ['.ppt', '.pptx'],
            '.htm': ['.html', '.htm'],
            '.html': ['.html', '.htm']
        }
    
    # Determine raw_path
    if not raw_path:
        parent_dir = os.path.dirname(doc_path)
        raw_path = os.path.join(parent_dir, "raw")
    
    if not os.path.exists(raw_path):
        print(f"Warning: RAW_PATH '{raw_path}' does not exist, using processed file path")
        return doc_file_path
    
    try:
        # Calculate corresponding raw path
        rel_path = os.path.relpath(doc_file_path, doc_path)
        raw_file_path = os.path.join(raw_path, rel_path)
        
        # Check exact match first
        if os.path.exists(raw_file_path):
            return raw_file_path
        
        # Try extension fallbacks
        file_dir = os.path.dirname(raw_file_path)
        file_name_no_ext = os.path.splitext(os.path.basename(raw_file_path))[0]
        current_ext = os.path.splitext(raw_file_path)[1].lower()
        
        if current_ext in extension_fallbacks:
            for fallback_ext in extension_fallbacks[current_ext]:
                fallback_path = os.path.join(file_dir, file_name_no_ext + fallback_ext)
                if os.path.exists(fallback_path):
                    print(f"Found raw file with different extension: {os.path.basename(fallback_path)}")
                    return fallback_path
        
        print(f"Warning: Raw file not found at '{raw_file_path}', using processed file path")
        return doc_file_path
        
    except ValueError:
        # File not within doc_path
        return doc_file_path


def move_to_backup(
    file_path: str,
    backup_base_dir: str,
    reason: str = "corrupted"
) -> str:
    """
    Move a file to a backup directory with collision handling.
    
    Args:
        file_path: Path to file to backup
        backup_base_dir: Base backup directory (subdirectory will be created for reason)
        reason: Subdirectory name under backup_base_dir (e.g., 'corrupted', 'failed')
    
    Returns:
        Path to the backed up file
    """
    backup_dir = os.path.join(backup_base_dir, reason)
    os.makedirs(backup_dir, exist_ok=True)
    
    filename = os.path.basename(file_path)
    backup_path = os.path.join(backup_dir, filename)
    
    # Handle filename collisions
    counter = 1
    base_name, ext = os.path.splitext(filename)
    while os.path.exists(backup_path):
        backup_path = os.path.join(backup_dir, f"{base_name}_{counter}{ext}")
        counter += 1
    
    shutil.copy2(file_path, backup_path)
    print(f"⚠️ Moved {reason} file to backup: {backup_path}")
    
    return backup_path


def dump_oversized_chunk(
    chunk_text: str,
    metadata: dict,
    backup_base_dir: str,
    max_chars: int = 65535
) -> str:
    """
    Save oversized chunk to backup for debugging.
    
    Args:
        chunk_text: The oversized text content
        metadata: Associated metadata for context
        backup_base_dir: Base backup directory
        max_chars: Maximum character limit that was exceeded
    
    Returns:
        Path to the dumped file
    """
    backup_dir = os.path.join(backup_base_dir, "corrupted")
    os.makedirs(backup_dir, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"oversized_chunk_{timestamp}.json"
    filepath = os.path.join(backup_dir, filename)
    
    dump_data = {
        "error": "Chunk exceeds field limit",
        "char_count": len(chunk_text),
        "max_chars": max_chars,
        "excess_chars": len(chunk_text) - max_chars,
        "metadata": metadata,
        "chunk_text": chunk_text,
        "timestamp": datetime.now().isoformat()
    }
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(dump_data, f, indent=2, ensure_ascii=False)
    
    print(f"⚠️ OVERSIZED CHUNK: {len(chunk_text)} chars (limit: {max_chars})")
    print(f"   📁 Dumped to: {filepath}")
    print(f"   📊 Source: {metadata.get('filename', 'unknown')} (chunk {metadata.get('chunk_index', 'unknown')})")
    
    return filepath


def cleanup_directory(dir_path: str, ignore_errors: bool = True) -> None:
    """
    Remove a directory and all its contents.
    
    Args:
        dir_path: Path to directory to remove
        ignore_errors: If True, ignore errors during removal
    """
    if os.path.exists(dir_path):
        shutil.rmtree(dir_path, ignore_errors=ignore_errors)
        if not ignore_errors:
            print(f"🗑️ Cleaned up directory: {dir_path}")


def create_backup(source_dir: Path, backup_dir: Path) -> tuple[Path, Path]:
    """
    Create backup of all files in source directory (including nested folders).
    
    Args:
        source_dir: Source directory to backup
        backup_dir: Destination backup directory
    
    Returns:
        Tuple of (source_dir, backup_dir) paths
    
    Raises:
        FileNotFoundError: If source directory doesn't exist
    """
    if not source_dir.exists():
        raise FileNotFoundError(f"Source directory not found: {source_dir}")
    
    # Create backup directory
    backup_dir.mkdir(exist_ok=True)
    
    # Copy entire directory structure from source to backup
    if backup_dir.exists():
        shutil.rmtree(backup_dir)
    shutil.copytree(source_dir, backup_dir)
    
    print(f"✓ Backed up all files and folders from {source_dir.name}/ to {backup_dir.name}/")
    return source_dir, backup_dir
</file>

<file path="flux-new-reason/app/utils/streaming.py">
"""
Streaming utilities for API responses.

Provides reusable functions for:
- SSE (Server-Sent Events) formatting
- Agent response streaming
- Error handling in streams
"""

import json
import logging
from typing import Union, Any

from app.agents.base import BaseAgent

logger = logging.getLogger(__name__)


async def stream_agent_response(agent: BaseAgent, input_data: Any):
    """
    Generic streaming function for agent responses in SSE format.
    
    Yields SSE-formatted chunks compatible with OpenAI streaming format.
    Works with any BaseAgent implementation.
    
    Handles both text chunks (str) and event dictionaries (dict with 'event' key).
    
    Args:
        agent: Agent instance (any BaseAgent subclass)
        input_data: Input to pass to agent.run() (type depends on agent)
    
    Yields:
        SSE-formatted strings with agent response chunks or events
    """
    try:
        async for chunk in agent.run(input_data):
            # Check if chunk is an event dictionary
            if isinstance(chunk, dict) and "event" in chunk:
                # Pass through event as-is in SSE format
                yield f"data: {json.dumps(chunk)}\n\n"
            else:
                # Regular text content
                yield format_sse_chunk(chunk)
        
        yield format_sse_done()
    
    except Exception as e:
        logger.error(f"Streaming error: {e}", exc_info=True)
        error_msg = f"Error: {str(e)}"
        yield format_sse_chunk(error_msg)
        yield format_sse_done()


def format_sse_chunk(content: str) -> str:
    """
    Format a content chunk as an SSE data event.
    
    Uses OpenAI-compatible streaming format with choices/delta structure.
    
    Args:
        content: Text content to stream
    
    Returns:
        SSE-formatted string
    """
    return f"data: {json.dumps({'choices': [{'delta': {'content': content}}]})}\n\n"


def format_sse_done() -> str:
    """
    Format the final SSE done message.
    
    Returns:
        SSE-formatted done message
    """
    return "data: [DONE]\n\n"
</file>

<file path="flux-new-reason/app/utils/yaml.py">
"""
YAML loading utilities using C-accelerated PyYAML for performance.

Provides fast YAML parsing with CSafeLoader (falls back to SafeLoader if unavailable).
"""

from pathlib import Path
from typing import Any, Dict
import yaml

try:
    from yaml import CSafeLoader as SafeLoader
except ImportError:
    from yaml import SafeLoader


def load_yaml(file_path: str | Path) -> Dict[str, Any]:
    """
    Load YAML file and parse to Python dict using fast C loader.
    
    Args:
        file_path: Path to YAML file
    
    Returns:
        Parsed YAML content as dict, empty dict if file not found
    """
    yaml_path = Path(file_path)
    if not yaml_path.exists():
        return {}
    
    with open(yaml_path, 'r', encoding='utf-8') as f:
        return yaml.load(f, Loader=SafeLoader) or {}
</file>

<file path="flux-new-reason/app/workflows/system.py">
# -*- coding: utf-8 -*-
"""System workflow – orchestrates the scan → assign → plan pipeline.

Pipeline (no LLM):
    Caller ──SCAN_REQUEST──► StrategicAgent ──STRATEGIC_RESULT──► TacticalAgent
                             (scan + assign)                       (plan generation)

See README.md for the developer guide.
"""
from __future__ import annotations

import argparse
import asyncio
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional

import agentscope
from agentscope.message import Msg
from agentscope.tracing import trace

from app.agents.strategic_agent import StrategicAgent
from app.agents.tactical_agent import TacticalAgent
from app.core.stream import AsyncEmitter
from icflow.schemas import TaskType

logger = logging.getLogger(__name__)


# ──────────────────────────────────────────────────────────────────────────────
# Public entry point
# ──────────────────────────────────────────────────────────────────────────────

@trace(name="system_scan")
async def run_system_scan(
    task_type: TaskType,
    cells: list[str],
    timestamp: Optional[str] = None,
    kpi_dir: Optional[Path] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    enable_web_search: bool = True,
    save_to_db: bool = True,
    emitter: Optional[AsyncEmitter] = None,
) -> Msg:
    """Run one full scan→assign→plan cycle and return the PLAN_RESULT Msg.

    Parameters
    ----------
    task_type:
        Which task to run (``MRO`` or ``ES``).
    cells:
        Cell names to include in the scan.
    timestamp:
        ISO-8601 reference time.  Defaults to *now*.
    kpi_dir:
        Override the default KPI data directory.
    start_date / end_date:
        Date window passed to ``assign_task`` inside ``StrategicAgent``
        (required for MRO tasks).
    enable_web_search:
        Forward to ``scan_network`` (disable in tests / offline envs).
    save_to_db:
        Persist intent / decisions to Postgres.

    Returns
    -------
    Msg
        PLAN_RESULT from ``TacticalAgent`` (plan artefacts from MinIO).
    """
    strategic = StrategicAgent()

    if emitter:
        emitter.emit("start", f"Starting {task_type.value} system scan for {len(cells)} cell(s)...")

    # ── Step 1: Strategic scan + assignment ───────────────────────────────────
    scan_req = Msg(
        name="system",
        content=f"Scan {len(cells)} cells for {task_type.value} action.",
        role="user",
        metadata={
            "type": "SCAN_REQUEST",
            "task_type": task_type,
            "cells": cells,
            "timestamp": timestamp or datetime.now().isoformat(),
            "kpi_dir": str(kpi_dir) if kpi_dir else None,
            "start_date": start_date.isoformat() if start_date else None,
            "end_date": end_date.isoformat() if end_date else None,
            "enable_web_search": enable_web_search,
            "save_to_db": save_to_db,
        },
    )

    strategic_result: Msg = await strategic.reply(scan_req, emitter=emitter)

    logger.info(
        "[system] Strategic done – %d positive, %d assigned, %d failed",
        len(strategic_result.metadata.get("positive_cells", [])),
        len(strategic_result.metadata.get("assigned_cells", [])),
        len(strategic_result.metadata.get("failed_cells", [])),
    )

    # ── Step 2: Tactical plan generation ────────────────────────────────────
    assigned = strategic_result.metadata.get("assigned_cells", [])
    if not assigned:
        logger.info("[system] No assigned cells – skipping tactical plan generation.")
        if emitter:
            emitter.emit("done", "No cells require a plan – scan complete.")
        return strategic_result

    tactical = TacticalAgent()
    plan_result: Msg = await tactical.reply(strategic_result, emitter=emitter)

    logger.info(
        "[system] Tactical done – plan keys: %s",
        list(plan_result.metadata.get("plan", {}).keys()),
    )
    if emitter:
        keys = list(plan_result.metadata.get("plan", {}).keys())
        emitter.emit("done", f"Plan ready – artefacts: {', '.join(keys)}.")

    return plan_result


# ──────────────────────────────────────────────────────────────────────────────
# CLI entry point
# ──────────────────────────────────────────────────────────────────────────────

def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Network Manager – system scan workflow")
    p.add_argument("--task", required=True, choices=["MRO", "ES"], help="Task type")
    p.add_argument("--cells", help="Path to text file with cell names (one per line)")
    p.add_argument("--timestamp", help="ISO-8601 reference time (default: now)")
    p.add_argument("--kpi-dir", help="KPI directory override")
    p.add_argument("--start-date", help="Date window start (ISO-8601, MRO only)")
    p.add_argument("--end-date", help="Date window end (ISO-8601, MRO only)")
    p.add_argument("--no-web-search", action="store_true", help="Disable web search")
    p.add_argument("--no-db", action="store_true", help="Skip DB persistence")
    p.add_argument("--studio-url", help="AgentScope Studio URL for tracing")
    return p.parse_args()


async def _main() -> None:
    args = _parse_args()

    agentscope.init(
        project="vulcan",
        name="system-scan",
        studio_url=args.studio_url,
        logging_level="INFO",
    )

    task_type = TaskType.MRO if args.task == "MRO" else TaskType.ES

    if args.cells:
        cell_lines = Path(args.cells).read_text().splitlines()
        cells = [l.strip() for l in cell_lines if l.strip() and not l.startswith("#")]
    else:
        # Minimal default for quick smoke tests
        from icflow.scan_network import DEFAULT_CELLS
        cells = DEFAULT_CELLS

    result = await run_system_scan(
        task_type=task_type,
        cells=cells,
        timestamp=args.timestamp,
        kpi_dir=Path(args.kpi_dir) if args.kpi_dir else None,
        start_date=datetime.fromisoformat(args.start_date) if args.start_date else None,
        end_date=datetime.fromisoformat(args.end_date) if args.end_date else None,
        enable_web_search=not args.no_web_search,
        save_to_db=not args.no_db,
    )

    print("\n── System scan result ──────────────────────────────")
    print(result.content)
    meta = result.metadata
    if meta.get("type") == "PLAN_RESULT":
        print(f"  intent   : {meta.get('intent_id')}")
        print(f"  date     : {meta.get('date')}")
        print(f"  plan keys: {list(meta.get('plan', {}).keys())}")
    else:
        print(f"  positive : {meta.get('positive_cells')}")
        print(f"  assigned : {meta.get('assigned_cells')}")
        print(f"  failed   : {meta.get('failed_cells')}")
        if meta.get("errors"):
            print(f"  errors   : {meta['errors']}")


if __name__ == "__main__":
    asyncio.run(_main())
</file>

<file path="flux-new-reason/app/main.py">
"""
App - Main Application

This module provides the FastAPI application factory for the app service,
using a clean architecture with separated concerns.
"""

import sys
import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

load_dotenv()

from app.api import network_scan, historical_kpi, historical_alarm, plan, intent, cell_context_snapshot

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup and shutdown."""
    try:
        logger.info("Initializing app components...")
        
        # Initialize components here (e.g., database connections, caches)
        
        logger.info("App startup completed successfully")
        
    except Exception as e:
        logger.error(f"Failed to initialize app: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("App shutting down...")


def create_app() -> FastAPI:
    """
    Application factory for creating FastAPI app.
    
    Returns:
        Configured FastAPI application
    """
    app = FastAPI(
        lifespan=lifespan,
        title=os.getenv("API_TITLE", "Flux AI"),
        version=os.getenv("API_VERSION", "1.0.1"),
        description=os.getenv("API_DESCRIPTION", "Agentic AI Platform API"),
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins="*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(network_scan.router)  # Network scanning endpoint
    app.include_router(historical_kpi.router)  # Historical KPI extraction endpoint
    app.include_router(historical_alarm.router)  # Historical alarm extraction endpoint
    app.include_router(plan.router)    # Plan data endpoint
    app.include_router(intent.router)  # Intent management endpoint
    app.include_router(cell_context_snapshot.router)  # Cell context snapshot endpoint
    
    return app


# Create application instance
app = create_app()
</file>

<file path="flux-new-reason/app/serve.py">
# -*- coding: utf-8 -*-
"""AgentScope-traced entry point for the Vulcan service.

Initialises AgentScope tracing at module level (synchronous, root context) and
registers the ``/system-scan/run`` workflow endpoint directly on the standard
FastAPI ``app`` from ``app.main`` – which already includes all API routers.

Usage
-----
Development::

    python -m app.serve                                 # default 0.0.0.0:8099
    python -m app.serve --studio-url http://localhost:3883

Production (uvicorn)::

    AGENTSCOPE_STUDIO_URL=http://localhost:3883 \\
    uvicorn app.serve:app --host 0.0.0.0 --port 8099
"""
from __future__ import annotations

import argparse
import asyncio
import logging
import os
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional

import agentscope
from fastapi import Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from icflow.schemas import TaskType
from app.workflows.system import run_system_scan
from app.agents.tactical_agent import _pending as _tactical_pending
from app.core.stream import AsyncEmitter
from app.main import app  # FastAPI app with all routers already registered

logger = logging.getLogger(__name__)

# ── AgentScope init (module level = root context) ─────────────────────────────
# Must run synchronously before any asyncio Task is created so that the
# ContextVar `trace_enabled` is set in the root context and is inherited by
# every request-handler task.  Calling it inside an async lifespan hook sets
# the ContextVar only in that task's context and does NOT propagate to request
# handlers – which is why tracing silently drops all spans.
#
# --studio-url is extracted from sys.argv early (before argparse) so that the
# env var is already set when this module is imported via uvicorn as well.
for _i, _arg in enumerate(sys.argv[:-1]):
    if _arg in ("--studio-url", "--studio_url"):
        os.environ.setdefault("AGENTSCOPE_STUDIO_URL", sys.argv[_i + 1])
        break

_studio_url = os.getenv("AGENTSCOPE_STUDIO_URL")
agentscope.init(
    project="vulcan",
    name="api-serve",
    studio_url=_studio_url,
    logging_level="INFO",
)
if _studio_url:
    logging.getLogger(__name__).info("[tracing] AgentScope Studio → %s", _studio_url)
else:
    logging.getLogger(__name__).info(
        "[tracing] No tracing – set AGENTSCOPE_STUDIO_URL to enable AS Studio tracing"
    )


# ── Request / Response models ─────────────────────────────────────────────────

class SystemScanRequest(BaseModel):
    task_type: TaskType = Field(..., description="MRO or ES")
    cells: List[str] = Field(..., min_length=1, description="Cell names to scan")
    timestamp: Optional[str] = Field(None, description="ISO-8601 reference time")
    start_date: Optional[str] = Field(None, description="Date window start (ISO-8601, MRO)")
    end_date: Optional[str] = Field(None, description="Date window end (ISO-8601, MRO)")
    enable_web_search: bool = Field(False, description="Enable web search during scan")
    save_to_db: bool = Field(True, description="Persist results to Postgres")

    model_config = {"use_enum_values": True}


class SystemScanResponse(BaseModel):
    content: str
    intent_id: Optional[str]
    task_type: str
    # Strategic fields (always populated)
    positive_cells: List[str]
    assigned_cells: List[str]
    failed_cells: List[str]
    errors: List[Any]
    # Tactical fields (populated when TacticalAgent completes)
    plan: Optional[Dict[str, Any]]
    metadata: Dict[str, Any]


# ── Tactical callback ──────────────────────────────────────────────────────────

class TacticalCallbackBody(BaseModel):
    intent_id: str
    service_type: str
    status: str                         # e.g. "success" | "error"
    error_message: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


@app.post(
    "/tactical/callback",
    status_code=200,
    tags=["workflow"],
    summary="ML pipeline completion webhook",
)
async def tactical_callback(
    body: TacticalCallbackBody,
    token: str = Query(..., description="Per-request correlation token"),
) -> Dict[str, str]:
    """Called by the ML pipeline when plan generation is complete.

    The ML service POSTs ``{intent_id, service_type, status, error_message}``
    to ``/tactical/callback?token=<token>``.  We look up the waiting coroutine
    by ``token`` (not by the ML service’s own intent_id).
    """
    entry = _tactical_pending.get(token)
    if entry is None:
        logger.warning("[callback] Unknown token: %s", token)
        return {"status": "unknown", "token": token}
    evt, result_slot = entry
    result_slot["status"] = body.status
    result_slot["error_message"] = body.error_message
    result_slot["data"] = body.data
    evt.set()
    logger.info(
        "[callback] Signalled token=%s intent=%s status=%s",
        token, body.intent_id, body.status,
    )
    return {"status": "ok", "token": token}


# ── Workflow endpoint (registered on the main FastAPI app) ────────────────────

@app.post("/system-scan/run", response_model=SystemScanResponse, tags=["workflow"])
async def system_scan_run(request: SystemScanRequest) -> SystemScanResponse:
    """Execute a full scan → assign → plan cycle and return results."""
    result = await run_system_scan(
        task_type=TaskType(request.task_type),
        cells=request.cells,
        timestamp=request.timestamp,
        start_date=datetime.fromisoformat(request.start_date) if request.start_date else None,
        end_date=datetime.fromisoformat(request.end_date) if request.end_date else None,
        enable_web_search=request.enable_web_search,
        save_to_db=request.save_to_db,
    )
    meta = result.metadata or {}
    # Result may be PLAN_RESULT (full pipeline) or STRATEGIC_RESULT (fallback)
    strategic = meta if meta.get("type") == "STRATEGIC_RESULT" else meta
    return SystemScanResponse(
        content=result.content,
        intent_id=meta.get("intent_id"),
        task_type=meta.get("task_type") or "",
        positive_cells=meta.get("positive_cells") or [],
        assigned_cells=meta.get("assigned_cells") or [],
        failed_cells=meta.get("failed_cells") or [],
        errors=list((meta.get("errors") or {}).values()),
        plan=meta.get("plan"),
        metadata=meta,
    )


@app.post("/system-scan/stream", tags=["workflow"])
async def system_scan_stream(request: SystemScanRequest) -> StreamingResponse:
    """Stream scan → assign → plan progress as Server-Sent Events.

    Each event is a JSON object::

        {"type": "scanning", "icon": "🔍", "text": "Scanning 42 cells..."}

    Event types: ``start``, ``scanning``, ``scan_done``, ``assigning``,
    ``strategic_done``, ``generating_plan``, ``awaiting_callback``,
    ``loading_plan``, ``done``, ``error``.
    """
    emitter = AsyncEmitter()

    async def _run() -> None:
        try:
            await run_system_scan(
                task_type=TaskType(request.task_type),
                cells=request.cells,
                timestamp=request.timestamp,
                start_date=datetime.fromisoformat(request.start_date) if request.start_date else None,
                end_date=datetime.fromisoformat(request.end_date) if request.end_date else None,
                enable_web_search=request.enable_web_search,
                save_to_db=request.save_to_db,
                emitter=emitter,
            )
        except Exception as exc:
            logger.exception("[stream] Pipeline error: %s", exc)
            emitter.emit("error", str(exc))
        finally:
            emitter.done()

    asyncio.create_task(_run())
    return StreamingResponse(
        emitter.iter_sse(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── CLI entry point ───────────────────────────────────────────────────────────

def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Vulcan – AgentScope Runtime server")
    p.add_argument("--host", default="0.0.0.0")
    p.add_argument("--port", type=int, default=8099)
    p.add_argument("--studio-url", help="AgentScope Studio URL for tracing (overrides AGENTSCOPE_STUDIO_URL env var)")
    return p.parse_args()


if __name__ == "__main__":
    import uvicorn

    logging.basicConfig(level=logging.INFO)
    args = _parse_args()

    # CLI --studio-url takes precedence over the env var
    if args.studio_url:
        os.environ["AGENTSCOPE_STUDIO_URL"] = args.studio_url

    uvicorn.run(app, host=args.host, port=args.port, log_level="info")
</file>

<file path="flux-new-reason/icflow/dt-legacy/create_models.py">
"""
Script to create ML models for ES and MRO from CSV datasets
"""
import numpy as np
import pandas as pd
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from pathlib import Path

# Set random seed for reproducibility
np.random.seed(42)

def create_es_model(csv_path: str = 'data/dataset_es.csv'):
    """Create Energy Saving (ES) model from CSV data"""
    print("Creating ES model...")

    csv_file = Path(csv_path)

    # Feature names for ES
    feature_names = [
        'Persistent Low Load Score',
        'Energy Inefficiency Score',
        'Stable QoS Confidence',
        'Mobility Safety Index',
        'Social Event Score',
        'Traffic Volatility Index',
        'Weather Sensitivity Score',
        'n_alarm'
    ]

    # Check if CSV file exists
    if csv_file.exists():
        print(f"  Loading data from {csv_path}")
        df = pd.read_csv(csv_path)

        # Drop unnecessary columns if they exist
        columns_to_drop = ['intent_id', 'task_type', 'timestamp', 'cellname', 'recommendation']
        df = df.drop([col for col in columns_to_drop if col in df.columns], axis=1, errors='ignore')

        # Ensure we have the decision column
        if 'decision' not in df.columns:
            raise ValueError("CSV must contain 'decision' column")

        # Extract features and target
        X = df[feature_names]
        y = df['decision']

        print(f"  Loaded {len(df)} samples from CSV")
    else:
        print(f"  CSV file not found at {csv_path}, generating mock data...")

        # Generate mock training data (1000 samples)
        n_samples = 1000
        data = {}

        for feature in feature_names:
            if feature == 'Weather Sensitivity Score':
                # Range: -1 to 1
                data[feature] = np.random.uniform(-1, 1, n_samples)
            elif feature == 'n_alarm':
                # Integer alarm count
                data[feature] = np.random.randint(0, 10, n_samples)
            else:
                # Range: 0 to 1
                data[feature] = np.random.uniform(0, 1, n_samples)

        # Create DataFrame
        df = pd.DataFrame(data)

        # Generate decision labels based on some logic
        df['decision'] = (
            (df['Energy Inefficiency Score'] > 0.6) &
            (df['Persistent Low Load Score'] > 0.5) &
            (df['n_alarm'] < 5)
        ).astype(bool)

        X = df[feature_names]
        y = df['decision']

        print(f"  Generated {len(df)} mock samples")

    # Train model
    model = DecisionTreeClassifier(random_state=42, max_depth=20)
    model.fit(X, y)

    # Save model with feature names
    model_data = {
        'model': model,
        'feature_names': feature_names,
        'model_type': 'ES'
    }

    output_path = Path('models/es_model.pkl')
    output_path.parent.mkdir(exist_ok=True)

    with open(output_path, 'wb') as f:
        joblib.dump(model_data, f)

    print(f"✓ ES model saved to {output_path}")
    print(f"  Features: {len(feature_names)}")
    print(f"  Training samples: {len(X)}")
    print(f"  Training accuracy: {model.score(X, y):.2%}")
    print(f"  True decisions: {y.sum()} / {len(y)} ({y.sum()/len(y):.1%})")
    print()

    return model, feature_names

def create_mro_model(csv_path: str = '../data/dataset_mro.csv'):
    """Create MRO model from CSV data"""
    print("Creating MRO model...")

    # Feature names for MRO
    feature_names = [
        'Handover Failure Pressure',
        'Handover Success Stability',
        'Congestion-Induced HO Risk',
        'Mobility Volatility Index',
        'Weather-Driven Mobility Risk',
        'n_alarm',
        'Social Event Score'
    ]

    csv_file = Path(csv_path)

    # Check if CSV file exists
    if csv_file.exists():
        print(f"  Loading data from {csv_path}")
        df = pd.read_csv(csv_path)

        # Drop unnecessary columns if they exist
        columns_to_drop = ['intent_id', 'task_type', 'timestamp', 'cellname', 'recommendation']
        df = df.drop([col for col in columns_to_drop if col in df.columns], axis=1, errors='ignore')

        # Ensure we have the decision column
        if 'decision' not in df.columns:
            raise ValueError("CSV must contain 'decision' column")

        # Extract features and target
        X = df[feature_names]
        y = df['decision']

        print(f"  Loaded {len(df)} samples from CSV")
    else:
        print(f"  CSV file not found at {csv_path}, generating mock data...")

        # Generate mock training data (1000 samples)
        n_samples = 1000
        data = {}

        for feature in feature_names:
            if feature == 'Weather-Driven Mobility Risk':
                # Range: -1 to 1
                data[feature] = np.random.uniform(-1, 1, n_samples)
            elif feature == 'n_alarm':
                # Integer alarm count
                data[feature] = np.random.randint(0, 10, n_samples)
            else:
                # Range: 0 to 1
                data[feature] = np.random.uniform(0, 1, n_samples)

        # Create DataFrame
        df = pd.DataFrame(data)

        # Generate decision labels based on some logic
        df['decision'] = (
            (df['Handover Failure Pressure'] > 0.6) &
            (df['Handover Success Stability'] < 0.4) &
            (df['n_alarm'] > 4)
        ).astype(bool)

        X = df[feature_names]
        y = df['decision']

        print(f"  Generated {len(df)} mock samples")

    # Train model
    model = DecisionTreeClassifier(random_state=42, max_depth=20)
    model.fit(X, y)

    # Save model with feature names
    model_data = {
        'model': model,
        'feature_names': feature_names,
        'model_type': 'MRO'
    }

    output_path = Path('models/mro_model.pkl')
    output_path.parent.mkdir(exist_ok=True)

    with open(output_path, 'wb') as f:
        joblib.dump(model_data, f)

    print(f"✓ MRO model saved to {output_path}")
    print(f"  Features: {len(feature_names)}")
    print(f"  Training samples: {len(X)}")
    print(f"  Training accuracy: {model.score(X, y):.2%}")
    print(f"  True decisions: {y.sum()} / {len(y)} ({y.sum()/len(y):.1%})")
    print()

    return model, feature_names

def test_models():
    """Test loading and using the models"""
    print("Testing models...")

    # Test ES model
    es_model_path = Path('models/es_model.pkl')
    if not es_model_path.exists():
        print("ES model not found, skipping test")
        return

    with open(es_model_path, 'rb') as f:
        es_data = joblib.load(f)

    es_model = es_data['model']
    es_features = es_data['feature_names']

    # Create a test sample
    test_es = pd.DataFrame({
        'Persistent Low Load Score': [0.7],
        'Energy Inefficiency Score': [0.75],
        'Stable QoS Confidence': [0.9],
        'Mobility Safety Index': [0.85],
        'Social Event Score': [0.3],
        'Traffic Volatility Index': [0.4],
        'Weather Sensitivity Score': [0.2],
        'n_alarm': [2]
    })

    es_prediction = es_model.predict(test_es)
    es_proba = es_model.predict_proba(test_es)

    print(f"✓ ES model test:")
    print(f"  Prediction: {es_prediction[0]}")
    print(f"  Probability: {es_proba[0]}")
    print()

    # Test MRO model
    mro_model_path = Path('models/mro_model.pkl')
    if not mro_model_path.exists():
        print("MRO model not found, skipping test")
        return

    with open(mro_model_path, 'rb') as f:
        mro_data = joblib.load(f)

    mro_model = mro_data['model']
    mro_features = mro_data['feature_names']

    # Create a test sample
    test_mro = pd.DataFrame({
        'Handover Failure Pressure': [0.7],
        'Handover Success Stability': [0.3],
        'Congestion-Induced HO Risk': [0.6],
        'Mobility Volatility Index': [0.5],
        'Weather-Driven Mobility Risk': [-0.3],
        'n_alarm': [6],
        'Social Event Score': [0.4]
    })

    mro_prediction = mro_model.predict(test_mro)
    mro_proba = mro_model.predict_proba(test_mro)

    print(f"✓ MRO model test:")
    print(f"  Prediction: {mro_prediction[0]}")
    print(f"  Probability: {mro_proba[0]}")
    print()

if __name__ == "__main__":
    import sys

    print("=" * 60)
    print("Creating ML Models for ES and MRO")
    print("=" * 60)
    print()

    # Allow custom CSV paths as command line arguments
    es_csv_path = sys.argv[1] if len(sys.argv) > 1 else '../data/dataset_es.csv'
    mro_csv_path = sys.argv[2] if len(sys.argv) > 2 else '../data/dataset_mro.csv'

    create_es_model(es_csv_path)
    create_mro_model(mro_csv_path)
    test_models()

    print("=" * 60)
    print("✓ All models created successfully!")
    print("=" * 60)
</file>

<file path="flux-new-reason/icflow/dt-legacy/main.py">
"""
FastAPI Backend for EMS Report System
Provides ML model prediction endpoints for ES and MRO intent classification
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
from contextlib import asynccontextmanager
import logging

from model_service import get_model_service, PredictionResult

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models on startup and cleanup on shutdown"""
    try:
        model_service = get_model_service()
        logger.info("✓ Models loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load models: {e}")
        raise
    yield
    # Cleanup code here if needed
    logger.info("Shutting down...")

# Initialize FastAPI app
app = FastAPI(
    title="EMS ML Prediction API",
    description="Machine Learning prediction service for Energy Saving and MRO intent classification",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class PredictionRequest(BaseModel):
    """Request model for predictions"""
    model_type: str = Field(..., description="Model type: 'ES' or 'MRO'")
    features: Dict[str, float] = Field(..., description="Feature values for prediction")
    intent_id: Optional[str] = Field(None, description="Optional intent ID for tracking")

class FeatureImportance(BaseModel):
    """Feature importance information"""
    name: str
    value: float
    importance: float

class DecisionNode(BaseModel):
    """Decision tree node information"""
    nodeId: int
    condition: str
    threshold: float
    featureValue: float
    featureName: str
    passed: bool

class Counterfactual(BaseModel):
    """Counterfactual explanation"""
    feature: str
    currentValue: float
    thresholdValue: float
    alternativeIntent: str

class DecisionTraceResponse(BaseModel):
    """Complete decision tree trace response"""
    intentId: str
    intentLabel: str
    decision: bool
    confidence: float
    path: List[DecisionNode]
    topFeatures: List[FeatureImportance]
    counterfactual: List[Counterfactual]
    featureSnapshot: Dict[str, float]
    timestamp: str

class SimplePredictionResponse(BaseModel):
    """Simple prediction response"""
    model_type: str
    decision: bool
    confidence: float
    probabilities: List[float]
    timestamp: str

class ModelInfoResponse(BaseModel):
    """Model information response"""
    model_type: str
    features: List[str]
    n_features: int
    model_class: str

# Health check endpoint
@app.get("/", tags=["Health"])
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return JSONResponse({
        "status": "ok",
        "service": "EMS ML Prediction API",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat()
    })

# Simple prediction endpoint
@app.post("/predict", response_model=SimplePredictionResponse, tags=["Prediction"])
async def predict(request: PredictionRequest):
    """
    Make a simple prediction using ES or MRO model

    **Parameters:**
    - **model_type**: Either 'ES' or 'MRO'
    - **features**: Dictionary of feature names and values
    - **intent_id**: Optional tracking ID

    **Returns:** Prediction result with confidence scores
    """
    try:
        model_service = get_model_service()
        model_type = request.model_type.upper()

        # Make prediction
        if model_type == 'ES':
            result = model_service.predict_es(request.features)
        elif model_type == 'MRO':
            result = model_service.predict_mro(request.features)
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid model_type: {request.model_type}. Use 'ES' or 'MRO'"
            )

        return SimplePredictionResponse(
            model_type=result.model_type,
            decision=result.decision,
            confidence=result.confidence,
            probabilities=result.probabilities,
            timestamp=datetime.now().isoformat()
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# Decision trace endpoint
@app.post("/predict/trace", response_model=DecisionTraceResponse, tags=["Prediction"])
async def predict_with_trace(request: PredictionRequest):
    """
    Make prediction with full decision tree trace

    Provides detailed explanation of the prediction including:
    - Decision path through the tree
    - Feature importance values
    - Counterfactual explanations
    - Complete feature snapshot

    **Parameters:**
    - **model_type**: Either 'ES' or 'MRO'
    - **features**: Dictionary of feature names and values
    - **intent_id**: Optional tracking ID

    **Returns:** Complete decision trace with explanations
    """
    try:
        model_service = get_model_service()
        model_type = request.model_type.upper()
        intent_id = request.intent_id or f"intent_{datetime.now().strftime('%Y%m%d%H%M%S')}"

        # Make prediction with trace
        result, path = model_service.predict_with_trace(model_type, request.features)

        # Get top N features by importance
        sorted_features = sorted(
            result.feature_importances.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]

        top_features = [
            FeatureImportance(
                name=name,
                value=result.feature_values[name],
                importance=importance
            )
            for name, importance in sorted_features
        ]

        # Generate counterfactual explanations
        # Find features close to decision boundaries
        counterfactuals = []
        for node in path[:3]:  # Use first 3 decision nodes
            if node['featureName'] != 'LEAF':
                counterfactuals.append(Counterfactual(
                    feature=node['featureName'],
                    currentValue=node['featureValue'],
                    thresholdValue=node['threshold'],
                    alternativeIntent='ES' if model_type == 'MRO' else 'MRO'
                ))

        # Add leaf node to path
        if path:
            path.append({
                'nodeId': len(path),
                'condition': f'LEAF: {model_type} = {result.decision}',
                'threshold': 0.0,
                'featureValue': 0.0,
                'featureName': 'LEAF',
                'passed': True
            })

        return DecisionTraceResponse(
            intentId=intent_id,
            intentLabel=model_type,
            decision=result.decision,
            confidence=result.confidence,
            path=[DecisionNode(**node) for node in path],
            topFeatures=top_features,
            counterfactual=counterfactuals,
            featureSnapshot=result.feature_values,
            timestamp=datetime.now().isoformat()
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction trace error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction trace failed: {str(e)}")

# Model info endpoints
@app.get("/models/{model_type}/info", response_model=ModelInfoResponse, tags=["Models"])
async def get_model_info(model_type: str):
    """
    Get information about a specific model

    **Parameters:**
    - **model_type**: Either 'ES' or 'MRO'

    **Returns:** Model metadata including features and type
    """
    try:
        model_service = get_model_service()
        info = model_service.get_model_info(model_type)
        return ModelInfoResponse(**info)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Model info error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/models", tags=["Models"])
async def list_models():
    """List all available models"""
    return JSONResponse({
        "models": [
            {
                "type": "ES",
                "name": "Energy Saving Model",
                "endpoint": "/predict",
                "features": 9
            },
            {
                "type": "MRO",
                "name": "Mobility Robustness Optimization Model",
                "endpoint": "/predict",
                "features": 8
            }
        ]
    })

# Batch prediction endpoint
@app.post("/predict/batch", tags=["Prediction"])
async def predict_batch(requests: List[PredictionRequest]):
    """
    Make predictions for multiple samples

    **Parameters:**
    - **requests**: List of prediction requests

    **Returns:** List of prediction results
    """
    try:
        model_service = get_model_service()
        results = []

        for req in requests:
            model_type = req.model_type.upper()
            if model_type == 'ES':
                result = model_service.predict_es(req.features)
            elif model_type == 'MRO':
                result = model_service.predict_mro(req.features)
            else:
                results.append({
                    "error": f"Invalid model_type: {req.model_type}",
                    "intent_id": req.intent_id
                })
                continue

            results.append({
                "intent_id": req.intent_id,
                "model_type": result.model_type,
                "decision": result.decision,
                "confidence": result.confidence,
                "probabilities": result.probabilities
            })

        return JSONResponse({"results": results, "count": len(results)})

    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8181, reload=True)
</file>

<file path="flux-new-reason/icflow/dt-legacy/model_service.py">
"""
Model Service Layer for ES and MRO ML Models
Handles model loading, prediction, and feature importance extraction
"""
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple, Any, Optional
from pathlib import Path
from dataclasses import dataclass


@dataclass
class PredictionResult:
    """Result of model prediction"""
    decision: bool
    confidence: float
    probabilities: List[float]
    feature_values: Dict[str, float]
    feature_importances: Dict[str, float]
    model_type: str


class ModelService:
    """Service for managing and using ML models"""

    def __init__(self, es_model_path: str = "models/es_model.pkl", mro_model_path: str = "models/mro_model.pkl"):
        self.es_model_path = Path(es_model_path)
        self.mro_model_path = Path(mro_model_path)
        self.es_model_data = None
        self.mro_model_data = None

    def load_models(self):
        """Load both ES and MRO models"""
        try:
            with open(self.es_model_path, 'rb') as f:
                self.es_model_data = joblib.load(f)
            print(f"✓ Loaded ES model from {self.es_model_path}")

            with open(self.mro_model_path, 'rb') as f:
                self.mro_model_data = joblib.load(f)
            print(f"✓ Loaded MRO model from {self.mro_model_path}")

        except FileNotFoundError as e:
            raise RuntimeError(f"Model file not found: {e}")
        except Exception as e:
            raise RuntimeError(f"Error loading models: {e}")

    def _validate_features(self, data: Dict[str, float], expected_features: List[str]) -> pd.DataFrame:
        """Validate and prepare features for prediction"""
        # Check for missing features
        missing = set(expected_features) - set(data.keys())
        if missing:
            raise ValueError(f"Missing required features: {missing}")

        # Check for extra features
        extra = set(data.keys()) - set(expected_features)
        if extra:
            print(f"Warning: Extra features provided (will be ignored): {extra}")

        # Create DataFrame with correct feature order
        df = pd.DataFrame([{feat: data[feat] for feat in expected_features}])
        return df

    def _extract_feature_importances(self, model, feature_names: List[str]) -> Dict[str, float]:
        """Extract feature importances from DecisionTree model"""
        if hasattr(model, 'feature_importances_'):
            importances = model.feature_importances_
            return {name: float(imp) for name, imp in zip(feature_names, importances)}
        return {name: 0.0 for name in feature_names}

    def _get_decision_path(self, model, X: pd.DataFrame, feature_names: List[str]) -> List[Dict[str, Any]]:
        """
        Extract decision path from DecisionTreeClassifier model
        """
        path_nodes = []

        try:
            # DecisionTreeClassifier has tree_ attribute
            if not hasattr(model, 'tree_'):
                print(f"Warning: Model type {type(model).__name__} does not support decision path extraction")
                return path_nodes

            tree = model.tree_
            node_indicator = model.decision_path(X)

            # Get decision path for the sample
            node_index = node_indicator.indices[node_indicator.indptr[0]:node_indicator.indptr[1]]

            for node_id in node_index:
                # Skip leaf nodes initially
                if tree.feature[node_id] != -2:  # -2 indicates leaf node
                    feature_idx = tree.feature[node_id]
                    threshold = tree.threshold[node_id]
                    feature_name = feature_names[feature_idx]
                    feature_value = float(X.iloc[0][feature_name])

                    # Determine if condition passed
                    passed = feature_value > threshold

                    path_nodes.append({
                        'nodeId': int(node_id),
                        'condition': f'{feature_name} > {threshold:.2f}',
                        'threshold': float(threshold),
                        'featureValue': feature_value,
                        'featureName': feature_name,
                        'passed': passed
                    })
        except Exception as e:
            print(f"Warning: Could not extract decision path: {e}")
            import traceback
            traceback.print_exc()

        return path_nodes

    def predict_es(self, data: Dict[str, float]) -> PredictionResult:
        """Make prediction using ES model"""
        if self.es_model_data is None:
            raise RuntimeError("ES model not loaded. Call load_models() first.")

        model = self.es_model_data['model']
        feature_names = self.es_model_data['feature_names']

        # Validate and prepare input
        X = self._validate_features(data, feature_names)

        # Make prediction
        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0].tolist()
        confidence = float(max(probabilities))

        # Get feature importances
        feature_importances = self._extract_feature_importances(model, feature_names)

        return PredictionResult(
            decision=bool(prediction),
            confidence=confidence,
            probabilities=probabilities,
            feature_values=data,
            feature_importances=feature_importances,
            model_type='ES'
        )

    def predict_mro(self, data: Dict[str, float]) -> PredictionResult:
        """Make prediction using MRO model"""
        if self.mro_model_data is None:
            raise RuntimeError("MRO model not loaded. Call load_models() first.")

        model = self.mro_model_data['model']
        feature_names = self.mro_model_data['feature_names']

        # Validate and prepare input
        X = self._validate_features(data, feature_names)

        # Make prediction
        prediction = model.predict(X)[0]
        probabilities = model.predict_proba(X)[0].tolist()
        confidence = float(max(probabilities))

        # Get feature importances
        feature_importances = self._extract_feature_importances(model, feature_names)

        return PredictionResult(
            decision=bool(prediction),
            confidence=confidence,
            probabilities=probabilities,
            feature_values=data,
            feature_importances=feature_importances,
            model_type='MRO'
        )

    def predict_with_trace(self, model_type: str, data: Dict[str, float]) -> Tuple[PredictionResult, List[Dict[str, Any]]]:
        """
        Make prediction and return decision tree trace
        """
        if model_type.upper() == 'ES':
            result = self.predict_es(data)
            model = self.es_model_data['model']
            feature_names = self.es_model_data['feature_names']
        elif model_type.upper() == 'MRO':
            result = self.predict_mro(data)
            model = self.mro_model_data['model']
            feature_names = self.mro_model_data['feature_names']
        else:
            raise ValueError(f"Unknown model type: {model_type}. Use 'ES' or 'MRO'")

        # Get decision path
        X = pd.DataFrame([{feat: data[feat] for feat in feature_names}])
        path = self._get_decision_path(model, X, feature_names)

        return result, path

    def get_model_info(self, model_type: str) -> Dict[str, Any]:
        """Get information about a model"""
        if model_type.upper() == 'ES':
            model_data = self.es_model_data
        elif model_type.upper() == 'MRO':
            model_data = self.mro_model_data
        else:
            raise ValueError(f"Unknown model type: {model_type}")

        if model_data is None:
            raise RuntimeError(f"{model_type} model not loaded")

        return {
            'model_type': model_data['model_type'],
            'features': model_data['feature_names'],
            'n_features': len(model_data['feature_names']),
            'model_class': type(model_data['model']).__name__
        }


# Singleton instance
_model_service: Optional[ModelService] = None

def get_model_service() -> ModelService:
    """Get or create the model service singleton"""
    global _model_service
    if _model_service is None:
        _model_service = ModelService()
        _model_service.load_models()
    return _model_service
</file>

<file path="flux-new-reason/icflow/utils/__init__.py">
"""Empty init file for utils package."""
</file>

<file path="flux-new-reason/icflow/utils/llm.py">
"""Simplified LLM client."""
from openai import OpenAI
from typing import Optional


def get_llm_client() -> OpenAI:
    """Get configured OpenAI client."""
    return OpenAI(
        base_url="http://localhost:30303/v1",
        api_key="none"
    )

def ask_llm(
    prompt: str,
    client: Optional[OpenAI] = None,
    model: str = "Qwen3-30B",
    temperature: float = 0.0
) -> str:
    """
    Simple synchronous LLM call.
    
    Args:
        prompt: The prompt to send
        client: OpenAI client (creates new one if None)
        model: Model name (default: Qwen3-30B)
        temperature: Sampling temperature
        
    Returns:
        Response content as string
    """
    if client is None:
        client = get_llm_client()
    
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=temperature
    )
    
    return response.choices[0].message.content.strip()
</file>

<file path="flux-new-reason/icflow/utils/postgres.py">
"""
PostgreSQL database connection and operations for Vulcan Agent.

Provides connection pooling and intent persistence functionality aligned with spec v3.
"""

import os
import json
import logging
from typing import Optional, List, Dict, Tuple
from datetime import datetime
from contextlib import asynccontextmanager

import asyncpg
from asyncpg.pool import Pool

logger = logging.getLogger(__name__)


def round_to_hour(dt: datetime) -> datetime:
    """Round datetime to nearest hour for time_bucket."""
    return dt.replace(minute=0, second=0, microsecond=0)


class PostgresClient:
    """Async PostgreSQL client with connection pooling."""
    
    def __init__(self):
        self.pool: Optional[Pool] = None
        self._dsn = self._build_dsn()
    
    def _build_dsn(self) -> str:
        """Build PostgreSQL DSN from environment variables."""
        host = os.getenv("DB_HOST", "localhost")
        port = os.getenv("DB_PORT", "5432")
        database = os.getenv("DB_NAME", "vulcan")
        user = os.getenv("DB_USER", "app")
        password = os.getenv("DB_PASSWORD", "appsecret")
        
        return f"postgresql://{user}:{password}@{host}:{port}/{database}"
    
    async def connect(self):
        """Initialize connection pool."""
        if self.pool is None:
            try:
                self.pool = await asyncpg.create_pool(
                    self._dsn,
                    min_size=2,
                    max_size=10,
                    command_timeout=60
                )
                logger.info("PostgreSQL connection pool created")
            except Exception as e:
                logger.error(f"Failed to create PostgreSQL pool: {e}")
                raise
    
    async def close(self):
        """Close connection pool."""
        if self.pool:
            await self.pool.close()
            self.pool = None
            logger.info("PostgreSQL connection pool closed")
    
    @asynccontextmanager
    async def acquire(self):
        """Acquire connection from pool."""
        if self.pool is None:
            await self.connect()
        
        async with self.pool.acquire() as conn:
            yield conn
    
    async def save_intent_request(
        self,
        intent_id: str,
        actor: str,
        task_type: str,
        target_type: str,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None,
        execution_mode: str = "time_based",
        trigger: Optional[Dict] = None,
        kpi: Optional[Dict] = None,
        note: Optional[str] = None,
        created_at: Optional[datetime] = None,
    ) -> Tuple[str, datetime]:
        """
        Save intent request (Step 1).
        
        Returns:
            (intent_id, time_bucket)
        """
        if created_at is None:
            created_at = datetime.now()
        
        time_bucket = round_to_hour(created_at)
        
        query = """
        INSERT INTO intent_request (
            intent_id, actor, task_type, target_type,
            start_time, end_time, execution_mode,
            trigger, kpi, note, created_at, time_bucket
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (intent_id) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
        RETURNING intent_id, time_bucket
        """
        
        try:
            async with self.acquire() as conn:
                row = await conn.fetchrow(
                    query,
                    intent_id, actor, task_type, target_type,
                    start_time, end_time, execution_mode,
                    json.dumps(trigger) if trigger else None,
                    json.dumps(kpi) if kpi else None,
                    note, created_at, time_bucket
                )
                logger.info(f"Saved intent: {row['intent_id']}")
                return row['intent_id'], row['time_bucket']
        except Exception as e:
            logger.error(f"Failed to save intent: {e}")
            raise
    
    async def save_intent_target_cells(
        self,
        intent_id: str,
        cell_names: List[str]
    ) -> int:
        """
        Save intent-to-cell mappings (Step 2).
        
        Returns:
            Number of cells saved
        """
        query = """
        INSERT INTO intent_target_cells (intent_id, cell_name, sequence_order)
        VALUES ($1, $2, $3)
        ON CONFLICT (intent_id, cell_name) DO NOTHING
        """
        
        try:
            async with self.acquire() as conn:
                await conn.executemany(
                    query,
                    [(intent_id, cell, idx) for idx, cell in enumerate(cell_names)]
                )
                logger.info(f"Saved {len(cell_names)} cell mappings")
                return len(cell_names)
        except Exception as e:
            logger.error(f"Failed to save cell mappings: {e}")
            raise
    
    async def get_cell_context_snapshot(
        self,
        cell_name: str,
        time_bucket: datetime
    ) -> Optional[Dict]:
        """
        Retrieve cell context snapshot if exists (Step 3 - cache check).
        
        Returns:
            Context dict or None if not found
        """
        query = """
        SELECT 
            context_snapshot_id::text,
            metadata, common_sense, kpi, alarm, history_command
        FROM cell_context_snapshot
        WHERE cell_name = $1 AND time_bucket = $2
        """
        
        try:
            async with self.acquire() as conn:
                row = await conn.fetchrow(query, cell_name, time_bucket)
                if row:
                    logger.debug(f"Found cached context for {cell_name} at {time_bucket}")
                    return dict(row)
                return None
        except Exception as e:
            logger.error(f"Failed to get context snapshot: {e}")
            raise
    
    async def save_cell_context_snapshot(
        self,
        cell_name: str,
        time_bucket: datetime,
        metadata: Dict,
        common_sense: Dict,
        kpi: Dict,
        alarm: Dict,
        history_command: Dict,
        minio_path: Optional[str] = None
    ) -> str:
        """
        Save cell context snapshot (Step 3 - cache miss).
        
        Returns:
            context_snapshot_id (UUID)
        """
        query = """
        INSERT INTO cell_context_snapshot (
            cell_name, time_bucket,
            metadata, common_sense, kpi, alarm, history_command,
            minio_path
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (cell_name, time_bucket) DO UPDATE SET
            metadata = EXCLUDED.metadata,
            common_sense = EXCLUDED.common_sense,
            kpi = EXCLUDED.kpi,
            alarm = EXCLUDED.alarm,
            history_command = EXCLUDED.history_command,
            minio_path = EXCLUDED.minio_path,
            updated_at = CURRENT_TIMESTAMP
        RETURNING context_snapshot_id::text
        """
        
        try:
            async with self.acquire() as conn:
                snapshot_id = await conn.fetchval(
                    query,
                    cell_name, time_bucket,
                    json.dumps(metadata), json.dumps(common_sense),
                    json.dumps(kpi), json.dumps(alarm),
                    json.dumps(history_command), minio_path
                )
                logger.info(f"Saved context snapshot: {snapshot_id}")
                return snapshot_id
        except Exception as e:
            logger.error(f"Failed to save context snapshot: {e}")
            raise

    async def save_cell_decision(
        self,
        intent_id: str,
        cell_name: str,
        decision: bool,
        decision_score: float,
        explain_path: Optional[List[Dict]] = None,
        model_version: Optional[str] = None,
        context_snapshot_id: Optional[str] = None,
    ) -> str:
        """
        Save decision tree result for a cell (Step 4).

        Returns:
            decision_id (UUID)
        """
        query = """
        INSERT INTO cell_decision (
            intent_id, cell_name, context_snapshot_id,
            decision, decision_score, explain_path, model_version
        ) VALUES ($1, $2, $3::uuid, $4, $5, $6, $7)
        ON CONFLICT (intent_id, cell_name) DO UPDATE SET
            decision = EXCLUDED.decision,
            decision_score = EXCLUDED.decision_score,
            explain_path = EXCLUDED.explain_path,
            model_version = EXCLUDED.model_version,
            context_snapshot_id = EXCLUDED.context_snapshot_id
        RETURNING decision_id::text
        """

        try:
            async with self.acquire() as conn:
                decision_id = await conn.fetchval(
                    query,
                    intent_id, cell_name, context_snapshot_id,
                    decision, decision_score,
                    json.dumps(explain_path) if explain_path else None,
                    model_version
                )
                logger.debug(f"Saved decision for {cell_name}: decision={decision}, score={decision_score:.3f}")
                return decision_id
        except Exception as e:
            logger.error(f"Failed to save cell decision: {e}")
            raise

    async def save_cell_decisions_batch(
        self,
        decisions: List[Dict],
    ) -> int:
        """
        Bulk-insert cell decisions.

        Each dict must have: intent_id, cell_name, decision, decision_score,
        and optionally: explain_path, model_version, context_snapshot_id.

        Returns:
            Number of rows upserted
        """
        query = """
        INSERT INTO cell_decision (
            intent_id, cell_name, context_snapshot_id,
            decision, decision_score, explain_path, model_version
        ) VALUES ($1, $2, $3::uuid, $4, $5, $6, $7)
        ON CONFLICT (intent_id, cell_name) DO UPDATE SET
            decision = EXCLUDED.decision,
            decision_score = EXCLUDED.decision_score,
            explain_path = EXCLUDED.explain_path,
            model_version = EXCLUDED.model_version,
            context_snapshot_id = EXCLUDED.context_snapshot_id
        """

        rows = [
            (
                d["intent_id"],
                d["cell_name"],
                d.get("context_snapshot_id"),
                d["decision"],
                d["decision_score"],
                json.dumps(d["explain_path"]) if d.get("explain_path") else None,
                d.get("model_version"),
            )
            for d in decisions
        ]

        try:
            async with self.acquire() as conn:
                await conn.executemany(query, rows)
                logger.info(f"Saved {len(rows)} cell decisions")
                return len(rows)
        except Exception as e:
            logger.error(f"Failed to save cell decisions batch: {e}")
            raise


    async def save_tactical_dispatch(
        self,
        intent_id: str,
        task_type: str,
        tactical_agent_endpoint: str,
        target_cells: List[str],
        tactical_response: Optional[Dict] = None,
    ) -> str:
        """
        Save tactical dispatch record (Step 5).

        Returns:
            dispatch_id (UUID)
        """
        query = """
        INSERT INTO tactical_dispatch (
            intent_id, task_type, tactical_agent_endpoint,
            target_cells, tactical_response
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING dispatch_id::text
        """
        try:
            async with self.acquire() as conn:
                dispatch_id = await conn.fetchval(
                    query,
                    intent_id, task_type, tactical_agent_endpoint,
                    target_cells,                              # TEXT[] – asyncpg handles list natively
                    json.dumps(tactical_response) if tactical_response else None,
                )
                logger.info(f"Saved tactical dispatch: {dispatch_id}")
                return dispatch_id
        except Exception as e:
            logger.error(f"Failed to save tactical dispatch: {e}")
            raise


# Global instance
_postgres_client: Optional[PostgresClient] = None


def get_postgres_client() -> PostgresClient:
    """Get or create global PostgreSQL client."""
    global _postgres_client
    if _postgres_client is None:
        _postgres_client = PostgresClient()
    return _postgres_client
</file>

<file path="flux-new-reason/icflow/utils/s3.py">
import boto3
from botocore.client import Config

class S3Client:
    def __init__(self, 
        endpoint="https://172.20.1.109:30444", 
        access_key="minioadmin", 
        secret_key="minioadmin123"
    ):
        self.s3 = boto3.client(
            's3',
            endpoint_url=endpoint,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            config=Config(signature_version='s3v4'),
            verify=False
        )

    def upload_file(self, file_path, bucket_name, object_name=None):
        """
        Upload a file to an S3 bucket.
        """
        if object_name is None:
            object_name = file_path.split('/')[-1]
        self.s3.upload_file(file_path, bucket_name, object_name)
        return f"s3://{bucket_name}/{object_name}"
    
    def download_file(self, bucket_name, object_name, file_path):
        """
        Download a file from an S3 bucket.
        """
        self.s3.download_file(bucket_name, object_name, file_path)
        return file_path
    
    def list_files(self, bucket_name, prefix=''):
        """
        List files in an S3 bucket.
        """
        response = self.s3.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
        return [item['Key'] for item in response.get('Contents', [])]
    
    def delete_file(self, bucket_name, object_name):
        """
        Delete a file from an S3 bucket.
        """
        self.s3.delete_object(Bucket=bucket_name, Key=object_name)
        return True
    
    def create_bucket(self, bucket_name):
        """
        Create an S3 bucket.
        """
        self.s3.create_bucket(Bucket=bucket_name)
        return True

    def delete_bucket(self, bucket_name):
        """
        Delete an S3 bucket.
        """
        self.s3.delete_bucket(Bucket=bucket_name)
        return True
    
# Example usage:
# s3_client = S3Client(
#     endpoint='http://localhost:9000',
#     access_key='minioadmin',
#     secret_key='minioadmin'
# )
# s3_client.upload_file('local_file.txt', 'my-bucket', 'remote_file.txt')
</file>

<file path="flux-new-reason/icflow/utils/searxng.py">
"""
SearXNG Web Search Client

Provides a client for interacting with a self-hosted SearXNG instance.
Designed for agent use, returns JSON responses by default.
"""

from typing import Any, Dict, List, Optional

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


class SearXNGClient:
    """Client for interacting with SearXNG search engine."""

    def __init__(self, base_url: str = "http://172.21.55.98:6379"):
        """
        Initialize the SearXNG client.

        Args:
            base_url: Base URL of the SearXNG instance
        """
        self.base_url = base_url.rstrip("/")
        self.search_endpoint = f"{self.base_url}/search"

        # Configure session with retry logic
        self.session = requests.Session()
        retry_strategy = Retry(
            total=3,
            backoff_factor=1,
            status_forcelist=[429, 500, 502, 503, 504],
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)

    def search(
        self,
        query: str,
        language: str = "auto",
        time_range: str = "",
        safesearch: int = 0,
        categories: str = "general",
        max_results: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Perform a search query using SearXNG.

        Args:
            query: Search query string
            language: Language code (e.g., 'en', 'auto')
            time_range: Time range filter ('day', 'week', 'month', 'year', '')
            safesearch: Safe search level (0=None, 1=Moderate, 2=Strict)
            categories: Comma-separated categories (general, images, videos, news, etc.)
            max_results: Maximum number of results to return (None for all)

        Returns:
            Dictionary containing search results and metadata in SearXNG JSON format

        Raises:
            ConnectionError: If unable to connect to SearXNG
            TimeoutError: If request times out
            RuntimeError: If request fails for other reasons
        """
        params = {
            "q": query,
            "language": language,
            "time_range": time_range,
            "safesearch": safesearch,
            "categories": categories,
            "format": "json",
        }

        try:
            response = self.session.get(
                self.search_endpoint, params=params, timeout=10
            )
            response.raise_for_status()
            data = response.json()

            # Limit results if requested
            if max_results is not None and "results" in data:
                data["results"] = data["results"][:max_results]

            return data

        except requests.exceptions.ConnectionError:
            raise ConnectionError(
                f"Failed to connect to SearXNG at {self.base_url}. "
                "Make sure the service is running."
            )
        except requests.exceptions.Timeout:
            raise TimeoutError(
                f"Request to SearXNG timed out. The service may be overloaded."
            )
        except requests.exceptions.RequestException as e:
            raise RuntimeError(f"Search request failed: {e}")

    def search_simple(
        self,
        query: str,
        max_results: int = 10,
        time_range: str = "",
    ) -> List[Dict[str, str]]:
        """
        Simplified search that returns only essential information.

        Args:
            query: Search query string
            max_results: Maximum number of results (default: 10)
            time_range: Time range filter ('day', 'week', 'month', 'year', '')

        Returns:
            List of dictionaries with keys: title, url, content, engines

        Raises:
            ConnectionError: If unable to connect to SearXNG
            TimeoutError: If request times out
            RuntimeError: If request fails
        """
        full_results = self.search(
            query=query,
            max_results=max_results,
            time_range=time_range,
        )

        simplified = []
        for result in full_results.get("results", []):
            simplified.append({
                "title": result.get("title", ""),
                "url": result.get("url", ""),
                "content": result.get("content", ""),
                "engines": result.get("engines", []),
                "score": result.get("score", 0),
            })

        return simplified

    def health_check(self) -> bool:
        """
        Check if the SearXNG service is healthy.

        Returns:
            True if service is healthy, False otherwise
        """
        try:
            response = self.session.get(
                f"{self.base_url}/healthz", timeout=5
            )
            return response.status_code == 200
        except requests.RequestException:
            return False

    def get_suggestions(self, query: str) -> List[str]:
        """
        Get search suggestions for a query.

        Args:
            query: Partial search query

        Returns:
            List of suggested search terms
        """
        try:
            results = self.search(query=query, max_results=1)
            return results.get("suggestions", [])
        except Exception:
            return []
</file>

<file path="flux-new-reason/icflow/__init__.py">
"""ICFlow - Minimal Network Decision Reasoning

Simplified decision tree reasoning for network optimization tasks (MRO, ES).
"""

__version__ = "0.1.0"

from .schemas import IntentObject, TaskType, ContextSchema, DecisionOutput
from .features import calculate_mro_features, calculate_es_features
from .reasoning import decide, decide_mro, decide_es

__all__ = [
    "IntentObject",
    "TaskType",
    "ContextSchema",
    "DecisionOutput",
    "calculate_mro_features",
    "calculate_es_features",
    "decide",
    "decide_mro",
    "decide_es",
]
</file>

<file path="flux-new-reason/icflow/context_schema.py">
#!/usr/bin/env python3
"""
Script A: Generate context schema from intent object.

This script:
1. Takes an intent object (cell, timestamp)
2. Loads KPI data for that cell/timestamp
3. Optionally searches web for events
4. Builds ContextSchema with all needed data

Usage:
    python context_schema.py --cell gKH00190_10n411 --timestamp "2024-01-15T10:00"
    python context_schema.py --cell gKH00190_10n411 --timestamp"2024-01-15T10:00" --no-web-search
"""
import sys
import json
import argparse
import asyncio
from pathlib import Path
from datetime import datetime, timedelta
import pandas as pd
import numpy as np

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agentscope.tracing import trace
from icflow.schemas import ContextSchema
from icflow.utils.searxng import SearXNGClient
from icflow.utils.llm import get_llm_client, ask_llm
from icflow.utils.postgres import get_postgres_client, round_to_hour


def extract_region_from_cell(cell: str) -> str:
    """
    Extract region from cell name based on site prefix.
    
    Patterns:
    - gHM*** = Hà Nam
    - gKH*** = Khánh Hòa
    
    Args:
        cell: Cell name (e.g., gKH00190_10n411)
        
    Returns:
        Region name
    """
    # Extract site prefix (before underscore or first 3-4 chars)
    site_prefix = cell.split('_')[0] if '_' in cell else cell
    site_upper = site_prefix.upper()
    
    if site_upper.startswith("GHM"):
        return "Hà Nam"
    elif site_upper.startswith("GKH"):
        return "Khánh Hòa"
    else:
        return "Việt Nam"


def safe_get_value(row, key, default=0.0):
    """Safely get value from pandas row, handling NaN."""
    value = row.get(key, default)
    if pd.isna(value):
        return default
    return float(value)


def load_kpi_data(cell: str, timestamp: str, kpi_dir: Path) -> dict:
    """Load KPI data for specific cell and timestamp."""
    # Parse timestamp
    dt = datetime.fromisoformat(timestamp)
    date_str = dt.strftime("%Y-%m-%d")
    
    # Find KPI file
    kpi_file = kpi_dir / f"kpi_5min_{date_str}.csv"
    if not kpi_file.exists():
        raise FileNotFoundError(f"KPI file not found: {kpi_file}")
    
    # Load and filter
    df = pd.read_csv(kpi_file)
    df['datetime'] = pd.to_datetime(df['datetime'])
    
    # Find exact or nearest timestamp
    cell_df = df[df['cellname'] == cell].copy()
    if len(cell_df) == 0:
        raise ValueError(f"Cell {cell} not found in KPI data")
    
    # Get closest timestamp
    cell_df['time_diff'] = abs((cell_df['datetime'] - dt).dt.total_seconds())
    row = cell_df.loc[cell_df['time_diff'].idxmin()]
    
    # Map to schema format (handle NaN values)
    kpi = {
        "latency_dl_mac_ms": safe_get_value(row, "Average Latency DL MAC (ms)"),
        "call_drop_ratio_pct": safe_get_value(row, "EN-DC CDR (%)"),
        "packet_loss_dl_pct": safe_get_value(row, "KV2_DL Packet Loss (%)"),
        "packet_loss_ul_pct": safe_get_value(row, "KV2_UL Packet Loss (%)"),
        "rrc_connected_ue": safe_get_value(row, "Max RRC Connected SA User (UE)"),
        "throughput_dl_mbps": safe_get_value(row, "NR DL User Throughput Mbps (Mbps)"),
        "throughput_ul_mbps": safe_get_value(row, "NR UL User Throughput (Mbps) (Mbps)"),
        "pscell_inter_att": safe_get_value(row, "PSCell Change Inter-SgNB Att (#)"),
        "pscell_inter_succ": safe_get_value(row, "PSCell Change Inter-SgNB Succ (#)"),
        "pscell_intra_att": safe_get_value(row, "PSCell Change Intra-SgNB Att (#)"),
        "pscell_intra_succ": safe_get_value(row, "PSCell Change Intra-SgNB Succ (#)"),
        "prb_dl_pct": safe_get_value(row, "TU PRB DL (%)"),
        "prb_ul_pct": safe_get_value(row, "TU PRB UL (%)"),
        "power_consumption_wh": safe_get_value(row, "Power Consumption (Wh)"),
    }
    
    return {
        "ne_name": row["ne_name"],
        "cellname": row["cellname"],
        "timestamp": row["datetime"].isoformat(),
        "kpi": kpi
    }


def load_alarm_data(cell: str, timestamp: str, alarm_dir: Path, window_hours: int = 1) -> dict:
    """
    Load and count alarms affecting different tasks.
    
    Returns dict with n_alarm_mro, n_alarm_es, n_alarm_ts, n_alarm_qos
    """
    # Alarm policy: 0 = task not allowed, 1 = task allowed
    ALARM_POLICY = {
        "CELL OUT OF SERVICE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CELL SETUP FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CELL START FAILED": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CELL START FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CLOCK GENERATOR FAULTY": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CONFIGURING FAILED": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CORE INTERRUPT ASSIGNED FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CPRI CLOCK NOT SYNC": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CPRI LOSS SYNC": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CPRI NOT SYNC": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CPU HIGH LOAD": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "CPU TEMPERATURE HIGH": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "CPU USAGE HIGH": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "CRITICAL FILE NOT FOUND": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "CU PLANE TRANSPORT CONNECTIVITY FAIL": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "DPD CORE ERROR": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "DPD COUNTER NOT UPDATE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "DPD MSE HIGH": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "DPD NOT ALIGN": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "DPD PA SATURATION": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "DPD PEAK EXPANSION HIGH": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "ETHERNET LINK DOWN": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "FAPI CONFIGURATION REQUEST FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "FAPI NOT RECEIVED": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "FLASH USAGE HIGH": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "HEARTBEAT FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "HEARTBEAT FAILURE SOFTWARE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "HIGH MEMORY USAGE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "INVALID CONFIGURATION": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "IRQ CORE BINDING INCORRECT": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "ISOLATE CORE ASSIGNED FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "JESD LINK FAULT": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "L1 L2 OUT OF SYNC": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "LAYER1 NOT RECEIVED RX PACKET": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "LAYER1 UNIT DISCONNECTED": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "MAC MSG LINK FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "MIDHAUL PACKET FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "MISS HW INTERRUPT": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "MPLANE CONFIGURING FAILED": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "NO SENDING L1 TX PACKET": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "OAM PROCESS DOWN": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "PA BIAS EXEC FAIL": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "PA FAULT": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "PA TEMPERATURE HIGH": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "PACKETS SEND FAILURE TO NIC": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "PCIE TX WRITE FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "POWER AMPLIFIER FAULTY": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "RAM USAGE HIGH RECOVERY MODE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "RESET REQUESTED": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "RF FEATURES FAULTY": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "RRC PROVISIONING FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "RRU DISCONNECTED": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "RRU DOWNLINK NO DATA": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "RRU NOT READY": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "RRU TX OUT OF ORDER": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "RRU UPLINK NO DATA": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "RX UNEQUAL RCV PACKET": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "S1AP CONNECTION FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "S1AP PROVISIONING FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "SCTP ASSOCIATION FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "SERVICE PROCESS DOWN": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "SFP NOT PRESENT": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "SFP RX POWER LOW": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "SFP TX POWER LOW": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "START PROCESS FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "SYNCHRONIZATION ERROR": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "TRANSCEIVER FAULT": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "TRANSFER CARD NOT PRESENT": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "TRANSFERCARD CONFIG FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "TRANSPORT CONNECTION FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "TX OUT OF ORDER": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "UNEXPECTED CU PLANE MESSAGE CONTENT FAULT": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "UNIT DANGEROUSLY OVERHEATING": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "UNIT OUT OF ORDER": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "UPLINK BLER TOO HIGH": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "UPLINK DATA NOT RECEIVED": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
        "VSWR TOO HIGH": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 1},
        "WLS OPEN FAILURE": {"MRO": 0, "ES": 0, "TS": 0, "QOS": 0},
    }
    
    dt = datetime.fromisoformat(timestamp)
    start_time = dt - timedelta(hours=window_hours)
    
    # Extract site name from cellname (prefix before underscore)
    # e.g., gKH00190_10n411 -> gKH00190
    site_name = cell.split('_')[0] if '_' in cell else cell
    
    # Determine which dates to load
    current_date = start_time.date()
    end_date = dt.date()
    dates_to_load = []
    
    while current_date <= end_date:
        dates_to_load.append(current_date)
        current_date += timedelta(days=1)
    
    # Load alarm files
    dfs = []
    for date in dates_to_load:
        date_str = date.strftime("%Y-%m-%d")
        alarm_file = alarm_dir / f"alarm_{date_str}.csv"
        if alarm_file.exists():
            try:
                df_day = pd.read_csv(alarm_file, quoting=3)  # quoting=3 to ignore quotes
                dfs.append(df_day)
            except Exception as e:
                print(f"    Warning: Failed to load {alarm_file}: {e}")
    
    # Default counts if no alarm data
    if not dfs:
        return {
            "n_alarm_mro": 0,
            "n_alarm_es": 0,
            "n_alarm_ts": 0,
            "n_alarm_qos": 0
        }
    
    # Concatenate and filter
    df = pd.concat(dfs, ignore_index=True)
    df['trigger_instant'] = pd.to_datetime(df['trigger_instant'])
    
    # Filter by site and time window
    alarm_df = df[
        (df['source_name'] == site_name) &
        (df['trigger_instant'] >= start_time) &
        (df['trigger_instant'] < dt)
    ]
    
    # Count alarms for each task type (count where policy is 0 = task blocked)
    counts = {
        "n_alarm_mro": 0,
        "n_alarm_es": 0,
        "n_alarm_ts": 0,
        "n_alarm_qos": 0
    }
    
    for _, alarm in alarm_df.iterrows():
        alarm_name = alarm.get('event_name', '')
        if alarm_name in ALARM_POLICY:
            policy = ALARM_POLICY[alarm_name]
            if policy['MRO'] == 0:
                counts['n_alarm_mro'] += 1
            if policy['ES'] == 0:
                counts['n_alarm_es'] += 1
            if policy['TS'] == 0:
                counts['n_alarm_ts'] += 1
            if policy['QOS'] == 0:
                counts['n_alarm_qos'] += 1
    
    return counts


def load_historical_data(cell: str, timestamp: str, kpi_dir: Path, window_hours: int = 24) -> dict:
    """Load historical KPI data for feature engineering."""
    dt = datetime.fromisoformat(timestamp)
    
    # Get historical window
    start_time = dt - timedelta(hours=window_hours)
    
    # Determine which dates we need to load
    # Generate list of dates from start_time to current timestamp
    current_date = start_time.date()
    end_date = dt.date()
    dates_to_load = []
    
    while current_date <= end_date:
        dates_to_load.append(current_date)
        current_date += timedelta(days=1)
    
    # Load and concatenate all necessary CSV files
    dfs = []
    for date in dates_to_load:
        date_str = date.strftime("%Y-%m-%d")
        kpi_file = kpi_dir / f"kpi_5min_{date_str}.csv"
        if kpi_file.exists():
            df_day = pd.read_csv(kpi_file)
            dfs.append(df_day)
    
    if not dfs:
        return {}
    
    # Concatenate all dataframes
    df = pd.concat(dfs, ignore_index=True)
    df['datetime'] = pd.to_datetime(df['datetime'])
    
    # Filter by time window and cell
    historical_df = df[
        (df['cellname'] == cell) &
        (df['datetime'] >= start_time) &
        (df['datetime'] < dt)
    ]
    
    if len(historical_df) == 0:
        return {}
    
    # Calculate historical metrics
    hos_values = []
    load_values = []
    
    for _, row in historical_df.iterrows():
        # HOS calculation
        inter_att = row.get("PSCell Change Inter-SgNB Att (#)", 0)
        inter_succ = row.get("PSCell Change Inter-SgNB Succ (#)", 0)
        intra_att = row.get("PSCell Change Intra-SgNB Att (#)", 0)
        intra_succ = row.get("PSCell Change Intra-SgNB Succ (#)", 0)
        total_att = inter_att + intra_att
        total_succ = inter_succ + intra_succ
        if total_att > 0:
            hos = (total_succ / total_att) * 100
            hos_values.append(hos)
        
        # Traffic load
        prb_dl = row.get("TU PRB DL (%)", 0)
        prb_ul = row.get("TU PRB UL (%)", 0)
        load_values.append(prb_dl + prb_ul)
    
    return {
        "historical_hos": hos_values,
        "historical_load": load_values
    }


async def search_web_events(cell: str, timestamp: str, region: str = None) -> dict:
    """Search web for relevant events around the timestamp."""
    if region is None:
        region = extract_region_from_cell(cell)
    
    dt = datetime.fromisoformat(timestamp)
    date_str = dt.strftime("%Y-%m-%d")
    
    # Build search query
    query = f"{region} Vietnam events {date_str} weather traffic"
    
    try:
        client = SearXNGClient()
        results = client.search(query, max_results=3)
        
        # Summarize with LLM
        if results.get("results"):
            context = "\n".join([
                f"- {r.get('title', '')}: {r.get('content', '')}"
                for r in results["results"][:3]
            ])
            
            prompt = f"""Based on these search results about {region} on {date_str}:

{context}

Extract:
1. Weather condition (clear/hot/cold/rain/fog/storm/extreme) - return ONLY the single word
2. Social events. Guidelines:
- Major events (World Cup final, huge concert, national celebration): 0.8-1.0
- Large events (local festival, sports match, concert): 0.5-0.7
- Medium events (small gathering, local event): 0.3-0.5
- Minor events: 0.1-0.3
- No significant impact: 0.0-0.1

Format response as JSON:
{{"weather": "clear", "social_event_score": 0.2}}"""
            
            llm = get_llm_client()
            response = ask_llm(prompt, llm)
            
            # Parse JSON
            try:
                data = json.loads(response)
                weather = data.get("weather", "clear")
                social_score = data.get("social_event_score", 0.0)
            except:
                weather = "clear"
                social_score = 0.0
            
            # Weather score mapping (from spec)
            weather_scores = {
                "extreme": -1.0,
                "storm": -0.5,
                "rain": -0.25,
                "fog": 0.0,
                "hot": 0.2,
                "cold": 0.3,
                "clear": 0.5
            }
            weather_score = weather_scores.get(weather.lower(), 0.5)
            
            return {
                "weather": weather,
                "weather_score": weather_score,
                "social_event_score": social_score,
                "search_results": results["results"][:3]
            }
    except Exception as e:
        print(f"Web search failed: {e}")
    
    # Default values
    return {
        "weather": "clear",
        "weather_score": 0.5,
        "social_event_score": 0.0
    }


@trace(name="build_context_schema")
async def build_context_schema(
    cell: str,
    timestamp: str,
    kpi_dir: Path,
    enable_web_search: bool = True,
    use_cache: bool = True
) -> ContextSchema:
    """
    Build complete context schema with database caching.
    
    Args:
        cell: Cell name
        timestamp: ISO timestamp
        kpi_dir: KPI data directory
        enable_web_search: Enable web search for events
        use_cache: Check database for cached context snapshot (default: True)
    
    Returns:
        ContextSchema object (either from cache or freshly built)
    """
    
    print(f"Building context for {cell} @ {timestamp}")
    
    # STEP 3: Check cache if enabled
    if use_cache:
        try:
            db = get_postgres_client()
            dt = datetime.fromisoformat(timestamp)
            time_bucket = round_to_hour(dt)
            
            print(f"  Checking cache (time_bucket: {time_bucket})...")
            cached_context = await db.get_cell_context_snapshot(cell, time_bucket)
            
            if cached_context:
                print(f"  ✓ Cache hit! Reusing cached context")
                # Reconstruct ContextSchema from cached fields
                # Get fresh KPI data for cellname and ne_name
                kpi_data = load_kpi_data(cell, timestamp, kpi_dir)
                
                # Parse JSON strings back to dictionaries
                kpi = json.loads(cached_context['kpi']) if isinstance(cached_context['kpi'], str) else cached_context['kpi']
                metadata = json.loads(cached_context['metadata']) if isinstance(cached_context['metadata'], str) else cached_context['metadata']
                common_sense = json.loads(cached_context['common_sense']) if isinstance(cached_context['common_sense'], str) else cached_context['common_sense']
                
                return ContextSchema(
                    timestamp=kpi_data["timestamp"],
                    ne_name=kpi_data["ne_name"],
                    cellname=kpi_data["cellname"],
                    kpi=kpi,
                    metadata=metadata,
                    common_sense=common_sense
                )
            else:
                print(f"  Cache miss, building fresh context...")
        except Exception as e:
            print(f"  ⚠️ Cache check failed: {e}, proceeding without cache")
    
    # Load KPI data
    print("  Loading KPI data...")
    kpi_data = load_kpi_data(cell, timestamp, kpi_dir)
    
    # Load historical data
    print("  Loading historical data...")
    historical = load_historical_data(cell, timestamp, kpi_dir)
    
    # Load alarm data
    print("  Loading alarm data...")
    alarm_dir = Path(__file__).parent.parent / "app" / "data" / "alarm"
    alarm_counts = load_alarm_data(cell, timestamp, alarm_dir)
    
    # Web search for events
    web_data = {}
    if enable_web_search:
        print("  Searching web for events...")
        web_data = await search_web_events(cell, timestamp)
    else:
        web_data = {
            "weather": "clear",
            "weather_score": 0.5,
            "social_event_score": 0.0
        }
    
    # Combine into ContextSchema
    context = ContextSchema(
        timestamp=kpi_data["timestamp"],
        ne_name=kpi_data["ne_name"],
        cellname=kpi_data["cellname"],
        kpi=kpi_data["kpi"],
        metadata={
            "region": extract_region_from_cell(cell),
            "site_type": "macro"  # Could be inferred
        },
        common_sense={
            **web_data,
            **historical,
        }
    )
    
    # Save to cache if enabled
    if use_cache:
        try:
            db = get_postgres_client()
            dt = datetime.fromisoformat(timestamp)
            time_bucket = round_to_hour(dt)
            
            print(f"  Saving to cache...")
            await db.save_cell_context_snapshot(
                cell_name=cell,
                time_bucket=time_bucket,
                metadata=context.metadata,
                common_sense=context.common_sense,
                kpi=context.kpi,
                alarm=alarm_counts,
                history_command={},  # Empty for now
                minio_path=None  # TODO: Save full context to MinIO
            )
            print(f"  ✓ Context cached")
        except Exception as e:
            print(f"  ⚠️ Cache save failed: {e}")
    
    print("  ✓ Context schema built")
    return context


async def main():
    parser = argparse.ArgumentParser(
        description="Generate context schema from intent"
    )
    parser.add_argument("--cell", required=True, help="Cell name (e.g., gKH00190_10n411)")
    parser.add_argument("--timestamp", required=True, help="Timestamp (ISO format: 2024-01-15T10:00)")
    parser.add_argument("--no-web-search", action="store_true", help="Disable web search")
    parser.add_argument("--output", help="Output JSON file (default: print to stdout)")
    
    args = parser.parse_args()
    
    # KPI data directory
    kpi_dir = Path(__file__).parent.parent / "app" / "data" / "KPI" / "v3"
    
    # Build context
    context = await build_context_schema(
        args.cell,
        args.timestamp,
        kpi_dir,
        enable_web_search=not args.no_web_search
    )
    
    # Output
    context_json = context.model_dump_json(indent=2)
    
    if args.output:
        Path(args.output).write_text(context_json)
        print(f"\n✓ Context schema saved to: {args.output}")
    else:
        print("\n" + "="*80)
        print("CONTEXT SCHEMA")
        print("="*80)
        print(context_json)


if __name__ == "__main__":
    asyncio.run(main())
</file>

<file path="flux-new-reason/icflow/extract_features.py">
#!/usr/bin/env python3
"""
Feature Extraction Script for Decision Tree Training.

This script:
1. Takes a list of intent objects (from JSON file or programmatically)
2. Builds context schema and calculates features for each intent
3. Returns DataFrames (one per task type) with features ready for ML training

Usage:
    # From file with multiple intents
    python extract_features.py --intents intents.json --output features_output/
    
    # From directory of individual intent files
    python extract_features.py --intent-dir data/intents/ --output features_output/
    
    # Programmatic usage
    from extract_features import extract_features_batch
    df_mro, df_es = await extract_features_batch(intent_list, kpi_dir)
"""
import sys
import json
import argparse
import asyncio
import logging
from pathlib import Path
from datetime import datetime
from typing import Any, List, Dict, Tuple, Optional
import pandas as pd
import numpy as np
from tqdm import tqdm

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agentscope.tracing import trace

logger = logging.getLogger(__name__)

from icflow.schemas import IntentObject, TaskType, ContextSchema
from icflow.context_schema import build_context_schema
from icflow.features import calculate_mro_features, calculate_es_features


def flatten_features(features: Dict[str, Dict]) -> Dict[str, float]:
    """
    Flatten feature dict to simple name->value mapping.
    
    Input: {"Feature Name": {"value": 0.5, "meaning": "...", "logic": "..."}}
    Output: {"Feature Name": 0.5}
    """
    return {name: data["value"] for name, data in features.items()}


@trace(name="extract_features_single")
async def extract_features_single(
    intent: IntentObject,
    kpi_dir: Path,
    enable_web_search: bool = True,
    verbose: bool = False,
    emitter: Any = None,
) -> Optional[Dict]:
    """
    Extract features for a single intent.
    
    Returns:
        Dict with: intent_id, cellname, timestamp, task_type, features, (optional decision label)
        Returns None if processing fails
    """
    cell = intent.target_id[0] if intent.target_id else "<unknown>"
    try:
        logger.debug(
            "extract_features_single start | cell=%s task=%s ts=%s",
            cell, intent.task_type.value, intent.start_time,
        )
        if verbose:
            print(f"Processing {intent.intent_id} | cell={cell} ({intent.task_type.value})...")
        
        timestamp = intent.start_time
        
        # Build context schema
        context = await build_context_schema(
            cell,
            timestamp,
            kpi_dir,
            enable_web_search
        )

        if emitter:
            emitter.emit_data(
                "cell_context",
                cell=context.cellname,
                ne_name=context.ne_name,
                kpi=context.kpi,
                metadata=context.metadata,
                common_sense=context.common_sense,
            )

        # Calculate features based on task type
        if intent.task_type == TaskType.MRO:
            features = calculate_mro_features(context)
        elif intent.task_type == TaskType.ES:
            features = calculate_es_features(context)
        else:
            logger.warning(
                "extract_features_single | unsupported task_type=%s cell=%s – skipped",
                intent.task_type.value, cell,
            )
            if verbose:
                print(f"  ⚠️  Task type {intent.task_type.value} not supported, skipping")
            return None

        # Flatten features
        feature_values = flatten_features(features)

        if emitter:
            emitter.emit_data(
                "cell_features",
                cell=context.cellname,
                task_type=intent.task_type.value,
                features=feature_values,
            )
        
        # Build result
        result = {
            "intent_id": intent.intent_id,
            "cellname": context.cellname,
            "ne_name": context.ne_name,
            "timestamp": context.timestamp,
            "task_type": intent.task_type.value,
            **feature_values
        }
        
        logger.debug(
            "extract_features_single done | cell=%s features=%d",
            cell, len(feature_values),
        )
        if verbose:
            print(f"  ✓ Extracted {len(feature_values)} features")
        
        return result
        
    except Exception as e:
        # Always log with full traceback so errors surface even without verbose=True
        logger.warning(
            "extract_features_single FAILED | cell=%s task=%s ts=%s | %s: %s",
            cell, intent.task_type.value, intent.start_time,
            type(e).__name__, e,
            exc_info=True,
        )
        if verbose:
            print(f"  ✗ Error processing cell={cell} intent={intent.intent_id}: {type(e).__name__}: {e}")
        return None


@trace(name="extract_features_batch")
async def extract_features_batch(
    intents: List[IntentObject],
    kpi_dir: Path,
    enable_web_search: bool = True,
    verbose: bool = False,
    show_progress: bool = True,
    emitter: Any = None,
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """
    Extract features for a batch of intents.
    
    Returns:
        (df_mro, df_es): Two DataFrames, one for each task type
    """
    results = []
    n_total = len(intents)
    n_failed = 0
    failed_cells: list[str] = []

    logger.info(
        "extract_features_batch start | n=%d web_search=%s kpi_dir=%s",
        n_total, enable_web_search, kpi_dir,
    )

    # Process intents
    iterator = tqdm(intents, desc="Extracting features") if show_progress else intents
    
    for intent in iterator:
        result = await extract_features_single(
            intent,
            kpi_dir,
            enable_web_search,
            verbose,
            emitter=emitter,
        )
        if result:
            results.append(result)
        else:
            n_failed += 1
            cell = intent.target_id[0] if intent.target_id else "<unknown>"
            failed_cells.append(f"{cell}({intent.task_type.value})")

    n_ok = len(results)
    logger.info(
        "extract_features_batch done | ok=%d failed=%d/%d failed_cells=%s",
        n_ok, n_failed, n_total,
        failed_cells if n_failed else [],
    )

    # Convert to DataFrame
    if not results:
        logger.warning(
            "extract_features_batch: ALL %d cells failed – returning empty DataFrames. "
            "Failed cells: %s",
            n_total, failed_cells,
        )
        print(f"⚠️  No valid results extracted ({n_failed}/{n_total} failed). Check logs for per-cell errors.")
        return pd.DataFrame(), pd.DataFrame()
    
    df_all = pd.DataFrame(results)
    
    # Split by task type
    df_mro = df_all[df_all["task_type"] == "MRO"].copy()
    df_es = df_all[df_all["task_type"] == "ES"].copy()

    logger.info(
        "extract_features_batch split | df_mro=%d df_es=%d",
        len(df_mro), len(df_es),
    )

    # Drop task_type column (redundant after split)
    if len(df_mro) > 0:
        df_mro = df_mro.drop(columns=["task_type"])
    if len(df_es) > 0:
        df_es = df_es.drop(columns=["task_type"])
    
    return df_mro, df_es


def load_intents_from_file(filepath: Path) -> List[IntentObject]:
    """Load intents from JSON file (single intent or list of intents)."""
    data = json.loads(filepath.read_text())
    
    if isinstance(data, list):
        return [IntentObject(**intent) for intent in data]
    else:
        return [IntentObject(**data)]


def load_intents_from_directory(dirpath: Path) -> List[IntentObject]:
    """Load all intent JSON files from a directory."""
    intents = []
    for filepath in dirpath.glob("*.json"):
        try:
            intent_data = json.loads(filepath.read_text())
            intents.append(IntentObject(**intent_data))
        except Exception as e:
            print(f"⚠️  Error loading {filepath.name}: {e}")
    return intents


def add_decision_labels(
    df: pd.DataFrame,
    labels: Dict[str, bool]
) -> pd.DataFrame:
    """
    Add decision labels to DataFrame.
    
    Args:
        df: DataFrame with intent_id column
        labels: Dict mapping intent_id -> decision (True/False)
    
    Returns:
        DataFrame with added 'decision' column
    """
    df = df.copy()
    df["decision"] = df["intent_id"].map(labels)
    return df


async def main():
    parser = argparse.ArgumentParser(
        description="Extract features from intent objects for decision tree training"
    )
    
    # Input options
    input_group = parser.add_mutually_exclusive_group(required=True)
    input_group.add_argument(
        "--intents",
        help="JSON file with intent(s) - single object or array"
    )
    input_group.add_argument(
        "--intent-dir",
        help="Directory containing multiple intent JSON files"
    )
    
    # Options
    parser.add_argument(
        "--output",
        required=True,
        help="Output directory for feature DataFrames"
    )
    parser.add_argument(
        "--no-web-search",
        action="store_true",
        help="Disable web search for faster processing"
    )
    parser.add_argument(
        "--labels",
        help="Optional JSON file with decision labels (intent_id -> bool)"
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Print detailed processing info"
    )
    parser.add_argument(
        "--kpi-dir",
        help="Custom KPI data directory (default: app/data/KPI/v3)"
    )
    
    args = parser.parse_args()
    
    # Load intents
    print("Loading intents...")
    if args.intents:
        intents = load_intents_from_file(Path(args.intents))
    else:
        intents = load_intents_from_directory(Path(args.intent_dir))
    
    print(f"Loaded {len(intents)} intents")
    
    # Count by task type
    task_counts = {}
    for intent in intents:
        task_counts[intent.task_type.value] = task_counts.get(intent.task_type.value, 0) + 1
    print(f"  Task breakdown: {task_counts}")
    
    # KPI directory
    if args.kpi_dir:
        kpi_dir = Path(args.kpi_dir)
    else:
        kpi_dir = Path(__file__).parent.parent / "app" / "data" / "KPI" / "v3"
    
    if not kpi_dir.exists():
        print(f"❌ KPI directory not found: {kpi_dir}")
        return
    
    print(f"Using KPI data from: {kpi_dir}")
    
    # Extract features
    print("\nExtracting features...")
    df_mro, df_es = await extract_features_batch(
        intents,
        kpi_dir,
        enable_web_search=not args.no_web_search,
        verbose=args.verbose,
        show_progress=True
    )
    
    # Load labels if provided
    labels = None
    if args.labels:
        labels_data = json.loads(Path(args.labels).read_text())
        labels = labels_data
        print(f"\nLoaded {len(labels)} decision labels")
    
    # Add labels to DataFrames
    if labels:
        if len(df_mro) > 0:
            df_mro = add_decision_labels(df_mro, labels)
        if len(df_es) > 0:
            df_es = add_decision_labels(df_es, labels)
    
    # Create output directory
    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save DataFrames
    print("\nSaving feature DataFrames...")
    
    if len(df_mro) > 0:
        mro_path = output_dir / "features_mro.csv"
        df_mro.to_csv(mro_path, index=False)
        print(f"  ✓ MRO features saved: {mro_path}")
        print(f"    Shape: {df_mro.shape}")
        print(f"    Columns: {list(df_mro.columns)}")
        
        # Also save as parquet for efficiency
        mro_parquet = output_dir / "features_mro.parquet"
        df_mro.to_parquet(mro_parquet, index=False)
        print(f"    Also saved as: {mro_parquet}")
    else:
        print("  ⚠️  No MRO features extracted")
    
    if len(df_es) > 0:
        es_path = output_dir / "features_es.csv"
        df_es.to_csv(es_path, index=False)
        print(f"  ✓ ES features saved: {es_path}")
        print(f"    Shape: {df_es.shape}")
        print(f"    Columns: {list(df_es.columns)}")
        
        # Also save as parquet
        es_parquet = output_dir / "features_es.parquet"
        df_es.to_parquet(es_parquet, index=False)
        print(f"    Also saved as: {es_parquet}")
    else:
        print("  ⚠️  No ES features extracted")
    
    # Save metadata
    metadata = {
        "extraction_time": datetime.now().isoformat(),
        "total_intents": len(intents),
        "task_counts": task_counts,
        "mro_samples": len(df_mro),
        "es_samples": len(df_es),
        "web_search_enabled": not args.no_web_search,
        "labels_included": labels is not None,
        "kpi_directory": str(kpi_dir)
    }
    
    if len(df_mro) > 0:
        metadata["mro_features"] = list(df_mro.columns)
    if len(df_es) > 0:
        metadata["es_features"] = list(df_es.columns)
    
    metadata_path = output_dir / "extraction_metadata.json"
    metadata_path.write_text(json.dumps(metadata, indent=2))
    print(f"\n  ✓ Metadata saved: {metadata_path}")
    
    # Print summary statistics
    print("\n" + "="*80)
    print("FEATURE EXTRACTION SUMMARY")
    print("="*80)
    
    if len(df_mro) > 0:
        print("\nMRO Features:")
        print(df_mro.describe())
    
    if len(df_es) > 0:
        print("\nES Features:")
        print(df_es.describe())
    
    print("\n✓ Feature extraction complete!")


if __name__ == "__main__":
    asyncio.run(main())
</file>

<file path="flux-new-reason/icflow/features.py">
"""Minimal feature engineering for MRO and ES tasks."""
import numpy as np
from typing import Dict
from icflow.schemas import ContextSchema


def safe_float(value, default=0.0):
    """Convert value to float, handling NaN/inf."""
    if value is None or np.isnan(value) or np.isinf(value):
        return default
    return float(value)


def calculate_mro_features(context: ContextSchema) -> Dict[str, Dict]:
    """
    Calculate MRO features from context.
    Returns dict with feature name -> {value, meaning, logic}.
    """
    kpi = context.kpi
    common_sense = context.common_sense
    
    # Calculate base HO metrics
    inter_att = kpi.get("pscell_inter_att", 0.0)
    inter_succ = kpi.get("pscell_inter_succ", 0.0)
    intra_att = kpi.get("pscell_intra_att", 0.0)
    intra_succ = kpi.get("pscell_intra_succ", 0.0)
    
    total_att = inter_att + intra_att
    total_succ = inter_succ + intra_succ
    hos = (total_succ / total_att * 100) if total_att > 0 else 100.0
    hof = (100.0 - hos) / 100.0
    
    call_drop_ratio = kpi.get("call_drop_ratio_pct", 0.0) / 100.0
    prb_dl_pct = kpi.get("prb_dl_pct", 0.0)
    
    # Feature 1: Handover Failure Pressure
    hf_pressure = safe_float(hof + call_drop_ratio)
    
    # Feature 2: Handover Success Stability
    historical_hos = common_sense.get("historical_hos", [])
    if historical_hos and len(historical_hos) > 1:
        hos_stability = safe_float(np.mean(historical_hos) - np.std(historical_hos))
    else:
        hos_stability = safe_float(hos)
    
    # Feature 3: Congestion-Induced HO Risk
    congestion_risk = safe_float(prb_dl_pct / 100.0)
    
    # Feature 4: Mobility Volatility
    if historical_hos and len(historical_hos) > 1:
        mobility_vol = safe_float(np.std(historical_hos) / 100.0)
    else:
        mobility_vol = 0.0
    
    # Feature 5: Weather Risk
    weather_risk = safe_float(common_sense.get("weather_score", 0.0), default=0.5)
    
    # Feature 6: Alarm Count
    n_alarm_mro = safe_float(common_sense.get("n_alarm_mro", 0), default=0.0)

    # Feature 7: Social Event Score
    social_event_score_mro = safe_float(common_sense.get("social_event_score", 0.0))

    return {
        "Handover Failure Pressure": {
            "value": safe_float(hf_pressure),
            "meaning": f"Total HO failure pressure: {hof*100:.1f}% HOF + {call_drop_ratio*100:.1f}% drop = {hf_pressure*100:.1f}%",
            "logic": ">0.03→cần MRO ngay; 0.02-0.03→MRO nhẹ; <0.02→theo dõi"
        },
        "Handover Success Stability": {
            "value": safe_float(hos_stability),
            "meaning": f"HOS ổn định: {hos_stability:.2f}%",
            "logic": ">97→ổn định; 95-97→cần MRO nhẹ; <95→cần MRO"
        },
        "Congestion-Induced HO Risk": {
            "value": safe_float(congestion_risk),
            "meaning": f"Risk HO fail do nghẽn: PRB DL {prb_dl_pct:.1f}%",
            "logic": ">0.8→MRO ưu tiên; 0.6-0.8→theo dõi; <0.6→OK"
        },
        "Mobility Volatility Index": {
            "value": safe_float(mobility_vol),
            "meaning": f"HOS dao động: std={mobility_vol*100:.3f}%",
            "logic": ">0.05→MRO động; 0.03-0.05→theo dõi; <0.03→ổn định"
        },
        "Weather-Driven Mobility Risk": {
            "value": safe_float(weather_risk, default=0.5),
            "meaning": f"Weather risk score: {weather_risk:.2f}",
            "logic": ">0→mới cho MRO; <0→BLOCK MRO"
        },
        "n_alarm": {
            "value": safe_float(n_alarm_mro),
            "meaning": f"Số alarm block MRO trong 1h: {int(n_alarm_mro)}",
            "logic": ">1→BLOCK MRO (HARD BLOCK); =0-1→cho phép MRO"
        },
        "Social Event Score": {
            "value": safe_float(social_event_score_mro),
            "meaning": f"Social event score: {social_event_score_mro:.2f}",
            "logic": ">0.6→CẤM MRO; 0.3-0.6→cảnh báo; <0.3→trung lập"
        }
    }


def calculate_es_features(context: ContextSchema) -> Dict[str, Dict]:
    """
    Calculate ES features from context.
    Returns dict with feature name -> {value, meaning, logic}.
    """
    kpi = context.kpi
    common_sense = context.common_sense
    
    # Extract base metrics
    power_wh = kpi.get("power_consumption_wh", 0.0)
    prb_dl_pct = kpi.get("prb_dl_pct", 0.0)
    prb_ul_pct = kpi.get("prb_ul_pct", 0.0)
    throughput_dl = kpi.get("throughput_dl_mbps", 0.0)
    throughput_ul = kpi.get("throughput_ul_mbps", 0.0)
    traffic_load = prb_dl_pct + prb_ul_pct
    
    # HO metrics for mobility safety
    inter_att = kpi.get("pscell_inter_att", 0.0)
    inter_succ = kpi.get("pscell_inter_succ", 0.0)
    intra_att = kpi.get("pscell_intra_att", 0.0)
    intra_succ = kpi.get("pscell_intra_succ", 0.0)
    total_att = inter_att + intra_att
    total_succ = inter_succ + intra_succ
    hos = (total_succ / total_att * 100) if total_att > 0 else 100.0
    hof = (100.0 - hos) / 100.0
    call_drop = kpi.get("call_drop_ratio_pct", 0.0) / 100.0
    
    # QoS metrics
    latency = kpi.get("latency_dl_mac_ms", 0.0)
    packet_loss_dl = kpi.get("packet_loss_dl_pct", 0.0)
    packet_loss_ul = kpi.get("packet_loss_ul_pct", 0.0)
    
    # Feature 1: Persistent Low Load Score
    historical_load = common_sense.get("historical_load", [])
    if historical_load:
        p20_threshold = np.percentile(historical_load, 20)
        low_load_pct = safe_float(sum(1 for l in historical_load if l < p20_threshold) / len(historical_load))
    else:
        low_load_pct = 0.7 if traffic_load < 20 else 0.3
    
    # Feature 2: Energy Inefficiency Score
    total_throughput = throughput_dl + throughput_ul
    energy_inefficiency = safe_float((power_wh / total_throughput) if total_throughput > 0 else 0.0)
    
    # Feature 3: Stable QoS Confidence
    qos_violations = 0
    if latency > 50:
        qos_violations += 1
    if packet_loss_dl > 1 or packet_loss_ul > 1:
        qos_violations += 1
    if call_drop > 2:
        qos_violations += 1
    qos_confidence = safe_float(1.0 - (qos_violations / 3.0))
    
    # Feature 4: Mobility Safety Index
    mobility_safety = safe_float(1.0 - (hof + call_drop) / 2.0)
    
    # Feature 5: Social Event Score
    social_event_score = safe_float(common_sense.get("social_event_score", 0.0))
    
    # Feature 6: Traffic Volatility Index
    historical_load = common_sense.get("historical_load", [])
    if historical_load and len(historical_load) > 1:
        mean_load = np.mean(historical_load)
        traffic_volatility = safe_float(np.std(historical_load) / mean_load if mean_load > 0 else 0.0)
    else:
        traffic_volatility = 0.2
    
    # Feature 7: Weather Sensitivity Score
    weather_score = safe_float(common_sense.get("weather_score", 0.5), default=0.5)
    
    # Feature 8: Alarm Count
    n_alarm_es = safe_float(common_sense.get("n_alarm_es", 0), default=0.0)
    
    return {
        "Persistent Low Load Score": {
            "value": safe_float(low_load_pct),
            "meaning": f"Cell nhàn rỗi {low_load_pct*100:.0f}% thời gian, traffic hiện tại: {traffic_load:.1f}%",
            "logic": ">0.7→ủng hộ ES; 0.4-0.7→trung lập; <0.4→chống ES"
        },
        "Energy Inefficiency Score": {
            "value": safe_float(energy_inefficiency),
            "meaning": f"Tiêu tốn {energy_inefficiency:.4f} Wh cho mỗi Mbps throughput",
            "logic": ">P75→ủng hộ ES mạnh; P50-P75→ES nhẹ; <P50→trung lập"
        },
        "Stable QoS Confidence": {
            "value": safe_float(qos_confidence),
            "meaning": f"QoS ổn định {qos_confidence*100:.0f}%, vi phạm: {qos_violations}/3",
            "logic": "≥0.9→cho phép ES; 0.8-0.9→cảnh báo; <0.8→CẤM ES (HARD BLOCK)"
        },
        "Mobility Safety Index": {
            "value": safe_float(mobility_safety),
            "meaning": f"Mobility an toàn {mobility_safety*100:.0f}%, HOF+drop={((hof+call_drop)*100):.2f}%",
            "logic": "≥0.85→cho phép ES; 0.7-0.85→cảnh báo; <0.7→CẤM ES (HARD BLOCK)"
        },
        "Social Event Score": {
            "value": safe_float(social_event_score),
            "meaning": f"Social event score: {social_event_score:.2f}",
            "logic": ">0.6→CẤM ES; 0.3-0.6→cảnh báo; <0.3→trung lập"
        },
        "Traffic Volatility Index": {
            "value": safe_float(traffic_volatility),
            "meaning": f"Traffic biến động: CV={traffic_volatility:.2f}",
            "logic": "<0.3→ủng hộ ES; 0.3-0.5→trung lập; >0.5→chống ES"
        },
        "Weather Sensitivity Score": {
            "value": safe_float(weather_score, default=0.5),
            "meaning": f"Weather score: {weather_score:.2f}",
            "logic": ">0→mới cho ES; <0→BLOCK ES"
        },
        "n_alarm": {
            "value": safe_float(n_alarm_es),
            "meaning": f"Số alarm block ES trong 1h: {int(n_alarm_es)}",
            "logic": ">1→BLOCK ES (HARD BLOCK); =0-1→cho phép ES"
        }
    }
</file>

<file path="flux-new-reason/icflow/generate_dataset.py">
#!/usr/bin/env python3
"""
Script C: Generate training dataset by sampling KPI data.

This script:
1. Loads KPI CSV files
2. Samples cells and timestamps
3. For each sample, generates both MRO and ES pseudo-labels (calls Script B)
4. Saves complete dataset to CSV/JSON for training

Usage:
    python generate_dataset.py 2024-01-15
    python generate_dataset.py 2024-01-15 --max-cells 10 --max-snapshots 50
    python generate_dataset.py  # Uses latest available date
"""
import sys
import json
import argparse
import asyncio
import random
import math
from pathlib import Path
from datetime import datetime
import pandas as pd

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from icflow.schemas import IntentObject, TaskType
from icflow.pseudo_labels import generate_pseudo_label


def safe_json_dumps(obj, **kwargs):
    """Safely dump JSON, replacing NaN/Infinity with null."""
    def convert(o):
        if isinstance(o, float):
            if math.isnan(o) or math.isinf(o):
                return None
        return o
    
    def walk(obj):
        if isinstance(obj, dict):
            return {k: walk(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [walk(item) for item in obj]
        else:
            return convert(obj)
    
    return json.dumps(walk(obj), **kwargs)


def load_kpi_csv(date_str: str = None, kpi_dir: Path = None) -> pd.DataFrame:
    """Load KPI CSV for specified date or latest."""
    if date_str:
        kpi_file = kpi_dir / f"kpi_5min_{date_str}.csv"
        if not kpi_file.exists():
            raise FileNotFoundError(f"KPI file not found: {kpi_file}")
    else:
        # Find latest
        available = sorted(kpi_dir.glob("kpi_5min_*.csv"), reverse=True)
        if not available:
            raise FileNotFoundError(f"No KPI files found in {kpi_dir}")
        kpi_file = available[0]
        print(f"Using latest file: {kpi_file.name}")
    
    print(f"Loading KPI data from: {kpi_file}")
    df = pd.read_csv(kpi_file)
    df['datetime'] = pd.to_datetime(df['datetime'])
    
    print(f"  Loaded {len(df)} rows")
    print(f"  Cells: {df['cellname'].nunique()}")
    print(f"  Sites: {df['ne_name'].nunique()}")
    print(f"  Time range: {df['datetime'].min()} to {df['datetime'].max()}")
    
    return df


def sample_snapshots(
    df: pd.DataFrame,
    max_cells: int = 5,
    max_snapshots_per_cell: int = 20
) -> list:
    """Sample cells and timestamps from KPI data."""
    
    # Get cells with sufficient data
    cell_counts = df.groupby('cellname').size()
    cells_with_data = cell_counts[cell_counts >= 10].index.tolist()
    
    # Sample cells
    random.seed(42)  # Reproducible
    num_cells = min(max_cells, len(cells_with_data))
    selected_cells = random.sample(cells_with_data, num_cells)
    
    print(f"\nSampling strategy:")
    print(f"  Cells selected: {num_cells}")
    print(f"  Max snapshots per cell: {max_snapshots_per_cell}")
    
    # Sample snapshots for each cell
    snapshots = []
    for cell in selected_cells:
        cell_df = df[df['cellname'] == cell].sort_values('datetime')
        
        # Resample to hourly (reduce from 5-minute)
        cell_df['hour'] = cell_df['datetime'].dt.floor('h')
        hourly_df = cell_df.groupby('hour').first().reset_index()
        
        # Sample if too many
        if len(hourly_df) > max_snapshots_per_cell:
            hourly_df = hourly_df.sample(n=max_snapshots_per_cell, random_state=42)
        
        for _, row in hourly_df.iterrows():
            snapshots.append({
                'cellname': row['cellname'],
                'ne_name': row['ne_name'],
                'timestamp': row['datetime'].isoformat()
            })
    
    print(f"  Total snapshots: {len(snapshots)}")
    return snapshots


async def generate_dataset(
    date_str: str = None,
    max_cells: int = 5,
    max_snapshots_per_cell: int = 20,
    kpi_dir: Path = None,
    output_dir: Path = None,
    enable_web_search: bool = False  # Disabled by default for speed
):
    """Generate complete training dataset."""
    
    print(f"\n{'='*80}")
    print(f"TRAINING DATASET GENERATION")
    print(f"{'='*80}\n")
    
    # Load KPI data
    df = load_kpi_csv(date_str, kpi_dir)
    
    # Sample snapshots
    snapshots = sample_snapshots(df, max_cells, max_snapshots_per_cell)
    
    # Prepare output
    artifacts_dir = output_dir / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate pseudo-labels for each snapshot (both MRO and ES)
    dataset_mro_csv = []  # Flat format for MRO CSV (training)
    dataset_es_csv = []  # Flat format for ES CSV (training)
    dataset_json = []  # Rich format for JSON (labeling)
    total = len(snapshots) * 2  # MRO + ES per snapshot
    completed = 0
    failed = 0
    
    print(f"\n{'='*80}")
    print(f"Processing {len(snapshots)} snapshots × 2 tasks = {total} labels to generate")
    print(f"{'='*80}\n")
    
    for idx, snapshot in enumerate(snapshots, 1):
        cell = snapshot['cellname']
        timestamp = snapshot['timestamp']
        ne_name = snapshot['ne_name']
        
        print(f"\n[Snapshot {idx}/{len(snapshots)}] {cell} @ {timestamp}")
        print("-" * 80)
        
        # Storage for multi-label record (one per snapshot)
        snapshot_outputs = {}
        import ulid
        snapshot_intent_id = str(ulid.new())  # Single intent ID for the snapshot
        
        # Process both MRO and ES tasks
        for task_type in [TaskType.MRO, TaskType.ES]:
            # Create intent
            intent = IntentObject(
                intent_id=snapshot_intent_id,
                actor="dataset_generator",
                task_type=task_type,
                target_type="cell",
                target_id=[cell],
                start_time=timestamp
            )
            
            try:
                # Generate pseudo-label (calls Script B)
                output = await generate_pseudo_label(
                    intent,
                    kpi_dir,
                    enable_web_search=enable_web_search,
                    save_artifacts=True,
                    artifacts_dir=artifacts_dir
                )
                
                # Store output for multi-label JSON record
                snapshot_outputs[task_type] = output
                
                # Build flat CSV row (training format: only feature values)
                row = {
                    'intent_id': output.intent_id,
                    'task_type': output.task_type.value,
                    'timestamp': output.timestamp,
                    'cellname': output.cellname,
                    'decision': output.decision,
                    'confidence': output.confidence,
                    'recommendation': output.recommendation
                }
                
                # Add features - only the values for training
                for feature_name, feature_data in output.features.items():
                    row[feature_name] = feature_data['value']
                
                # Append to task-specific list
                if task_type == TaskType.MRO:
                    dataset_mro_csv.append(row)
                else:  # TaskType.ES
                    dataset_es_csv.append(row)
                completed += 1
                
                print(f"  ✓ {task_type.value}: decision={output.decision}, confidence={output.confidence:.2%}")
                
            except Exception as e:
                print(f"  ✗ {task_type.value} failed: {e}")
                failed += 1
        
        # Build multi-label JSON record (rich format for labeling)
        if len(snapshot_outputs) == 2:  # Both MRO and ES succeeded
            # Extract features by task type
            mro_features_list = []
            es_features_list = []
            
            # MRO features with meaning/logic
            for feat_name, feat_data in snapshot_outputs[TaskType.MRO].features.items():
                mro_features_list.append({
                    "name": feat_name,
                    "value": feat_data['value'],
                    "meaning": feat_data.get('meaning', f"{feat_name} = {feat_data['value']:.3f}"),
                    "logic": feat_data.get('logic', 'N/A')
                })
            
            # ES features with meaning/logic
            for feat_name, feat_data in snapshot_outputs[TaskType.ES].features.items():
                es_features_list.append({
                    "name": feat_name,
                    "value": feat_data['value'],
                    "meaning": feat_data.get('meaning', f"{feat_name} = {feat_data['value']:.3f}"),
                    "logic": feat_data.get('logic', 'N/A')
                })
            
            # Get context info from first output (same for both tasks)
            first_output = snapshot_outputs[TaskType.MRO]
            
            # Build comprehensive JSON record
            json_record = {
                # Metadata
                "metadata": {
                    "timestamp": datetime.now().isoformat(),
                    "intent_id": snapshot_intent_id,
                    "cellname": cell,
                    "ne_name": ne_name,
                    "snapshot_time": timestamp,
                    "region": "",  # Could be extracted from context if available
                    "site_type": "",  # Could be extracted from context if available
                },
                
                # Context (placeholder - could be enriched from context_schema)
                "context": {
                    "weather": "clear",  # Could be extracted from context
                    "social_event": "None",  # Could be extracted from context
                    "power_context": "Normal",  # Could be extracted from context
                    "recent_events": "",  # Could be extracted from context
                },
                
                # Features with descriptive meaning and logic
                "features": {
                    "MRO": mro_features_list,
                    "ES": es_features_list,
                },
                
                # Pseudo-labels: decision (True/False) for each task
                "pseudo_labels": {
                    "MRO": snapshot_outputs[TaskType.MRO].decision,
                    "ES": snapshot_outputs[TaskType.ES].decision,
                },
            }
            
            dataset_json.append(json_record)
    
    # Save dataset
    print(f"\n{'='*80}")
    print(f"Saving dataset...")
    print(f"{'='*80}\n")
    
    # Save separate CSVs by task type (flat format for training)
    # Each CSV contains only task-specific features
    csv_files = []
    task_data = {
        'MRO': dataset_mro_csv,
        'ES': dataset_es_csv
    }
    
    for task_type, task_rows in task_data.items():
        if len(task_rows) > 0:
            # Convert to DataFrame
            df_task = pd.DataFrame(task_rows)
            csv_path = output_dir / f"dataset_{task_type.lower()}.csv"
            
            # Load existing data if file exists (cumulative mode)
            if csv_path.exists():
                print(f"  📁 Loading existing {task_type} CSV: {csv_path}")
                df_existing = pd.read_csv(csv_path)
                print(f"     Existing rows: {len(df_existing)}")
                
                # Combine and deduplicate by intent_id
                df_combined = pd.concat([df_existing, df_task], ignore_index=True)
                df_combined = df_combined.drop_duplicates(subset=['intent_id'], keep='last')
                
                new_count = len(df_combined) - len(df_existing)
                print(f"     New rows added: {new_count}")
                df_task = df_combined
            
            df_task.to_csv(csv_path, index=False)
            csv_files.append((csv_path, df_task))
            print(f"  ✓ {task_type} CSV saved: {csv_path} ({len(df_task)} total rows)")
    
    # Save as JSON (rich multi-label format for labeling)
    json_path = output_dir / "dataset.json"
    
    # Load existing JSON data if file exists (cumulative mode)
    if json_path.exists():
        print(f"  📁 Loading existing JSON: {json_path}")
        try:
            existing_json = json.loads(json_path.read_text())
            print(f"     Existing snapshots: {len(existing_json)}")
            
            # Combine and deduplicate by intent_id
            existing_intent_ids = {rec['metadata']['intent_id'] for rec in existing_json}
            new_records = [rec for rec in dataset_json if rec['metadata']['intent_id'] not in existing_intent_ids]
            dataset_json = existing_json + new_records
            
            print(f"     New snapshots added: {len(new_records)}")
        except (json.JSONDecodeError, KeyError) as e:
            print(f"     ⚠️  Could not parse existing JSON, will overwrite: {e}")
    
    json_path.write_text(safe_json_dumps(dataset_json, indent=2))
    print(f"  ✓ JSON saved (rich multi-label format): {json_path} ({len(dataset_json)} total snapshots)")
    
    # Summary
    print(f"\n{'='*80}")
    print(f"DATASET GENERATION COMPLETED")
    print(f"{'='*80}")
    print(f"  Labels generated this run: {completed}/{total}")
    print(f"  Success rate: {completed/total*100:.1f}%")
    print(f"  Failed: {failed}")
    print(f"\n  Output files (cumulative):")
    for csv_path, _ in csv_files:
        print(f"    • {csv_path}")
    print(f"    • {json_path} (multi-label contextualized format)")
    print(f"    • {artifacts_dir}/ (individual artifacts)")
    print(f"\n  Dataset breakdown (total accumulated):")
    for csv_path, df_task in csv_files:
        task_name = "MRO" if "mro" in csv_path.name else "ES"
        print(f"    • {task_name} CSV (task-specific features only): {len(df_task)} rows")
        print(f"      ✓ Action needed: {len(df_task[df_task['decision']==True])}")
        print(f"      ✗ No action: {len(df_task[df_task['decision']==False])}")
    if len(dataset_json) > 0:
        print(f"    • JSON (rich, for labeling): {len(dataset_json)} snapshots")
        print(f"      - Each snapshot includes MRO + ES features with meaning/logic")
        mro_actions = sum(1 for rec in dataset_json if rec['pseudo_labels']['MRO'])
        es_actions = sum(1 for rec in dataset_json if rec['pseudo_labels']['ES'])
        print(f"      - MRO actions: {mro_actions}/{len(dataset_json)}")
        print(f"      - ES actions: {es_actions}/{len(dataset_json)}")
    print(f"{'='*80}\n")


async def main():
    parser = argparse.ArgumentParser(
        description="Generate training dataset from KPI data"
    )
    parser.add_argument(
        "date",
        nargs="?",
        help="Date in YYYY-MM-DD format (optional, uses latest if not specified)"
    )
    parser.add_argument(
        "--max-cells",
        type=int,
        default=2,
        help="Maximum number of cells to sample (default: 5)"
    )
    parser.add_argument(
        "--max-snapshots",
        type=int,
        default=5,
        help="Maximum snapshots per cell (default: 20)"
    )
    parser.add_argument(
        "--enable-web-search",
        action="store_true",
        default=True,
        help="Enable web search for events (slower but more accurate)"
    )
    
    args = parser.parse_args()
    
    # Validate date if provided
    date_str = args.date
    if date_str:
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            print(f"Error: Invalid date format '{date_str}'. Expected YYYY-MM-DD")
            sys.exit(1)
    
    # Paths
    kpi_dir = Path(__file__).parent.parent / "app" / "data" / "KPI" / "v3"
    output_dir = Path(__file__).parent / "output"
    output_dir.mkdir(exist_ok=True)
    
    print(f"Configuration:")
    print(f"  Date: {date_str or 'Latest available'}")
    print(f"  Max cells: {args.max_cells}")
    print(f"  Max snapshots per cell: {args.max_snapshots}")
    print(f"  Web search: {'Enabled' if args.enable_web_search else 'Disabled (faster)'}")
    print(f"  KPI directory: {kpi_dir}")
    print(f"  Output directory: {output_dir}")
    
    # Generate
    try:
        await generate_dataset(
            date_str=date_str,
            max_cells=args.max_cells,
            max_snapshots_per_cell=args.max_snapshots,
            kpi_dir=kpi_dir,
            output_dir=output_dir,
            enable_web_search=args.enable_web_search
        )
    except KeyboardInterrupt:
        print("\n\n⚠️  Generation interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Generation failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
</file>

<file path="flux-new-reason/icflow/model_service.py">
"""
Decision Tree Model Service for icflow.

Loads ES/MRO models from icflow/models/ and exposes predict_with_trace().
Models are stored as pkl dicts: {'model': classifier, 'feature_names': [...], 'model_type': str}
"""
import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

# Default model directory relative to this file
_MODELS_DIR = Path(__file__).parent / "models"


@dataclass
class PredictionResult:
    decision: bool
    decision_score: float          # max class probability
    explain_path: List[Dict[str, Any]]   # decision node trace
    feature_values: Dict[str, float]
    model_type: str
    model_version: str


class ModelService:
    """Loads and serves DecisionTree models for ES and MRO tasks."""

    def __init__(self, models_dir: Path = _MODELS_DIR):
        self._dir = Path(models_dir)
        self._models: Dict[str, Dict[str, Any]] = {}  # task_type -> model_data

    def load(self, task_type: str) -> None:
        """Load model for the given task type (ES or MRO)."""
        key = task_type.upper()
        pkl_path = self._dir / f"{key.lower()}_model.pkl"
        if not pkl_path.exists():
            raise FileNotFoundError(f"Model not found: {pkl_path}")
        data = joblib.load(pkl_path)
        self._models[key] = data
        logger.info(f"Loaded {key} model from {pkl_path} ({len(data['feature_names'])} features)")

    def load_all(self) -> None:
        """Load all available models."""
        for pkl in self._dir.glob("*_model.pkl"):
            task = pkl.stem.replace("_model", "").upper()
            try:
                self.load(task)
            except Exception as e:
                logger.warning(f"Could not load {task} model: {e}")

    def is_loaded(self, task_type: str) -> bool:
        return task_type.upper() in self._models

    # ------------------------------------------------------------------
    # Core prediction
    # ------------------------------------------------------------------

    def predict(self, task_type: str, features: Dict[str, float]) -> PredictionResult:
        """
        Run model for task_type and return PredictionResult with decision tree trace.
        Auto-loads model if not yet in memory.
        """
        key = task_type.upper()
        if key not in self._models:
            self.load(key)

        data = self._models[key]
        model = data["model"]
        feature_names: List[str] = data["feature_names"]

        # Align features → DataFrame (fill missing with 0)
        row = {f: features.get(f, 0.0) for f in feature_names}
        X = pd.DataFrame([row])

        prediction = bool(model.predict(X)[0])
        proba = model.predict_proba(X)[0].tolist()
        score = float(max(proba))
        path = self._decision_path(model, X, feature_names)

        pkl_path = self._dir / f"{key.lower()}_model.pkl"
        model_version = f"{key.lower()}_model_v{self._file_mtime(pkl_path)}"

        return PredictionResult(
            decision=prediction,
            decision_score=score,
            explain_path=path,
            feature_values={f: float(row[f]) for f in feature_names},
            model_type=key,
            model_version=model_version,
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _decision_path(model, X: pd.DataFrame, feature_names: List[str]) -> List[Dict[str, Any]]:
        """Extract decision node trace from a DecisionTreeClassifier."""
        path: List[Dict[str, Any]] = []
        if not hasattr(model, "tree_"):
            return path
        tree = model.tree_
        node_indicator = model.decision_path(X)
        node_ids = node_indicator.indices[node_indicator.indptr[0]:node_indicator.indptr[1]]
        for node_id in node_ids:
            if tree.feature[node_id] == -2:  # leaf
                continue
            feat_idx = int(tree.feature[node_id])
            threshold = float(tree.threshold[node_id])
            feat_name = feature_names[feat_idx]
            feat_val = float(X.iloc[0][feat_name])
            path.append({
                "nodeId": int(node_id),
                "featureName": feat_name,
                "threshold": round(threshold, 6),
                "featureValue": round(feat_val, 6),
                "condition": f"{feat_name} > {threshold:.4f}",
                "passed": feat_val > threshold,
            })
        return path

    @staticmethod
    def _file_mtime(path: Path) -> str:
        """Return short mtime string for version tagging."""
        try:
            import datetime
            ts = path.stat().st_mtime
            return datetime.datetime.fromtimestamp(ts).strftime("%Y%m%d")
        except Exception:
            return "unknown"


# ---------------------------------------------------------------------------
# Singleton
# ---------------------------------------------------------------------------

_service: Optional[ModelService] = None


def get_model_service() -> ModelService:
    """Return (and lazily initialise) the global ModelService."""
    global _service
    if _service is None:
        _service = ModelService()
        _service.load_all()
    return _service
</file>

<file path="flux-new-reason/icflow/pseudo_labels.py">
#!/usr/bin/env python3
"""
Script B: Generate pseudo-labels from intent object.

This script:
1. Takes an intent object (calls Script A to get context)
2. Calculates features for the task type
3. Makes decision using reasoning logic
4. Returns DecisionOutput with pseudo-labels

Usage:
    python pseudo_labels.py --intent intent.json
    python pseudo_labels.py --cell gKH00190_10n411 --timestamp "2024-01-15T10:00" --task MRO
"""
import sys
import json
import argparse
import asyncio
import math
from pathlib import Path
from datetime import datetime

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from icflow.schemas import IntentObject, TaskType, DecisionOutput
from icflow.context_schema import build_context_schema
from icflow.features import calculate_mro_features, calculate_es_features
from icflow.reasoning import decide


def safe_json_dumps(obj, **kwargs):
    """Safely dump JSON, replacing NaN/Infinity with null."""
    def convert(o):
        if isinstance(o, float):
            if math.isnan(o) or math.isinf(o):
                return None
        return o
    
    def walk(obj):
        if isinstance(obj, dict):
            return {k: walk(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [walk(item) for item in obj]
        else:
            return convert(obj)
    
    return json.dumps(walk(obj), **kwargs)


async def generate_pseudo_label(
    intent: IntentObject,
    kpi_dir: Path,
    enable_web_search: bool = True,
    save_artifacts: bool = True,
    artifacts_dir: Path = None
) -> DecisionOutput:
    """
    Generate pseudo-label for a single intent.
    
    Saves artifacts at each step if enabled.
    """
    print(f"\n{'='*80}")
    print(f"Generating pseudo-label for intent: {intent.intent_id}")
    print(f"  Task: {intent.task_type.value}")
    print(f"  Targets: {', '.join(intent.target_id)}")
    print(f"  Timestamp: {intent.start_time}")
    print(f"{'='*80}\n")
    
    # Prepare artifacts directory
    if save_artifacts and artifacts_dir:
        intent_dir = artifacts_dir / intent.intent_id
        intent_dir.mkdir(parents=True, exist_ok=True)
        
        # Save intent
        (intent_dir / "01_intent.json").write_text(intent.model_dump_json(indent=2))
        print(f"  💾 Saved: 01_intent.json")
    
    # Get first target (for simplicity, process one cell at a time)
    cell = intent.target_id[0]
    timestamp = intent.start_time
    
    # Step 1: Build context schema (calls Script A logic)
    print(f"\n[Step 1/4] Building context schema...")
    context = await build_context_schema(
        cell,
        timestamp,
        kpi_dir,
        enable_web_search
    )
    
    if save_artifacts and artifacts_dir:
        (intent_dir / "02_context_schema.json").write_text(context.model_dump_json(indent=2))
        print(f"  💾 Saved: 02_context_schema.json")
    
    # Step 2: Calculate features
    print(f"\n[Step 2/4] Calculating features for {intent.task_type.value}...")
    if intent.task_type == TaskType.MRO:
        features = calculate_mro_features(context)
    elif intent.task_type == TaskType.ES:
        features = calculate_es_features(context)
    else:
        raise ValueError(f"Task type {intent.task_type.value} not supported yet")
    
    if save_artifacts and artifacts_dir:
        (intent_dir / "03_features.json").write_text(safe_json_dumps(features, indent=2))
        print(f"  💾 Saved: 03_features.json")
    
    print(f"\n  Features calculated:")
    for name, data in features.items():
        print(f"    • {name}: {data['value']:.4f}")
    
    # Step 3: Make decision
    print(f"\n[Step 3/4] Making decision...")
    decision, confidence, recommendation = decide(intent.task_type, features)
    
    print(f"\n  Decision: {'✓ ACTION NEEDED' if decision else '✗ NO ACTION'}")
    print(f"  Confidence: {confidence:.2%}")
    print(f"  Recommendation: {recommendation}")
    
    # Step 4: Create output
    print(f"\n[Step 4/4] Creating decision output...")
    output = DecisionOutput(
        intent_id=intent.intent_id,
        task_type=intent.task_type,
        timestamp=context.timestamp,
        cellname=context.cellname,
        decision=decision,
        confidence=confidence,
        features=features,
        recommendation=recommendation
    )
    
    if save_artifacts and artifacts_dir:
        (intent_dir / "04_decision.json").write_text(output.model_dump_json(indent=2))
        print(f"  💾 Saved: 04_decision.json")
        print(f"\n  📁 All artifacts saved to: {intent_dir}")
    
    print(f"\n{'='*80}")
    print(f"✓ Pseudo-label generation completed")
    print(f"{'='*80}\n")
    
    return output


async def main():
    parser = argparse.ArgumentParser(
        description="Generate pseudo-labels from intent"
    )
    
    # Input options
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--intent", help="Intent JSON file")
    group.add_argument("--cell", help="Cell name (use with --timestamp and --task)")
    
    parser.add_argument("--timestamp", help="Timestamp (ISO format)")
    parser.add_argument("--task", choices=["MRO", "ES"], help="Task type")
    
    # Options
    parser.add_argument("--no-web-search", action="store_true", help="Disable web search")
    parser.add_argument("--no-artifacts", action="store_true", help="Don't save artifacts")
    parser.add_argument("--output", help="Output JSON file (default: print to stdout)")
    
    args = parser.parse_args()
    
    # Load or create intent
    if args.intent:
        intent_data = json.loads(Path(args.intent).read_text())
        intent = IntentObject(**intent_data)
    else:
        if not args.timestamp or not args.task:
            parser.error("--cell requires --timestamp and --task")
        
        # Create simple intent
        import ulid
        intent = IntentObject(
            intent_id=str(ulid.new()),
            actor="script",
            task_type=TaskType(args.task),
            target_type="cell",
            target_id=[args.cell],
            start_time=args.timestamp
        )
    
    # Paths
    kpi_dir = Path(__file__).parent.parent / "app" / "data" / "KPI" / "v3"
    artifacts_dir = Path(__file__).parent / "artifacts"
    
    # Generate pseudo-label
    output = await generate_pseudo_label(
        intent,
        kpi_dir,
        enable_web_search=not args.no_web_search,
        save_artifacts=not args.no_artifacts,
        artifacts_dir=artifacts_dir
    )
    
    # Output
    if args.output:
        Path(args.output).write_text(output.model_dump_json(indent=2))
        print(f"✓ Decision output saved to: {args.output}")
    else:
        print("\nDECISION OUTPUT:")
        print("-" * 80)
        print(output.model_dump_json(indent=2))


if __name__ == "__main__":
    asyncio.run(main())
</file>

<file path="flux-new-reason/icflow/README.md">
# ICFlow - Network Feature Extraction

Extract ML-ready features from network intents for decision tree training.

## Prerequisites

KPI data must be available at: `../app/data/KPI/v3/kpi_5min_YYYY-MM-DD.csv`

## 1. Extract Features from Intents

Use `extract_features.py` to convert intent objects into feature DataFrames/CSVs.

### Command Line Examples

```bash
# From a JSON file with intents
python extract_features.py --intents intents.json --output features_output/

# From a directory of intent files
python extract_features.py --intent-dir data/intents/ --output features_output/

# Faster processing (disable web search)
python extract_features.py --intents intents.json --output features_output/ --no-web-search

# With decision labels for training
python extract_features.py --intents intents.json --output features_output/ --labels labels.json
```

### Programmatic Usage

```python
from pathlib import Path
from icflow.schemas import IntentObject, TaskType
from icflow.extract_features import extract_features_batch

# Create intent objects
intents = [
    IntentObject(
        intent_id="abc123",
        actor="user",
        task_type=TaskType.MRO,
        target_type="cell",
        target_id=["gKH00190_10n411"],
        start_time="2024-01-15T10:00:00"
    ),
    IntentObject(
        intent_id="def456",
        actor="system",
        task_type=TaskType.ES,
        target_type="cell",
        target_id=["gKH00190_10n411"],
        start_time="2024-01-15T10:00:00"
    )
]

# Extract features
kpi_dir = Path("../app/data/KPI/v3")
df_mro, df_es = await extract_features_batch(intents, kpi_dir)

# Save to CSV
df_mro.to_csv("mro_features.csv", index=False)
df_es.to_csv("es_features.csv", index=False)
```

### Output

- `features_mro.csv` / `features_mro.parquet` - MRO task features
- `features_es.csv` / `features_es.parquet` - ES task features
- `extraction_metadata.json` - Extraction details

Each row = one cell with extracted features ready for ML training.

## 2. Scan Entire Network

Use `scan_network.py` to extract features for all cells at a specific timestamp.

### Command Line Examples

```bash
# Scan with default cell list at current time
python scan_network.py --output scan_results/

# Scan at specific timestamp
python scan_network.py --timestamp "2024-01-15T10:00" --output scan_results/

# Scan custom cell list
python scan_network.py --cells cells.txt --timestamp "2024-01-15T10:00" --output scan_results/

# Enable web search for weather/events (slower)
python scan_network.py --timestamp "2024-01-15T10:00" --output scan_results/ --enable-web-search
```

### Output

- `scan_mro_YYYYMMDD_HHMM.csv` / `.parquet` - MRO features for all cells
- `scan_es_YYYYMMDD_HHMM.csv` / `.parquet` - ES features for all cells
- `scan_intents.json` - Generated intents
- `scan_summary_YYYYMMDD_HHMM.json` - Scan metadata

Each row = one cell with features extracted at the scan timestamp.

## Features Extracted

**MRO Features:**
- Handover Failure Pressure
- Handover Success Stability
- Congestion-Induced HO Risk
- Mobility Volatility Index
- Weather-Driven Mobility Risk

**ES Features:**
- Persistent Low Load Score
- Energy Inefficiency Score
- Stable QoS Confidence
- Mobility Safety Index
- Social Event Score
- Traffic Volatility Index
- Weather Sensitivity Score

## Notes

- Web search is disabled by default for speed
- Both CSV and Parquet formats are generated
- All features include value, meaning, and decision logic

## 3. Database Integration (NEW!)

The network scanning flow now integrates with PostgreSQL to track intents and cache context snapshots.

### Quick Start

```bash
# Scan with database integration (default)
python scan_network.py --task MRO --output scan_results/

# Scan without database (legacy mode)
python scan_network.py --task MRO --output scan_results/ --no-db
```

### Features

- **Intent Tracking**: Each scan creates one intent record covering all cells
- **Context Caching**: Context snapshots cached by (cell, hour) to avoid redundant web searches
- **Performance**: 20-25x speedup for repeated scans within same hour

### Setup

1. **Run database migration**:
   ```bash
   cd docker
   ./run_migration.sh  # or run_migration.bat on Windows
   ```

2. **Validate integration**:
   ```bash
   python validate_db_integration.py
   ```

3. **Start scanning**:
   ```bash
   python scan_network.py --task MRO --output scan_results/
   ```

### Documentation

- **[DATABASE_UPDATE.md](DATABASE_UPDATE.md)** - Complete implementation guide
- Covers Steps 1-3: Intent Request → Cell Mapping → Context Snapshot
- Includes migration guide, usage examples, performance metrics

### Database Schema

Three new tables:
- `intent_request` - Strategic intent records with ULID IDs
- `intent_target_cells` - Maps intents to target cells
- `cell_context_snapshot` - Cached contexts by (cell_name, time_bucket)

Existing tables preserved:
- `cell_info` - Cell configuration data
- `city` - City/location data
</file>

<file path="flux-new-reason/icflow/reasoning.py">
"""Simple rule-based reasoning for MRO and ES decisions."""
from typing import Dict, Tuple
from icflow.schemas import TaskType


def decide_mro(features: Dict[str, Dict]) -> Tuple[bool, float, str]:
    """
    Simple MRO decision based on features.
    Returns: (decision, confidence, recommendation)
    """
    # Extract feature values
    hf_pressure = features["Handover Failure Pressure"]["value"]
    hos_stability = features["Handover Success Stability"]["value"]
    congestion_risk = features["Congestion-Induced HO Risk"]["value"]
    weather_risk = features["Weather-Driven Mobility Risk"]["value"]
    mobility_vol = features["Mobility Volatility Index"]["value"]
    n_alarm = features["n_alarm"]["value"]
    
    # Hard blocks
    if n_alarm > 1:
        return False, 0.95, f"MRO BLOCKED - {int(n_alarm)} critical alarms detected in 1h window"
    
    if weather_risk < 0:
        return False, 0.85, "Adverse weather - MRO BLOCKED"
    
    # Strong MRO signals
    if hf_pressure > 0.03:
        return True, 0.95, "High handover failure pressure (>3%) - MRO needed immediately"
    
    if hos_stability < 95.0:
        return True, 0.9, "HO stability <95% - MRO optimization needed"
    
    if congestion_risk > 0.8:
        return True, 0.9, "High congestion (>80% PRB) causing HO risk - MRO with load balancing"
    
    if mobility_vol > 0.05:
        return True, 0.85, "High HO volatility (>5%) - dynamic MRO needed"
    
    # Moderate MRO signals
    if hf_pressure > 0.02:
        return True, 0.75, "Moderate handover failure pressure (2-3%) - MRO recommended"
    
    # No action needed
    return False, 0.7, "HO metrics stable - no MRO action needed"


def decide_es(features: Dict[str, Dict]) -> Tuple[bool, float, str]:
    """
    Simple ES decision based on features.
    Returns: (decision, confidence, recommendation)
    """
    # Extract feature values
    low_load = features["Persistent Low Load Score"]["value"]
    energy_inefficiency = features["Energy Inefficiency Score"]["value"]
    qos_confidence = features["Stable QoS Confidence"]["value"]
    mobility_safety = features["Mobility Safety Index"]["value"]
    social_event = features["Social Event Score"]["value"]
    traffic_vol = features["Traffic Volatility Index"]["value"]
    weather = features["Weather Sensitivity Score"]["value"]
    n_alarm = features["n_alarm"]["value"]
    
    # Hard blocks (safety gates)
    if n_alarm > 1:
        return False, 0.95, f"ES BLOCKED - {int(n_alarm)} critical alarms detected in 1h window"
    
    if qos_confidence < 0.8:
        return False, 0.95, "QoS unstable (<80%) - ES BLOCKED for safety"
    
    if mobility_safety < 0.7:
        return False, 0.95, "Mobility unsafe (<0.7) - ES BLOCKED to prevent HO issues"
    
    if social_event > 0.6:
        return False, 0.9, "High social event activity - ES BLOCKED due to high traffic risk"
    
    if weather < 0:
        return False, 0.85, "Adverse weather - ES BLOCKED"
    
    if traffic_vol > 0.7:
        return False, 0.85, "High traffic volatility (>0.7) - ES risky, BLOCKED"
    
    # ES opportunities
    if low_load > 0.7:
        return True, 0.9, "Persistent low load >70% - strong ES opportunity"
    
    # Energy inefficiency signals (high waste = support ES)
    if energy_inefficiency > 0.003:
        return True, 0.95, f"High energy waste ({energy_inefficiency:.4f} Wh/Mbps) - strong ES recommendation"
    
    if energy_inefficiency > 0.002 and low_load > 0.5:
        return True, 0.85, f"Moderate energy waste ({energy_inefficiency:.4f} Wh/Mbps) with low load - ES recommended"
    
    if traffic_vol < 0.5:
        return True, 0.8, "Low traffic volatility (<0.5) - ES safe"
    
    # No strong signal
    return False, 0.6, "No clear ES opportunity - monitoring recommended"


def decide(task_type: TaskType, features: Dict[str, Dict]) -> Tuple[bool, float, str]:
    """Route to appropriate decision function."""
    if task_type == TaskType.MRO:
        return decide_mro(features)
    elif task_type == TaskType.ES:
        return decide_es(features)
    else:
        return False, 0.5, f"Task {task_type.value} not implemented yet"
</file>

<file path="flux-new-reason/icflow/scan_network.py">
#!/usr/bin/env python3
"""
Network Scanning Script - Aligned with Spec v2.

Creates ONE intent per scan covering all cells for a given task type.
Implements context snapshot caching to avoid redundant web searches within same hour.

Usage:
    python scan_network.py --task MRO --output scan_results/
    python scan_network.py --task ES --timestamp "2024-01-15T10:00" --output scan_results/
"""
import sys
import json
import argparse
import asyncio
from pathlib import Path
from datetime import datetime
from typing import Any, List
import pandas as pd
import ulid

sys.path.insert(0, str(Path(__file__).parent.parent))

import logging
from agentscope.tracing import trace

from icflow.schemas import IntentObject, TaskType
from icflow.extract_features import extract_features_batch
from icflow.model_service import get_model_service
from icflow.utils.postgres import get_postgres_client, round_to_hour

logger = logging.getLogger(__name__)


# ── Traced sub-steps ─────────────────────────────────────────────────────────

@trace(name="scan_save_intent")
async def _save_intent_cells(db, intent_id: str, task_type: TaskType, cells: List[str], timestamp: str):
    """Persist intent_request + cell mappings; returns (intent_id, time_bucket)."""
    created_at = datetime.fromisoformat(timestamp)
    intent_id, time_bucket = await db.save_intent_request(
        intent_id=intent_id,
        actor="strategic-agent",
        task_type=task_type.value,
        target_type="site",
        start_time=created_at,
        execution_mode="time_based",
        created_at=created_at,
    )
    await db.save_intent_target_cells(intent_id, cells)
    return intent_id, time_bucket


@trace(name="scan_run_decisions")
async def _run_decisions(
    df: pd.DataFrame,
    intent_id: str,
    task_type: TaskType,
    db,
    save_to_db: bool,
    verbose: bool = False,
    emitter: Any = None,
) -> tuple:
    """Run decision model over df; returns (df_with_decisions, n_decisions, n_positive)."""
    model_svc = get_model_service()
    meta_cols = {"intent_id", "cellname", "ne_name", "timestamp", "task_type"}
    feature_cols = [c for c in df.columns if c not in meta_cols]

    df_decisions: list = []
    decision_rows: list = []
    for _, row in df.iterrows():
        features = {col: float(row[col]) for col in feature_cols if not pd.isna(row[col])}
        result = model_svc.predict(task_type.value, features)
        df_decisions.append({"decision": result.decision, "decision_score": result.decision_score})
        decision_rows.append({
            "intent_id": intent_id,
            "cell_name": row["cellname"],
            "decision": result.decision,
            "decision_score": result.decision_score,
            "explain_path": result.explain_path,
            "model_version": result.model_version,
        })
        if emitter:
            emitter.emit_data(
                "cell_decision",
                cell=row["cellname"],
                decision=result.decision,
                decision_score=result.decision_score,
                explain_path=result.explain_path,
            )

    df = df.copy()
    df["decision"] = [d["decision"] for d in df_decisions]
    df["decision_score"] = [d["decision_score"] for d in df_decisions]
    n_positive = sum(1 for d in decision_rows if d["decision"])

    if save_to_db and db:
        await db.save_cell_decisions_batch(decision_rows)

    return df, len(decision_rows), n_positive


# Default cell list for scanning
DEFAULT_CELLS = [
    'gHM00356_10n411', 'gHM00356_20n411', 'gHM00356_30n411',
    'gHM00293_10n411', 'gHM00293_20n411', 'gHM00293_30n411',
    'gHM00072_10n411', 'gHM00072_20n411', 'gHM00072_30n411',
    'gKH00788_10n411', 'gKH00788_20n411', 'gKH00788_30n411',
    'gKH00505_10n411', 'gKH00505_20n411', 'gKH00505_30n411',
    'gKH00472_10n411', 'gKH00472_20n411', 'gKH00472_30n411',
    'gKH00412_10n411', 'gKH00412_20n411', 'gKH00412_30n411',
    'gKH00243_10n411', 'gKH00243_20n411', 'gKH00243_30n411',
    'gKH00231_10n411', 'gKH00231_20n411', 'gKH00231_30n411',
    'gKH00190_10n411', 'gKH00190_20n411', 'gKH00190_30n411',
    'gKH00112_10n411', 'gKH00112_20n411', 'gKH00112_30n411',
    'gKH00018_10n411', 'gKH00018_20n411', 'gKH00018_30n411'
]


@trace(name="scan_network")
async def scan_network(
    task_type: TaskType,
    cells: List[str],
    timestamp: str,
    kpi_dir: Path,
    output_dir: Path,
    enable_web_search: bool = True,
    verbose: bool = False,
    save_to_db: bool = True,
    emitter: Any = None,
) -> pd.DataFrame:
    """
    Scan network for ONE task type.
    
    Creates:
    - ONE intent_request covering all cells
    - intent_target_cells mappings
    - cell_context_snapshot (with caching)
    - cell_decision rows (decision tree output per cell)

    Returns:
        DataFrame with extracted features (decision columns appended)
    """
    print(f"\n{'='*80}")
    print(f"NETWORK SCAN - {task_type.value}")
    print(f"{'='*80}")
    print(f"Timestamp: {timestamp}")
    print(f"Cells: {len(cells)}")
    print(f"Save to DB: {save_to_db}")
    print(f"{'='*80}\n")
    
    intent_id = str(ulid.new())
    time_bucket = None
    db = None
    
    # STEP 1 & 2: Save intent and cell mappings
    if save_to_db:
        try:
            db = get_postgres_client()
            print(f"[STEP 1+2] Saving intent and cell mappings...")
            intent_id, time_bucket = await _save_intent_cells(db, intent_id, task_type, cells, timestamp)
            print(f"  ✓ Intent: {intent_id} | Time bucket: {time_bucket}")
        except Exception as e:
            print(f"  ❌ Database error: {e}")
            if verbose:
                import traceback
                traceback.print_exc()
    
    # STEP 3: Extract features (with context caching handled in extract_features_batch)
    print(f"\n[STEP 3] Extracting features...")
    
    # Create IntentObjects for legacy feature extraction
    intents = [
        IntentObject(
            intent_id=intent_id,
            actor="strategic-agent",
            task_type=task_type,
            target_type="cell",
            target_id=[cell],
            start_time=timestamp
        )
        for cell in cells
    ]
    
    df_mro, df_es = await extract_features_batch(
        intents, kpi_dir,
        enable_web_search=enable_web_search,
        verbose=verbose,
        show_progress=True,
        emitter=emitter,
    )
    
    df = df_mro if task_type == TaskType.MRO else df_es

    # Diagnostic: surface empty-DataFrame root cause immediately
    n_requested = len(cells)
    n_extracted = len(df)
    if n_extracted == 0:
        logger.error(
            "[scan_network] EMPTY DataFrame after feature extraction | "
            "task=%s ts=%s intent=%s cells_requested=%d "
            "df_mro=%d df_es=%d – likely cause: KPI file missing, "
            "cell name not found in KPI data, or all extract_features_single calls failed. "
            "Enable verbose=True and check WARNING lines above for per-cell errors.",
            task_type.value, timestamp, intent_id,
            n_requested, len(df_mro), len(df_es),
        )
        print(
            f"  ❌ Zero features extracted for {task_type.value} "
            f"(df_mro={len(df_mro)}, df_es={len(df_es)}). "
            f"Re-run with verbose=True or check log WARNING entries above."
        )
    else:
        logger.info(
            "[scan_network] Features extracted | task=%s n=%d/%d columns=%d",
            task_type.value, n_extracted, n_requested, len(df.columns),
        )

    # STEP 4: Run decision tree per cell and persist results
    n_decisions = 0
    n_positive = 0
    print(f"\n[STEP 4] Running decision model ({task_type.value})...")
    if len(df) > 0:
        try:
            df, n_decisions, n_positive = await _run_decisions(df, intent_id, task_type, db, save_to_db, verbose, emitter=emitter)
            print(f"  ✓ Decisions: {n_positive}/{n_decisions} cells recommended for action")
            if save_to_db and db:
                print(f"  ✓ Decisions saved to DB")
        except Exception as e:
            print(f"  ❌ Decision step failed: {e}")
            if verbose:
                import traceback
                traceback.print_exc()

    # Save results
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp_str = datetime.fromisoformat(timestamp).strftime("%Y%m%d_%H%M")
    task_str = task_type.value.lower()

    print(f"\nSaving results...")
    if len(df) > 0:
        csv_file = output_dir / f"scan_{task_str}_{timestamp_str}.csv"
        parquet_file = output_dir / f"scan_{task_str}_{timestamp_str}.parquet"
        df.to_csv(csv_file, index=False)
        df.to_parquet(parquet_file, index=False)
        print(f"  ✓ CSV: {csv_file}")
        print(f"  ✓ Parquet: {parquet_file}")
        print(f"  ✓ Shape: {df.shape}")
    else:
        print(f"  ⚠️  No features extracted")

    # Save summary
    summary = {
        "scan_time": datetime.now().isoformat(),
        "target_timestamp": timestamp,
        "intent_id": intent_id,
        "task_type": task_type.value,
        "cells_scanned": len(cells),
        "features_extracted": len(df),
        "decisions_made": n_decisions,
        "decisions_positive": n_positive,
        "saved_to_db": save_to_db,
    }

    summary_file = output_dir / f"scan_{task_str}_{timestamp_str}_summary.json"
    summary_file.write_text(json.dumps(summary, indent=2))
    print(f"  ✓ Summary: {summary_file}")

    # Stamp intent_id onto every row so callers (strategic_agent, system) can
    # recover it via df["intent_id"].iloc[0] without a separate return value.
    df["intent_id"] = intent_id

    print(f"\n{'='*80}")
    print(f"✓ {task_type.value} scan completed: {len(df)}/{len(cells)} cells | {n_positive} action recommended")
    print(f"{'='*80}\n")

    return df


def load_cells_from_file(filepath: Path) -> List[str]:
    """Load cell list from text file."""
    cells = []
    for line in filepath.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith('#'):
            cells.append(line)
    return cells


async def main():
    parser = argparse.ArgumentParser(description="Network feature extraction with database integration")
    
    parser.add_argument("--task", required=True, choices=["MRO", "ES"], help="Task type to scan")
    parser.add_argument("--cells", help="Text file with cell names (one per line)")
    parser.add_argument("--timestamp", help="Target timestamp (ISO format). Default: now")
    parser.add_argument("--output", required=True, help="Output directory")
    parser.add_argument("--kpi-dir", help="KPI data directory (default: app/data/KPI/v3)")
    parser.add_argument("--no-web-search", action="store_true", help="Disable web search")
    parser.add_argument("--no-db", action="store_true", help="Skip database operations")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")
    
    args = parser.parse_args()
    
    # Parse task type
    task_type = TaskType.MRO if args.task == "MRO" else TaskType.ES
    
    # Load cells
    if args.cells:
        cells = load_cells_from_file(Path(args.cells))
        print(f"Loaded {len(cells)} cells from {args.cells}")
    else:
        cells = DEFAULT_CELLS
        print(f"Using default {len(cells)} cells")
    
    # Timestamp
    timestamp = args.timestamp if args.timestamp else datetime.now().isoformat()
    
    # KPI directory
    kpi_dir = Path(args.kpi_dir) if args.kpi_dir else Path(__file__).parent.parent / "app" / "data" / "KPI" / "v3"
    if not kpi_dir.exists():
        print(f"❌ KPI directory not found: {kpi_dir}")
        return 1
    
    # Run scan
    try:
        await scan_network(
            task_type=task_type,
            cells=cells,
            timestamp=timestamp,
            kpi_dir=kpi_dir,
            output_dir=Path(args.output),
            enable_web_search=not args.no_web_search,
            verbose=args.verbose,
            save_to_db=not args.no_db
        )
        return 0
    except Exception as e:
        print(f"\n❌ Scan failed: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 1
    finally:
        # Cleanup
        db = get_postgres_client()
        if db.pool:
            await db.close()


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
</file>

<file path="flux-new-reason/icflow/schemas.py">
"""Minimal schemas for intent and decisions."""
from typing import Dict, List, Optional, Any
from pydantic import BaseModel
from enum import Enum


class TaskType(str, Enum):
    """Task types."""
    MRO = "MRO"
    ES = "ES"
    TS = "TS"
    QOS = "QoS"


class IntentObject(BaseModel):
    """Intent object from user or system."""
    intent_id: str
    actor: str
    task_type: TaskType
    target_type: str  # site, cell, region
    target_id: List[str]  # list of targets
    start_time: str  # ISO format
    end_time: Optional[str] = None


class ContextSchema(BaseModel):
    """Context for reasoning - simplified."""
    timestamp: str
    ne_name: str  # site
    cellname: str
    kpi: Dict[str, float]  # raw KPI values
    metadata: Dict[str, Any] = {}  # region, site_type, etc.
    common_sense: Dict[str, Any] = {}  # weather, social_event, historical data


class DecisionOutput(BaseModel):
    """Decision output with pseudo-labels."""
    intent_id: str
    task_type: TaskType
    timestamp: str
    cellname: str
    decision: bool  # True = action needed
    confidence: float
    features: Dict[str, Any]  # all features with meaning/logic
    recommendation: str
</file>

<file path="flux-new-reason/icflow/train_models.py">
"""
Script to create ML models for ES and MRO from CSV datasets
"""
import numpy as np
import pandas as pd
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from pathlib import Path

# Set random seed for reproducibility
np.random.seed(42)

def create_es_model(csv_path: str = 'data/dataset_es.csv'):
    """Create Energy Saving (ES) model from CSV data"""
    print("Creating ES model...")

    csv_file = Path(csv_path)

    # Feature names for ES
    feature_names = [
        'Persistent Low Load Score',
        'Energy Inefficiency Score',
        'Stable QoS Confidence',
        'Mobility Safety Index',
        'Social Event Score',
        'Traffic Volatility Index',
        'Weather Sensitivity Score',
        'n_alarm'
    ]

    # Check if CSV file exists
    if csv_file.exists():
        print(f"  Loading data from {csv_path}")
        df = pd.read_csv(csv_path)

        # Drop unnecessary columns if they exist
        columns_to_drop = ['intent_id', 'task_type', 'timestamp', 'cellname', 'recommendation']
        df = df.drop([col for col in columns_to_drop if col in df.columns], axis=1, errors='ignore')

        # Ensure we have the decision column
        if 'decision' not in df.columns:
            raise ValueError("CSV must contain 'decision' column")

        # Extract features and target
        X = df[feature_names]
        y = df['decision']

        print(f"  Loaded {len(df)} samples from CSV")
    else:
        print(f"  CSV file not found at {csv_path}, generating mock data...")

        # Generate mock training data (1000 samples)
        n_samples = 1000
        data = {}

        for feature in feature_names:
            if feature == 'Weather Sensitivity Score':
                # Range: -1 to 1
                data[feature] = np.random.uniform(-1, 1, n_samples)
            elif feature == 'n_alarm':
                # Integer alarm count
                data[feature] = np.random.randint(0, 10, n_samples)
            else:
                # Range: 0 to 1
                data[feature] = np.random.uniform(0, 1, n_samples)

        # Create DataFrame
        df = pd.DataFrame(data)

        # Generate decision labels based on some logic
        df['decision'] = (
            (df['Energy Inefficiency Score'] > 0.6) &
            (df['Persistent Low Load Score'] > 0.5) &
            (df['n_alarm'] < 5)
        ).astype(bool)

        X = df[feature_names]
        y = df['decision']

        print(f"  Generated {len(df)} mock samples")

    # Train model
    model = DecisionTreeClassifier(random_state=42, max_depth=20)
    model.fit(X, y)

    # Save model with feature names
    model_data = {
        'model': model,
        'feature_names': feature_names,
        'model_type': 'ES'
    }

    output_path = Path('models/es_model.pkl')
    output_path.parent.mkdir(exist_ok=True)

    with open(output_path, 'wb') as f:
        joblib.dump(model_data, f)

    print(f"✓ ES model saved to {output_path}")
    print(f"  Features: {len(feature_names)}")
    print(f"  Training samples: {len(X)}")
    print(f"  Training accuracy: {model.score(X, y):.2%}")
    print(f"  True decisions: {y.sum()} / {len(y)} ({y.sum()/len(y):.1%})")
    print()

    return model, feature_names

def create_mro_model(csv_path: str = '../data/dataset_mro.csv'):
    """Create MRO model from CSV data"""
    print("Creating MRO model...")

    # Feature names for MRO
    feature_names = [
        'Handover Failure Pressure',
        'Handover Success Stability',
        'Congestion-Induced HO Risk',
        'Mobility Volatility Index',
        'Weather-Driven Mobility Risk',
        'n_alarm',
        'Social Event Score'
    ]

    csv_file = Path(csv_path)

    # Check if CSV file exists
    if csv_file.exists():
        print(f"  Loading data from {csv_path}")
        df = pd.read_csv(csv_path)

        # Drop unnecessary columns if they exist
        columns_to_drop = ['intent_id', 'task_type', 'timestamp', 'cellname', 'recommendation']
        df = df.drop([col for col in columns_to_drop if col in df.columns], axis=1, errors='ignore')

        # Ensure we have the decision column
        if 'decision' not in df.columns:
            raise ValueError("CSV must contain 'decision' column")

        # Extract features and target
        X = df[feature_names]
        y = df['decision']

        print(f"  Loaded {len(df)} samples from CSV")
    else:
        print(f"  CSV file not found at {csv_path}, generating mock data...")

        # Generate mock training data (1000 samples)
        n_samples = 1000
        data = {}

        for feature in feature_names:
            if feature == 'Weather-Driven Mobility Risk':
                # Range: -1 to 1
                data[feature] = np.random.uniform(-1, 1, n_samples)
            elif feature == 'n_alarm':
                # Integer alarm count
                data[feature] = np.random.randint(0, 10, n_samples)
            else:
                # Range: 0 to 1
                data[feature] = np.random.uniform(0, 1, n_samples)

        # Create DataFrame
        df = pd.DataFrame(data)

        # Generate decision labels based on some logic
        df['decision'] = (
            (df['Handover Failure Pressure'] > 0.6) &
            (df['Handover Success Stability'] < 0.4) &
            (df['n_alarm'] > 4)
        ).astype(bool)

        X = df[feature_names]
        y = df['decision']

        print(f"  Generated {len(df)} mock samples")

    # Train model
    model = DecisionTreeClassifier(random_state=42, max_depth=20)
    model.fit(X, y)

    # Save model with feature names
    model_data = {
        'model': model,
        'feature_names': feature_names,
        'model_type': 'MRO'
    }

    output_path = Path('models/mro_model.pkl')
    output_path.parent.mkdir(exist_ok=True)

    with open(output_path, 'wb') as f:
        joblib.dump(model_data, f)

    print(f"✓ MRO model saved to {output_path}")
    print(f"  Features: {len(feature_names)}")
    print(f"  Training samples: {len(X)}")
    print(f"  Training accuracy: {model.score(X, y):.2%}")
    print(f"  True decisions: {y.sum()} / {len(y)} ({y.sum()/len(y):.1%})")
    print()

    return model, feature_names

def test_models():
    """Test loading and using the models"""
    print("Testing models...")

    # Test ES model
    es_model_path = Path('models/es_model.pkl')
    if not es_model_path.exists():
        print("ES model not found, skipping test")
        return

    with open(es_model_path, 'rb') as f:
        es_data = joblib.load(f)

    es_model = es_data['model']
    es_features = es_data['feature_names']

    # Create a test sample
    test_es = pd.DataFrame({
        'Persistent Low Load Score': [0.7],
        'Energy Inefficiency Score': [0.75],
        'Stable QoS Confidence': [0.9],
        'Mobility Safety Index': [0.85],
        'Social Event Score': [0.3],
        'Traffic Volatility Index': [0.4],
        'Weather Sensitivity Score': [0.2],
        'n_alarm': [2]
    })

    es_prediction = es_model.predict(test_es)
    es_proba = es_model.predict_proba(test_es)

    print(f"✓ ES model test:")
    print(f"  Prediction: {es_prediction[0]}")
    print(f"  Probability: {es_proba[0]}")
    print()

    # Test MRO model
    mro_model_path = Path('models/mro_model.pkl')
    if not mro_model_path.exists():
        print("MRO model not found, skipping test")
        return

    with open(mro_model_path, 'rb') as f:
        mro_data = joblib.load(f)

    mro_model = mro_data['model']
    mro_features = mro_data['feature_names']

    # Create a test sample
    test_mro = pd.DataFrame({
        'Handover Failure Pressure': [0.7],
        'Handover Success Stability': [0.3],
        'Congestion-Induced HO Risk': [0.6],
        'Mobility Volatility Index': [0.5],
        'Weather-Driven Mobility Risk': [-0.3],
        'n_alarm': [6],
        'Social Event Score': [0.4]
    })

    mro_prediction = mro_model.predict(test_mro)
    mro_proba = mro_model.predict_proba(test_mro)

    print(f"✓ MRO model test:")
    print(f"  Prediction: {mro_prediction[0]}")
    print(f"  Probability: {mro_proba[0]}")
    print()

if __name__ == "__main__":
    import sys

    print("=" * 60)
    print("Creating ML Models for ES and MRO")
    print("=" * 60)
    print()

    # Allow custom CSV paths as command line arguments
    es_csv_path = sys.argv[1] if len(sys.argv) > 1 else '../data/dataset_es.csv'
    mro_csv_path = sys.argv[2] if len(sys.argv) > 2 else '../data/dataset_mro.csv'

    create_es_model(es_csv_path)
    create_mro_model(mro_csv_path)
    test_models()

    print("=" * 60)
    print("✓ All models created successfully!")
    print("=" * 60)
</file>

<file path="flux-new-reason/.env.example">
# ==============================================================================
# Flux AI Platform - Environment Configuration Template
# ==============================================================================
# Copy this file to .env and update the values according to your setup
# DO NOT commit the .env file to version control

# ==============================================================================
# API Settings
# ==============================================================================
API_TITLE="Flux AI"
API_VERSION="1.0.1"
API_DESCRIPTION="Agentic AI Platform API"
API_BASE_URL="http://localhost:8001"

# ==============================================================================
# CORS Settings
# ==============================================================================
# JSON array of allowed origins, use ["*"] for development
CORS_ORIGINS='["*"]'

# ==============================================================================
# Vector Database Settings (Milvus)
# ==============================================================================
VECTOR_DB_URI="http://localhost:19530"
VECTOR_DB_NAME="milvus_demo"
COLLECTION_NAME="demo"

# ==============================================================================
# OpenAI Embedding Settings (for hybrid search with BM25)
# ==============================================================================
# OpenAI-compatible API base URL for embeddings
OPENAI_EMBEDDING_BASE_URL="https://integrate.api.nvidia.com/v1"

# API key for embedding service (REQUIRED)
OPENAI_EMBEDDING_API_KEY=""

# Embedding model name
OPENAI_EMBEDDING_MODEL="baai/bge-m3"

# Embedding vector dimensions
EMBEDDING_DIMENSIONS=1024

# ==============================================================================
# Search Configuration
# ==============================================================================
# Default number of results per query (1-50)
DEFAULT_K=6

# Default search type: dense, sparse, hybrid, or concatenate
DEFAULT_SEARCH_TYPE="hybrid"

# Weights for hybrid search (should sum to 1.0)
HYBRID_DENSE_WEIGHT=0.5
HYBRID_SPARSE_WEIGHT=0.5

# ==============================================================================
# LLM API Settings
# ==============================================================================
# OpenAI API key (or compatible provider)
OPENAI_API_KEY=""

# OpenAI-compatible API base URL
OPENAI_BASE_URL="https://integrate.api.nvidia.com/v1"

# Model to use for chat completions
OPENAI_MODEL="qwen/qwen3-235b-a22b"

# Sampling temperature (0.0-2.0)
OPENAI_TEMPERATURE=0.2

# Nucleus sampling parameter (0.0-1.0)
OPENAI_TOP_P=0.7

# Maximum tokens to generate (1-4096)
OPENAI_MAX_TOKENS=1024

# ==============================================================================
# Storage Settings
# ==============================================================================
# Directory for user-uploaded files
UPLOADED_FILES_DIR="./app/data/uploaded_files"

# Path to static assets
STATIC_ASSET_PATH="./app/public"

# ==============================================================================
# Docling API Settings
# ==============================================================================
# Docling API endpoint URL for document conversion
DOCLING_API_URL="http://localhost:5001/v1/convert/file"

# Default OCR languages (JSON array format)
DOCLING_OCR_LANGS='["en"]'

# ==============================================================================
# ML Inference Service (KServe)
# ==============================================================================
ML_SERVICE_URL="http://localhost:8080"

# Base URL this serve process is reachable at (used to build the tactical callback URL)
SERVE_BASE_URL="http://localhost:8090"

# ==============================================================================
# Database Settings (PostgreSQL)
# ==============================================================================
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="vulcan"
DB_USER="app"
DB_PASSWORD="appsecret"
</file>

<file path="flux-new-reason/.gitignore">
# Byte-compiled / optimized / DLL files
__pycache__/
*.py[codz]
*$py.class

# C extensions
*.so

# Distribution / packaging
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
share/python-wheels/
*.egg-info/
.installed.cfg
*.egg
MANIFEST

# PyInstaller
#  Usually these files are written by a python script from a template
#  before PyInstaller builds the exe, so as to inject date/other infos into it.
*.manifest
*.spec

# Installer logs
pip-log.txt
pip-delete-this-directory.txt

# Unit test / coverage reports
htmlcov/
.tox/
.nox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.py.cover
.hypothesis/
.pytest_cache/
cover/

# Translations
*.mo
*.pot

# Django stuff:
*.log
local_settings.py
db.sqlite3
db.sqlite3-journal

# Flask stuff:
instance/
.webassets-cache

# Scrapy stuff:
.scrapy

# Sphinx documentation
docs/_build/

# PyBuilder
.pybuilder/
target/

# Jupyter Notebook
.ipynb_checkpoints

# IPython
profile_default/
ipython_config.py

# pyenv
#   For a library or package, you might want to ignore these files since the code is
#   intended to run in multiple environments; otherwise, check them in:
# .python-version

# pipenv
#   According to pypa/pipenv#598, it is recommended to include Pipfile.lock in version control.
#   However, in case of collaboration, if having platform-specific dependencies or dependencies
#   having no cross-platform support, pipenv may install dependencies that don't work, or not
#   install all needed dependencies.
#Pipfile.lock

# UV
#   Similar to Pipfile.lock, it is generally recommended to include uv.lock in version control.
#   This is especially recommended for binary packages to ensure reproducibility, and is more
#   commonly ignored for libraries.
#uv.lock

# poetry
#   Similar to Pipfile.lock, it is generally recommended to include poetry.lock in version control.
#   This is especially recommended for binary packages to ensure reproducibility, and is more
#   commonly ignored for libraries.
#   https://python-poetry.org/docs/basic-usage/#commit-your-poetrylock-file-to-version-control
#poetry.lock
#poetry.toml

# pdm
#   Similar to Pipfile.lock, it is generally recommended to include pdm.lock in version control.
#   pdm recommends including project-wide configuration in pdm.toml, but excluding .pdm-python.
#   https://pdm-project.org/en/latest/usage/project/#working-with-version-control
#pdm.lock
#pdm.toml
.pdm-python
.pdm-build/

# pixi
#   Similar to Pipfile.lock, it is generally recommended to include pixi.lock in version control.
#pixi.lock
#   Pixi creates a virtual environment in the .pixi directory, just like venv module creates one
#   in the .venv directory. It is recommended not to include this directory in version control.
.pixi

# PEP 582; used by e.g. github.com/David-OConnor/pyflow and github.com/pdm-project/pdm
__pypackages__/

# Celery stuff
celerybeat-schedule
celerybeat.pid

# SageMath parsed files
*.sage.py

# Environments
.env
.envrc
.venv
env/
venv/
ENV/
env.bak/
venv.bak/

# Spyder project settings
.spyderproject
.spyproject

# Rope project settings
.ropeproject

# mkdocs documentation
/site

# mypy
.mypy_cache/
.dmypy.json
dmypy.json

# Pyre type checker
.pyre/

# pytype static type analyzer
.pytype/

# Cython debug symbols
cython_debug/

# PyCharm
#  JetBrains specific template is maintained in a separate JetBrains.gitignore that can
#  be found at https://github.com/github/gitignore/blob/main/Global/JetBrains.gitignore
#  and can be added to the global gitignore or merged into this file.  For a more nuclear
#  option (not recommended) you can uncomment the following to ignore the entire idea folder.
#.idea/

# Abstra
# Abstra is an AI-powered process automation framework.
# Ignore directories containing user credentials, local state, and settings.
# Learn more at https://abstra.io/docs
.abstra/

# Visual Studio Code
#  Visual Studio Code specific template is maintained in a separate VisualStudioCode.gitignore 
#  that can be found at https://github.com/github/gitignore/blob/main/Global/VisualStudioCode.gitignore
#  and can be added to the global gitignore or merged into this file. However, if you prefer, 
#  you could uncomment the following to ignore the entire vscode folder
# .vscode/

# Ruff stuff:
.ruff_cache/

# PyPI configuration file
.pypirc

# Cursor
#  Cursor is an AI-powered code editor. `.cursorignore` specifies files/directories to
#  exclude from AI features like autocomplete and code analysis. Recommended for sensitive data
#  refer to https://docs.cursor.com/context/ignore-files
.cursorignore
.cursorindexingignore

# Marimo
marimo/_static/
marimo/_lsp/
__marimo__/

# Extra
volumes/
# docs/
tmp/
app/data/
app/public/
ui/**/valves.json
ui/pipelines/failed/
*TODO*
</file>

<file path="flux-new-reason/.python-version">
3.12
</file>

<file path="flux-new-reason/ALLCELL.txt">
"gHM00356_10n411", "gHM00356_20n411", "gHM00356_30n411",
"gHM00293_10n411", "gHM00293_20n411", "gHM00293_30n411",
"gHM00072_10n411", "gHM00072_20n411", "gHM00072_30n411",
"gKH00788_10n411", "gKH00788_20n411", "gKH00788_30n411",
"gKH00505_10n411", "gKH00505_20n411", "gKH00505_30n411",
"gKH00472_10n411", "gKH00472_20n411", "gKH00472_30n411",
"gKH00412_10n411", "gKH00412_20n411", "gKH00412_30n411",
"gKH00243_10n411", "gKH00243_20n411", "gKH00243_30n411",
"gKH00231_10n411", "gKH00231_20n411", "gKH00231_30n411",
"gKH00190_10n411", "gKH00190_20n411", "gKH00190_30n411",
"gKH00112_10n411", "gKH00112_20n411", "gKH00112_30n411",
"gKH00018_10n411", "gKH00018_20n411", "gKH00018_30n411"
</file>

<file path="flux-new-reason/context.txt">
# -*- coding: utf-8 -*-
"""AgentScope-traced entry point for the Vulcan service.

Initialises AgentScope tracing at module level (synchronous, root context) and
registers the ``/system-scan/run`` workflow endpoint directly on the standard
FastAPI ``app`` from ``app.main`` – which already includes all API routers.

Usage
-----
Development::

    python -m app.serve                                 # default 0.0.0.0:8099
    python -m app.serve --studio-url http://localhost:3883

Production (uvicorn)::

    AGENTSCOPE_STUDIO_URL=http://localhost:3883 \\
    uvicorn app.serve:app --host 0.0.0.0 --port 8099
"""
from __future__ import annotations

import argparse
import asyncio
import logging
import os
import sys
from datetime import datetime
from typing import Any, Dict, List, Optional

import agentscope
from fastapi import Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from icflow.schemas import TaskType
from app.workflows.system import run_system_scan
from app.agents.tactical_agent import _pending as _tactical_pending
from app.core.stream import AsyncEmitter
from app.main import app  # FastAPI app with all routers already registered

logger = logging.getLogger(__name__)

# ── AgentScope init (module level = root context) ─────────────────────────────
# Must run synchronously before any asyncio Task is created so that the
# ContextVar `trace_enabled` is set in the root context and is inherited by
# every request-handler task.  Calling it inside an async lifespan hook sets
# the ContextVar only in that task's context and does NOT propagate to request
# handlers – which is why tracing silently drops all spans.
#
# --studio-url is extracted from sys.argv early (before argparse) so that the
# env var is already set when this module is imported via uvicorn as well.
for _i, _arg in enumerate(sys.argv[:-1]):
    if _arg in ("--studio-url", "--studio_url"):
        os.environ.setdefault("AGENTSCOPE_STUDIO_URL", sys.argv[_i + 1])
        break

_studio_url = os.getenv("AGENTSCOPE_STUDIO_URL")
agentscope.init(
    project="vulcan",
    name="api-serve",
    studio_url=_studio_url,
    logging_level="INFO",
)
if _studio_url:
    logging.getLogger(__name__).info("[tracing] AgentScope Studio → %s", _studio_url)
else:
    logging.getLogger(__name__).info(
        "[tracing] No tracing – set AGENTSCOPE_STUDIO_URL to enable AS Studio tracing"
    )


# ── Request / Response models ─────────────────────────────────────────────────

class SystemScanRequest(BaseModel):
    task_type: TaskType = Field(..., description="MRO or ES")
    cells: List[str] = Field(..., min_length=1, description="Cell names to scan")
    timestamp: Optional[str] = Field(None, description="ISO-8601 reference time")
    start_date: Optional[str] = Field(None, description="Date window start (ISO-8601, MRO)")
    end_date: Optional[str] = Field(None, description="Date window end (ISO-8601, MRO)")
    enable_web_search: bool = Field(False, description="Enable web search during scan")
    save_to_db: bool = Field(True, description="Persist results to Postgres")

    model_config = {"use_enum_values": True}


class SystemScanResponse(BaseModel):
    content: str
    intent_id: Optional[str]
    task_type: str
    # Strategic fields (always populated)
    positive_cells: List[str]
    assigned_cells: List[str]
    failed_cells: List[str]
    errors: List[Any]
    # Tactical fields (populated when TacticalAgent completes)
    plan: Optional[Dict[str, Any]]
    metadata: Dict[str, Any]


# ── Tactical callback ──────────────────────────────────────────────────────────

class TacticalCallbackBody(BaseModel):
    intent_id: str
    service_type: str
    status: str                         # e.g. "success" | "error"
    error_message: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


@app.post(
    "/tactical/callback",
    status_code=200,
    tags=["workflow"],
    summary="ML pipeline completion webhook",
)
async def tactical_callback(
    body: TacticalCallbackBody,
    token: str = Query(..., description="Per-request correlation token"),
) -> Dict[str, str]:
    """Called by the ML pipeline when plan generation is complete.

    The ML service POSTs ``{intent_id, service_type, status, error_message}``
    to ``/tactical/callback?token=<token>``.  We look up the waiting coroutine
    by ``token`` (not by the ML service’s own intent_id).
    """
    entry = _tactical_pending.get(token)
    if entry is None:
        logger.warning("[callback] Unknown token: %s", token)
        return {"status": "unknown", "token": token}
    evt, result_slot = entry
    result_slot["status"] = body.status
    result_slot["error_message"] = body.error_message
    result_slot["data"] = body.data
    evt.set()
    logger.info(
        "[callback] Signalled token=%s intent=%s status=%s",
        token, body.intent_id, body.status,
    )
    return {"status": "ok", "token": token}


# ── Workflow endpoint (registered on the main FastAPI app) ────────────────────

@app.post("/system-scan/run", response_model=SystemScanResponse, tags=["workflow"])
async def system_scan_run(request: SystemScanRequest) -> SystemScanResponse:
    """Execute a full scan → assign → plan cycle and return results."""
    result = await run_system_scan(
        task_type=TaskType(request.task_type),
        cells=request.cells,
        timestamp=request.timestamp,
        start_date=datetime.fromisoformat(request.start_date) if request.start_date else None,
        end_date=datetime.fromisoformat(request.end_date) if request.end_date else None,
        enable_web_search=request.enable_web_search,
        save_to_db=request.save_to_db,
    )
    meta = result.metadata or {}
    # Result may be PLAN_RESULT (full pipeline) or STRATEGIC_RESULT (fallback)
    strategic = meta if meta.get("type") == "STRATEGIC_RESULT" else meta
    return SystemScanResponse(
        content=result.content,
        intent_id=meta.get("intent_id"),
        task_type=meta.get("task_type") or "",
        positive_cells=meta.get("positive_cells") or [],
        assigned_cells=meta.get("assigned_cells") or [],
        failed_cells=meta.get("failed_cells") or [],
        errors=list((meta.get("errors") or {}).values()),
        plan=meta.get("plan"),
        metadata=meta,
    )


@app.post("/system-scan/stream", tags=["workflow"])
async def system_scan_stream(request: SystemScanRequest) -> StreamingResponse:
    """Stream scan → assign → plan progress as Server-Sent Events.

    Each event is a JSON object::

        {"type": "scanning", "icon": "🔍", "text": "Scanning 42 cells..."}

    Event types: ``start``, ``scanning``, ``scan_done``, ``assigning``,
    ``strategic_done``, ``generating_plan``, ``awaiting_callback``,
    ``loading_plan``, ``done``, ``error``.
    """
    emitter = AsyncEmitter()

    async def _run() -> None:
        try:
            await run_system_scan(
                task_type=TaskType(request.task_type),
                cells=request.cells,
                timestamp=request.timestamp,
                start_date=datetime.fromisoformat(request.start_date) if request.start_date else None,
                end_date=datetime.fromisoformat(request.end_date) if request.end_date else None,
                enable_web_search=request.enable_web_search,
                save_to_db=request.save_to_db,
                emitter=emitter,
            )
        except Exception as exc:
            logger.exception("[stream] Pipeline error: %s", exc)
            emitter.emit("error", str(exc))
        finally:
            emitter.done()

    asyncio.create_task(_run())
    return StreamingResponse(
        emitter.iter_sse(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── CLI entry point ───────────────────────────────────────────────────────────

def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Vulcan – AgentScope Runtime server")
    p.add_argument("--host", default="0.0.0.0")
    p.add_argument("--port", type=int, default=8099)
    p.add_argument("--studio-url", help="AgentScope Studio URL for tracing (overrides AGENTSCOPE_STUDIO_URL env var)")
    return p.parse_args()


if __name__ == "__main__":
    import uvicorn

    logging.basicConfig(level=logging.INFO)
    args = _parse_args()

    # CLI --studio-url takes precedence over the env var
    if args.studio_url:
        os.environ["AGENTSCOPE_STUDIO_URL"] = args.studio_url

    uvicorn.run(app, host=args.host, port=args.port, log_level="info")


# -*- coding: utf-8 -*-
"""Async SSE emitter for streaming agentic workflow progress."""
from __future__ import annotations

import asyncio
import json
from typing import Any, AsyncIterator

_ICONS: dict[str, str] = {
    "start":             "🚀",
    "scanning":          "🔍",
    "scan_done":         "📊",
    "assigning":         "📋",
    "strategic_done":    "✅",
    "generating_plan":   "⚙️",
    "awaiting_callback": "⏳",
    "loading_plan":      "📥",
    "done":              "🎉",
    "error":             "❌",
}

_SENTINEL = object()


class AsyncEmitter:
    """Thread-safe SSE event emitter backed by asyncio.Queue.

    Usage::

        emitter = AsyncEmitter()

        async def run():
            await do_work(emitter=emitter)
            emitter.done()

        asyncio.create_task(run())
        async for chunk in emitter.iter_sse():
            yield chunk          # StreamingResponse body
    """

    def emit(self, type: str, text: str) -> None:
        """Enqueue a progress SSE event (safe to call from any coroutine)."""
        event = {"channel": "progress", "type": type, "icon": _ICONS.get(type, "•"), "text": text}
        self._queue.put_nowait(event)

    def emit_data(self, type: str, **data: Any) -> None:
        """Enqueue a content SSE event for streaming structured results."""
        event = {"channel": "content", "type": type, **data}
        self._queue.put_nowait(event)

    def done(self) -> None:
        """Signal end-of-stream (must be called exactly once)."""
        self._queue.put_nowait(_SENTINEL)

    # ── Lifecycle ──────────────────────────────────────────────────────────────

    def __init__(self) -> None:
        self._queue: asyncio.Queue = asyncio.Queue()

    async def iter_sse(self) -> AsyncIterator[str]:
        """Yield ``data: <json>\n\n`` SSE frames until sentinel received."""
        while True:
            item = await self._queue.get()
            if item is _SENTINEL:
                break
            yield f"data: {json.dumps(item)}\n\n"
</file>

<file path="flux-new-reason/main.py">
def main():
    print("Hello from flux!")


if __name__ == "__main__":
    main()
</file>

<file path="flux-new-reason/pyproject.toml">
[project]
name = "flux"
version = "1.0.1"
description = "Agentic AI"
readme = "README.md"
requires-python = ">=3.10"
dependencies = [
    "asyncpg>=0.31.0",
    "beautifulsoup4>=4.14.3",
    "docling-core[chunking]>=2.59.0",
    "fastapi>=0.128.0",
    "langchain>=1.2.7",
    "langchain-core>=1.2.7",
    "langfuse>=3.12.0",
    "langgraph>=1.0.7",
    "markdown>=3.10",
    "openai>=2.15.0",
    "pydantic>=2.12.5",
    "pydantic-settings>=2.12.0",
    "pymilvus[model]>=2.6.6",
    "streamlit>=1.53.1",
    "tiktoken>=0.12.0",
    "ulid-py>=1.1.0",
    "uvicorn[standard]>=0.40.0",
]

[dependency-groups]
dev = [
    "ipykernel>=7.1.0",
    "ipywidgets>=8.1.8",
    "poethepoet>=0.40.0",
    "pytest>=9.0.2",
    "pytest-cov>=7.0.0",
    "pytest-mock>=3.15.1",
    "ruff>=0.14.11",
]

[tool.uv.sources]

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]

[tool.ruff]
line-length = 120
target-version = "py311"

[tool.ruff.lint]
select = [
    "E",  # pycodestyle errors
    "W",  # pycodestyle warnings
    "F",  # pyflakes
    "I",  # isort
    "B",  # flake8-bugbear
    "C4", # flake8-comprehensions
    "UP", # pyupgrade
]
ignore = [
    "E501", # line too long (handled by formatter)
    "B008", # do not perform function calls in argument defaults
    "B904", # raise from None
]

[tool.ruff.lint.per-file-ignores]
"__init__.py" = ["F401"] # Allow unused imports in __init__.py

[tool.ruff.format]
quote-style = "double"
indent-style = "space"

# Poethepoet Task Runner Configuration
[tool.poe]
envfile = ".env"

[tool.poe.tasks]
# ========================================
# Testing Tasks
# ========================================
test = { cmd = "pytest tests/ -v", help = "Run all tests with verbose output" }
test-cov = { cmd = "pytest --cov=app --cov-report=html --cov-report=term-missing tests/", help = "Run tests with coverage report" }
test-fast = { cmd = "pytest tests/ -x -v", help = "Run tests, stop on first failure" }
test-failed = { cmd = "pytest --lf -v", help = "Re-run only failed tests" }
test-watch = { cmd = "pytest tests/ -v --tb=short", help = "Run tests in watch mode (use with pytest-watch)" }

# ========================================
# Code Quality Tasks
# ========================================
lint = { cmd = "ruff check app/ tests/ scripts/", help = "Run ruff linter" }
lint-fix = { cmd = "ruff check --fix app/ tests/ scripts/", help = "Run ruff linter and auto-fix issues" }
format = { cmd = "ruff format app/ tests/ scripts/", help = "Format code with ruff" }
format-check = { cmd = "ruff format --check app/ tests/ scripts/", help = "Check code formatting without changes" }

# Combined quality check
quality = { sequence = [
    "format-check",
    "lint",
    "test",
], help = "Run all quality checks (format, lint, test)" }

# ========================================
# Development Server Tasks
# ========================================
dev = { cmd = "uvicorn app.main:app --host localhost --port 8000", help = "Run development server" }
dev-debug = { cmd = "uvicorn app.main:app --host localhost --port 8000 --log-level debug", help = "Run dev server with debug logging" }

# ========================================
# Data Pipeline Tasks
# ========================================
prep = { cmd = "python scripts/prep.py", help = "Preprocess documents (normalize, convert formats)" }
seed-reset = { cmd = "python scripts/seed.py --reset", help = "Reset and ingest all documents" }

# ========================================
# Cleanup Tasks
# ========================================
clean-pyc = { shell = "find . -type f -name '*.pyc' -delete && find . -type d -name '__pycache__' -delete", help = "Remove Python bytecode files" }
clean-test = { shell = "rm -rf .pytest_cache htmlcov .coverage", help = "Remove test artifacts" }
clean-build = { shell = "rm -rf build dist *.egg-info", help = "Remove build artifacts" }
clean = { sequence = [
    "clean-pyc",
    "clean-test",
    "clean-build",
], help = "Remove all generated files" }

# ========================================
# Setup Tasks
# ========================================
install = { cmd = "uv sync", help = "Install all dependencies" }
install-dev = { cmd = "uv sync --all-extras", help = "Install all dependencies including dev, pipeline, notebook" }
install-prod = { cmd = "uv sync --no-dev", help = "Install only production dependencies" }

# ========================================
# CI/CD Tasks
# ========================================
ci-test = { cmd = "pytest tests/ --cov=app --cov-report=xml --cov-report=term -v", help = "Run tests for CI with XML coverage report" }
ci-lint = { sequence = [
    "format-check",
    "lint",
], help = "Run linting checks for CI" }
ci = { sequence = [
    "ci-lint",
    "ci-test",
], help = "Run full CI pipeline (lint + test)" }

# ========================================
# Docker Tasks
# ========================================
[tool.poe.tasks.docker-up]
help = "Start Docker services (usage: poe docker-up [service1 service2...])"
cmd = "docker compose -f docker/docker-compose.yml up -d ${services}"
args = [{ name = "services", positional = true, multiple = true, default = "" }]

[tool.poe.tasks.docker-down]
help = "Stop Docker services (usage: poe docker-down [service1 service2...])"
cmd = "docker compose -f docker/docker-compose.yml down ${services}"
args = [{ name = "services", positional = true, multiple = true, default = "" }]

[tool.poe.tasks.docker-logs]
help = "View logs for a service (default: agent)"
cmd = "docker compose -f docker/docker-compose.yml logs -f ${service}"
args = [{ name = "service", positional = true, default = "agent" }]

[tool.poe.tasks.docker-restart]
help = "Restart a service (default: agent)"
cmd = "docker compose -f docker/docker-compose.yml restart ${service}"
args = [{ name = "service", positional = true, default = "agent" }]

[tool.poe.tasks.docker-build]
help = "Build Docker image for a service (default: agent)"
cmd = "docker compose -f docker/docker-compose.yml build ${service}"
args = [{ name = "service", positional = true, default = "agent" }]

#========================================
# Data Seeding Task
#========================================
[tool.poe.tasks.seed]
help = "Ingest documents (usage: poe seed [--groups group1 group2] [--reset] [--max-tokens 512])"
cmd = "python scripts/seed.py"

#=======================================
# Rebuild and Reload Tasks
#=======================================
[tool.poe.tasks.rebuild]
help = "Rebuild a Docker service (usage: poe rebuild [service])"
cmd = "bash scripts/rebuild.sh ${service}"
args = [{ name = "service", positional = true, required = true }]

[tool.poe.tasks.reload]
help = "Reload a Docker service (usage: poe reload [service])"
cmd = "bash scripts/reload.sh ${service}"
args = [{ name = "service", positional = true, required = true }]
</file>

<file path="flux-new-reason/README.md">
## Setup

```bash
# Activate virtual environment
source .venv/bin/activate        # Linux/macOS
.venv\Scripts\activate            # Windows

# Install dependencies
uv sync
```

---

## Agentic Workflow

Built on [AgentScope](https://github.com/modelscope/agentscope). No LLM involved.

### Pipeline

```
Caller ──SCAN_REQUEST──► StrategicAgent ──STRATEGIC_RESULT──► TacticalAgent (stub)
                         (scan + assign)                       (plan generation)
```

| Agent | File | Status |
|---|---|---|
| `StrategicAgent` | `app/agents/strategic_agent.py` | ✅ done |
| `TacticalAgent` | `app/agents/tactical_agent.py` | 🚧 stub |
| Workflow | `app/workflows/system.py` | ✅ done |

### Run

```bash
# CLI
python -m app.workflows.system --task MRO --no-db
python -m app.workflows.system --task ES --start-date 2026-01-01 --end-date 2026-02-01

# Programmatic
import asyncio, agentscope
from app.workflows.system import run_system_scan
from icflow.schemas import TaskType

agentscope.init(project="vulcan")
result = asyncio.run(run_system_scan(task_type=TaskType.MRO, cells=[...]))
```

### API service

Served via [AgentScope Runtime](https://github.com/modelscope/agentscope-runtime) (`app/serve.py`).

```bash
# Start (uvicorn, default 0.0.0.0:8090)
python -m app.serve

# Daemon-thread mode via LocalDeployManager
python -m app.serve --deploy

# Custom host/port
python -m app.serve --host 0.0.0.0 --port 9000

# Production
uvicorn app.serve:agent_app --host 0.0.0.0 --port 8090
```

Interactive docs: `http://localhost:8090/docs`

#### Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/system-scan/run` | Run scan → assign workflow |
| `POST` | `/network-scan/...` | Raw KPI feature extraction |
| `POST` | `/historical-kpi/...` | Historical KPI data |
| `POST` | `/historical-alarm/...` | Historical alarm data |
| `POST` | `/plan/load` | Load plan from MinIO |
| `GET` | `/health` | Health check |

#### Example – system scan

```bash
curl -X POST http://localhost:8090/system-scan/run \
  -H "Content-Type: application/json" \
  -d '{
    "task_type": "MRO",
    "cells": ["gHM00356_10n411", "gHM00356_20n411"],
    "enable_web_search": false,
    "save_to_db": false
  }'
```

Optional request fields: `timestamp`, `start_date`, `end_date` (ISO-8601 strings).

### Tracing

All agents are instrumented with `@trace_reply` / `@trace`.
Traces are forwarded to **AgentScope Studio** when `AGENTSCOPE_STUDIO_URL` is set.

AgentScope Studio: `http://localhost:3883` (or `http://172.16.28.63:3883` on the shared server)

```bash
# API server with tracing
AGENTSCOPE_STUDIO_URL=http://localhost:3883 python -m app.serve

# or via CLI flag
python -m app.serve --studio-url http://localhost:3883

# CLI workflow runner
python -m app.workflows.system --task MRO --studio-url http://localhost:3883
```

---

## Developer guide

### Add a new agent

1. Create `app/agents/your_agent.py` extending `AgentBase`.
2. Define an input/output `msg.metadata` protocol (see existing agents for examples).
3. Instantiate and chain in `app/workflows/system.py`:
   ```python
   your_agent = YourAgent()
   result = await your_agent.reply(previous_msg)
   ```

### Add a new task type

1. Add the variant to `icflow/schemas.py` → `TaskType`.
2. Implement its handler in `app/agents/helpers/task_assigner.py` → `TASK_HANDLERS`.
3. No other changes required – routing is data-driven.

### Implement `TacticalAgent`

See the module docstring in `app/agents/tactical_agent.py`.  
Input: `STRATEGIC_RESULT`. Expected output: `PLAN_RESULT` with a `plans: list[dict]`.

### Parallel fan-out

Replace a single `agent.reply(msg)` call with:
```python
from agentscope.pipeline import fanout_pipeline
results = await fanout_pipeline(agents, msg, enable_gather=True)
```
</file>

</files>
