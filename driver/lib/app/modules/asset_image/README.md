# asset-image

## Integrate with your tools
Add this in your .git modules

[submodule "asset-image"]
path = lib/app/modules/asset
url = http://192.168.10.21/flutter/libs/asset-image.git

Now clone using
bash scripts/clone-submodules.sh

Now Add the path to .gitignore file
lib/app/modules/asset


## Name
Asset

## Description
This guide demonstrates how to implement the Asset image widget in your Flutter project using the GetX state management system.
Features

    Easily configurable asset images.


## Usage
Asset image use easily in your class for fetch and display asset image as below.
Asset image can be customize with arguments like radiusAll, imageFitType, imageHeight ,imageWidth and color.
Give radius to the image using radiusAll & give radius to the single corner using radiusTopLeft, radiusTopRight, radiusBottomLeft, radiusBottomRight.

AssetImageWidget(
imageUrl: 'YOUR_ASSET_IMAGE_PATH',
imageWidth: height_200,
imageHeight: height_200,
imageFitType: imageFitType: BoxFit.cover,
)





