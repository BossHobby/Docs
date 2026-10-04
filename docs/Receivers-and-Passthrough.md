# Receivers, telemetry and passthrough

## Receiver support in v2

Current v2 develop builds support **serial receivers**. **SPI receivers are temporarily disabled**, pending SPI interrupt-safety fixes. Retained SPI drivers, target definitions and legacy configurator controls do not make SPI reception available in these builds.

A serial receiver runs its own receiver firmware and sends channels over a UART. It may be a separate module or built into the FC board; an onboard UART ExpressLRS receiver is still a serial receiver. Assign its UART in **Setup → Receiver (RX)**, apply changes and reboot. A board with an SPI-only receiver needs a supported serial receiver connected to a suitable UART to receive controls on this firmware.

Serial protocols include SBUS, CRSF, IBUS, FPort, DSM and Redpine, including the inversion variants offered by the firmware. Wiring, inversion and half-duplex requirements depend on the protocol and board. For CRSF, connect both receiver TX to FC RX and receiver RX to FC TX so telemetry and commands work as well as channel input.

### Automatic and fixed serial protocol

With the unified serial receiver, **AUTO** searches for a supported protocol. The status cycles through `trying …` until it reports a detected protocol. If detection does not settle, first check power, UART selection and wiring.

Select a fixed protocol when you know the receiver type. On current firmware this updates the profile's bind/protocol settings; use **Apply changes** and reboot. The separate **Apply serial protocol** button is for older firmware.

### Binding

Bind a serial receiver using that receiver's normal procedure. For CRSF/ExpressLRS, **Bind receiver** sends a CRSF bind command when available; the receiver must support the command. It does not install a binding phrase or flash receiver firmware.

Changing Quicksilver's serial protocol is separate from binding the radio link. SPI bind-phrase controls and the U,U,U bind-save gesture do not configure a serial receiver's binding identity.

**Reset binding** clears the stored binding/protocol information; on current firmware apply the resulting profile and reboot. **Save bind data** and **Load bind data** retain compatibility with older profiles. Preserve an old SPI bind backup if you may return to older firmware; restoring it does not enable SPI receivers on v2.

## Channel roles and calibration

In **Receiver → Channel Mapping**, use AETR or TAER as a starting point for aircraft radios. Rover builds offer **Aircraft Radio** and **Pistol Radio** presets. Each role can also be assigned independently.

Move one control at a time and confirm its **Live Channels** meter. Expand **Channel calibration** to adjust minimum, center and maximum, or use **Calibrate** and follow the capture/verification prompts. Apply the result and check full travel plus neutral again.

Role calibration and AUX ranges are different: AUX functions use the selected raw receiver channel, not a roll/pitch/throttle role. A correct stick mapping does not prove the arm switch is assigned correctly.

### AUX range example

For a three-position switch whose live values are near 0%, 50% and 100%, assign separate ranges around those positions. For example, a multirotor's **Level mode** could use 35–100% and **Horizon** 75–100% on the same channel:

| Switch position | Active functions | Result |
| --- | --- | --- |
| Low | Neither | Acro |
| Middle | Level mode | Level |
| High | Level mode and Horizon | Horizon |

Leave gaps between ranges that should be exclusive. Check the actual live values and indicators; receiver switch modes can provide different resolution from the transmitter's physical switch.

### AUX functions

| Function | Purpose |
| --- | --- |
| Arming | Requests armed operation; it must still pass the arming checks |
| Prearm | Additional arming condition; leave Always on when unused |
| Idle up | Keeps multirotor motors active at low throttle for stabilization |
| Level / Horizon / Race | Multirotor attitude-mode selection; Horizon/Race require Level |
| Acro | Wing rate stabilization; use separate ranges from Level |
| Stick boost profile | Selects the AUX-off or AUX-on Stick Boost settings |
| Buzzer | Requests the lost-craft buzzer/motor beeper where supported |
| Turtle | Makes multirotor flip recovery available when inverted |
| Motor test | Multirotor field test without normal PID control |
| RSSI | Selects the channel used by channel-based LQI |
| FPV switch | Controls the target's FPV power-switch output and supported VTX pit mode; leave Always on when unused |
| Blackbox | Enables recording while armed |
| OSD profile | Selects the second OSD layout when active |
| Return to home | Requests multirotor RTH; a visible/reserved entry on another vehicle does not implement RTH |
| Rate assist / Rate throttle | Rover steering assistance |
| Autotrim / Autolaunch | Wing trim capture and launch assistance |

Rate and PID profiles are selected in Control. The old rate-profile AUX slot is reserved/hidden in the current configurator.

## Link quality and CRSF telemetry

**PACKET_RATE** estimates received packet performance, **CHANNEL** uses a designated receiver channel, and **DIRECT** uses protocol-supplied link statistics. Choose a source your receiver provides. For CHANNEL, assign **RSSI** to the channel carrying that information.

Current CRSF support handles packed/subset channel frames and newer link-statistics messages. It sends filtered **per-cell voltage**, current, consumed capacity and flight mode; GPS and extended GPS telemetry are included when GPS data is available. Radio-side sensor discovery and display depend on the transmitter.

The battery-remaining percentage in the current CRSF battery frame is a fixed placeholder of 100%, not a fuel estimate. Use calibrated voltage and consumed-capacity readings instead. GPS telemetry altitude is GPS altitude, while the OSD/navigation relative altitude comes from the barometer.

The **CRSF TX power** OSD element reports the transmitter power supplied in link statistics. It is separate from video-transmitter power. Missing data on one telemetry element does not necessarily mean channel reception has stopped.

### Configuration over CRSF

Firmware supports QUIC configuration traffic carried in CRSF `0x7F` frames while disarmed. This requires a compatible client/bridge; the current browser configurator's normal connection is still USB serial.

The CRSF transport permits configuration reads/writes and IMU/stick calibration. Motor tests, passthrough, Blackbox transfers and OSD font transfers require USB. Active CRSF configuration also inhibits arming; stop the session and lower the arm switch before arming.

## Serial and ESC passthrough

Passthrough turns the controller into a bridge for another tool. It does not itself install firmware.

1. Disarm, remove props or otherwise isolate moving outputs, and power the peripheral as required.
2. In **Profile → Serial Passthrough**, select the wired **Serial Port** and matching **Preset**.
3. Click **Start**. A successful start disconnects the configurator.
4. Open the peripheral's flashing/configuration tool and select the controller's USB serial port.
5. When finished, close the external tool and power-cycle the controller before reconnecting normally.

| Selection | Preset | Current bridge settings |
| --- | --- | --- |
| UART | ExpressLRS | 420000 baud, full duplex, one stop bit |
| UART | OpenVTX | 4800 baud, half duplex, two stop bits |
| ESCPROG 0–3 | ESCape32 | 38400 baud, selected ESC programming output |

ESCPROG indices are zero-based. Verify the output being addressed before flashing an ESC. Firmware also provides USB MSP/serial 4-way passthrough for compatible ESC tools when built with that feature; use the external tool's passthrough workflow rather than looking for the removed Esc Settings panel.

If a tool cannot open the port, ensure the configurator and other serial clients have released it. If the controller no longer answers normal configuration commands after a bridge session, power-cycle it.
