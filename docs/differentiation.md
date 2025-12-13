# Differentiation and SEND Support Guide

This guide provides evidence-based strategies for supporting foundation groups and students with special educational needs and disabilities (SEND) in computing lessons.

## Core Principles

### 1. Same Objectives, Different Routes

Differentiation in computing should maintain rigorous learning objectives while varying:
- **Scaffolding level** (more/less support)
- **Task complexity** (simpler/more complex)
- **Time allocation** (more processing time)
- **Representation** (visual, auditory, kinesthetic)

### 2. Start Concrete, Move Abstract

Research supports a consistent progression:

```
Unplugged activities → Physical computing → Block-based → Text-based
```

Students who begin with unplugged activities demonstrate:
- More self-efficacy
- Wider programming vocabulary
- Better transfer to text-based coding

### 3. Reduce Extraneous Load

Students with learning differences often have reduced working memory capacity. Focus cognitive resources on learning, not fighting the interface.

---

## Implementation Strategies by PRIMM Stage

### Predict Stage

| Standard | Foundation Adaptation |
|----------|----------------------|
| 6-8 lines of code | 3-4 lines maximum |
| Open prediction | Multiple choice options |
| Written prediction | Verbal prediction to partner |
| Independent first | Paired from start |

**SEND accommodations**:
- Read code aloud for students with reading difficulties
- Provide printed copies for annotation
- Use colour-coding for different constructs
- Allow extra processing time (90 seconds vs 30)

### Run Stage

| Standard | Foundation Adaptation |
|----------|----------------------|
| Students run independently | Teacher demonstration |
| Compare to own prediction | Class comparison |
| Quick reflection | Extended discussion |

**SEND accommodations**:
- Use projector/large display
- Run multiple times if needed
- Pause and explain unexpected behaviour

### Investigate Stage

| Standard | Foundation Adaptation |
|----------|----------------------|
| Full trace table | Partial trace table (some cells filled) |
| All variables | Key variables only |
| Written annotation | Verbal explanation |
| Independent work | Paired or guided |

**SEND accommodations**:
- Provide trace table templates
- Use colour-coded variable tracking
- Offer manipulatives (counters for values)
- Python Tutor visualisation for those who benefit from animation

### Modify Stage

This is where PRIMM naturally supports differentiation:

```
Foundation:     Change a single value
                "Change the 5 to a 10"

Core:           Change logic
                "Make it count down instead of up"

Extension:      Add functionality
                "Add a running total"
```

**Foundation modifications should**:
- Require changing only 1-2 characters
- Have immediately visible effect
- Not introduce new concepts
- Include the exact change instruction

### Make Stage

| Level | Scaffolding |
|-------|-------------|
| Foundation | Provide starter code with one gap to fill |
| Foundation+ | Provide starter code with 2-3 gaps |
| Core | Provide pseudocode to translate |
| Core+ | Provide similar worked example |
| Extension | Problem statement only |

---

## Parsons Problems for Differentiation

Parsons problems are **especially effective** for students with low self-efficacy. Research shows these students are more likely to engage with Parsons scaffolding.

### Foundation Configuration

```yaml
difficulty: foundation
has_distractors: false     # Critical: no distractors
block_count: 3-5           # Fewer blocks
pre_placed_blocks: 1-2     # Start them off
expected_output: shown     # Make success criteria clear
```

### Progressive Difficulty

```
Level 1:  3 blocks, no distractors, 2 pre-placed
Level 2:  4 blocks, no distractors, 1 pre-placed
Level 3:  5 blocks, no distractors, none pre-placed
Level 4:  5 blocks, 1 distractor, none pre-placed
Level 5:  6+ blocks, multiple distractors
Level 6:  Faded blocks requiring completion
```

### 2D Parsons (Indentation)

For Python's meaningful whitespace:

**Foundation**: Provide visual indent guides, pre-indent some blocks
**Core**: Blocks start at left margin, students must indent
**Extension**: Mixed indentation depths, complex nesting

