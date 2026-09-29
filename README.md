# Public Cost Estimator

This project is a static HTML, CSS, and JavaScript app that estimates a person's annual net public cost or net fiscal contribution from user-supplied inputs.

The model is intentionally simple and transparent:

`net impact = total public costs - total taxes and fees paid`

Positive results mean the modeled public costs exceed the modeled taxes and fees. Negative results mean the modeled taxes and fees exceed the modeled public costs.

## Files

- `index.html` contains the app structure
- `styles.css` contains the animated layout, theme system, and visual styling
- `script.js` contains the estimator logic, field definitions, validation, rendering, presets, and customization controls

## Customization features

The options menu includes a broad set of visual and interaction controls:

- dark mode and light mode
- multiple accent palettes
- calm, playful, and turbo motion levels
- animated ambient background effects
- animated counters and card pulse effects
- hover tilt interactions
- spotlight styling for the primary result card
- compact layout mode
- preset fiscal scenarios

Preferences and entered values are persisted in `localStorage`.

## What the app asks for

The form collects annual inputs for:

- taxes and fees paid
- healthcare support
- housing support
- cash or income support
- education or training support
- justice system costs
- infrastructure and local services
- emergency and public-health costs
- other public services

## Scope and guardrails

- The calculator is a budgeting aid, not a measure of a person's worth.
- It does not infer anything from demographics or protected traits.
- It depends on the quality of the user-entered annual estimates.
- It does not model indirect economic effects, spillovers, or long-term social outcomes.

## Usage

Open `index.html` in a browser, or serve the repository as a static site.
