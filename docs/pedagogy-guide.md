# Pedagogy Guide: Evidence-Based Programming Teaching

This guide synthesises research-validated approaches for teaching programming to KS3 and KS4 students. Every technique described here has empirical support from peer-reviewed studies.

## Core Principle: Comprehension Before Production

> "Programming is a comprehension activity first and a production activity second."

Research consistently shows that students must be able to **read and trace code** before they can write it. The skill hierarchy is:

1. Knowledge of constructs
2. Tracing code execution
3. Explaining code behaviour
4. Writing new code

**Practical implication**: Never ask students to write code involving concepts they haven't first read and traced.

---

## The PRIMM Framework

**Source**: Dr Sue Sentance and Dr Jane Waite, quasi-experimental study with 493 students aged 11-14.

PRIMM structures programming lessons through five stages:

### Predict

Students examine short programs and predict what will happen before running any code.

**Implementation**:
- Display code on screen (3-8 lines maximum)
- Give 30-60 seconds individual thinking time
- Pair discussion (1-2 minutes)
- Whole class sharing of predictions
- Record predictions visibly (whiteboard, hands up for options)

**Key questions**:
- "What will this program output?"
- "What will be stored in variable X after line 3?"
- "How many times will the loop run?"

### Run

Students execute the code and compare actual output with predictions.

**Implementation**:
- Run the code live (or have students run it)
- Explicitly compare result with predictions
- Ask: "Whose prediction was correct? Why?"
- For incorrect predictions: "What did you think would happen? Why?"

**Metacognitive prompts**:
- "Were you surprised by the output?"
- "What did you misunderstand?"
- "Which line behaves differently than you expected?"

### Investigate

Students deepen understanding through structured activities.

**Activity types**:

| Activity | Description | Time |
|----------|-------------|------|
| Tracing | Track variable values through execution | 10-15 min |
| Annotation | Label lines with explanations | 5-10 min |
| Peer explanation | Explain code to a partner | 5-10 min |
| Construct hunt | Find and label specific constructs | 5-10 min |

**Tracing approach**:
- Provide trace table template with variable columns
- Work through first 2-3 rows as class demonstration
- Students complete remaining rows
- Include output column

### Modify

Students make targeted changes to existing code.

**Key principle**: Specify exactly what modification to make. Don't say "change this program" - say "change line 3 so it prints numbers 1 to 10 instead of 1 to 5."

**Differentiation through modification complexity**:
- **Foundation**: Change a single value (change `5` to `10`)
- **Core**: Change logic (change counting up to counting down)
- **Extension**: Add new functionality (add a running total)

### Make

Students create new programs using learned concepts.

**Scaffolding options**:
- Provide starter code with gaps
- Give pseudocode to translate
- Provide worked example of similar problem
- Pair programming with structured roles

**Important**: Not every lesson needs all five stages. Focus on stages aligned with your learning objectives.

---

## Parsons Problems

**Source**: Barbara Ericson et al., multiple studies showing ~50% time reduction with equivalent learning.

Parsons problems present scrambled code blocks that students arrange into correct order.

### Why They Work

- Eliminate syntax errors (major barrier for novices)
- Constrain problem space to logic and structure
- Reduce cognitive load significantly
- Students with low self-efficacy more likely to attempt them

### Types

| Type | Description | Use Case |
|------|-------------|----------|
| Standard | Arrange blocks vertically | Early introduction |
| 2D | Arrange + indent correctly | Python (essential) |
| Faded | Some blocks incomplete | Transition to writing |
| Adaptive | Difficulty adjusts | Differentiation |

### Implementation Guidance

**For foundation groups**:
- Start without distractors (research shows they hinder learning for novices)
- Pre-place first 1-2 blocks
- Use 3-5 blocks maximum
- Provide clear problem statement with expected output

**For core/extension**:
- Add distractors gradually
- Increase block count
- Include faded blocks requiring completion
- Remove scaffolding progressively

### Tools

- js-parsons widget (JavaScript library)
- Runestone Interactive ebooks
- PrairieLearn
- Many LMS platforms support this

---

## Code Tracing

**Source**: Lister, Fidge, Teague et al. - students must trace 50% accurately before writing code.

### Why Tracing Matters

Tracing is to programming what "showing work" is to mathematics. It reveals understanding (or misconceptions) that can't be seen in correct/incorrect output alone.

### Trace Table Method

```
| Step | Line | x  | y  | Output |
|------|------|----|----|--------|
| 1    | 1    | 5  | -  |        |
| 2    | 2    | 5  | 3  |        |
| 3    | 3    | 8  | 3  |        |
| 4    | 4    | 8  | 3  | 8      |
```

### Teaching Tracing

1. **Demonstrate** with simple 3-4 line programs (10-15 min)
2. **Guided practice** with class participation
3. **Independent practice** with trace table templates (15-20 min)
4. **Verify** using Python Tutor or similar visualisation

### Common Student Errors

| Error | Example | Intervention |
|-------|---------|--------------|
| Confusing assignment direction | Thinking `x = y` means "y becomes x" | Use "x gets the value of y" |
| Missing loop iterations | Counting wrong number of times | Trace on paper first |
| Scope confusion | Using old variable values | Highlight scope boundaries |
| Off-by-one | `range(5)` gives 0-4 not 1-5 | Explicit tracing of first/last values |

---

## Subgoal Labels in Worked Examples

**Source**: Lauren Margulieux et al. - reduces dropout/failure rates, struggling students benefit most.

### What Are Subgoal Labels?

Brief, functional descriptions inserted into worked examples that explain the *purpose* of code chunks.

### Without Subgoal Labels

```python
total = 0
for num in numbers:
    total = total + num
print(total)
```

