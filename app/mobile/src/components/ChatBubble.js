import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export default function ChatBubble({ message, isOwn }) {
  return (
    <View style={[styles.row, isOwn ? styles.rowOwn : styles.rowOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
        {message.type === 'voice' && (
          <Text style={[styles.voiceTag, isOwn && styles.textOwn]}>🎙 Voice message</Text>
        )}
        <Text style={isOwn ? styles.textOwn : styles.textOther}>{message.displayText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 4, paddingHorizontal: 10 },
  rowOwn: { justifyContent: 'flex-end' },
  rowOther: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '78%', borderRadius: 14, paddingVertical: 8, paddingHorizontal: 12 },
  bubbleOwn: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderBottomLeftRadius: 4 },
  textOwn: { color: '#fff' },
  textOther: { color: COLORS.text },
  voiceTag: { fontSize: 11, marginBottom: 2, opacity: 0.8 },
});
