## nointernet

cd existing_repo

git remote add origin http://192.168.10.21/flutter/libs/nointernet.git

git branch -M main

git push -uf origin main


## Integrate with your tools

Add this in your .git modules

[submodule "nointernet"]

path = lib/app/modules/nointernet

url = http://192.168.10.21/flutter/libs/nointernet.git

Now clone using

bash scripts/clone-submodules.sh

## Name

Internet Connectivity Check

## Description

This guide demonstrates how to implement the no internet module in your Flutter project using the
GetX state management system.
Features:-

    Easily configurable and real time internet connection availability.

## Usage

This module helps your app gracefully handle situations where you don't have an internet connection.

**Key Benefits:**

* Prevents frustrating error messages.
* Retry button Triggers.
* Provides clear indication to the user about the connection status.

add this in main.dart file
DependencyInjection.init();

