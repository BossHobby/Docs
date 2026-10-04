# Development

These docs follow the `develop` branches of [QUICKSILVER](https://github.com/BossHobby/QUICKSILVER/tree/develop) and [Configurator](https://github.com/BossHobby/Configurator/tree/develop). Use matching branches when changing configuration or protocol interfaces.

This update was checked against firmware `bc194da4` and configurator `937a545`. Recheck the relevant source when updating development behavior.

## Building firmware

Install PlatformIO, clone the firmware repository and select `develop`:

```shell
git clone --branch develop https://github.com/BossHobby/QUICKSILVER.git
cd QUICKSILVER
pio run -e multi-stm32g473
```

Environment names include a vehicle prefix: `multi-`, `rover-` or `wing-`. MCU environments build generic firmware. Board environments also inject the board's runtime target, for example:

```shell
pio run -e multi-befh-betafpvg473_v2
```

The pre-build script fetches generated target files into `targets/`. The generated `targets/_index.ini` lists board environments; `platformio.ini` lists MCU, simulator and test environments. If a fresh checkout does not yet recognize a board environment, build an MCU environment first to fetch targets, then retry.

Normal build products are in `.pio/build/<environment>/`, including `firmware.hex`. A board build embeds its target in the configuration section. Use that board-specific HEX for the configurator's Local flashing flow.

Development branches use the generated `targets-develop` branch by default; `master` uses `targets`. Set `TARGETS_BRANCH` to select a different generated target branch. Use `SKIP_TARGETS_CHECKOUT=1` only when deliberately building against an existing local target checkout.

### Native tests and simulators

Run the vehicle-specific test environments:

```shell
pio test -e multi-test -e rover-test -e wing-test
```

For a focused shared suite, append `--filter test_common`. Other suites include `test_pid`, multirotor `test_navigation`, `test_rover` and `test_wing`. Simulator environments are `multi-simulator`, `rover-simulator` and `wing-simulator`.

Native tests do not verify hardware timing, output wiring, MCU stack margins or flight behavior. Include the relevant hardware checks when changing these areas.

## Source layout

| Path | Responsibility |
| --- | --- |
| `src/core/` | Startup, tasks, profile/target persistence and faults |
| `src/control/` | Shared control, IMU, PID, gestures and navigation |
| `src/control/multi/`, `rover/`, `wing/` | Vehicle controllers |
| `src/driver/` | Sensors and peripheral drivers |
| `src/io/` | QUIC/MSP, USB, GPS, battery, VTX and Blackbox |
| `src/rx/` | Receiver protocols and input processing |
| `src/osd/` | OSD rendering and menus |

Firmware uses FreeRTOS with a Flight task and separate IO, OSD, Blackbox and USB workers. Keep flight-loop work bounded; configuration and storage operations must respect the owning task and synchronization rules. Read the firmware repository's `AGENTS.md` before changing these interfaces.

## Adding a runtime configuration variable

1. Add the field to the appropriate structure in [src/core/profile.h](https://github.com/BossHobby/QUICKSILVER/blob/develop/src/core/profile.h) and its serialization `*_MEMBERS` definition. Check the vehicle-specific profile member lists if adding a section.
2. Add its default in `src/core/profile.cpp` and implement its behavior in the owning subsystem.
3. Update matching Configurator types, defaults, controls and tooltips. The configurator exchanges CBOR over **QUIC**; its definitions are in `src/store/serial/quic.ts`, and firmware handling is in `src/io/quic.cpp`.
4. Review profile-version compatibility and off-device migration for released formats. Do not assume an older saved layout can be reused unchanged.
5. Build the affected vehicle environments and test serialization plus the behavior the setting controls.

The serialization macros expose a value through the protocol; they do not create its configurator UI or implement its runtime behavior.

## Runtime targets

Hardware descriptions originate in [BossHobby/Targets](https://github.com/BossHobby/Targets). Its schema/types and generated YAML must agree with firmware `src/core/target.h` and Configurator target types.

Target YAML defines board hardware and may provide initial serial, receiver and VTX defaults. Its `vehicles` list describes which builds can use the board; vehicle selection is compiled into firmware. Output capabilities belong to the target, while output routing and mixer rules belong to the profile.

The build scripts encode target YAML as CBOR and inject it into `.config_flash`. Verify a new target's sensor orientation, serial wiring and motor/servo pins on hardware before distributing it.

## Creating a template

Templates live in [BossHobby/Templates](https://github.com/BossHobby/Templates). Create a directory under the appropriate `setup/` or `tune/` category containing:

- `profile.yaml`: an exported profile trimmed to only the settings the template should change.
- `index.yaml`: the template's `name` and `desc`.
- `image.jpg`: an image of the craft or setup.

For example, the metadata file contains:

```yaml
name: Example craft
desc: Setup for the specified board, receiver and motor arrangement
```

Verify that the profile matches the intended firmware and vehicle, then submit the template directory in a pull request.

## Building these docs

Install the pinned dependencies and build with strict validation:

```shell
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/mkdocs build --strict
```

Use relative links and image paths so pages also work under `/develop/` and feature-branch deployments. Run `.venv/bin/mkdocs serve` to preview locally. See the repository README for deployment details.
