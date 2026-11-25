from pathlib import Path
import json
import sqlite3

ROOT = Path(__file__).parent
database = ROOT / "gallery.db"
database.unlink(missing_ok=True)
db = sqlite3.connect(database)
db.row_factory = sqlite3.Row
db.execute("PRAGMA page_size=512")
db.executescript((ROOT / "gallery.sql").read_text())
names = "artist artwork art_group artwork_group customer customer_artist customer_group".split()
records = {name: [dict(row) for row in db.execute(f"SELECT * FROM {name}")] for name in names}
porto = """SELECT g.group_code, g.name, ag.provenance
FROM artwork_group ag JOIN art_group g USING (group_code)
WHERE ag.artwork_id = 'porto'
ORDER BY ag.provenance DESC, g.group_code;"""
inventory = """SELECT group_code, name,
       COUNT(CASE WHEN provenance = 'portfolio' THEN 1 END) AS published,
       COUNT(CASE WHEN provenance = 'case-study' THEN 1 END) AS examples
FROM art_group LEFT JOIN artwork_group USING (group_code)
GROUP BY group_code, name
ORDER BY group_code;"""
recommend = """SELECT artwork_id, title, artist_match, group_match
FROM customer_recommendations
WHERE customer_id = ?
ORDER BY title;"""
def rows(sql, params=()):
    return [list(row) for row in db.execute(sql, params)]
queries = {"porto": {"sql": porto,"rows": rows(porto)}, "inventory": {"sql": inventory,"rows": rows(inventory)}}
queries["recommendations"] = {"sql": recommend,"rows": {c["customer_id"]: rows(recommend, (c["customer_id"],)) for c in records["customer"]}}
assert len(records["artwork"]) == 32 and all(w["price_cop"] is None for w in records["artwork"])
assert queries["porto"]["rows"] == [["objects", "Objects & colour", "portfolio"], ["creatures", "Creatures & stories", "case-study"]]
assert sum(r[2] for r in queries["inventory"]["rows"]) == 32
assert len(queries["recommendations"]["rows"]["C02"]) == 11
assert db.execute("PRAGMA integrity_check").fetchone()[0] == "ok"
assert db.execute("PRAGMA foreign_key_check").fetchall() == []
db.commit()
db.close()
(ROOT / "data.js").write_text("const DB = " + json.dumps({"records":records,"queries":queries}, ensure_ascii=False) + ";\n")