---

## Specific Learning Differences

### Dyslexia

**Challenges**:
- Processing sequential symbolic information
- Reading unfamiliar keywords
- Distinguishing similar-looking syntax

**Strengths to leverage**:
- Often strong visual-spatial skills
- Good at seeing the "big picture"
- Pattern recognition for program architecture

**Accommodations**:
- Use dyslexia-friendly fonts (OpenDyslexic, Lexie Readable)
- Increase line spacing (1.5 or double)
- Provide audio explanations of code
- Use consistent colour-coding
- Allow text-to-speech for problem descriptions
- Avoid timed assessments where possible
- Provide printed reference sheets for syntax

### ADHD

**Challenges**:
- Executive functioning (planning, organising)
- Sustained attention
- Working memory limitations

**Strengths to leverage**:
- May hyperfocus when interested
- Often creative problem-solvers
- Good at rapid iteration

**Accommodations**:
- Break tasks into smaller, visible chunks (use todo lists)
- Use visual timers
- Provide movement breaks
- Vary activity types within lesson
- Clear, immediate feedback
- Physical computing can maintain engagement
- Pair with supportive partner
- Reduce distractions (minimise windows, notifications)

### Autism Spectrum

**Challenges**:
- Social communication (pair programming dynamics)
- Flexibility when debugging
- Processing verbal instructions

**Strengths to leverage**:
- Strong attention to detail
- Pattern recognition (excellent for debugging)
- Systematic thinking
- Often enjoys logical systems

**Accommodations**:
- Explicit, written instructions
- Consistent classroom routines
- Predictable lesson structure
- Clear success criteria
- Advance notice of pair programming (who, when, how long)
- Allow individual work options when appropriate
- Use interests to contextualise problems

### Dyscalculia

**Challenges**:
- Number manipulation
- Understanding variables as changing values
- Loop counting

**Accommodations**:
- Use meaningful variable names (`score` not `x`)
- Visual representations of counting
- Manipulatives for tracking loop iterations
- Avoid unnecessary mathematical operations in examples
- Focus on string/text manipulation where possible initially

---

## Physical Computing as Access

The NCCE describes physical computing as **"extremely engaging and accessible"** for SEND students.

### Why Physical Computing Works

- **Immediate, tangible feedback** (LED lights up, motor turns)
- **Removes abstraction barrier** (output is visible, not just text)
- **Engages multiple senses** (visual, tactile, auditory)
- **Naturally supports collaboration** (shared physical artefact)

### Recommended Devices

| Device | Age Range | Key Features |
|--------|-----------|--------------|
| Bee-Bot | KS1-KS2 | No screen, tactile, immediate |
| micro:bit | KS2-KS4 | LEDs, buttons, sensors, block-to-Python |
| Crumble | KS2-KS3 | Motors, lights, simple connections |
| Arduino | KS4+ | Full electronics, text-based |

### Implementation

1. **Start unplugged** - plan the program on paper
2. **Build physical setup** - connect LEDs, motors
3. **Use blocks first** - MakeCode for micro:bit
4. **Show text equivalent** - side-by-side view
5. **Transition to text** - when ready

---

## Unplugged Activities

### Benefits for Foundation/SEND

- No technical barriers (login, syntax, typing)
- Social and collaborative by nature
- Builds conceptual vocabulary
- Accessible to students with motor difficulties
- Reveals thinking (teacher can observe)

### Example Unplugged Activities

| Concept | Activity | Materials |
|---------|----------|-----------|
| Algorithms | Following/writing instructions | Instruction cards, blindfold |
| Variables | Cup game (store/retrieve values) | Paper cups, counters |
| Selection | Sorting yourself | Space to move, criteria cards |
| Iteration | Dancing (repeat moves) | Music, move cards |
| Debugging | Spot the mistake recipes | Deliberately wrong instructions |

