import React, {useContext, useState} from 'react';
import {View, Modal, Image, Button, StyleSheet, Platform} from 'react-native';
import PText from './PText';
import theme from '../theme/theme';
import i18n from '../../i18n';
import RNFetchBlob from 'rn-fetch-blob';
import {AuthContext} from '../store/auth-context';
import {showFailureToast} from './Toast';

const ImagePreviewModal = ({visible, imageURL, onClose, onDelete, theme}) => {
  const authCtx = useContext(AuthContext);
  const isStaff = authCtx?.isStaff;

  let newImgUri = imageURL?.lastIndexOf('/');
  let imageName = imageURL?.substring(newImgUri);

  let dirs = RNFetchBlob.fs.dirs;
  let path =
    Platform.OS === 'ios'
      ? dirs['MainBundleDir'] + imageName
      : dirs.PictureDir + imageName;

  function isImageURL(url: string): boolean {
    // List of common image file extensions
    const imageExtensions = [
      'jpg',
      'jpeg',
      'png',
      'gif',
      'bmp',
      'tiff',
      'webp',
      'svg',
    ];

    // Extract the extension from the URL
    const extension = url?.split('.')?.pop()?.toLowerCase();

    // Check if the extension is in the list of image extensions
    if (extension) {
      return imageExtensions.includes(extension);
    }
    return false;
  }

  const saveToGallery = () => {
    if (!isImageURL(imageURL)) {
      showFailureToast('Invalid image');
      onClose();
      return;
    }
    try {
      RNFetchBlob.config({
        fileCache: true,
        appendExt: 'png',
        indicator: true,
        IOSBackgroundTask: true,
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          description: 'Image',
        },
      })
        .fetch('GET', imageURL)
        .then(res => {
          console.log(res, 'end downloaded');
          onClose();
        })
        .catch(err => {
          showFailureToast('Failed to download');
          onClose();
        });
    } catch (err) {
      showFailureToast('Failed to save to gallery');
      onClose();
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <PText theme={theme}>{i18n.t('image_preview')}</PText>
          <View>
            <Image source={{uri: imageURL}} style={styles.image} />
          </View>
          <View style={styles.buttonContainer}>
            <PText style={styles.btn} theme={theme} onPress={onClose}>
              {i18n.t('cancel')}
            </PText>
            {isStaff && (
              <PText style={styles.btn} theme={theme} onPress={saveToGallery}>
                {i18n.t('download')}
              </PText>
            )}
            {onDelete && (
              <PText
                style={styles.btnd}
                theme={theme}
                onPress={() => {
                  if (onDelete) {
                    onDelete(imageURL);
                  }
                }}>
                {i18n.t('delete')}
              </PText>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  btn: {
    backgroundColor: theme.colors.gray,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: theme.colors.whitecolor,
  },
  btnd: {
    backgroundColor: theme.colors.primary,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: theme.colors.whitecolor,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 400,
    marginBottom: 20,
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    marginTop: 10,
  },
});

export default ImagePreviewModal;
