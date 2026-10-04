# Video transmitters and OSD

## Wiring and protocol selection

| Connection | Setup assignment | VTX protocol |
| --- | --- | --- |
| Analog VTX control wire | **VTX** UART | SMARTAUDIO or TRAMP, matching the VTX |
| Digital MSP/DisplayPort system | **Digital VTX** UART | MSP_VTX for supported VTX control |
| Analog video overlay | Target's onboard analog OSD chip/video wiring | Separate from the VTX control protocol |

Digital systems need compatible MSP/DisplayPort support. This includes HDZero and supported Walksnail/DJI configurations; the video system must be configured to accept the FC's OSD. Connect both UART directions for MSP communication, crossing TX to RX. Use the target's actual UART assignment and the video system's wiring instructions.

Apply serial assignments and reboot. Power the VTX if it is not powered from USB. Configure its antenna and cooling as required for bench operation.

## Desired and detected VTX settings

The VTX panel distinguishes profile settings from what the device reports. Select the actual protocol; current firmware does not automatically cycle through every VTX protocol.

1. Select **Protocol**, **Band**, **Channel**, **Power** and, when supported, **Pit Mode**.
2. Use **Apply changes** to save the desired settings.
3. Check **Detected** protocol/frequency and power-table values after the VTX responds.

A saved request is not proof that the VTX accepted it. If detected values differ, check power, UART wiring, selected protocol and the device's supported channels/power levels.

### Power tables

The table associates power-level labels with values expected by that protocol/device. The current UI shows desired and detected entries side by side. **Load detected power levels** copies the detected table into the profile; apply it afterward.

Do not copy another VTX's numerical table just because its labels look similar. Keep labels and values consistent with the connected hardware. Current firmware stores desired VTX settings in the profile, so loading a profile or template can also change the VTX configuration.

### FPV switch and pit mode

**FPV switch** serves two related hardware-dependent functions:

- If the target defines an FPV power-switch pin, it controls that output.
- If assigned to a receiver channel and the VTX supports pit mode, an inactive switch requests pit mode and an active switch requests normal operation.

Leave FPV switch **Always on** when unused. Check actual behavior on the ground; a board power switch and a VTX pit-mode command are not interchangeable.

## OSD layouts

Select **OSD profile 1** or **2** to edit its layout. The **OSD profile** AUX function selects profile 2 when active and profile 1 when inactive. A second layout can deliberately contain fewer elements or none.

Enable an element and drag it in the preview, or use its position fields. Coordinates start at the top left. Select the appropriate analog preview format where available, use uppercase callsign characters, and check the result in the goggles: analog and digital display grids differ.

### Available telemetry

| Elements | What they show |
| --- | --- |
| Callsign, crosshair | Craft identity and an aiming reference |
| Cell count, fuel-gauge volts, filtered volts | Cell detection, estimated resting voltage and measured voltage |
| Current draw, consumed capacity, watts | Current-sensor data, integrated use and electrical power |
| Gyro temperature | Temperature reported by the gyro |
| Flight mode, System Status | Selected mode and current warnings/state messages |
| RSSI/LQI, CRSF TX power | Radio-link information and reported transmitter power |
| Stopwatch, throttle | Flight timing and throttle indication |
| VTX channel | Video channel information |
| GPS satellites, GPS speed, GPS home | GPS availability, ground speed and direction/distance home |
| Altitude | Barometer-derived height relative to the launch reference |
| Rover inclinometer | Rover attitude display |

Enable **System Status** for arming inhibits, launch/trim progress and RTH messages. Keep it visible in both layouts. A requested mode shown by Flight Mode does not by itself confirm that all navigation prerequisites were met.

Battery warnings follow the warning source selected in Setup, independently of the displayed voltage element. Current, capacity and watts require a working, calibrated current sensor. GPS altitude used by radio telemetry and the barometer-based OSD altitude have different sources/references.

## Analog font and logo

In **OSD Font**, choose a font and use **Upload Font**. A custom logo must be a **288 × 72 PNG** using black, white and transparency; upload it with **Upload Logo**. The analog chip stores the font/logo across FC firmware flashes. Digital VTX layouts do not show this uploader because their fonts live in the goggles or receiver.

For HDZero setup and its font library, see [HDZero](Features.md#hdzero). L,R,L resets/redraws Quicksilver's display after using the video system's menu.

## OSD menu controls

While disarmed with a working receiver, center the controls and perform R,R,R. Up/down selects a row; right enters a submenu or selects a value. When a value is selected, up/down adjusts it and left moves back out of the selection. Holding a direction repeats menu input; shortcut gestures require short taps.

Menu categories depend on the vehicle. Common categories include VTX, Filters, Flight Modes, RC Link, OSD Elements, Motor Settings and Blackbox. Multirotors/wings have PID/rate menus; rovers have Rover Tuning for steering PID, filtering and throttle-related steering scale.

Use **SAVE+EXIT** to persist changes. Most ordinary edits affect the live profile before saving, so merely exiting is not a reliable way to undo them. Reboot without saving to reload persisted settings. VTX edits have their own staged menu handling; leaving that menu discards its uncommitted staging.

The OSD menu is a ground configuration interface. Arming exits menu operation. Use the configurator for settings without an OSD control, including the current Navigation and Wing Settings panels.
