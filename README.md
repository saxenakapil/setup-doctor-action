# setup-doctor-action

A [GitHub Action](https://github.com/marketplace/actions/setup-doctor) wrapping [setup-doctor](https://github.com/saxenakapil/setup-doctor): score and audit an AI coding agent setup (Claude Code, Codex, GitHub Copilot CLI, Cursor) in CI. Local-only, read-only: it installs and runs the real `setup-doctor` npm package, nothing else.

## Usage

```yaml
name: setup-doctor gate

on:
  pull_request:

jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: saxenakapil/setup-doctor-action@v1
        with:
          fail-under: 75
```

## Inputs

| Input | Default | Meaning |
| --- | --- | --- |
| `path` | `.` | Project directory to audit |
| `agent` | `all` | `claude` \| `codex` \| `cursor` \| `copilot` \| `all` |
| `scope` | `all` | `project` \| `global` \| `all` |
| `fail-under` | (none) | Fail the job if the score drops below this number |
| `compare` | `false` | Fail the job on any score regression since the last `--ci` run in this job (needs a persisted `.setupdoctor-history.jsonl`, e.g. via `actions/cache`; see [`docs/guide/ci-integration.md`](https://github.com/saxenakapil/setup-doctor/blob/main/docs/guide/ci-integration.md)) |
| `min-severity` | (none) | Hide findings below this severity in the printed report |
| `config` | (none) | Path to a `.setupdoctorrc`-shaped config file |
| `node-version` | `22` | Node.js version to set up before running |

## Outputs

| Output | Meaning |
| --- | --- |
| `score` | The 0-100 score (empty string if nothing was checked) |
| `band` | `Excellent` \| `Good` \| `Needs work` \| `Poor` |

```yaml
      - uses: saxenakapil/setup-doctor-action@v1
        id: doctor
      - run: echo "Score was ${{ steps.doctor.outputs.score }}"
```

## What this does under the hood

Sets up Node (`actions/setup-node`), then runs `npx setup-doctor@latest doctor --ci --format json` with your inputs mapped to the equivalent CLI flags, always pulling the latest published version. Parses the score/band from the real JSON report for the outputs above; the full report is also printed to the job log.

See the main project's [`docs/guide/ci-integration.md`](https://github.com/saxenakapil/setup-doctor/blob/main/docs/guide/ci-integration.md) for the equivalent hand-written workflow examples (score history, PR comments) that this Action doesn't (yet) wrap.
