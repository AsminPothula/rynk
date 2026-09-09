# RetroPay — clearing queue items with no destination

**Draft for Kristina — not published yet.** Sample consultants and test scenarios will be added once we have them.

---

## What’s going on

You already know RetroPay: when UltraStaff shortens an assignment, leftover timesheet weeks can become orphaned, and the portal raises a queue item so you can move those weeks to the right place.

A lot of those queue items have **no destination** to move to. For example:

- The consultant switched from hourly to p/i, or changed job order / client, so there is no matching next assignment.
- The assignment simply ended, with nowhere for the weeks to go.
- A decision hasn’t been entered into UltraStaff / the portal yet, so a destination may show up later.
- UltraStaff (or the portal) already has timesheets for that person on another project, so the leftover weeks are just sitting there with nowhere sensible to go.

This is an **extension of RetroPay** built for exactly those cases — the ones where you open the item and there is nothing useful in the destination dropdown.

---

## Why “Reject” isn’t enough by itself

Today you can reject a RetroPay queue item. That closes that item, but it does **not** clear the orphaned timesheets.

The next day, the portal looks again, still sees those orphaned weeks on the assignment, and raises a **new** queue item. So the same dead end can come back. We can’t leave those weeks hanging forever — the portal keeps surfacing them until something real is done with them.

That’s why we’re adding a proper way to clear “no destination” cases without pretending the problem is gone when it isn’t.

---

## What’s new on the portal

Two things:

1. **Disassociate** — a new action on RetroPay queue items that have **no destination**.
2. A new page / tab: **Disassociated Timesheets** — where those weeks go after you disassociate them, so you can still find them later.

Nothing else about normal RetroPay migrate / move behaviour changes. If there *is* a destination, you still move the weeks the way you do today.

---

## How to use it

### When there is no destination

1. Open the RetroPay queue item as usual.
2. You’ll see there is nowhere to move the weeks.
3. Use **Disassociate**.
4. Enter a **reason** (required) and confirm.
5. The orphaned weeks are taken off that assignment and recorded. The queue item is handled so it shouldn’t keep coming back for the same dead end just because you rejected it.

Only weeks that sit **fully after** the assignment end date are cleared this way. Weeks that straddle the end date stay on the old assignment (they partly belong there).

### After you disassociate — the new tab

1. Go to **Disassociated Timesheets**.
2. You’ll see the weeks grouped by assignment — consultant, project, company, dates, hours, who cleared them, when, and why.
3. You can filter by company (All / SmartWorks / iTech).
4. Open **Review Timesheets** on a group to see each week in detail.

### If a destination shows up later

Sometimes UltraStaff later gets a proper next assignment. When that happens:

1. On **Disassociated Timesheets**, those weeks will start showing a destination (you don’t need to wait for a new overnight run — it updates when you open the page).
2. You can choose to **create a queue item to resolve** for the weeks that now have a place to go.
3. That puts you back into the **normal RetroPay migrate flow** you already know — restore / move the weeks, then finish as usual.
4. Weeks that still have no destination stay on the list. A group can be partly ready (for example, 4 of 5 weeks have a place to go).

### If a destination appears while you’re still on the queue item

Rare, but possible: you opened an item with no destination, and before you click Disassociate, a destination becomes available.

- Disassociate will **refuse**.
- Nothing is cleared.
- The screen should switch you into the normal **move** flow instead.

That’s intentional — we don’t want to clear weeks when there’s suddenly somewhere to put them.

### If the destination disappears before you finish resolving

If you were about to restore / resolve from the Disassociated tab and the destination is no longer valid:

- The resolve action goes away / won’t complete a partial move.
- Better to stop than move weeks to the wrong place.

---

## What money / Available to Pay does

Disassociating or putting weeks back on the Disassociated list does **not** by itself change Available to Pay. Money only moves when you do a normal RetroPay **migrate**, same as today.

---

## Testing on stage

We’re seeding sample data on **stage** so you can try the situations you’re likely to see in real use — not only the happy path.

The scenarios to walk through will be listed below (consultants and steps for each case will be filled in shortly).

**If while you’re testing you can’t find one of the cases on stage, tell us.** Syncs and refreshes can overwrite sample data. We’ll seed that case again for you.

---

## Scenarios to test

*(To be added — sample consultants and step-by-step cases coming from the team.)*

-
-
-
