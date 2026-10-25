# Let motion change its mind

Backlog #1. The backlog entry covers one mechanism (does a running animation take the next input). The page adds three more, each verified, so the reader learns what makes an animation interruptible, not only that it should be.

## Cases

| # | Section | Mechanism | One variable | Source (verified) |
| --- | --- | --- | --- | --- |
| 0 | Scene | A queued animation makes the reader wait for clicks they already took back | Clicking a panel open and shut several times fast: each click waits its turn, or each click turns the panel from where it is | jQuery `.stop()` docs: effects queue by default, "These animations will not begin until the first one completes", "the common problem of multiple queued animations"; Apple WWDC18 803: "we built a fully redirectable interface" |
| 1 | Keyframes start over | A keyframe animation has a start and an end; reversed mid-way it jumps to its own start | Closing a half-open drawer built with `@keyframes`, or with a transition | Emil Kowalski: "A CSS transition can be interrupted and smoothly transition to a new value" |
| 2 | The way back is shorter | CSS Transitions shorten a reversed transition by how far it got (the "reversing shortening factor") | Turning back near the start: the full duration again, or the share already travelled | CSS Transitions Level 1 §3; measured in Chrome: reversed at 50% linear, back in 508 ms of 1000 |
| 3 | Keep the speed when you turn | A timing curve restarts from zero speed at every new target; a physics spring carries the current velocity into the turn | A card flicked and sent back mid-flight: an easing curve, or a spring that keeps its velocity | Motion docs: physics springs "incorporate the velocity of any existing gestures or animations"; duration-based springs "don't incorporate velocity"; WWDC18 on springs, "this seamlessness is, kind of, built in" |

Case 3 brings a new reusable tool: a motion trace, a small position-over-time line drawn live under the demo, so the kink at the turn is visible as well as felt. Slow motion (0.1×) is reused for cases 1 and 2.

Links out: Popover and Menu (origin, slow motion), Hover forgives (judging intent mid-motion), How waiting feels.
