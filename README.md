# Meta → JSON Microserver

Express microserver that finds `.meta` (XML) files in a directory, converts them to JSON, and writes `.json` files with the same base name to an output directory.

## Quick Start

```sh
# 1) Create project
mkdir meta-json-microserver && cd $_
# copy files from this README or your editor into place

# 2) Install deps
npm install

# 3) Configure
cp .env.example .env
# edit .env as needed (SOURCE_DIR, OUTPUT_DIR, PORT)

# 4) Make folders and a sample file
mkdir -p data/meta data/json
cat > data/meta/example.meta <<'XML'
<vehicle>
  <model name="adder" />
  <stats speed="210" handling="high" />
</vehicle>
XML

# 5) Run
npm run start
```

## REST Endpoints

- `GET /health` → `{ status, uptime }`
- `GET /files` → lists `.meta` files found in `SOURCE_DIR`
- `POST /convert/all` → converts **all** `.meta` files into `.json` under `OUTPUT_DIR`
- `POST /convert/:name` → converts a **single** file by basename (no extension).  
  Example: `POST /convert/example` reads `example.meta` and writes `example.json`.

## Notes

- Filenames are sanitized; only `[A-Za-z0-9._-]` allowed.
- XML is parsed with `fast-xml-parser` (attributes kept as `@_attr`).
- JSON is pretty-printed with two-space indentation.
- Set `AUTO_CONVERT_ON_START=true` to auto-run conversion on boot.

## Environment

See `.env.example`.
