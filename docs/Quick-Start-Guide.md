# Quick Start

## Get the Quicksilver Configurator

Use the [develop configurator](https://config.bosshobby.com/develop/) with firmware from `develop`. The [release configurator](https://config.bosshobby.com/) follows the release line. Desktop downloads are available from [Configurator releases](https://github.com/BossHobby/Configurator/releases); choose the asset for your operating system and CPU architecture.

The web configurator needs USB and serial access. Use a supported browser such as desktop Chrome or Edge, or the desktop application if the browser reports that it is unsupported.

## Before flashing

Export your profile from **Profile** before an upgrade. Firmware changes can reset settings; check the restored configuration before using the craft. See [Upgrading](Upgrading.md) for backup contents and migration checks.

**SPI receivers are disabled in current v2 develop builds.** Confirm that the craft has a supported UART receiver before upgrading; an onboard UART receiver is supported, but an SPI-only receiver cannot receive controls on this firmware.

!!! warning

    Remove propellers before flashing or configuring powered motors. Turn the transmitter off before entering the bootloader if the receiver prevents your board from entering DFU mode.

## Flashing firmware

The **Firmware** panel is on the disconnected welcome page. Disconnect from the normal configuration session to return there. Flashing uses the bootloader connection; **Connect** opens a normal serial configuration session instead.

1. Put the controller in DFU (bootloader) mode. Hold its boot button while plugging in USB, or use **Reset to bootloader** in the Firmware panel and select the controller's serial port.
2. Choose a **Source**:

    | Source | Use |
    | --- | --- |
    | Release | A published firmware release |
    | Development Branch | A branch build; select `develop` for these docs |
    | Pull Request | An available pull request build |
    | Local | A `.hex` file you built or downloaded |

3. Select the release, branch or pull request. Branch and pull request builds display their **Commit** so you can identify the firmware being flashed.
4. Select **Vehicle** (`Multi`, `Rover` or `Wing`) when offered, then search for and select your exact **Target**. The target list is filtered by vehicle support. A target containing an SPI receiver definition does not enable that receiver in v2.
5. Click **Flash firmware**, select the bootloader device when prompted, and wait for completion.
6. Power-cycle the controller, click **Connect**, and choose its normal serial port.

Current builds combine firmware for a vehicle/MCU with a runtime target describing the board. The configurator injects the selected target while flashing remote builds. For **Local**, use a board-specific HEX containing the correct target; the local-file flow does not offer target injection. See [Development](About/Development.md#building-firmware).

Vehicle selection is part of the firmware build. Loading a profile or changing a target's supported-vehicle list does not turn a multirotor build into a wing or rover build.

If flashing fails, reconnect while holding the boot button and retry with the correct target. See [Troubleshooting](Troubleshooting.md) if no bootloader or serial device appears.

Continue with [Configuring Quicksilver](Configuring-Quicksilver.md).
