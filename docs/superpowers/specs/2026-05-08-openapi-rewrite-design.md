# OpenAPI spec rewrite — design

**Date:** 2026-05-08
**Author:** Luka Pellegrinelli
**Target file:** `docs/end-point-diagram/end-point-diagram.json`

## Goal

Replace the obsolete `end-point-diagram.json` (v1.0.1, 11 endpoints) with a
faithful OpenAPI 3.0.3 spec that documents the 26 endpoints currently exposed
by the backend, importable directly into Swagger UI / Swagger Editor /
SwaggerHub without manual fixes.

## Scope

### Included
- All 26 backend routes mounted under `/api`.
- Full request/response schemas matching the actual JSON the backend returns.
- Pagination wrapper for `GET /internships` (`{ data, total }`).
- Reusable error responses for the 5 documented HTTP error classes.
- `multipart/form-data` request bodies for the two upload endpoints.
- Two `servers` entries: local dev + SwaggerHub mock.

### Excluded
- Authentication (none in this version of the app — to be added when CA TIC
  Authentication Gateway is integrated, per chapter 9 of the report).
- Rate limiting / quotas.
- Webhook callbacks.

## Structure

```
openapi: 3.0.3
info:
  title: WorkXP Admin API
  version: 2.0.0
servers:
  - http://localhost:3000/api  (local dev)
  - https://virtserver.swaggerhub.com/...  (SwaggerHub mock, kept)
tags: [Health, Internships, Activities, Categories, Documents, Certificate]
paths:                                                            (26 ops)
  /health                                                         (1)
  /internships                                                    (2)
  /internships/{id}                                               (3)
  /internships/{id}/activities                                    (1)
  /internships/{internshipId}/activities/{activityId}             (2)
  /internships/{id}/certificate                                   (1)
  /activities                                                     (2)
  /activities/details                                             (1)
  /activities/{id}                                                (3)
  /activities/{id}/document                                       (3)
  /categories                                                     (2)
  /categories/{id}                                                (3)
  /certificate/template                                           (2)
components:
  schemas: ~15
  responses: 5 reusable error responses
```

## Schemas

Faithful to the actual API responses (verified by reading the model + service
code on 2026-05-08):

| Schema | Notes |
|---|---|
| `Internship` | id, personId, firstName, lastName, email, startDate, endDate |
| `InternshipListResponse` | `{ data: [Internship], total: integer }` |
| `InternshipCreateRequest` | firstName, lastName, email, startDate, endDate |
| `InternshipUpdateRequest` | same fields, all optional |
| `Activity` | id, title, description, documentUrl, visible, categories: [CategoryRef], internshipCount |
| `ActivityCreateRequest` | title (required), description, categoryIds[], visible |
| `ActivityUpdateRequest` | all fields optional |
| `Category` | id, name, description, activityCount |
| `CategoryCreateRequest` | name (required), description |
| `CategoryUpdateRequest` | name, description (both optional) |
| `CategoryRef` | minimal: id + name (used inside Activity) |
| `HealthStatus` | `{ status: 'ok' }` |
| `ErrorResponse` | `{ error: string }` |
| `TemplateStatus` | `{ exists: bool, filename, lastModified? }` |

## Reusable error responses

Mapping based on the actual backend error codes (`backend/controllers/`):

| Status | Name | Triggers |
|---|---|---|
| 400 | `BadRequest` | `INVALID_FILE_TYPE`, `LIMIT_FILE_SIZE` |
| 404 | `NotFound` | `NOT_FOUND` |
| 409 | `Conflict` | `HAS_LINKED_INTERNSHIPS`, `HAS_LINKED_ACTIVITIES`, `NO_DOCUMENT` |
| 422 | `ValidationError` | `MISSING_FIELDS`, `MISSING_TITLE`, `NAME_TOO_LONG`, `EMAIL_TOO_LONG`, `INVALID_EMAIL`, `INVALID_DATE_FORMAT`, `END_DATE_BEFORE_START`, `TITLE_TOO_LONG`, `INVALID_INPUT` |
| 503 | `ServiceUnavailable` | `NO_LIBREOFFICE` |

## Special-case responses

- `GET /internships/{id}/certificate` returns `application/pdf` (binary), not JSON.
- `GET /activities/{id}/document` returns binary (any MIME type the original file had).
- `GET /certificate/template` returns the DOCX file (`application/vnd.openxmlformats-officedocument.wordprocessingml.document`).
- `POST /activities/{id}/document` and `POST /certificate/template` accept `multipart/form-data` with a single `document`/`template` field.

## Validation criteria

The spec must:
1. Parse as valid JSON: `python3 -c "import json; json.load(open(PATH))"` succeeds.
2. Pass an OpenAPI validation when imported into Swagger Editor (no schema errors in the right pane).
3. Include all 26 endpoints listed above (verifiable by counting `(get|post|put|patch|delete)` operation keys under `paths`).
4. Reference only schemas that are defined in `components.schemas` (no broken `$ref`).
5. Include at least one example per response body where the shape is non-trivial.

## Implementation plan

Single commit:
- `docs(api): rewrite end-point-diagram.json to match current backend (v2.0.0)`
- Body: list the new endpoints, the schema additions, the rationale for v2.0.0.

The old file is overwritten — Git history preserves v1.0.1 if anyone needs to diff.

## Out of scope (follow-up)

- Generating client SDKs from the spec (frontend axios layer is hand-written today; we don't need codegen yet).
- Splitting the spec into multiple files (`paths.yaml`, `schemas.yaml`) — single-file is easier to import.
- Adding security schemes (none currently; will be added when MFA Gateway lands).