### With Subgoal Labels

```python
# Set up accumulator variable
total = 0

# Loop through each item
for num in numbers:
    # Update accumulator
    total = total + num

# Output result
print(total)
```

### Effective Subgoal Categories

**Setup**: "Set up variables", "Import modules", "Define constants"

**Input**: "Get user input", "Read data", "Receive parameters"

**Processing**: "Check condition", "Loop through items", "Calculate result"

**Output**: "Display result", "Return value", "Write to file"

### Implementation

1. Identify 3-5 logical chunks in solution
2. Write brief labels (2-5 words) describing *purpose* not mechanics
3. Group related lines under each label
4. Explicitly teach the labels as transferable patterns

---

## Pair Programming

**Source**: Werner, Denner longitudinal study; McDowell et al. showing increased retention.

### Roles

| Role | Responsibilities |
|------|------------------|
| **Driver** | Types code, controls keyboard/mouse |
| **Navigator** | Reviews code, tracks design, suggests improvements, catches errors |

### Implementation

- **Rotation interval**: 15-20 minutes (research shows 5 min is too short)
- **Pairing strategy**: Friendship pairs show benefits; some research supports ability pairing
- **Explicit training**: Teach collaboration skills, not just technical content

### Role Prompts

**Driver prompts**:
- "I'm going to type..."
- "What should I do next?"
- "Can you check this line?"

**Navigator prompts**:
- "I think we need to..."
- "Let's trace through this to check"
- "Should that be X or Y?"

### Monitoring

Watch for:
- One partner dominating
- Off-task behaviour
- Frustration or disengagement
- Social dynamics interfering

---

## Live Coding

**Source**: Rubin (2013) - students perform significantly better on projects.

### Why Live Coding Works

- Makes the programming *process* visible
- Demonstrates that experts make mistakes
- Shows debugging as normal practice
- Models problem-solving thinking

### Effective Live Coding

1. **Go slowly** - narrate every action
2. **Think aloud** - explain reasoning, not just what you're typing
3. **Make deliberate errors** - then debug them visibly
4. **Use learner's environment** - no shortcuts, plugins, or customisations
5. **Large fonts** - at least 18pt, maximise window
6. **Turn off notifications** - avoid distractions

### What to Say

Instead of silently typing `for i in range(5):`, say:

> "I want to repeat something 5 times, so I need a for loop. I'll use `for`... then I need a variable to track which repetition I'm on - I'll call it `i`... then `in range` because I'm counting... `range(5)` gives me 0, 1, 2, 3, 4 - that's 5 numbers... and a colon to start the loop body."

---

## Block-to-Text Transition

**Source**: Weintrop and Wilensky; Armoni et al. showing Scratch experience aids later text-based learning.

### Why This Transition is Difficult

- Sudden exposure to syntax errors
- Loss of visual structure cues
- Mental model translation required

### Scaffolding Strategies

1. **Hybrid environments** (e.g., Pencil Code) - 30%+ improvement over direct transition
2. **Frame-based editing** (e.g., Stride in Greenfoot) - maintains structure, reduces errors
3. **Side-by-side display** - show blocks alongside text equivalent
4. **Gradual text exposure** - start with text-viewing before text-editing

### Transition Sequence

```
Scratch/Blockly → Hybrid (Pencil Code) → Frame-based (Stride) → Full text (Python)
```

Or simpler:
```
Scratch → Show text equivalent → Edit text with blocks visible → Text only
```

---

## Cognitive Load Management

**Source**: Sweller's Cognitive Load Theory; 2024 Python learning study.

### Three Types of Load

| Type | Definition | Approach |
|------|------------|----------|
| **Intrinsic** | Inherent complexity | Can't reduce, but can isolate concepts |
| **Extraneous** | Poor design causes | Minimise through good instruction design |
| **Germane** | Schema building | Maximise through effective activities |

### Practical Applications

**Reduce split attention**:
- Embed comments in code (don't separate explanations)
- Place diagrams next to relevant code
- Avoid "see page X" references

**Manage element interactivity**:
- Teach concepts in isolation before combining
- Master syntax before tackling logic
- Master simple loops before nested loops

**Use worked examples effectively**:
- Show complete examples before problem-solving
- Fade scaffolding as expertise develops
- Watch for expertise reversal (examples hinder experts)

**For students with learning differences**:
- Chunk large tasks
- Provide visual + auditory explanations
- Use consistent formatting and naming
- Allow processing time

---

## Assessment Alignment

Assessments should reflect the comprehension-first hierarchy:

| Component | Weight | Format |
|-----------|--------|--------|
| Construct knowledge | 15% | Multiple choice, matching |
| Code tracing | 25% | Trace table completion |
| Code explanation | 20% | Annotate/describe code |
| Code writing | 40% | Parsons → free writing |

**Key threshold**: Students should demonstrate 50% tracing accuracy before substantial code-writing assessment.

---

## Quick Reference: Implementation Priorities

1. **Start every new concept with prediction** (PRIMM - Predict)
2. **Include tracing in every lesson** (even 5 minutes)
3. **Use Parsons problems before free writing**
4. **Label subgoals in all worked examples**
5. **Implement pair programming with timed rotations**
6. **Live code while thinking aloud**
7. **Scaffold block-to-text transitions**
8. **Manage cognitive load through isolation and integration**

---

## Further Resources

- [PRIMM Portal](https://primmportal.com)
- [NCCE Teach Computing Curriculum](https://teachcomputing.org/curriculum)
- [Isaac Computer Science](https://isaaccomputerscience.org)
- [Python Tutor](https://pythontutor.com)
- [CS Unplugged](https://csunplugged.org)
