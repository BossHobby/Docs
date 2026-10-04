# Features

These features describe the current `develop` firmware. Availability depends on the vehicle build and target hardware.

## Stick Gestures

Gestures work while disarmed and on the ground with a working receiver link. Center the controls briefly before starting, then make three short directional movements, returning to center between each. Avoid diagonal inputs and long holds.

On multirotors and wings, pitch supplies up/down; roll or yaw can supply left/right. On rovers, throttle supplies left/right around its center position, and steering/yaw supplies up/down.

| Gesture | Action |
| --- | --- |
| U,U,U | Toggle the legacy receiver bind-saved flag; does not bind serial receivers |
| D,D,D | Calibrate gyro and accelerometer and save; immediately after U,U,U, save the bind without calibration |
| R,R,R | Open the OSD menu |
| L,R,L | Exit/reset the OSD display, useful after a digital system's own menu |

Place the craft level and still before calibration. U,U,U remains a legacy bind-flag gesture; SPI receivers are disabled in current v2 builds, and serial receivers use their own binding procedure.

## Vehicle modes

### Multirotor modes

Acro/Rate is the default when **Level mode** is off. Level mode self-levels the craft. **Horizon** blends level and rate behavior, while **Race mode** combines level roll with acro pitch; both require Level mode to be active.

Two rate profiles and two PID profiles can be selected in **Control**. Stick Boost and OSD layouts have separate AUX profile switches. Multirotor GPS return-to-home is described in [Navigation](Navigation.md).

### Rover modes

Rovers use a centered throttle input and configurable steering/throttle output mapping.

- **Manual:** steering follows the pilot's input.
- **Rate assist:** the steering stick requests a yaw rate; the gyro and steering PID correct the output to follow it.
- **Rate throttle:** adds automatic throttle adjustments to rate-assisted steering. It takes priority when both assistance switches are on.

Configure center deadband and reversible behavior in **Control**, and verify neutral throttle before arming.

### Wing modes

Wings support **Manual**, **Acro** rate stabilization and **Level** self-leveling. Use separate AUX ranges to select the intended mode. Set up surface mixes and directions in **Outputs** before testing stabilization.

**Autotrim** captures control-surface trim during steady flight. Enable its AUX function, hold steady flight until capture completes, and leave it enabled through landing and disarming so the trim can be saved. Turning it off before saving cancels the pending trim and restores the previous values. Capture pauses during maneuvering and does not run during autolaunch; a disarm during an incomplete capture requires another flight to complete it. Check the OSD status before disconnecting power.

**Autolaunch** must be selected before arming. After the pilot raises throttle, the controller prepares for a throw and detects launch using forward acceleration or valid GPS speed. Configure detection, idle throttle, motor delay, launch throttle, pitch and handover in **Control → Wing Settings**.

!!! warning

    A nonzero autolaunch Idle Throttle can spin the motor while the aircraft is still in your hand. Motor Delay starts after release and keeps the motor at Idle Throttle until spinup begins.

Launch ends through its timeout, configured GPS altitude gain, or pilot roll/pitch input after the minimum launch time. The finish phase blends back toward pilot control. Switching Autolaunch off cancels it; each arm cycle permits one launch attempt, so disarm before starting another.

Wing and rover builds share GPS/home telemetry, but their current `develop` controllers do not implement RTH.

## Failsafe and arming

The receiver-loss sequence briefly holds the last valid commands, enters a guarded fallback, then blocks outputs if the link has not recovered and no RTH is controlling the multirotor. Generic timing defaults detect loss after 150 ms, hold the last commands until 300 ms from the last valid frame, and allow a further 1 second in the guarded phase.

