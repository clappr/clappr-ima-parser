# Changelog

## 3.0.1

### Bug Fixes

- A wrapper in the same VAST URL that resolves empty or fails no longer discards ads already collected from that URL.
- An empty wrapper resolution is not a request error.
- A wrapper request failure (timeout, HTTP, network) is recorded in `errors` alongside the collected ads.
- Genuine no-fill (the VAST response itself has no ads) is still `{ ads: [], errors: [] }`.

## 3.0.0

### Breaking Changes

- `IMAParser.requestAds` and `VASTManager.request` now resolve with `{ ads, errors }` instead of an ads array.
- No-fill (a valid VAST response with no ads) is `{ ads: [], errors: [] }`. That is not a request error.
- Request failures (timeout, HTTP, network, parse) appear in `errors`.
- When a pod has several URLs and only some fail, the promise still resolves: `ads` contains what succeeded and `errors` contains the failures.
- The promise still rejects only when no adTag is provided (`Invalid adTag received to request VAST`).

`requestAdBreaks` is unchanged: it still rejects on VMAP request failure.

### Distinguishing no-fill from request error

- `errors.length > 0` — ad request error
- `ads.length === 0 && errors.length === 0` — no-fill (content should continue)
