# Arte de la Montaña / Art Gallery Case Study

Independent academic database exercise using 32 real public artworks from [Andrea Montaña’s Design & Art catalogue](https://andreamontana.com/design-art/). Artwork is © Andrea Montaña; source links refer to her portfolio. Titles, media, years and original collections follow the catalogue. Prices are NULL, and broad types are a case-study interpretation of published media. Collector records and transaction totals are synthetic. Three optional secondary tags illustrate many-to-many classification and are labeled separately.

The site is dependency-free on GitHub Pages. For a local copy, serve this directory with \`python -m http.server\`. The normalized SQLite schema, fixture and three query views are in \`gallery.sql\`; run the script against an empty database. Browser data was exported from the same SQLite fixture into \`data.js\`.
