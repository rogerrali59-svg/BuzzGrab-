# network-image

```
cd existing_repo
git remote add origin http://192.168.10.21/flutter/libs/network-image.git
git branch -M main
git push -uf origin main
```

## Integrate with your tools
Add this in your .git modules

[submodule "network_image"]
path = lib/app/modules/network_image
url = http://192.168.10.21/flutter/libs/network-image.git

Now clone using
bash scripts/clone-submodules.sh


## Name
network image

## Description
This guide demonstrates how to implement the Network image widget in your Flutter project using the GetX state management system.
Features

    Easily configurable network images.

    Uses FancyShimmerImage library for shimmer effect on image rendering.
    FancyShimmerImage library path : https://pub.dev/packages/fancy_shimmer_image

 
## Usage
Network image use easily in your class for fetch and display network image as below.
Network image can be customize with arguments like radius, imageFitType ,placeHolder, color , imageHeight ,imageWidth and color.

NetworkImageWidget(
imageurl: 'YOUR_NETWORK_IMAGE_PATH',
imageWidth: height_200,
imageHeight: height_200,
) 