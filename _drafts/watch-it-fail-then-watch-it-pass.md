---
title: "Watch it fail, then watch it pass"
summary: "The one rule that carried over from hand-written Cypress suites to agents that fix their own tests."
tag: Agents
---

<!-- SAMPLE DRAFT — rewrite in your own words. Files in _drafts/ are NOT published.
     To publish: move this file to _posts/ and rename it with a date,
     e.g. _posts/2026-10-01-watch-it-fail-then-watch-it-pass.md -->

For years my job was building the frameworks other people's tests ran on: page objects, API suites, reporters. The habit that mattered most wasn't any of the tools. It was refusing to trust an assertion I hadn't seen fail.

## A green test proves nothing on its own

A test that has never failed might be testing nothing at all. Break the thing it guards, watch it go red, then fix it and watch it go green. Only then does the green mean something.

```ts
test('user can complete checkout', async ({ page }) => {
  await page.goto('/cart');
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.getByText('Order confirmed')).toBeVisible();
});
```

## Teaching an agent the same rule

When I started building AgenticPw, the obvious failure mode was an agent that makes tests pass by weakening them. So the rule became the design: a fix only ships if it was verified, and when the honest answer is "this is a real bug", the agent says so instead.

> A refusal with a reason beats a green that lies.

[Continue here — what you tried, what broke, what finally passed.]
