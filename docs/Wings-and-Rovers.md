# Wings and rovers

Select **Wing** or **Rover** in the firmware flasher and choose a target supporting that vehicle. The controller reports its running vehicle in Profile. Changing a YAML capability list cannot change the compiled vehicle.

## Output routing and mixers

Each configured output has a physical target output, a protocol and one or more source rules. The target determines which pins support DShot, PWM or brushed output. The profile determines what drives them.

For a wing, sources include **Throttle**, **Roll**, **Pitch**, **Yaw** and **RX Channel**. Rover sources include **Throttle**, **Steering** and **RX Channel**. A direct receiver-channel source follows that channel rather than the stabilized axis controller.

Add multiple source rules to a wing surface to create a combined mix. Weights scale each contribution; negative weights reverse that contribution. The summed result is inverted, trimmed and limited by the output configuration.

| Example surface | Example source mix |
| --- | --- |
| Aileron | Roll +100% |
| Elevator | Pitch +100% |
| Rudder | Yaw +100% |
| First elevon | Roll +50%, Pitch +50% |
| Second elevon | Roll -50%, Pitch +50% |

These mixes illustrate the relationship, not universal servo directions. Servo mounting and linkage geometry determine the required signs. Equal 50% contributions leave room for simultaneous full roll and pitch; larger combined demands can reach the output limit.

### PWM travel

PWM uses 1000–2000 µs pulses, with normalized zero at 1500 µs for a centered surface. Use a servo-compatible PWM rate; the current range is 50–333 Hz.

The profile's per-output `trim`, `min` and `max` are normalized thousandths: -1000 to +1000 represents -1 to +1. For example, a centered surface limited to -800/+800 uses approximately 1100–1900 µs. Output inversion is applied before trim and limits. These values are not entered in microseconds.

Wing PWM throttle is treated separately: zero throttle maps to the low pulse, rather than surface neutral. Reversible rover PWM throttle uses center as neutral. Confirm the ESC's expected neutral/range before applying power.

### Output testing

**Enable test** bypasses normal control. Test each output individually with props removed or wheels raised. Wing PWM outputs use bidirectional test controls, including PWM throttle outputs; the **Master** slider only changes unidirectional test outputs and therefore does nothing on an all-PWM wing.

Check the physical label and mix beside each wing test slider. A working slider proves the output path; it does not prove that stabilization moves the surface in the right direction.

## Wing setup

1. Flash the Wing build and verify board orientation in Setup.
2. Bind the receiver, select channel roles and calibrate travel. Configure arming/prearm.
3. Map the throttle and control surfaces in Outputs. Set the PWM rate, mechanical neutral and travel limits.
4. Assign separate switch ranges for **Manual**, **Acro** and **Level**. With neither Acro nor Level active, the wing is in Manual. Current firmware gives Level priority if both are active.
5. Check pilot control directions in Manual. In stabilized modes, check that a disturbance produces a correcting surface movement. Keep the motor isolated during these checks.
6. Use the wing's own default gains as the starting point. Set suitable rate limits and Level Max Angle, then verify normal flight before adding autotrim or autolaunch.

### Wing controller settings

In Acro, sticks request rotation rates. In Level, roll/pitch request attitude and the controller generates corrective rate demands. Wing control includes per-axis feedforward as well as P/I/D.

Feedforward drives surface response from the requested rate, including level-mode corrections. The current scaling makes a feedforward value of 100 produce full normalized output for a 1 rad/s rate request, before output limits. It is not a percentage to copy from a multirotor PID tune.

Rate profiles affect stick response; output mixer weights and limits affect available surface travel. Check both when the aircraft responds too weakly or hits full deflection too early. Throttle Boost and Torque Boost are multirotor motor features even if a shared configurator panel displays their fields.

### Autotrim

Enable Autotrim during established, steady flight. It accumulates about two seconds of suitable samples, pausing when the craft rotates too quickly. It excludes autolaunch and requires the flight state to indicate airborne operation; when GPS is valid, low ground speed also prevents capture.

After **AUTOTRIM: DISARM SAVES**, leave the switch on, land and disarm. Saving waits until the craft is disarmed and GPS no longer indicates continuing flight. Confirm **AUTOTRIM SAVED** before removing power. These result messages are shown briefly.

