import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {getImagesByTicketId} from '../services/images.api';
import ImagePreviewModal from './ImagePreviewModel';
import {Theme} from '../theme/ThemeProvider';

const ImagesList = ({
  ticketId,
  theme,
}: {
  ticketId: string | number;
  theme: Theme;
}) => {
  const [images, setImages] = useState<string[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const [previewUri, setPreviewUri] = useState('');
  useEffect(() => {
    (async () => {
      const response = await getImagesByTicketId(ticketId);
      if (response) {
        setImages(response);
      }
    })();
  }, []);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
          setPreviewUri(item);
        }}>
        <View style={styles.container}>
          <Image source={{uri: item}} style={styles.image} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {images && images?.length > 0 && (
        <View style={styles.container}>
          <ImagePreviewModal
            theme={theme}
            visible={modalVisible}
            imageURL={previewUri}
            onClose={() => {
              setModalVisible(false);
            }}
            onDelete={null}
          />
          <FlatList
            data={images}
            renderItem={renderItem}
            keyExtractor={item => item.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    resizeMode: 'cover',
  },
});
export default ImagesList;
