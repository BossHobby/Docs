# QUICKSILVER documentation

QUICKSILVER is firmware for multirotors, rovers and fixed-wing aircraft. These docs cover the **v2 development line on `develop`** and the matching [develop configurator](https://config.bosshobby.com/develop/). The v1 release line continues on `master`; its interface and available features differ.

[Quick Start](Quick-Start-Guide.md){ .md-button .md-button--primary }
[Open configurator](https://config.bosshobby.com/develop/){ .md-button }

Supported MCU builds include STM32 F405, F411, F722, F745, F765, G473 and H743, plus AT32 F435 and F435M. Select your exact board from the configurator's target list: an MCU match alone does not identify its wiring, sensors or supported vehicles.

- [Quick Start](Quick-Start-Guide.md): choose firmware, flash your controller and connect.
- [Controller Setup](Configuring-Quicksilver.md): configure and verify orientation, radio, outputs and operating modes.
- [Rates, PID and Filters](Tuning.md): adjust control response after setup.
- [Features](Features.md): understand flight modes, filters, receivers, OSD and recording.
- [Navigation](Navigation.md): configure GPS and multirotor return-to-home.
- [Troubleshooting](Troubleshooting.md): resolve connection, arming and setup problems.

For source builds and contributions, see [Development](About/Development.md).

For language models and other tools, use [llms.txt](llms.txt) for the document index or [llms-full.txt](llms-full.txt) for the complete text. Read the [scope, vehicle capabilities and source revisions](Scope-and-Reference.md) before applying a procedure.
