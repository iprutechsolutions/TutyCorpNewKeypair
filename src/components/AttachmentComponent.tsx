import React, {useEffect} from 'react';
import {useState} from 'react';
import {Image} from 'react-native-elements';
import {addAttachmentImage, attachmentImg, deleteImg} from '../assets/images';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import PText from './PText';
import {Theme} from '../theme/ThemeProvider';
import DocumentPicker from 'react-native-document-picker';
import {FileItem} from '../models/FileItem';
import ImagePreviewModal from './ImagePreviewModel';
import i18n from '../../i18n';

interface AttachmentProps {
  theme: Theme;
  files: FileItem[];
  maxAllowed?: number;
}
interface ImageProps {
  id: string;
  uri: string;
}
const AttachmentComponent: React.FC<AttachmentProps> = ({
  theme,
  files,
  maxAllowed,
}) => {
  const MAX_ALLOWED_ATTACHMENTS = maxAllowed === undefined ? 4 : maxAllowed;
  const styles = generateStyles(theme);
  const [profiles, setProfiles] = useState<ImageProps[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState('');

  useEffect(() => {}, [profiles]);

  const generateFilenameWithMilliseconds = (filename: string) => {
    const timestamp = Date.now();
    const extension = filename.split('.').pop(); // Get file extension
    const filenameWithMilliseconds = `${timestamp}.${extension}`;
    return filenameWithMilliseconds;
  };

  const handlePreview = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleDelete = (uri: string) => {
    // Implement delete functionality here
    setModalVisible(false);
    setProfiles(profiles.filter(profile => profile.uri !== uri));
  };
  const openDocuments = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
        copyTo: 'cachesDirectory',
      });
      const uri = res.fileCopyUri;

      if (uri) {
        const id = String(profiles.length + 1);
        setProfiles([...profiles, {id, uri}]);
        const parts = uri.split('/');
        const fileName = parts[parts.length - 1];
        files.push({
          uri: uri,
          name: generateFilenameWithMilliseconds(fileName),
          type: 'image/jpeg',
        });
      } else {
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        // Handle other errors
        console.error(err);
      }
    }
  };

  const withAttachments = () => {
    return (
      profiles.length > 0 && (
        <View style={styles.wcontainer}>
          {profiles.length < MAX_ALLOWED_ATTACHMENTS && (
            <Image
              source={addAttachmentImage}
              style={styles.icon}
              onPress={openDocuments}
            />
          )}
          <ImagePreviewModal
            theme={theme}
            visible={modalVisible}
            imageURL={previewUri}
            onClose={handleClose}
            onDelete={handleDelete}
          />
          {profiles?.length > 0 && (
            <FlatList
              data={profiles}
              horizontal
              renderItem={({item}) => (
                <View style={styles.profileContainer}>
                  <Image
                    onPress={() => {
                      handlePreview();
                      setPreviewUri(item.uri);
                    }}
                    source={{uri: item.uri}}
                    style={styles.profileImage}
                  />
                </View>
              )}
              keyExtractor={item => item.uri}
            />
          )}
        </View>
      )
    );
  };

  const withoutAttachments = () => {
    return (
      <TouchableOpacity onPress={openDocuments}>
        <View style={styles.attachContainer}>
          <Image source={attachmentImg} style={styles.icon} />
          <PText style={styles.attachtext} theme={theme}>
            {i18n.t('attach_photos')}
          </PText>
        </View>
      </TouchableOpacity>
    );
  };
  return profiles.length === 0 ? withoutAttachments() : withAttachments();
};

const generateStyles = (theme: Theme) =>
  StyleSheet.create({
    attachtext: {
      marginLeft: 10,
    },
    attachContainer: {
      flexDirection: 'row',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      borderStyle: 'dashed',
    },
    icon: {
      width: 50,
      height: 50,
      marginRight: 10,
      marginLeft: 10,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'black',
      borderStyle: 'dashed',
    },
    wcontainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconImg: {
      width: 60,
      height: 60,
    },
    profileContainer: {
      margin: 5,
      gap: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.textcolor,
      borderRadius: 8, // Ensure the border radius is applied properly
    },
    profileImage: {
      width: 70,
      height: 70,
    },
  });
export default AttachmentComponent;
