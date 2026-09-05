import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { getSocket } from '../../services/socket';
import ChatBubble from '../../components/ChatBubble';
import { colors, radius, spacing } from '../../constants/theme';

export default function ConversationScreen() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const [text, setText] = useState('');
  const { messagesByConversation, fetchMessages, sendMessage, receiveMessage } = useChatStore();
  const user = useAuthStore((s) => s.user);
  const listRef = useRef<FlatList>(null);
  const messages = messagesByConversation[conversationId] || [];

  useEffect(() => {
    fetchMessages(conversationId);
    const socket = getSocket();
    const handler = (msg: any) => {
      if (msg.conversationId === conversationId) receiveMessage(msg);
    };
    socket?.on('message:new', handler);
    return () => {
      socket?.off('message:new', handler);
    };
  }, [conversationId]);

  const handleSend = () => {
    if (!text.trim() || !user) return;
    sendMessage({
      conversationId,
      senderId: user.id,
      receiverId: '', // resolved server-side from the conversation participants
      text,
      type: 'text',
    });
    setText('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item, idx) => item._id || String(idx)}
        renderItem={({ item }) => (
          <ChatBubble text={item.text} isMine={item.senderId === user?.id} timestamp={item.createdAt} />
        )}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message…"
          placeholderTextColor={colors.muted}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  inputRow: { flexDirection: 'row', padding: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'center' },
  input: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, height: 44, marginRight: spacing.sm },
  sendBtn: { backgroundColor: colors.primary, borderRadius: radius.pill, paddingHorizontal: 18, height: 44, alignItems: 'center', justifyContent: 'center' },
  sendText: { color: colors.white, fontWeight: '700' },
});
