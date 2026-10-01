---
title: "PlayAgent: designing a test agent that's allowed to say no"
summary: "The requirements behind my next project — a Playwright platform where agents plan, write and heal tests, but never grade their own work."
tag: Agents
---

Recorders and code generators are good at one thing: turning clicks into a script. What they don't give you is everything that happens after — knowing whether that script actually protects a requirement, figuring out why it went red at 2 a.m., and deciding whether "fixing" it is a repair or a cover-up.

That gap is what I'm building **PlayAgent** to close. It's a platform that coordinates specialized agents to plan coverage, write Playwright tests, run them, investigate failures, propose controlled repairs and apply release quality gates. I've just finished the first draft of its requirements, and this post walks through the ideas that shaped it.

It's a draft for review, not a shipped product. Everything below is what the platform *must* do, not what it already does.

## The rule underneath everything

If you've read anything else here, you know the habit: don't trust an assertion until you've watched it fail, and watched the fix pass. PlayAgent is that habit turned into architecture. The requirements open with a short list of principles, and three of them do most of the work:

- **Test intent is authoritative.** An agent must not change expected business behavior just to get a green run.
- **The maker does not approve its own work.** Anything an authoring or healing agent produces goes through an independent evaluator.
- **Passing is evidence, not proof of coverage.** A green test is measured against requirements and risk, not against itself.

> A refusal with a reason beats a green that lies.

## Separate what a test means from how it's written

The most important design decision is a data-model one. PlayAgent keeps two records for every test:

- a **logical test case** — preconditions, actions, expected outcomes, linked requirements, risk and owner, written independently of any framework
- an **automation implementation** — the actual Playwright code, fixtures and configuration

Because the intent lives on its own, the code can be regenerated or healed without losing the requirement links, ownership, execution history or approvals. When a healer touches a test, it has something authoritative to check itself against.

## Every agent run is a bounded loop

Agents in PlayAgent don't "keep trying until it works." Each run binds a goal, a policy version, a budget and a set of permitted actions, then loops: observe, take one permitted action, run deterministic checks, and let an independent evaluator decide whether the goal is met, more work is justified, or a human needs to step in.

The loop stops on success, cancellation, policy violation, budget exhaustion, no progress, or a repeated unchanged failure. Every run ends in a named terminal state, so "it just stopped" is never an answer:

```ts
// Terminal states every agent run must end in (sketch)
type TerminalState =
  | 'success'
  | 'product_defect'
  | 'test_defect'
  | 'requirement_ambiguity'
  | 'environment_failure'
  | 'human_review'
  | 'budget_exhausted'
  | 'no_progress'
  | 'cancelled'
  | 'policy_violation';
```

Budgets cover attempts, elapsed time, tokens, execution cost and browser actions. An agent that's burning money without making progress is a bug, not a feature.

## Twelve agents, one job each

Instead of one do-everything agent, the platform splits the work into narrow roles: Requirement Analyst, Risk Analyst, Test Planner, Test Author, Execution Agent, Failure Investigator, Test Healer, Test Reviewer, Coverage Analyst, Flakiness Analyst, Defect Agent and Release Quality Agent.

Each one has a defined output and a defined evaluator. The Test Author produces a reviewable diff, checked by execution and independent review. The Release Quality Agent produces one of four outcomes — **pass, pass with risk, block, or human decision** — from a deterministic gate policy, with the deciding evidence attached.

## Writing tests the way a careful engineer would

The authoring requirements read like a code-review checklist I've been applying by hand for years:

- Follow the repository's existing structure, fixtures, utilities and style.
- Prefer role, label, text and test-id locators before fragile CSS or XPath.
- Assert **observable business outcomes**, not just that a button was clicked or an element appeared.
- Isolate test data and browser state unless a suite explicitly needs shared state.
- Run every generated test in a clean environment before anyone is asked to accept it.

And for critical tests, there's a requirement I'm particularly happy with: a **deliberate-failure check** that proves the assertion can actually catch the behavior it protects. That's "watch it fail" as a platform feature.

## What healing is allowed to touch

Self-healing is where most tools get dangerous, so the boundaries are explicit.

Before proposing anything, the healer must load the approved test intent, the original assertions, the relevant product change and the failure evidence. Failures get classified first — product defect, test defect, intentional product change, test data issue, environment issue, flaky behavior, or unresolved — and only a reproduced test defect is eligible for repair.

When project policy allows it, automatic healing can fix **locators, synchronization, setup and data dependencies**. These always need explicit human approval:

- removing or weakening assertions
- changing expected outcomes
- accepting new visual baselines
- adding broad waits or retries
- skipping tests
- modifying application code

Every healing proposal carries its diagnosis, changed files, a statement of preserved intent, risk, before-and-after evidence and rollback information — and the healed test still has to pass clean and repeated runs plus independent review.

## Context you can cite, and content you don't trust

Agents get their context from a QA retrieval layer that indexes requirements, code, tests, documentation, execution artifacts and defect history — with versions and citations. It has to prefer the current approved version of a record, and when two sources disagree it must surface the conflict instead of quietly picking one.

Just as important: **web pages and retrieved documents are untrusted input.** Nothing an agent reads in the application under test, or in a retrieved document, can change its instructions, permissions, tools or approval rules. Secrets never appear in prompts, generated tests, logs, traces or screenshots.

## How I'll know it works

The draft sets proposed pilot targets, to be validated before anything is called done:

| Measure | Proposed target |
|---|---|
| Generated tests accepted without a major rewrite | 70%+ |
| Healing proposals that preserve test intent | 90%+ |
| Failures correctly classified before human review | 85%+ |
| Agent runs with complete evidence | 100% |
| Changes outside the declared mutation boundary | Zero |

One acceptance criterion sums up the whole philosophy: the independent evaluator must **reject a passing but semantically weak test**. A green that doesn't mean anything should fail review.

## The road from here

Delivery is split into phases: discovery and evaluation datasets first, then the authoring foundation, then investigation and healing, then retrieval and integrations, and finally release governance. Plenty is still open — pilot repositories, which systems are authoritative, automatic-acceptance boundaries per risk class, and who decides when a requirement and an existing test disagree.

I'll write about each phase as it lands — what I tried, what broke, and what finally passed.
