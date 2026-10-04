# Upgrading and restoring a configuration

The v2 development line changes receiver mapping, AUX assignments, output routing and persisted settings. Keep a backup from the firmware that created it, and verify the converted setup before operating the craft.

**Check receiver compatibility before flashing:** current v2 develop builds disable SPI receivers pending interrupt-safety fixes. Use a supported UART receiver. Retaining an old SPI target or restoring its bind data does not restore SPI reception.

## What each file contains

| Backup | Contents and purpose |
| --- | --- |
| **Save profile** | Controller settings, rates, gains, receiver mapping, outputs and OSD; current profiles also include receiver bind and desired VTX settings |
| **Save target** | Board hardware description, including pins, buses, sensor definitions and output capabilities |
| **Save bind data** | Legacy SPI bind backup for returning to compatible older firmware; it does not enable SPI reception in v2 |
| Blackbox downloads | Recorded flights; these are separate from the configuration backups |

**Save profile** reads the profile from the controller. Apply pending edits before exporting if you want them in the backup. Name backups with the board, vehicle and firmware revision; firmware version, profile-schema version and QUIC protocol version are different identifiers.

An older/imported profile can include an SPI receiver's binding identity. Remove that data before publishing a profile intended for other people's craft.

## Save and apply behavior

Not every control waits for the bottom save bar:

| Action | Behavior on current develop |
| --- | --- |
| Edit a field, load a PID/Blackbox preset | Stage edits; use **Apply changes** |
| **Load profile** | Import and apply the profile directly |
| **Reset profile** | Apply the firmware's default profile directly |
| Apply a community template | Merge its selected settings into the controller profile and apply directly |
| **Load target** | Send the hardware description directly; reboot before verifying the hardware setup |
| Change serial protocol or load bind data | Update profile bind settings; use **Apply changes**, then reboot when indicated |
| **Bind receiver** | Send a CRSF binding command immediately |
| Motor/output tests and motor direction commands | Act on outputs immediately |

Back up before importing, resetting or applying templates. Reconnect after the required reboot and check the saved values.

## Upgrade procedure

1. Connect using a configurator compatible with the existing firmware. Apply any edits you intend to retain, then save the profile, target and relevant bind data. Download logs you need.
2. Record the exact board variant, vehicle, receiver protocol and UART assignments.
3. Flash the matching vehicle and target from `develop` using the [develop configurator](https://config.bosshobby.com/develop/).
4. Power-cycle and inspect the fresh configuration. The target can supply receiver, serial and VTX defaults; verify them against your wiring.
5. Restore an appropriate profile through the configurator. It converts supported older formats on import. This does not make a profile for another board or vehicle suitable for this one.
6. Configure the serial receiver and desired VTX settings if the old profile did not contain them. Keep legacy SPI bind backups for older firmware; do not use them as a v2 receiver setup step.
7. Check the items below, apply subsequent edits and reboot when required. Export a new backup after verification.

### Settings to recheck

- **Receiver roles:** current firmware maps Roll/Pitch/Yaw/Throttle, or rover Throttle/Steering, to individual receiver channels with minimum, center and maximum calibration.
- **AUX functions:** assignments are channel/range pairs. Older high/low assignments are converted to ranges; check arming, prearm and every flight-mode switch position.
- **Outputs:** physical pins, protocols and logical mixer sources are separate settings. Check motor position, direction, PWM neutral and surface mixes.
- **Throttle curve:** older releases used different mid/expo behavior. Inspect the current curve and response.
- **Filters:** dynamic D-term now has a selectable type. Review gyro/D-term passes and any restored tuning.
- **OSD:** current firmware has two profiles and additional telemetry elements. Verify both layouts, especially System Status, cell count and navigation data.
- **Navigation:** confirm failsafe-RTH selection, altitude/throttle settings and valid GPS home before relying on it.

Current development formats can evolve without migration for each intermediate build. If an old development profile restores incorrectly, start from current defaults and re-enter the relevant settings rather than editing the metadata version to force acceptance.

## Templates and resets

Templates provide setup/tune fragments, sometimes with options for the board, gyro or VTX. Select the options that match the craft. Applying a template can overwrite existing values in those sections; it is not simply a name or label.

**Reset profile** resets operating settings. A profile reset does not select another vehicle build or replace an incorrect hardware target. To return to another firmware line, reflash the correct vehicle/target and restore a backup from that line; do not assume a v2 profile can be imported into v1.
