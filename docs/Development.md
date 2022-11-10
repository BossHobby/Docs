## Adding a new runtime configuration variable

add a new member to the [profile struct](https://github.com/BossHobby/QUICKSILVER/blob/master/src/main/config/profile.h), both in the struct itself and in the appropriate *_MEMBERS define.

this will make it available in the variable `profile.your.variable` for you to switch on in the codebase and automatically generate the cbor encoding/decoding code to expose it via usb.