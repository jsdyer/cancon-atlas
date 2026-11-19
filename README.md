# CanCon Atlas

[CanCon Atlas](https://coolcode.ca/cancon-atlas/) · [CoolCode](https://coolcode.ca/)

Find a recording in the CRTC music database and inspect its Canadian-content decision, language and release details.

<!-- coolcode:guide -->
Search the October 2026 edition for Gord Bamford or paste an ISRC. The count shows matching selection rows. Browse different recordings of the same song and check each row’s Canadian-content status.
<!-- /coolcode:guide -->

## Exploring the music index

The first edition contains 19,687 CRTC selection rows dated October 22, 2026. The CRTC marks 16,818 as Canadian and 2,869 as non-Canadian. Search for Sloan and open “COAX ME” to switch between published ISRCs for recordings that share the same artist label and title. An ISRC identifies a recording. Different versions and alternate identifiers are retained as published. The detail panel gives the CSV row number, release date, duration, content category and emerging status. Most searches match words across the title, artist and ISRC together. Filters work on the complete edition and the table displays 30 rows at a time.

The source lists the majority language of each selection. The initial edition contains 43 rows with no language. All emerging-artist values in this edition read N/A. These values are displayed as supplied. The database does not publish a province of origin or counts of actual radio plays.

## Source and release

[CRTC music dataset and downloadable dictionary](https://open.canada.ca/data/en/dataset/086cf10b-d8d3-4c11-8bc2-60b4769d50db). Contains information licensed under the [Open Government Licence – Canada](https://open.canada.ca/en/open-government-licence-canada).

The monthly importer discovers the latest dated English CSV in Open Canada, validates the header and full-row count, and writes a compressed edition. The static build expands it once. Your search stays in your browser. A dated recording link includes the source row and edition because row positions can change across releases.

## Development

Run `python scripts/refresh.py` to retrieve public data, `node --test tests/*.test.mjs` and `python -m unittest discover -s tests` to test, and `python scripts/build.py` to build offline. Serve `dist/` over HTTP. GitHub Actions exercises the main user interaction on Chromium before publishing to Pages. A scheduled import that fails validation does not replace the published edition.
