#!/bin/bash

# set -x

# printf "Hi, if you installed Android SDK, then: \n"
# printf "add this path to your system environment \n"
# printf "Local\\Android\\Sdk\\emulator \n"
export ANDROID_SDK=/home/android/sdk
export PATH=$PATH:$ANDROID_SDK/emulator
printf "========================================\n"
printf "You can see the list of Available virtual Devices Below:\n"
emulator -list-avds | cat -n
printf "Select AVD number: "
read index
avd=$(emulator -list-avds | sed "${index}q;d")
echo "Selected $avd"
emulator -netdelay none -netspeed full -avd $avd &disown &exit
#emulator -netdelay none -netspeed full @$avd
