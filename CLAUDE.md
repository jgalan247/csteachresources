# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Evidence-based programming teaching resources for UK KS3/KS4 (Years 7-11), implementing research-validated pedagogies from computing education research (SIGCSE, ICER, NCCE).

## Architecture

### Content Layer (YAML-based)
- `/schemas/` - YAML schemas defining structure for lessons, Parsons problems, tracing exercises, worked examples
- `/content/lessons/` - Complete PRIMM-structured lessons by key stage (ks3, ks4)
- `/content/activities/` - Standalone activities (parsons, tracing, worked-examples)
- `/content/progressions/` - Learning pathway definitions

### Student Website (`/website/`)
Static HTML/CSS/JS site for interactive exercises:
- **Component classes** (in `js/`): `ParsonsProblem`, `CodeTracing`, `PredictionQuiz`, `WorkedExample`
- **Auto-initialization**: Components init via `data-component` attributes with JSON config in sibling `<script type="application/json">`
- **Progress tracking**: `Progress` object stores completion in localStorage
- **Topic structure**: `/website/topics/{topic-name}/` with index.html and activity pages

### Documentation (`/docs/`)
- `pedagogy-guide.md` - Research-based teaching approaches (PRIMM, Parsons, tracing, subgoal labels)
- `differentiation.md` - SEND and foundation group support
- `getting-started.md` - Teacher usage guide

## Key Concepts

### PRIMM Framework
Lessons follow Predict → Run → Investigate → Modify → Make stages. Not all stages required per lesson.

### Differentiation Levels
All content provides three tiers:
- **foundation** - Simplified, maximum scaffolding, no distractors in Parsons
- **core** - Standard curriculum
- **extension** - Challenge content

### Content Naming Conventions
- Lessons: `{stage}-{topic}-{number}` (e.g., `ks3-for-loops-001`)
- Parsons: `parsons-{topic}-{number}`
- Tracing: `trace-{topic}-{number}`
- Worked examples: `we-{topic}-{number}`

## Development

### Running the Website
Open `website/index.html` in a browser or use any static file server:
```bash
cd website && python -m http.server 8000
```

### Adding New Content
1. Follow schemas in `/schemas/` for YAML structure
2. For web activities, use `data-component` pattern with JSON config
3. Always provide foundation/core/extension variants
