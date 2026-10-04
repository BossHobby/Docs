<img src="https://github.com/BossHobby/QUICKSILVER/blob/master/misc/Logo_Clean.svg?raw=true" width="256">

# QUICKSILVER Docs

install:
```shell
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

serve:
```shell
source .venv/bin/activate # if not already active
mkdocs serve
```

Deployments use the same branch URLs as the configurator:

| Branch | Documentation URL |
| --- | --- |
| `master` | https://docs.bosshobby.com/ |
| `develop` | https://docs.bosshobby.com/develop/ |
| `feature-navigation` | https://docs.bosshobby.com/feature-navigation/ |

Every branch push except `gh-pages` builds the docs. Branch names keep their
case; special characters use the configurator's hexadecimal escaping, so
`feature/navigation` deploys to `/feature~2f~navigation/`. Names that collide
with documentation paths such as `assets`, `search`, or `About` are reserved.
Canonical URLs, search, and source edit links follow the build's branch.

The `publish-pages` workflow on the default branch publishes successful builds,
preserving the other versions. It ignores outdated builds and removes deployments
for deleted branches. Each published build's URL appears in the workflow summary.
The `gh-pages` branch stores the combined site and its deployment manifest.

For initial setup, merge these workflows into `master`, set the repository's
**Settings → Pages → Build and deployment → Source** to **GitHub Actions**, and
create `develop` from the updated `master`. Feature branches also need these
workflow changes. Keep the custom domain as `docs.bosshobby.com` and allow the
default branch to deploy to the `github-pages` environment. You can manually run
`ci` for an existing branch, or `publish-pages` to republish and prune deleted
branches without rebuilding.

Run the deployment tests with `node --test script/pages.test.mjs` (Node.js 22).
