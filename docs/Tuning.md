# Rates, PID and filters

Use **Control** in the develop configurator after completing the [orientation, receiver and output checks](Configuring-Quicksilver.md). These settings change flight or driving response; save a profile before tuning and change one group of settings at a time.

This page covers shared settings and multirotor tuning controls. For wing feedforward and rover steering control, use [Wings and rovers](Wings-and-Rovers.md).

## Stick rates

Multirotors and wings have two rate-profile slots. Select the active slot before editing and apply the change. Rate selection controls commanded rotation; it is separate from the PID-profile selection.

| Rate mode | Controls |
| --- | --- |
| Silverware | Maximum rate in degrees/second, Acro expo and Angle expo |
| Betaflight | RC rate, Super rate and Expo |
| Actual | Center sensitivity and maximum rate in degrees/second, plus Expo |

Use the response graph to compare center feel and full-stick rotation rate. **Level Max Angle** sets the requested tilt limit in degrees for level modes. **Sticks Deadband** removes small inputs around center.

**Save rates** exports both rate-profile slots. **Load rates** imports both slots; use **Apply changes** to save them to the controller. The old rate-profile AUX slot is reserved/hidden in the current configurator.

## Throttle response

**Throttle Mid** and **Throttle Expo** use values from 0 to 1. Mid locates the part of the curve around which Expo softens response. Current firmware uses Betaflight-style mid/expo behavior; inspect the curve after restoring settings from older firmware.

Several controls affect throttle or motors in different ways:

| Control | Purpose |
| --- | --- |
| Throttle Mid / Expo | Shape the stick-to-throttle response |
| Motor Limit Percent | Cap motor output |
| Digital Idle | Set the running motor floor |
| Idle up AUX | Enable multirotor low-throttle stabilization behavior |
| Throttle Boost | Add response to rapid throttle changes on multirotors |
| Torque Boost | Change multirotor motor-command response |

Keep boost settings conservative. Torque Boost is sensitive to noise and can overheat motors; see [Torque Boost](Features.md#torque-boost) before enabling it.

## PID profiles and presets

Multirotors and wings have two PID-profile slots. Select a slot before editing or loading a preset. A preset is a starting point for the matching craft; verify the affected values and use **Apply changes** after loading it.

P, I and D govern the response to rate error, sustained error and rapid changes. Raising gains does not correct wrong motor routing, reversed stabilization or a mechanical problem. Start with a suitable tune, inspect flight behavior and motor temperature, and use [Blackbox](Blackbox-and-Diagnostics.md) to assess changes.

Wing surface control also provides feedforward. Rovers use their own steering PID; do not transfer multirotor gains into those controllers.

### Multirotor response controls

- **Stick Boost:** two separately configured profiles selected by its AUX function. Accelerator changes the setpoint contribution to D-term; Transition changes that contribution across stick travel. See [Stick Boost](Features.md#stick-boost).
- **Angle Strength:** small-error and large-error gains govern attitude corrections in level modes. See [Angle Strength](Features.md#angle-strength).
- **TDA:** attenuates D gain above the throttle breakpoint. **TDA Percent** is the fraction retained at full throttle: 0.5 retains half; 1 leaves D unchanged. See [TDA](Features.md#throttle-d-term-attenuation-tda).
- **PID voltage compensation:** adjusts gains as battery voltage changes. Configure it in **Setup → Voltage & Current**; it is separate from the warning-voltage selection.

## Filters

Gyro and D-term lowpass passes reduce noise at the cost of delay. Select **None** to disable a pass. PT1, PT2 and PT3 provide increasing filter order; chaining passes adds filtering and delay.

The checked firmware's generic gyro default is one **PT2 pass at 100 Hz**, with its second pass disabled. This is a source default, not a statement about every target, template or restored profile. Check the values actually loaded on the controller.

The dynamic D-term filter varies its cutoff with throttle between configured limits. The dynamic notch tracks gyro noise peaks. See [Filters](Features.md#filters) for their roles and [Blackbox debug modes](Blackbox-and-Diagnostics.md) for recording.

Start from the appropriate defaults. Reducing filtering or raising D gain can increase motor heating. Check mechanical condition, logs and motor temperature before making further changes.
