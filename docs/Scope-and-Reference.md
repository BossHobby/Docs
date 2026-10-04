# Scope and source reference

These docs describe the **QUICKSILVER v2 development line**, checked against firmware `bc194da41531cca3f61ff23c9c09c7f3ad368c3c` and Configurator `937a5456c6353073a127fffca96750220a1db67f` on their `develop` branches. They are not a specification of the v1/master release line or unmerged feature branches.

## Reading this documentation

- A **generic default** is the value in firmware source. Target defaults, templates and restored profiles can change the value on a particular controller.
- A configurator field being visible does not prove the selected vehicle implements that behavior. Use the vehicle scope below.
- SPI receiver drivers remain in the repository but are disabled in current v2 builds. UART receivers, including onboard UART ExpressLRS, are supported. Source presence is not evidence of an enabled build feature.
- Firmware behavior, configurator UI labels and file-format versions are separate facts. Where old tooltips disagree with the implementation, these docs follow the checked implementation.
- Setup procedures describe intended use. Source/native-test coverage is not a claim of hardware or flight validation for every target.
- For a newer build, verify behavior against its source before treating the values or limits here as unchanged.

## Vehicle capability matrix

| Capability | Multi | Wing | Rover |
| --- | --- | --- | --- |
| Primary control | Multirotor motor mixing | Throttle and control surfaces | Drive and steering |
| Default mode with mode switches off | Acro/Rate | Manual | Manual |
| Self-leveling | Level, Horizon, Race combinations | Level | No flight self-level mode |
| Rate stabilization | Acro/Rate | Acro | Rate Assist / Rate Throttle |
| Turtle | Yes, suitable DShot hardware required | No | No |
| Autotrim / Autolaunch | No | Yes | No |
| GPS and captured-home telemetry | Yes | Yes | Yes |
| Barometer relative altitude | With supported hardware | With supported hardware | With supported hardware |
| Return-to-home controller | Yes, GPS + valid home + barometer required | No | No |
| Automatic RTH landing | No; hovers near home | No RTH | No RTH |
| Throttle Boost / Torque Boost | Implemented | Shared fields may be visible; no wing boost implementation | No |
| Blackbox | With supported storage | With supported storage | With supported storage |
| Serial/UART receiver | Yes | Yes | Yes |
| SPI receiver | Disabled | Disabled | Disabled |

## Terminology and units

| Term or field | Meaning |
| --- | --- |
| Vehicle | Compile-time controller choice: Multi, Wing or Rover |
| Target | Board hardware description; its vehicle list declares compatibility |
| Profile | Operating configuration, including mixer/output routing |
| Firmware version | Release/development version; checked source declares `v2.0.0` |
| Profile version | Persisted/configuration schema; checked source uses `0.3.1` |
| QUIC version | Configurator wire protocol; checked source uses `0.2.10` |
| Blackbox version | Log data format; checked source uses `0.3.2` |
| UART | Serial hardware port; transmitter TX connects to peripheral RX and vice versa |
| AUX range | Raw receiver-channel activation range, displayed as 0–100%; stored as 0–65535 |
| Output weight | Contribution to a mix, expressed as a signed percentage |
| Output trim/min/max | Normalized thousandths; centered surface -1000/+1000 maps to 1000/2000 µs |
| RTH climb height | Meters added to altitude at activation, not an absolute height above launch |
| RTH return speed | UI: km/h; profile `rth_cruise_speed`: m/s |
| RTH throttle limits/hover | UI: percent; profile: 0–1 fractions |
| Voltage warning | Per-cell voltage, not total pack voltage |
| CRSF voltage telemetry | Filtered per-cell voltage in the checked implementation |
| OSD/navigation altitude | Barometer-based height relative to the launch reference |
| GPS telemetry altitude | GPS-derived altitude, a different reference/source |
| CPU load | System percentage 0–100; not loop duration |

## Source map

The links below are pinned to the revisions used for this update. Source paths also give maintainers a place to recheck behavior when develop changes.

Build feature availability is defined by [feature.h](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/config/feature.h), which explicitly disables SPI receivers pending interrupt-safety fixes. Check build gates before inferring support from a driver or UI field.

| Documentation topic | Firmware authority | Configurator authority |
| --- | --- | --- |
| Upgrade/profile compatibility | [profile.h](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/core/profile.h), [flash.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/core/flash.cpp) | [profile.ts](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/store/profile.ts), [ProfileMetadata.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/ProfileMetadata.vue) |
| Defaults and build environments | [config.h](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/config/config.h), [profile.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/core/profile.cpp), [platformio.ini](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/platformio.ini) | [Flash.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/Flash.vue) |
| Arming/failsafe | [control.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/control/control.cpp) | [AuxChannels.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/AuxChannels.vue) |
| Receiver and CRSF | [rx/](https://github.com/BossHobby/QUICKSILVER/tree/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/rx), [quic_crsf.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/io/quic_crsf.cpp) | [ReceiverSettings.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/ReceiverSettings.vue), [RCChannels.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/RCChannels.vue) |
| Outputs and vehicles | [output.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/control/output.cpp), [wing/control.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/control/wing/control.cpp), [rover/control.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/control/rover/control.cpp) | [OutputMapping.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/OutputMapping.vue), [motor.ts](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/store/motor.ts) |
| GPS/RTH | [navigation.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/control/navigation.cpp), [multi/navigation.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/control/multi/navigation.cpp) | [Navigation.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/Navigation.vue), [GPS.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/GPS.vue) |
| Video/OSD | [vtx.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/io/vtx.cpp), [osd/](https://github.com/BossHobby/QUICKSILVER/tree/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/osd) | [VTX.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/VTX.vue), [OSDElements.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/OSDElements.vue) |
| Filters/PID/battery | [pid.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/control/pid.cpp), [vbat.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/io/vbat.cpp) | [FilterSettings.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/FilterSettings.vue), [Voltage.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/panel/Voltage.vue) |
| Blackbox | [blackbox.h](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/io/blackbox.h), [blackbox.cpp](https://github.com/BossHobby/QUICKSILVER/blob/bc194da41531cca3f61ff23c9c09c7f3ad368c3c/src/io/blackbox.cpp) | [Blackbox.vue](https://github.com/BossHobby/Configurator/blob/937a5456c6353073a127fffca96750220a1db67f/src/views/Blackbox.vue) |

## Text exports for tools and language models

Every build provides [llms.txt](llms.txt), a page index with links to individual Markdown copies, and [llms-full.txt](llms-full.txt), the complete documentation in one text file. Exports are generated from the same source as this site.

Read this scope page before using isolated snippets. Preserve vehicle, hardware prerequisites, units and limitations when summarizing a procedure. A failed prerequisite such as missing home or barometer data changes what the controller can do.