Turning the switch off before saving restores the previous trim. Failsafe or output-test activity cancels capture and requires cycling Autotrim off before another attempt. An incomplete capture interrupted by disarming can start again on the next flight.

### Autolaunch settings

These are current generic defaults, not a tune for every airframe:

| Setting | Default | Meaning |
| --- | --- | --- |
| Accel Threshold | 1.5 g | Forward acceleration needed to detect the throw |
| GPS Speed Threshold | 3 m/s | Alternative GPS-based detection, with a suitable launch attitude |
| Detect Time | 40 ms | Time a detection condition must persist |
| Idle Throttle | 8% | Throttle while preparing/waiting and during motor delay |
| Idle Delay | 0 ms | Delay after raising throttle before idle startup |
| Motor Delay | 100 ms | Delay after release before launch spinup |
| Spinup | 100 ms | Ramp from idle to launch throttle |
| Launch Throttle | 70% | Throttle during the assisted climb |
| Launch Pitch | 18° | Nose-up climb attitude |
| Min Launch Time | 0 ms | Delay after detection before stick movement can cancel |
| Timeout | 5000 ms | Climb duration after spinup |
| Finish | 3000 ms | Blend back toward pilot throttle and pitch |
| Stick Deadband | 15% | Roll/pitch movement that requests takeover |
| Max Launch Altitude | 0 m | GPS altitude-gain exit; zero disables it |

!!! warning

    The default nonzero Idle Throttle can spin the propeller before the throw. Motor Delay is measured from release, not from arming or initial throw detection. Configure and verify this behavior with the propeller removed first.

Select Autolaunch before arming, then raise throttle and follow the System Status messages:

| Status | Meaning |
| --- | --- |
| LAUNCH: SET BEFORE ARM | Disarm and select Autolaunch before the next arm |
| LAUNCH: RAISE THROTTLE | Waiting for the pilot to start preparation |
| LAUNCH: GET READY | Idle startup/preparation |
| LAUNCH: THROW | Waiting for launch detection |
| LAUNCH: DETECTED | Throw accepted; waiting for motor-start conditions |
| LAUNCH: STICKS ABORT | Assisted launch running; stick takeover is subject to Min Launch Time |
| LAUNCH: TAKE CONTROL | Finishing the assisted climb |
| LAUNCH DONE / LAUNCH ABORTED | One-shot result; disarm before another attempt |

Switching Autolaunch off or disarming cancels it. A failsafe aborts launch and it does not restart automatically when the radio returns. Normal wing failsafe levels with zero commanded throttle during the guarded phase, then blocks outputs. Current Wing firmware has no RTH.

## Rover setup

1. Flash Rover firmware and verify board orientation.
2. Choose Aircraft Radio or Pistol Radio channel mapping, then check **Throttle** and **Steering** roles and calibration.
3. Map the drive ESC to Throttle and the steering servo to Steering. Confirm neutral, direction and servo travel with the wheels clear of the bench.
4. Configure **Center Deadband** around throttle neutral and select **Reversible Motor** to match the ESC.
5. Test Manual first, then assign Rate Assist or Rate Throttle and tune steering behavior at low speed.

Rover input remains centered even with reversible drive disabled. Above center commands forward drive; below center commands reverse only when Reversible Motor is enabled, otherwise it commands no drive.

### Steering scale and assistance

**Max Yaw Rate** is the full-stick rate request in assisted modes. **Rate Assist** uses the gyro and steering PID to follow it. **Rate Throttle** additionally adjusts throttle magnitude to help achieve the requested turn; it preserves the commanded drive direction and takes priority when both switches are active.

**Throttle Scale Breakpoint** and **Throttle Scale Factor** reduce steering authority as throttle increases. Below the breakpoint, full steering authority remains available. Above it, authority curves toward the configured factor at full throttle. A 100% breakpoint disables this reduction; a 50% factor retains half the authority at full throttle.

The controller smooths its throttle-based steering scale with acceleration-aware behavior, so steering authority does not jump instantly with the throttle stick. This is based on commanded throttle and inertial feedback, not a measured wheel-speed governor.

Use **Rover** Blackbox debug mode to investigate assistance/scaling. On receiver loss, the guarded response commands neutral throttle and steering before output shutdown. Rover GPS/home telemetry does not provide an autonomous return controller.
