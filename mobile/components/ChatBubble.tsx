import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../constants/theme';

type Props = {
  text?: string;
  isMine: boolean;
  timestamp?: string;
};

export default function ChatBubble({ text, isMine, timestamp }: Props) {
  return (
    <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
      <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
        <Text style={[styles.text, isMine && styles.textMine]}>{text}</Text>
        {!!timestamp && <Text style={styles.time}>{new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', marginVertical: 4, paddingHorizontal: spacing.md },
  rowMine: { justifyContent: 'flex-end' },
  rowTheirs: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '78%', padding: spacing.sm, borderRadius: radius.md },
  bubbleMine: { backgroundColor: colors.primary, borderBottomRightRadius: 2 },
  bubbleTheirs: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 2 },
  text: { fontSize: 14, color: colors.text },
  textMine: { color: colors.white },
  time: { fontSize: 10, color: colors.muted, marginTop: 4, alignSelf: 'flex-end' },
});
