# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-06-29
### Added
- Initial public release of `marked-bridge`.
- Added `bridgeExtension()` for `marked` integration.
- Added direct renderer API: `parseBridgeBlock`, `renderHand`, `renderHands`, `renderDeal`, `renderAuction`.
- Added SVG-based rendering for bridge hands, deals, auctions, and partnership bidding.
- Added default stylesheet and themeable CSS variables.
- Added live demo page in `demo/`.
- Added `LICENSE` file and public npm metadata (`bugs`, `homepage`).
- Added release-ready documentation with BridgeForge attribution and contact details.

### Fixed
- Updated build script to use cross-platform file copy logic.
- Removed stale compiled test artifacts.
- Verified `npm test` passes.
