# react-native-camera-roll-android

[Documentation](https://facebook.github.io/react-native/docs/cameraroll)

#### Why?

Fixed issue https://github.com/facebook/react-native/issues/20112

#### Supports
Android

### Installation
```
react-native link react-native-camera-roll-android
```
#### Manual
`android/settings.gradle`:
settings.gradle
```diff
+ include ':react-native-camera-roll-android'
+ project(':react-native-camera-roll-android').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-camera-roll-android/android')

```

`android/app/build.gradle`:

```diff
dependencies {
...
+   implementation project(':react-native-camera-roll-android')
...
}
```

`android/app/src/.../MainApplication.java`:

```diff
dependencies {
...
import android.app.Application;
...
+import me.naxel.RNCameraRollAndroid.RNCameraRollAndroidPackage;
...
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
+            new RNCameraRollAndroidPackage(),
...
      );
    }
```


### Using
```js
import { CameraRoll as CameraRollIOS, Platform } from "react-native";
import CameraRollAndroid from 'react-native-camera-roll-android';

if (Platform.OS === 'android') {
  CameraRoll = CameraRollAndroid;
} else {
  CameraRoll = CameraRollIOS;
}
```
