'use strict';

import { NativeModules } from 'react-native';
const RCTCameraRollManager = NativeModules.RNCameraRollAndroid;
const invariant = require('fbjs/lib/invariant');

const GROUP_TYPES_OPTIONS = {
  Album: 'Album',
  All: 'All',
  Event: 'Event',
  Faces: 'Faces',
  Library: 'Library',
  PhotoStream: 'PhotoStream',
  SavedPhotos: 'SavedPhotos', // default
};

const ASSET_TYPE_OPTIONS = {
  All: 'All',
  Videos: 'Videos',
  Photos: 'Photos',
};

type GetPhotosParams = {
  first: number,
  after?: string,
  groupTypes?: $Keys<typeof GROUP_TYPES_OPTIONS>,
  groupName?: string,
  assetType?: $Keys<typeof ASSET_TYPE_OPTIONS>,
  mimeTypes?: Array<string>,
};

type GetPhotosReturn = Promise<{
  edges: Array<{
    node: {
      type: string,
      group_name: string,
      image: {
        uri: string,
        height: number,
        width: number,
        isStored?: boolean,
        playableDuration: number,
      },
      timestamp: number,
      location?: {
        latitude?: number,
        longitude?: number,
        altitude?: number,
        heading?: number,
        speed?: number,
      },
    },
  }>,
  page_info: {
    has_next_page: boolean,
    start_cursor?: string,
    end_cursor?: string,
  },
}>;

/**
 * `CameraRoll` provides access to the local camera roll or photo library.
 *
 * See https://facebook.github.io/react-native/docs/cameraroll.html
 */
class CameraRoll {
  static GroupTypesOptions: Object = GROUP_TYPES_OPTIONS;
  static AssetTypeOptions: Object = ASSET_TYPE_OPTIONS;

  /**
   * `CameraRoll.saveImageWithTag()` is deprecated. Use `CameraRoll.saveToCameraRoll()` instead.
   */
  static saveImageWithTag(tag: string): Promise<string> {
    console.warn(
      '`CameraRoll.saveImageWithTag()` is deprecated. Use `CameraRoll.saveToCameraRoll()` instead.',
    );
    return this.saveToCameraRoll(tag, 'photo');
  }

  static deletePhotos(photos: Array<string>) {
    return RCTCameraRollManager.deletePhotos(photos);
  }

  /**
   * Saves the photo or video to the camera roll or photo library.
   *
   * See https://facebook.github.io/react-native/docs/cameraroll.html#savetocameraroll
   */
  static saveToCameraRoll(
    tag: string,
    type?: 'photo' | 'video',
  ): Promise<string> {
    invariant(
      typeof tag === 'string',
      'CameraRoll.saveToCameraRoll must be a valid string.',
    );

    invariant(
      type === 'photo' || type === 'video' || type === undefined,
      `The second argument to saveToCameraRoll must be 'photo' or 'video'. You passed ${type ||
      'unknown'}`,
    );

    let mediaType = 'photo';
    if (type) {
      mediaType = type;
    } else if (['mov', 'mp4'].indexOf(tag.split('.').slice(-1)[0]) >= 0) {
      mediaType = 'video';
    }

    return RCTCameraRollManager.saveToCameraRoll(tag, mediaType);
  }

  /**
   * Returns a Promise with photo identifier objects from the local camera
   * roll of the device
   *
   * See https://facebook.github.io/react-native/docs/cameraroll.html#getphotos
   */
  static getPhotos(params: GetPhotosParams): GetPhotosReturn {
    if (arguments.length > 1) {
      console.warn(
        'CameraRoll.getPhotos(tag, success, error) is deprecated.  Use the returned Promise instead',
      );
      let successCallback = arguments[1];
      const errorCallback = arguments[2] || (() => {});
      RCTCameraRollManager.getPhotos(params).then(
        successCallback,
        errorCallback,
      );
    }
    // TODO: Add the __DEV__ check back in to verify the Promise result
    return RCTCameraRollManager.getPhotos(params);
  }
}

module.exports = CameraRoll;
