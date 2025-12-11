# BuzzGrab

## How to Use
The objective of this project is to design and develop a complete Alcohol Delivery Management System that
includes a customer mobile application, driver mobile application, and an admin web panel. The system aims
to streamline online ordering, secure age-verified alcohol delivery, real-time order tracking, efficient driver
management, and end-to-end operational visibility. By providing a seamless user experience, automated de-
livery workflows, accurate inventory control, and strong compliance tools, the platform will enable smooth
business operations while ensuring safety, transparency, and convenience for all users involved.

**Step 1:**

Download or clone this repo by using the link below:

```
	http://192.168.10.30/flutter/buzzgrab-flutter-2300
```

**Step 2:**

Go to project root and execute the following command in console to get the required dependencies:

```
flutter pub get 

```
**Step 3:**

Open terminal and run following command:

```
flutter packages pub run build_runner build

```

## Build With flutter

for android

```
flutter build apk --release
```

for ios

```
flutter build ios

```

Base over getx with MVC Architecture

#### MVC Architecture

- `Model`[data]
- `View` [ui]
- `Controller`[logic & operation]

#### Flow of The App

- `Binding` [It binds the Controller, Provider and Repository in self to observe changes]
- `GetMaterialAPP` [GetMaterialController]
- `Controller` [Invoke API]
- `Repository` [Fired and return response or error]
- `Provider` [Set data in model]
- `Controller` [update dependencies]

#### Http Response Codes Summary
    200: OK. Everything worked as expected.
    201: A resource was successfully created in response to a POST request. The Location header contains the URL pointing to the newly created resource.
    204: The request was handled successfully and the response contains no body content (like a DELETE request).
    304: The resource was not modified. You can use the cached version.
    400: Bad request. This could be caused by various actions by the user, such as providing invalid JSON data in the request body, providing invalid action parameters, etc.
    401: Authentication failed.
    403: The authenticated user is not allowed to access the specified API endpoint.
    404: The requested resource does not exist.
    405: Method not allowed. Please check the Allow header for the allowed HTTP methods.
    415: Unsupported media type. The requested content type or version number is invalid.
    422: Data validation failed (in response to a POST request, for example). Please check the response body for detailed error messages.
    429: Too many requests. The request was rejected due to rate limiting.
    500: Internal server error. This could be caused by internal program errors.

## Authors

```
 @copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
 @author     : Shiv Charan Panjeta < shiv@toxsl.com >
 All Rights Reserved.
 Proprietary and confidential :  All information contained herein is, and remains
 the property of ToXSL Technologies Pvt. Ltd. and its partners.
 Unauthorized copying of this file, via any medium is strictly prohibited.
```

###### How to import flutter base module in .gitmodules file

**Example for .gitmodule file**

```
[submodule "logger"] 
path = module/logger
url  = http://192.168.10.21/flutter/libs/logger.git

```

**- Importing base module -**

````
Download or clone this repo (path :- //workspace) by using the link below:

````

**- http://192.168.10.21/common/scripts.git -**

` git clone command ` **- git clone http://192.168.10.21/common/scripts.git -**

````
After cloning the scripts repository, execute the following command from the root directory of the project to clone the submodules:

````

**- bash scripts/clone-submodules.sh -**


````
git-sync-all -- This command is used to synchronize and reflect the latest changes from the base modules [on Repository] in your imported modules.

````
**- bash scripts/git-sync-all.sh -**


**------------/ **