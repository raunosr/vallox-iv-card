# Beta field validation

The implementation and automated checks cover the v2 behavior in README and docs.
These checks require an actual installation, beyond synthetic data:

- Native timer completion and manual override before retiring an existing timer chain.
- At least 24 hours of seasonal sampling before opting into Auto.
- Replacement energy-meter cadence, readings and HA Recorder retention.
- Winter defrost and energy observations to evaluate house-specific thresholds.
- Review of the isolated HA test view before promoting v2 to the everyday dashboard.

Suggestions never change target temperature or frost-protection parameters.
