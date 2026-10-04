# Configure a controller

Use this guide after [flashing and connecting](Quick-Start-Guide.md). It takes a controller from its initial profile to a checked setup on the **v2 develop** firmware and [develop configurator](https://config.bosshobby.com/develop/). Complete the common steps, then follow the output procedure for your vehicle.

Remove propellers before powering aircraft motors. Support a rover with its wheels clear of the bench, and keep clear of servos and linkages. Output tests can drive motors even while normal arming is inhibited by the configurator.

## 1. Back up and confirm the firmware

In **Profile**, confirm the board target and vehicle, give the craft a name, and use **Save profile** to export its current settings. A target describes hardware; the firmware build selects Multi, Wing or Rover. Stop and correct a wrong target or vehicle before testing outputs.

Ordinary field edits stay pending until you press **Apply changes** in the bottom bar. Wait for **All changes applied**, then use **Reboot** if requested. Reconnect to check the saved values.

**Load profile**, **Reset profile** and applying a community template write directly to the controller. Back up before using them. A template may supply useful board or tune settings, but you still need to check the resulting setup. See [backup files and save behavior](Upgrading.md#save-and-apply-behavior).

## 2. Check orientation and battery readings

### Board orientation

In **Setup**, move the craft through roll and pitch and check that the preview model follows each movement. Correct board rotation and the upside-down setting until the movement agrees. A reversed or swapped axis will also reverse or misdirect stabilization.

Keep the controller still during boot-time gyro calibration. If the level reference needs recalibration, place the craft level and still and use [D,D,D](Features.md#stick-gestures) with a working receiver link.

### Voltage and current

In **Setup → Voltage & Current**:

1. Connect a battery and compare the displayed voltage with a meter.
2. Enter the measured and reported voltages in the calibration controls.
3. Check the cell count. Zero selects automatic detection; verify the detected count with the actual battery.
4. Set the low-voltage warning in **volts per cell**. Check current-meter calibration if the board provides a current sensor.

**Filtered voltage warnings** selects measured voltage for warnings. With it off, warnings use the compensated fuel-gauge estimate. The displayed voltage element and the warning source are separate choices; see [Voltage](Features.md#voltage).

## 3. Assign the serial peripherals

In **Setup → Serial Ports**, match each function to the UART used by its wiring:

| Function | Connected device |
| --- | --- |
| Receiver (RX) | Serial receiver, including UART ExpressLRS |
| VTX | SmartAudio or Tramp analog VTX control |
| Digital VTX | MSP/DisplayPort digital video system |
| GPS | Supported UBX GPS receiver |

Apply changes and reboot before checking reception or peripheral status. Some peripherals require battery power; USB alone may not power them.

**SPI receivers are disabled in current v2 builds.** An onboard receiver wired internally over UART is a serial receiver and can be used. An SPI-only receiver needs a supported serial replacement for v2 operation. See [receiver compatibility](Receivers-and-Passthrough.md#receiver-support-in-v2).

## 4. Verify the radio and switches

<a id="protocol-and-binding"></a>

### Get a valid receiver link

In **Receiver**, use automatic serial protocol detection or select the protocol explicitly, then apply changes and reboot. With the transmitter on, confirm that the protocol is detected and the live channel meters move.

Bind using the receiver's own procedure. **Bind receiver** can send a bind command to compatible CRSF receivers; it does not program an ExpressLRS binding phrase. See [binding and telemetry](Receivers-and-Passthrough.md).

### Check channels and calibration

Move one control at a time. Confirm Roll, Pitch, Yaw and Throttle for aircraft, or Throttle and Steering for a rover. Select the matching channel mapping and use **Channel calibration** to capture travel and center. Apply the result and check full travel and neutral again.

A rover uses centered throttle, including when configured for forward-only drive. Aircraft use low throttle for the stopped position.

<a id="aux-channels"></a>

### Assign arming and modes

Assign **Arming** to the intended switch range and check its active indicator at every switch position. AUX functions use raw receiver channels and a **0–100% activation range**; stick-role mapping does not change the channel used by an AUX function.

Leave **Prearm** at **Always on** when unused. If assigned to a switch, activate prearm before arming and cycle it for the next arm. The generic profile assigns Arming and Idle up to the upper half of channel 5; a template or restored profile can change this.

Choose modes for the actual vehicle:

| Vehicle | Mode selection |
| --- | --- |
| Multi | Level off gives Acro. Horizon and Race require Level to be active |
| Wing | Neither Level nor Acro gives Manual. Use separate switch ranges for Level and Acro |
| Rover | Neither assistance mode gives Manual. Rate Throttle takes priority over Rate Assist |

Check every mode indicator against the switch positions. Use the [AUX range example and function reference](Receivers-and-Passthrough.md#aux-range-example) for a three-position switch.

<a id="motor"></a>
<a id="outputs"></a>

## 5. Configure and test the outputs

### Multirotor motor checks

In **Outputs**, map each motor to the physical output shown by the diagram. Set DShot speed, motor limit, Digital Idle and turtle throttle for the craft.

With props removed and battery power connected:

1. Enable **Motor Test** and raise one output at a time.
2. Confirm that the motor's physical position matches the diagram.
3. Check actual rotation. Use **Normal** or **Reversed** on supported ESCs to change direction.
4. Set **Prop Direction** to agree with the actual props-in or props-out arrangement.
5. Stop the test before disconnecting.

Changing Prop Direction does not by itself prove the motors turn the right way. Check position and rotation separately.

### Wing and rover output checks

Follow [Wings and rovers](Wings-and-Rovers.md) to assign physical outputs, protocols, signed mixer weights, trim and travel limits. The guide includes an elevon example and explains PWM units.

Check each output independently, then check pilot input and stabilization correction direction. A surface can respond correctly to the stick and still correct in the wrong direction when the craft moves. Verify neutral drive on a rover and ensure servos do not bind at either endpoint.

<a id="rates"></a>
<a id="control"></a>
<a id="stick-rates"></a>
<a id="throttle-settings"></a>
<a id="pid"></a>
<a id="filter"></a>

## 6. Choose control settings

In **Control**, choose rates and a tune appropriate to the vehicle. For the first setup, retain appropriate filtering and avoid changing several tuning controls at once.

Use [Rates, PID and filters](Tuning.md) for rate-profile selection, throttle curves, presets, gain controls and filter settings. Wing feedforward, Autotrim and Autolaunch, and rover steering assistance have their own procedures in [Wings and rovers](Wings-and-Rovers.md).

<a id="osd"></a>
<a id="blackbox"></a>

## 7. Set up flight information and recording

Configure the video system and OSD with [Video and OSD](Video-and-OSD.md). Keep **System Status**, battery information and the relevant radio-link information visible. Check the result in the goggles, including both layouts if you use the OSD profile switch.

For recording, follow [Blackbox and diagnostics](Blackbox-and-Diagnostics.md): select a preset and log rate, assign the Blackbox AUX function, and verify a recording before relying on logs for tuning.

For GPS-equipped aircraft or rovers, follow [Navigation](Navigation.md) to verify GPS and home telemetry. **RTH is implemented only for multirotors** and also needs valid barometer data and a captured home position.

<a id="state"></a>
<a id="diagnostics"></a>

## 8. Verify the saved setup

Apply changes, reboot if required, and reconnect. Confirm the saved UART assignments, channel mapping, AUX ranges and output settings. Use **Diagnostics** to investigate missing sensor or receiver data.

Before operating the craft:

- Confirm the selected mode, receiver response and output directions.
- Check that the arm switch is off, throttle is safe, and the configured prearm condition is satisfied.
- Stop output testing, end the configurator session and disconnect USB. Lower the arm switch again before attempting normal arming.
- Verify receiver-loss behavior on the ground with props removed or drive wheels clear; use the [failsafe behavior reference](Features.md#failsafe-and-arming) to interpret it.
- Export a new profile after the setup is verified.

If arming is inhibited or data is missing, use [Troubleshooting](Troubleshooting.md) before changing the tune.
