import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Assuming you're using i18n-js for localization

const useBookData = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://dev.iqrakitab.net/API/books');
        setBooks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return { books, loading };
};

const App = () => {
  const { t, i18n } = useTranslation(); // Initialize i18n
  const { books, loading } = useBookData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRTL, setIsRTL] = useState(false);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleRTL = () => {
    setIsRTL(!isRTL);
    // Toggle language between English and Urdu
    i18n.changeLanguage(isRTL ? 'en' : 'ur');
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.title}</Text>
      {/* Add more details if needed */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toggleButton}>
        <Button title={isRTL ? t('Right to Left') : t('Left to Right')} onPress={toggleRTL} />
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder={t('Search by book name')}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {loading ? (
        <Text>{t('Loading...')}</Text>
      ) : (
        <FlatList
          data={filteredBooks}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 20,
  },
  toggleButton: {
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;