# CS Teaching Resources

Evidence-based programming teaching resources for KS3 and KS4, built on research-validated pedagogies.

## Overview

This repository provides structured teaching resources implementing:

- **PRIMM Framework** - Predict, Run, Investigate, Modify, Make
- **Parsons Problems** - Drag-and-drop code arrangement exercises
- **Code Tracing** - Variable tracking and execution prediction
- **Subgoal Labels** - Annotated worked examples
- **Pair Programming** - Structured collaboration activities
- **Live Coding Scripts** - Teacher demonstration guides

## Architecture

```
/csteachresources
├── /docs                      # Teacher documentation
│   ├── pedagogy-guide.md      # Research-based teaching approaches
│   ├── differentiation.md     # SEND and foundation group support
│   └── getting-started.md     # Quick start guide
│
├── /schemas                   # Activity type definitions
│   ├── lesson.schema.yaml     # PRIMM lesson structure
│   ├── parsons.schema.yaml    # Parsons problem format
│   ├── tracing.schema.yaml    # Code tracing exercises
│   └── worked-example.schema.yaml
│
├── /content
│   ├── /lessons               # Complete PRIMM lessons
│   │   ├── /ks3               # Key Stage 3 (Years 7-9)
│   │   └── /ks4               # Key Stage 4 (Years 10-11)
│   │
│   ├── /activities            # Standalone activities
│   │   ├── /parsons           # Parsons problems
│   │   ├── /tracing           # Code tracing exercises
│   │   └── /worked-examples   # Subgoal-labelled examples
│   │
│   └── /progressions          # Learning pathways
│
└── /resources                 # External resource links
    └── external-links.yaml    # NCCE, Isaac CS, etc.
```

## Key Principles

### Comprehension Before Production

Research shows students must be able to trace code before they can write it. Every lesson scaffolds:

1. **Read** code first
2. **Trace** execution
3. **Explain** behaviour
4. **Modify** existing code
5. **Make** new programs

### Built-in Differentiation

All activities include:
- **Foundation** - Simplified versions for struggling learners
- **Core** - Standard curriculum coverage
- **Extension** - Challenges for advanced students

### Cognitive Load Management

- Concepts introduced in isolation before combination
- Parsons problems reduce load by ~50% vs writing from scratch
- Worked examples with subgoal labels make expert thinking visible

## Quick Start

1. Browse `/docs/pedagogy-guide.md` for teaching approaches
2. Check `/schemas` to understand activity formats
3. Find lessons in `/content/lessons/ks3` or `/content/lessons/ks4`
4. Use standalone activities from `/content/activities`

## Research Foundation

This resource is built on peer-reviewed research from:
- SIGCSE, ICER, ITiCSE conferences
- National Centre for Computing Education (NCCE)
- Raspberry Pi Foundation
- Computing at School (CAS)

Key researchers: Dr Sue Sentance, Dr Jane Waite, Barbara Ericson, Lauren Margulieux, and others.

## Contributing

Contributions welcome. Please follow the schemas in `/schemas` when adding new content.

## License

Educational use permitted. See LICENSE for details.
