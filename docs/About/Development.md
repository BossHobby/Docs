## Adding a new runtime configuration variable

add a new member to the [profile struct](https://github.com/BossHobby/QUICKSILVER/blob/master/src/config/profile.h), both in the struct itself and in the appropriate *_MEMBERS define.

this will make it available in the variable `profile.your.variable` for you to switch on in the codebase and automatically generate the cbor encoding/decoding code to expose it via usb.  


## Creating a template
**All files must be named the same and begin either /tune or /setup**

* Set up the build to your requirements then save a profile. Edit the .yaml file to only contain the necessary settings for your template.
Save as `/the name of your template/profile.yaml`
* Create a new file with a line for name and a line for description like so
Start the first line with ***name:*** and the second line with ***desc:*** 
Save the file as `/the name of your template/index.yaml`
* Add an image .jpg and save as `/the name of your template/image.jpg`
* Commit this to the repository and create a pull request from the commit.