# Coastlines for the decorative globe

Made with Natural Earth. The land polygons come from the Natural Earth
1:110m land dataset, distributed in the public domain.

- Dataset: https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/
- Terms: https://www.naturalearthdata.com/about/terms-of-use/
- Download: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson
- Download SHA-256: `9e0729ee253ca7d7a5c4ae9395fb1902264c5377c52e224d13dd85010e2835d9`

`earth-land.json` contains the source geometries without feature properties,
with coordinates rounded to three decimal places. Polygon winding was
checked against D3's spherical-area convention. No political boundaries
or live satellite data are included. The map is a decorative background.

The scene uses the pinned `d3-geo` package (ISC license) for the orthographic
projection and horizon clipping. All map data ships with the site; the
background makes no requests to external map services.
