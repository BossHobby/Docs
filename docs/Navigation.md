# GPS and Return-to-Home

Current `develop` firmware provides GPS and home telemetry for all vehicle builds, and **return-to-home (RTH) control for multirotors only**. RTH climbs, returns and hovers near home. It does not automatically land.

!!! warning

    RTH is a development feature. Test its switch activation and pilot takeover in an open area with a working radio link before enabling it as a failsafe response. It has no obstacle avoidance, and heading acquisition can move the craft away from its starting position.

## Hardware and setup

Use a supported UBX GPS receiver connected to an available UART, with GPS TX connected to controller RX and GPS RX connected to controller TX. Both directions are used because the firmware configures the GPS. RTH also requires a working barometer recognized by the target and a correctly oriented/calibrated flight controller.

1. Assign **Setup → Serial Ports → GPS**, apply changes and reboot.
2. Inspect the GPS panel in Setup. The firmware detects baud rate and configures supported receivers; select the constellations suitable for the module.
3. Outdoors with a clear view of the sky, wait for stable position data and a valid fix. Check satellite count and accuracy.
4. Verify barometer altitude data and board orientation. Altitude is relative to a launch reference reset on arming.
5. On a multirotor, configure **Control → Navigation** and assign **Return to home** to a deliberate AUX switch range in Receiver.
6. Configure OSD GPS/home/altitude elements and Blackbox **Navigation / RTH** debug recording for test flights.

Home is captured **on arming**, only when the GPS position passes validity checks. Acquiring a fix later in flight does not establish a missing home for that arm cycle. If there was no valid home at arming, land, disarm, wait for valid GPS and rearm.

Current navigation checks require a valid GPS fix, at least four satellites, horizontal accuracy of 30 m or better, updates no older than 500 ms, and plausible position changes. These are firmware acceptance limits; wait for a stable, accurate fix rather than treating the minimum satellite count as a preflight target.

## Navigation settings

| Setting | Meaning | Generic default |
| --- | --- | --- |
| Return to home on failsafe | Allow an airborne multirotor failsafe to start RTH when ready | Enabled |
| RTH climb height | Height added to the altitude at RTH activation | 10 m |
| Return speed | Requested horizontal speed | 30 km/h |
| Min throttle | Lower navigation throttle limit | 10% |
| Hover throttle | Starting hover estimate; steady flight can improve the estimate | 50% |
| Max throttle | Upper navigation throttle limit | 75% |

Check the values actually loaded on your controller. Set a realistic hover estimate and enough throttle range to hold altitude and climb. Minimum throttle must be below maximum throttle. The controller reserves thrust headroom, so a configured 100% maximum does not mean RTH will command full throttle.

**RTH climb height is additional height at activation**, not a fixed altitude above the takeoff point. For example, activating at 20 m with a 10 m climb height requests a return at about 30 m above the launch reference.

## Return sequence

1. RTH takes over roll, pitch, yaw and throttle, levels the craft and climbs to the requested height.
2. If heading confidence is low, it makes a controlled forward movement to estimate heading from GPS motion.
3. It turns toward home and navigates back, slowing as it approaches.
4. Near home, it holds position and altitude. The pilot must take over and land.

The climb is not a position hold: horizontal navigation starts after reaching the climb altitude. Wind and the heading-acquisition maneuver can move the craft during these phases.

With a healthy radio link, turn the RTH AUX function off to return to pilot control. If an activation request was rejected because prerequisites were missing, correct the problem and cycle the switch to request RTH again.

## Failsafe and taking control back

An airborne multirotor first enters a guarded altitude-hold response on sustained receiver loss. If **Return to home on failsafe** is enabled and valid home, GPS and barometer data are available, RTH takes over.

After failsafe RTH starts, a recovered radio link alone does not immediately hand control back. The link must remain valid for the recovery interval (500 ms by default), and the pilot must move roll, pitch or yaw beyond the takeover threshold (30% of normalized travel from center). Keep the RTH AUX function off if you want manual control; an active manual RTH request keeps RTH selected.

Disarming still stops the return. If RTH cannot start or aborts while the radio link is lost, the normal failsafe sequence can progress to output shutdown.

## Sensor loss and unsuccessful returns

RTH temporarily levels and attempts to hold altitude if GPS or barometer data becomes invalid. Without a barometer, it attempts to hold zero vertical speed using the inertial estimate, which can drift. A continuous sensor outage of 10 seconds aborts the return.

Climb, heading acquisition and progress toward home also have limits. Heading or navigation failures get a bounded hold before aborting; RTH does not keep retrying indefinitely during the same signal loss. These behaviors do not guarantee recovery in wind, with a poor tune or with faulty sensor data.

For a return that does not start or behaves unexpectedly, check home capture, GPS freshness, barometer validity, throttle limits and the RTH state in the log. An OSD mode label indicating an RTH request is not proof that navigation successfully engaged.
