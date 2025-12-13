# Getting Started

A quick guide to using these teaching resources effectively.

## Understanding the Structure

### Schemas

The `/schemas` directory defines the structure for each activity type:

| Schema | Purpose |
|--------|---------|
| `lesson.schema.yaml` | Complete PRIMM lesson structure |
| `parsons.schema.yaml` | Drag-and-drop code arrangement |
| `tracing.schema.yaml` | Variable tracking exercises |
| `worked-example.schema.yaml` | Subgoal-labelled examples |

Use these schemas when creating new content to ensure consistency.

### Content

The `/content` directory contains actual teaching materials:

```
/content
├── /lessons          # Complete PRIMM-structured lessons
│   ├── /ks3          # Years 7-9
│   └── /ks4          # Years 10-11
│
├── /activities       # Standalone activities
│   ├── /parsons      # Parsons problems
│   ├── /tracing      # Code tracing exercises
│   └── /worked-examples
│
└── /progressions     # Learning pathway definitions
```

### Documentation

The `/docs` directory provides guidance:

- `pedagogy-guide.md` - Research-based teaching approaches
- `differentiation.md` - SEND and foundation support
- `getting-started.md` - This file

---

## Using a PRIMM Lesson

### Before the Lesson

1. Read the lesson file (YAML format)
2. Review the `teacher_notes.preparation` section
3. Prepare any printed trace tables or worksheets
4. Set up the coding environment
5. Load the `predict.code_snippet` ready to display

### During the Lesson

**Predict** (5-10 minutes)
- Display the code snippet
- Ask prediction questions from `predict.prompts`
- Allow individual think time, then pair discussion
- Collect predictions (hands up, mini whiteboards, verbal)

**Run** (2-5 minutes)
- Execute the code
- Compare output to predictions
- Ask reflection questions from `run.reflection_prompts`

**Investigate** (10-20 minutes)
- Use activities from `investigate.activities`
- Tracing: provide the trace table template
- Annotation: distribute printed code
- Work through first example together, then independent/paired work

**Modify** (10-15 minutes)
- Display `modify.base_code`
- Assign appropriate difficulty level:
  - `modifications.foundation` for struggling students
  - `modifications.core` for most students
  - `modifications.extension` for advanced students
- Circulate and address `common_errors`

**Make** (remaining time)
- Present the `make.challenge`
- Provide `make.differentiation.[level].starter_code` as appropriate
- Use `make.success_criteria` for self/peer assessment

### After the Lesson

- Review student work against `make.rubric`
- Note misconceptions for next lesson
- Update any `teacher_notes.common_issues` based on experience

---

## Using Parsons Problems

### When to Use

- After PRIMM Predict/Run/Investigate, before Make
- As a scaffold for students who struggle with free writing
- As a confidence builder for anxious students
- For quick formative assessment

### How to Use

1. Display/distribute the `problem_statement`
2. Show the `expected_output`
3. Explain that blocks need arranging (and indenting for 2D problems)
4. For foundation: pre-place blocks listed in `differentiation.foundation.blocks_to_pre_place`
5. Allow attempts without revealing solution
6. Release `hints` progressively if students are stuck
7. Discuss `common_errors` if observed

### Tools for Interactive Parsons

If using digital tools:
- Runestone Interactive: [runestone.academy](https://runestone.academy)
- js-parsons: [js-parsons.github.io](https://js-parsons.github.io)

For paper-based:
- Print code blocks on strips of card
- Students physically arrange on desk
- Good for collaboration and discussion

---

## Using Code Tracing Exercises

### Classroom Approach

**Teacher demonstration** (10-15 minutes):
1. Display the code
2. Draw trace table on board with columns from `trace_table.variables`
3. Step through execution line by line
4. Ask students "what happens next?" at each step
5. Fill in values together

**Student practice** (15-20 minutes):
1. Distribute new problem with blank trace table
2. For foundation: provide `scaffolding.prefilled_steps`
3. Students complete independently or in pairs
4. Circulate and observe
5. Use `visualisation.python_tutor_link` if students need visual support

### Assessment

- Require trace tables as "showing work"
- Students must trace 50% accurately before code-writing tasks
- Use partial credit for partially correct traces

---

## Using Worked Examples

### Display Method

1. Don't show complete code immediately
2. Reveal subgoal by subgoal
3. For each subgoal:
   - Read the `label` aloud
   - Show the `code`
   - Explain using `explanation`
   - Ask `self_explanation_prompts` questions

### Fading for Independence

Use `fading.faded_versions` to gradually remove scaffolding:

```
Full example → Faded example 1 → Faded example 2 → Independent practice
```

This transitions students from studying to doing.

### Practice Problems

After the worked example, assign `practice_problems`:

- `identical_structure`: Same pattern, different values
- `varied_context`: Same pattern, different scenario
- `increased_complexity`: Extended version of pattern

---

## Creating New Content

### Follow the Schemas

When creating new lessons or activities:

1. Open the relevant schema file
2. Copy the structure
3. Fill in all required fields
4. Test the activity with students
5. Iterate based on feedback

### Naming Conventions

| Content Type | ID Format | Example |
|--------------|-----------|---------|
| Lesson | `{stage}-{topic}-{number}` | `ks3-for-loops-001` |
| Parsons | `parsons-{topic}-{number}` | `parsons-selection-003` |
| Tracing | `trace-{topic}-{number}` | `trace-while-loops-002` |
| Worked example | `we-{topic}-{number}` | `we-functions-001` |

### Difficulty Levels

Always provide three levels:
- **foundation**: Maximum scaffolding, simplified version
- **core**: Standard curriculum expectation
- **extension**: Challenge for advanced students

---

## Quick Checklist: Lesson Planning

Before any programming lesson, verify:

- [ ] Students will **read** code before writing it
- [ ] **Prediction** activity prepared (code to display, questions to ask)
- [ ] **Tracing** activity included (even 5 minutes)
- [ ] **Modification** task has clear, specific instructions
- [ ] **Differentiation** prepared for foundation and extension
- [ ] **Pair programming** roles defined if using collaboration
- [ ] **Success criteria** shared with students

---

## External Resources

These resources align with our pedagogical approach:

| Resource | URL | Use For |
|----------|-----|---------|
| NCCE Teach Computing | teachcomputing.org | Complete lesson plans |
| Isaac Computer Science | isaaccomputerscience.org | GCSE/A-level content |
| PRIMM Portal | primmportal.com | PRIMM-specific resources |
| Python Tutor | pythontutor.com | Code visualisation |
| CS Unplugged | csunplugged.org | Unplugged activities |
| CAS Community | community.computingatschool.org.uk | Shared resources |