### CS Unplugged Resource

[csunplugged.org](https://csunplugged.org) provides free, tested activities with full lesson plans.

---

## Pair Programming Adaptations

Pair programming can be highly beneficial but requires careful setup for some learners.

### Potential Issues

- Social anxiety
- Communication difficulties
- Power imbalances
- Sensory issues (proximity)

### Adaptations

**For anxiety/communication difficulties**:
- Use role cards with explicit prompts
- Provide sentence starters
- Allow written communication alongside verbal
- Pair with familiar, supportive partners
- Practice roles separately before combining

**For sensory issues**:
- Allow more physical space
- Use separate keyboards/mice
- Consider headphones
- Don't force constant collaboration

**Alternative structures**:
- Think-pair-share (independent first, then pair)
- Ping-pong pairing (alternate every few minutes)
- Expert helper (one student assists another, then roles reverse)

---

## Worked Examples and Subgoal Labels

Research shows **struggling students benefit most** from subgoal-labelled worked examples.

### Foundation Adaptations

1. **More subgoals** - break into smaller steps
2. **Simpler language** - avoid jargon in labels
3. **Visual emphasis** - highlight current step
4. **Audio option** - provide narrated version
5. **One example at a time** - don't overwhelm

### Example: Foundation Subgoals

**Standard subgoals**:
1. Set up accumulator variable
2. Loop through collection
3. Update accumulator
4. Return result

**Foundation subgoals**:
1. Create a variable to store the total
2. Set the total to 0
3. Start the loop
4. Look at each item one at a time
5. Add the item to the total
6. Move to the next item
7. After all items: show the total

---

## Environment Setup

### IDE/Editor Adaptations

| Adaptation | Purpose |
|------------|---------|
| Larger fonts (14-18pt) | Readability |
| High contrast themes | Visual accessibility |
| Syntax highlighting | Construct recognition |
| Line numbers always visible | Reference in discussion |
| Auto-indent enabled | Reduce cognitive load |
| Spell-check disabled | Avoid false error signals |
| Auto-complete cautiously | Can help or overwhelm |

### Classroom Setup

- Ensure all screens visible to teacher
- Position students with needs strategically
- Reduce visual clutter on walls near screens
- Ensure adequate lighting (no glare)
- Allow movement breaks
- Have fidget tools available if helpful

---

## Assessment Adaptations

### Time

- Extended time (typically 25% or more)
- Breaks during longer assessments
- Chunked assessments across sessions

### Format

- Oral explanation as alternative to written
- Multiple choice for construct knowledge
- Parsons problems instead of free writing
- Tracing with partial completion
- Practical demonstration

### Environment

- Separate room for concentration
- Reader/scribe where appropriate
- Computer-based for typing preference
- Paper-based for some with screen fatigue

---

## NCCE SEND Resources

The NCCE offers **CO700: "Creating an Inclusive Classroom: Approaches to Supporting Learners with SEND in Computing"** which covers:

- Barriers faced by SEND students in computing
- General teaching approaches toolkit
- Accessible programming environments
- Physical computing for engagement

Available free at [teachcomputing.org](https://teachcomputing.org)

---

## Quick Reference Card

### For Any Struggling Student

1. ✓ Start with prediction (show code, ask what happens)
2. ✓ Use Parsons problems before free writing
3. ✓ Provide trace tables with some cells filled
4. ✓ Give worked examples with subgoal labels
5. ✓ Specify exact modifications (not "change this")
6. ✓ Allow pair programming with supportive partner
7. ✓ Use physical computing where possible
8. ✓ Chunk tasks visibly
9. ✓ Give extra processing time
10. ✓ Celebrate partial success

### Red Flags to Watch For

- Student not attempting (may need more scaffolding)
- Copying without understanding (increase Investigate activities)
- Frustration with typing (consider Parsons problems)
- Social isolation in pair work (restructure pairings)
- Correct output, wrong process (add tracing requirement)
