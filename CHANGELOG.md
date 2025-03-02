# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial implementation of the editor with basic text and image box support
- Canvas with adjustable size and background color
- Box controls for styling (background color, border, shadow, etc.)
- Image box support with drag and drop functionality
- Text box support with editable content
- Box selection and manipulation (move, resize)
- Canvas display scaling for better editing experience
- Added z-index support for boxes with automatic increment for new boxes
- Added layer order controls (Move Forward/Backward) in box settings
- Added text color support for text boxes
- Added `hasBorder` property to control border visibility
- Added `hasBackground` property to control background visibility
- Added `textColor` property for text boxes
- Added hover effect with blue outline for better box selection visibility
- Added four corner resize handles for text boxes with hover reveal
- Added smooth transition effects for box interactions

### Changed
- Improved box dragging to require Shift key
- Simplified image handling by removing fit modes and using 'cover' mode only
- Enhanced box positioning to allow elements to extend beyond canvas boundaries
- Updated canvas overflow behavior to only show content within bounds
- Removed internal image dragging functionality
- Streamlined image box controls by removing unnecessary options
- Removed image fit mode options from BoxControls, now always using 'cover' mode
- Modified Box component to allow dragging elements partially outside the canvas
- Updated Canvas component to use 'overflow: clip' for proper content clipping
- Simplified image box styles by removing fit mode and scale related code
- Removed position constraints in Box component to allow free movement
- Updated editor to create new image boxes with 'cover' mode only
- Modified box selection behavior to prevent selection while Shift key is pressed
- Disabled text selection in boxes to improve dragging experience
- Removed legacy editor (v1) and made the new editor the default
- Modified default box styles:
  - Border is now disabled by default
  - Shadow is now disabled by default
  - Background is now disabled by default for text boxes
  - Removed background color support for image boxes
- Updated box rendering to respect new style properties

### Fixed
- Box resize handle now properly scales with display zoom
- Text overflow issues in text boxes
- Image aspect ratio preservation when adding new images
- Box position calculation with display scaling
- Canvas boundary constraints for box movement and resizing
- Implemented image export functionality using html2canvas
- Added support for PNG and JPEG export formats with quality and scale options
- Fixed transparent background handling for JPEG exports

### Technical
- Implemented proper TypeScript types for all components
- Added proper event handling for mouse interactions
- Improved component structure and separation of concerns
- Enhanced state management for box properties
- Added support for high-resolution image handling

## [0.1.0] - 2024-03-XX
- Initial release with basic editor functionality 

### Removed
- Removed image internal dragging functionality
- Removed fit mode selection UI and related code
- Removed image scaling controls for 'original' mode
- Removed legacy editor implementation (v1)
