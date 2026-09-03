import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import ChatBubble from '../../components/ChatBubble';
import VoiceRecorder from '../../components/VoiceRecorder';
import LoadingState from '../../components/LoadingState';
import { COLORS } from '../../utils/constants';
import api from '../../services/api';
import { useSocket } from '../../hooks/useSocket';
import { getSocket } from '../../services/socket';
import { useAuthStore } from '../../store/authStore';

export default function ChatScreen({ route, navigation }) {
  const { conversationId, sellerName } = route.params;
  const user = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  useEffect(() => {
    navigation.setOptions?.({ title: sellerName || 'Chat' });
  }, []);

  const onNewMessage = useCallback(
    (msg) => {
      const lang = user?.preferredLanguage || 'en';
      setMessages((prev) => [...prev, { ...msg, displayText: msg.translations?.[lang] || msg.transcript }]);
    },
    [user]
  );

  useSocket(onNewMessage, conversationId);

  useEffect(() => {
    api
      .get(`/chat/conversations/${conversationId}/messages`, { params: { lang: user?.preferredLanguage || 'en' } })
      .then(({ data }) => setMessages(data.messages))
      .finally(() => setLoading(false));
  }, [conversationId]);

  async function sendText() {
    if (!text.trim()) return;
    const socket = await getSocket();
    socket.emit('message:send', { conversationId, type: 'text', text }, () => {});
    setText('');
  }

  async function sendVoice(uri) {
    // In production this would upload the audio file first (multipart) and
    // pass the resulting server-side path here for transcription/translation.
    const socket = await getSocket();
    socket.emit('message:send', { conversationId, type: 'voice', audioPath: uri }, () => {});
  }

  if (loading) return <LoadingState message="Opening conversation…" />;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item, idx) => item._id || String(idx)}
        renderItem={({ item }) => <ChatBubble message={item} isOwn={String(item.sender) === String(user?.id)} />}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <VoiceRecorder onRecorded={sendVoice} />
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendText}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 8,
  },
  input: { flex: 1, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  sendButton: { backgroundColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  sendText: { color: '#fff', fontWeight: '700' },
});
