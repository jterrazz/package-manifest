# @jterrazz/manifest — the manual

A site's presence declared once, projected into every machine-facing surface, and audited on the live site. What the package is and how a site starts using it is the repository's README; this page lists every page of the manual, by what the reader came to do.

## Guides

| Page                         | Answers                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| [Develop](guides/develop.md) | Changing the package: the declaration, the gestures, where a new file goes, what it owes |
| [Test](guides/test.md)       | Proving a change: the specs that install the tarball, the audit spec, the mutations      |
| [Release](guides/release.md) | How the package is published, who cuts a release, and what its peer range follows        |

## Concepts

| Page                                     | Answers                                                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------- |
| [Architecture](concepts/architecture.md) | The three entries, the model and the projections, the adapter and the audit entry |

## Reference

| Page                                    | Answers                                                                                |
| --------------------------------------- | -------------------------------------------------------------------------------------- |
| [Projections](reference/projections.md) | The URL policy, and what identity and image JSON-LD, sitemap, robots and llms.txt hold |
| [Audit](reference/audit.md)             | The eleven rules of `audit.website`, and how a consumer runs them                      |

## Decisions

The records of decisions this package alone took are in [`decisions/`](decisions/), numbered in the order they were taken, the mold `_template.md` beside them. A decision spanning several repositories is recorded by the corpus that spans them.
