#loader

## Integrate with your tools
Add this in your .git modules

[submodule "loader"]
path = lib/app/modules/loader
url = http://192.168.10.21/flutter/libs/loader.git

Now clone using
bash scripts/clone-submodules.sh

Now Add the path to 
.gitignore file lib/app/modules/loader

## Name
Custom Loader

## Description
This guide demonstrates how to implement the Custom Loader widget in your Flutter project using the GetX state management system.


## Usage
A Custom loader widget is a loading effect that is generally added as an extra effect to your app's screen If something takes time to be loaded on the screen.

CustomLoader customLoader = CustomLoader();

To show custom loader
customLoader.show(Get.context);

To hide custom loader
customLoader.hide();
