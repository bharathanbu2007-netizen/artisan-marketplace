import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { colors, radius, spacing } from '../../constants/theme';

export default function ConversationsList() {
  const { conversations, fetchConversations } = useChatStore();
  const user = useAuthStore((s) => s.user);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations().catch((err) => {
      console.error('[ConversationsList] load failed:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to load conversations.');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const other = item.participants.find((p: any) => p._id !== user?.id);
          return (
            <TouchableOpacity style={styles.row} onPress={() => router.push(`/chat/${item._id}`)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{other?.name?.[0]?.toUpperCase() || '?'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{other?.name || 'User'}</Text>
                <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={{ color: colors.muted }}>No conversations yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.md },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.sm, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  avatarText: { fontWeight: '700', color: colors.primaryDark },
  name: { fontWeight: '700', color: colors.text },
  lastMessage: { color: colors.muted, fontSize: 13 },
  errorText: { textAlign: 'center', color: '#B3261E', marginBottom: spacing.sm, fontWeight: '600' },
});
