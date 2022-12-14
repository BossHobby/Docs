Connect via usb as for flashing. Press the **_CONNECT_** button and select the offered port in the pop up window. Once connected you will be in the Profile tab.

Occasionally on a Windows pc the serial port doesn't show up. If this happens firstly make sure you have power cycled the fc by replugging the usb. If that doesn't work refer to the [Troubleshooting Page](/Troubleshooting/).

Every time you make a change on a tab remember to click **_APPLY_** before leaving the tab. There will always be a confirmation pop up after successfully applying changes.

## Quick Setup

1. Name your craft
2. Make any uart changes needed to get smartadio and serial rx to work.
3. Adjust Dshot, Digital Idle and prop direction to suit.
4. Set up rates and expo and load PID profiles. Filter adjustments should be made after a test flight, defaults are safe.
5. If you are using a serial connected rx (uart) it will autodetct the protocol, turn on your tx and bind. Save the bind with up,up,up on the pitch stick followed by down,down,down.
6. Set Aux channels and flight modes remembering that Quicksilver uses two position switch logic, high or low. Arm is already set on CH5. (Racemode and Horizon mode both require Angle to be active) If no other flight modes are set it will be in Acro/Rate mode only.
7. Set up OSD.
8. Check motor direction and order (props off)
9. Test fly
10. Enjoy 👍

More detail is available below on the contents of each tab.

## Profile

Here is where you save profile information or load a saved profile. You can also name the craft and see what firmware is on it.

Profiles are saved as .yaml files and can be edited in a code editor.

We will supply template profiles for some bnf models [here](https://github.com/BossHobby/Templates)
These are available within the configurator and are applied after flashing your target.

<img src="/assets/img/QS_profile.png" width=100%>

## Setup

In this tab are the basic hardware settings for the flight controller and anything attatched to uarts.

Smart Audio for the vtx will show here.

Select the uart your rx is attached to as well as the Smart Audio connection if applicable. There is an HDZero option here also.

The **_REFRESH_** button should cause the vtx settings to show up.

<img src="/assets/img/QS_setup_1.png" width=100%>
<img src="/assets/img/QS_setup_2.png" width=100%>

## Rates

Rates, PIDs and Filters are all set here.

### Stick Rates

<img src="/assets/img/QS_rates_1.png" width=100%>
Choose Silverware rates (default) or Betaflight rates or Actual rates.
Two rate profile settings are available.

### Throttle Settings

<img src="/assets/img/QS_rates_2.png" width=100%>

### PID

<img src="/assets/img/QS_rates_3.png" width=100%>

There are two slots to save a PID profile, choose the preset that most closely matches your craft from the drop down menu and **_LOAD_**

### Filter

<img src="/assets/img/QS_rates_4.png" width=100%>
A given fitler pass can be disabled by setting the `Type` to `None`. For example a single gyro filter can be achieved by setting the `Gyro Pass 2 Type` to `None`.  
Unless otherwise recommended we advise leaving most of the settings here at default values and asking in the [Discord](https://discord.gg/wvWBymAxRH) server before changing.

## Receiver

As long as a uart is set for serial connected rx or an spi integrated rx is used the firmware will detect the correct protocol.  
(Some flight controllers may need a lipo connected to power the rx)

Once bound to the tx it will show here and bind information can be saved using "stick gesture" up-up-up followed by down-down-down.

Expresslrs users can enter the bind phrase here if necessary.

<img src="/assets/img/QS_receiver_1.png" width=100%>
<img src="/assets/img/QS_receiver_2.png" width=100%>

### Aux Channels

Aux switches are only two way, high or low in Quicksilver.  
You must set an arm switch, Levelmode is required for both Horizon and Racemode to work.  
If only Arm is set you will be in Acro/Rate mode.  
To find out about other features operated by Aux channels check [Features](/Features/)

<img src="/assets/img/QS_receiver_3.png" width=100%>

## OSD

Select and move various elements and alter callsign.

<img src="/assets/img/QS_osd_1.png" width=100%>
<img src="/assets/img/QS_osd_2.png" width=100%>

## Motor

!!! warning

    **REMOVE PROPS BEFORE ACTIVATING ANYTHING ON THIS TAB**

A lipo will need to be connected for most of the functions to work.

If your flight controller is in any orientation other than standard you can set the motor pins here.
Use the **_Motor Test_** function to check position and rotation.
If the direction of rotation needs changed the **_Esc Settings_** function will allow this.

<img src="/assets/img/QS_motor_1.png" width=100%>

## State

Live information in time based graphs of many inputs and outputs from the flight controller.

Use to check correct operation of rc inputs from your TX and to monitor gyro and accelerometer values.

<img src="/assets/img/QS_state_1.png" width=100%>
