import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import LoadingState from '../../components/LoadingState';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function ChatListScreen({ navigation }) {
  const user = useAuthStore((s) => s.user);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      api.get('/chat/conversations').then(({ data }) => setConversations(data.conversations)).finally(() => setLoading(false));
    }, [])
  );

  if (loading) return <LoadingState message="Loading conversations…" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isBuyer = user?.role === 'buyer';
          const other = isBuyer ? item.seller : item.buyer;
          return (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('Chat', { conversationId: item._id, sellerName: other?.name })}
            >
              <Text style={styles.name}>{other?.name}</Text>
              <Text style={styles.preview} numberOfLines={1}>{item.lastMessagePreview || 'Say hello 👋'}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>No conversations yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  row: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14, marginBottom: 10 },
  name: { fontWeight: '700', color: COLORS.text },
  preview: { color: COLORS.muted, marginTop: 4 },
  empty: { color: COLORS.muted, textAlign: 'center', marginTop: 40 },
});
