# Arte de la Montaña / Gallery database

Academic worked example, not the official portfolio. Public artwork metadata: https://andreamontana.com/design-art/. There are no verified prices or real customer records. Three illustrative extra group memberships are marked `case-study`.

- `gallery.db`: runnable SQLite database.
- `gallery.sql`: schema and seed records; apply to an empty database.
- `build.py`: rebuilds `gallery.db` and runs the three queries, exporting their real results to `data.js`.
- `index.html`: dependency-free GitHub Pages viewer for these records and results.

Rebuild with `python build.py`. To inspect manually, open `gallery.db` in a SQLite client and copy any SQL example from the site. Replace the parameter `?` with a demo collector ID such as `'C02'` when running the recommendation query manually.
