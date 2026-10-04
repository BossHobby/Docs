# Blackbox and diagnostics

## Record a useful log

1. Confirm that the target has supported Blackbox storage and that **Blackbox → Flight Logs** reports available capacity.
2. Assign the Blackbox AUX function to a switch range or **Always on**.
3. Choose a preset and click **Load**. Select a log rate and, if needed, one debug mode.
4. Check **Recorded fields**, then **Apply changes** before the flight.
5. Arm and fly with Blackbox active. Disarming or disabling the function ends that recording session. Turtle-ready operation does not start a normal flight log.
6. Reconnect while disarmed, download the flight, and confirm it opens in the intended analysis tool before erasing storage.

The all-fields preset records at 1 kHz. The filtered-gyro preset records gyro, loop and time at 200 Hz for workflows such as video stabilization. Loading a preset changes both rate and field selection; debug selection can add fields.

### Sampling and storage

The selected rates are 200 Hz, 1 kHz, 2 kHz and 4 kHz. The firmware samples at a whole-number division of the active flight-loop rate, so the effective rate depends on loop timing and cannot exceed it.

Blackbox captures flight data in the flight loop and writes it from a separate storage task. Storage stalls can cause missing samples; inspect actual timestamps and sequence gaps rather than assuming every requested sample was recorded. Lower the rate or choose a smaller field set if storage cannot keep up.

Leave time for the recording to finish writing after disarming before removing power. Download and erase operations are ground maintenance operations.

## Fields and debug modes

The all-fields set includes receiver input, setpoint, P/I/D terms, raw/filtered gyro and accelerometer, outputs, CPU load, GPS position/home, altitude, time/sequence and debug values. Availability of meaningful sensor data still depends on the hardware and selected vehicle.

| Debug mode | Use |
| --- | --- |
| None | Normal tuning without extra subsystem diagnostics |
| Dynamic Notch | Inspect tracked gyro-noise peaks/filter behavior |
| Rover | Inspect steering mode, steering saturation/scale and throttle assistance |
| Navigation / RTH | Inspect heading, confidence, RTH phase, home vector and navigation commands |
| Wing | Inspect flight mode, autolaunch, autotrim and failsafe phases |

Navigation / RTH selection also includes GPS position, GPS home and altitude on current firmware. Pick the mode before recording: the meaning of debug slots depends on the selected subsystem and firmware revision.

### Current data-format details

For analysis scripts, current Blackbox format `0.3.2` stores:

- CPU load as **0–100% system load**. Older Blackbox versions used this field for timing in microseconds.
- GPS position and home as latitude/longitude in degrees multiplied by 10,000,000.
- Altitude as signed decimeters above the launch reference, saturated to the field's range.
- Sixteen signed debug slots; each subsystem defines their units.

Current QUIC protocol `0.2.10` adds navigation fields and places Debug at field index 16. Do not interpret an old log using an assumed current field order. Firmware's `src/io/blackbox.h` and the Configurator's Blackbox decoder define the formats.

## Download formats

**BTFL** converts the recording to a `.bfl` file for compatible Betaflight-format tools. **QUIC** exports decoded Quicksilver data as `.json`. Keep the native export and firmware revision when reporting a problem, especially for vehicle/navigation fields that another analyzer may not display.

The Quicksilver analyzer is available [here](https://bosshobby.github.io/Blackbox-Analyzer/). Check its support for the log version you recorded. The current download buttons do not produce the old `.quic` and `.btfl` filenames described in earlier docs.

**Erase logs** clears recording storage. A profile export does not back up flight recordings.

## Live diagnostics

**Diagnostics** provides these plots:

| Plot | Useful check |
| --- | --- |
| RX Channels | Stick direction, center and input stability |
| CPU Load | System workload; not a flight-loop duration |
| Raw / Filtered Gyro | Motion response and the effect of filtering |
| Gyro Temperature | Sensor temperature behavior |
| Altitude | Barometer detection and relative-altitude behavior |
| Gyro Vector | Estimated gravity direction |
| Raw / Filtered Accelerometer | Acceleration response and orientation |
| PID Output | Controller response |

Live USB plots are for bench diagnosis. They are not a replacement for a flight recording: ground operation, USB communication and absent motor/airframe loading change the conditions.

The optional **Performance** view displays firmware timing counters when exposed by the build. Its summed task plot excludes USB; it should not be read as the CPU Load percentage shown in Diagnostics.

## Reporting a fault or flight problem

Include the firmware commit, configurator branch/version, exact target/vehicle, a relevant profile with private binding data removed, and a short reproduction sequence. For flight issues, attach the recording and identify the time of the event, active modes and what you expected.

Distinguish a controller failloop from an ordinary arming inhibit or an RTH status message. See [Troubleshooting](Troubleshooting.md#controller-failloop-codes).