During that guarded phase, an airborne multirotor levels and attempts to hold altitude; a grounded multirotor retains idle/stabilization before output shutdown. Wings level with zero commanded throttle, and rovers command neutral throttle and steering. Multirotor [failsafe RTH](Navigation.md#failsafe-and-taking-control-back) can take over when its prerequisites are met.

Normal arming requires a valid receiver link, safe throttle, valid prearm and cleared arming latches. Active USB or CRSF configurator access prevents arming. An arm request while configuration is active latches an inhibit: end the configuration session and lower the arm switch before trying again. After an output-blocking failsafe, allow the receiver to recover and cycle the arm switch.

## Voltage

**Filtered volts** is the measured battery voltage smoothed for display and telemetry. **Fuel-gauge volts** estimates resting voltage by compensating for load-related sag. It is an estimate, so verify it against your battery after landing.

In **Setup → Voltage & Current**, calibrate measured voltage against a meter and verify the detected cell count. The warning threshold is per cell.

- With **Filtered voltage warnings** off, the low-battery warning uses compensated cell voltage, with hysteresis and an additional absolute-low-voltage check.
- With it on, the warning uses the faster filtered measured cell voltage and responds to sag under load.

The flashing OSD cell count follows that warning setting regardless of which voltage element you display. The generic warning threshold is 3.6 V per cell; a loaded profile or template can change it. PID voltage compensation is a separate setting that adjusts controller gains as voltage changes.

## Filters

### Lowpass filters

Gyro and D-term lowpass filters reduce high-frequency noise. Lower cutoffs remove more noise but add delay. PT1, PT2 and PT3 provide increasing filter order; chaining passes adds filtering and delay.

Configure the passes in **Control → Filters**. **None** disables a pass. Current generic gyro defaults use PT2 at 100 Hz with the second pass disabled. Tune from the defaults appropriate to the craft, using motor temperature and Blackbox data to assess changes.

### Dynamic D-term

The dynamic D-term lowpass moves between configured minimum and maximum cutoff frequencies with throttle. Select its type and frequency limits in Control. The current multirotor controller uses a fixed parabolic throttle curve. Raising the cutoff at higher throttle reduces filtering delay while allowing more noise through.

### Dynamic Notch Filter

The dynamic notch uses sliding discrete Fourier analysis to track gyro noise peaks and place notch filters at those frequencies. It complements the lowpass passes. Enable it in **Control → Filters** and use the Dynamic Notch Blackbox debug mode when investigating its behavior.

## Throttle D-term attenuation (TDA)

TDA reduces D gain above a throttle breakpoint. The current firmware treats **TDA Percent** as the fraction of D gain retained at full throttle: 0.5 retains half the gain, while 1 leaves it unchanged. It can be used alongside dynamic D-term filtering to control high-throttle noise.

## Throttle Boost

Throttle boost adds a highpass-filtered component to throttle input to strengthen the response to rapid throttle changes. Start with small changes and assess the effect on throttle control.

## Torque Boost

Torque boost changes motor commands to accelerate their response. It is sensitive to noise and can overheat motors; leave it disabled unless you are deliberately testing and retuning the motor response. Check filtering and motor temperature when changing it.

## Stick Boost

**Stick Accelerator** controls the setpoint contribution to D-term, changing how strongly the controller responds to stick movement. Zero uses measurement-based D-term; one gives full setpoint contribution.

**Stick Transition** changes that contribution across stick travel. Zero keeps it constant. Positive values reduce acceleration around center relative to full deflection; negative values allow stronger acceleration near center. For example, Accelerator 1 and Transition 0.3 reduce the center contribution by 30%.

Configure each axis in either Stick Boost profile, and select the active profile with **Stick boost profile** in **Receiver → AUX Functions**. Keep Transition within -1 to 1 and make small tuning changes.

## Angle Strength

Small-error and large-error angle gains control how level modes correct attitude errors. Small-error gains affect response around the requested attitude; large-error gains affect stronger corrections such as recovery after a collision.

## Receivers

Serial protocols include SBUS, CRSF (including UART ExpressLRS), IBUS, FPort, DSM2/DSMX and serial Redpine. **SPI receivers are temporarily disabled in current v2 develop builds**, pending SPI interrupt-safety fixes.

Assign the receiver UART in Setup. Automatic serial detection or an explicitly selected protocol is available in Receiver. An onboard receiver connected internally over UART remains supported as a serial receiver; it is not an SPI receiver.

Binding a serial receiver is separate from configuring its serial protocol. See [receiver setup and binding](Receivers-and-Passthrough.md#binding).

### Link quality

**LQI source** can use packet rate, a receiver channel or direct protocol data. Direct data is useful with protocols such as CRSF that provide their own link statistics. Packet-rate LQI describes received packet performance; it is not a distance estimate. Monitor the source appropriate to your receiver and do not assume a good reading guarantees remaining range.

## Turtle mode

Multirotor turtle mode uses reversible DShot commands to flip an inverted craft. Assign **Turtle** to an AUX function, enable it while inverted, then arm. Pitch or roll input selects the motors used for the attempt.

Current firmware uses roughly one-second motor bursts at the configured **Turtle Throttle Percent**, stopping when it detects the craft has flipped, turtle is cancelled or the craft is disarmed. Disarm after the flip, then rearm for flight.

Set the throttle for your craft and avoid repeated attempts against an obstruction. An AUX setting of **Always on** makes turtle available whenever arming inverted.

## OSD

Open the menu with R,R,R while disarmed. Up/down moves through items, right enters and left returns. Use **SAVE+EXIT** to persist changes; exiting without saving can leave temporary changes that are lost at power-off. Some changes require a reboot.

The configurator supports two layouts selected by **OSD profile** AUX, movable elements and text inversion. Available telemetry includes voltage, current/power, link quality and GPS/home/altitude information where the hardware supports it.

Analog OSD font uploads update the font and boot logo in the OSD chip, which persist through firmware updates. Digital fonts are handled by the video system.

## HDZero

Assign the connected UART to **Digital VTX** in Setup, apply and reboot. Power the video receiver or goggles before the VTX. L,R,L redraws the display after using the HDZero menu.

HDZero fonts are handled by the receiver or goggles; see the [HDZero OSD font library](https://github.com/hd-zero/hdzero-osd-font-library).

## Blackbox

Supported onboard flash or SD-card storage records flight data when armed and the **Blackbox** AUX function is active. Configure recording in the [Blackbox tab](Configuring-Quicksilver.md#blackbox).

The firmware supplies all-fields/1 kHz and filtered-gyro/200 Hz presets. The configurator also offers 2 kHz and 4 kHz rates and optional Dynamic Notch, Rover, Navigation / RTH and Wing debug data. Recording is constrained by loop rate and storage throughput.

**BTFL** exports `.bfl` for compatible Blackbox analysis tools such as PIDtoolbox. **QUIC** exports JSON for tools consuming Quicksilver data. The [Quicksilver Blackbox Analyzer](https://bosshobby.github.io/Blackbox-Analyzer/) is a separate project; check compatibility with the log format you record.

## Motor Test

The configurator's **Outputs** tab can drive outputs directly for bench checks. Remove props before enabling the test and stop it before disconnecting.

The multirotor **Motor test** AUX/OSD mode is a separate function: while armed, motors follow throttle without normal PID control, and pitch/roll selects individual motors. It is for diagnosis and must be disabled before flight.

## Runtime Targets

A runtime target is a YAML hardware description defining sensors, buses, pins, outputs and supported vehicles. Remote flashing combines this data with the vehicle/MCU firmware. Board-specific source builds can embed it in the HEX.

Export/import target YAML in **Profile** for board development. Select a matching vehicle build and validate pin/output assignments; a target's `vehicles` list describes capabilities, not the running vehicle selection. See [Development](About/Development.md) for the target source and schema.
