# @jterrazz/manifest — the corpus

The manual of this package: what it is, how it is changed, what proves a
change, and how it is released. `AGENTS.md` and the `jterrazz-manifest` skill
route into it; they never restate it.

| Chapter                                  | Holds                                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [01-architecture.md](01-architecture.md) | The three published entries, the model/projections boundary, the Next.js adapter, the audit entry |
| [02-developing.md](02-developing.md)     | Install and wiring, the commands, the artefact convention, where a new file goes                  |
| [03-testing.md](03-testing.md)           | The module unit tests and the ten-rule audit pack, and how a consumer runs it                     |
| [04-operating.md](04-operating.md)       | What merging does, what publishes, and which version ships                                        |
| [05-projections.md](05-projections.md)   | The four projections in detail: URL policy, identity JSON-LD, sitemap, robots, llms.txt           |

Decisions this package alone took stand in [decisions/](decisions/), the mold
`_template.md` beside them.
