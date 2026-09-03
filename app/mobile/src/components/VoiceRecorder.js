import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { COLORS } from '../utils/constants';

export default function VoiceRecorder({ onRecorded }) {
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);

  async function startRecording() {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return Alert.alert('Microphone permission is required');
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Could not start recording', err.message);
    }
  }

  async function stopRecording() {
    try {
      setIsRecording(false);
      const recording = recordingRef.current;
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;
      onRecorded?.(uri);
    } catch (err) {
      Alert.alert('Could not stop recording', err.message);
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, isRecording && styles.recording]}
      onPressIn={startRecording}
      onPressOut={stopRecording}
    >
      <Text style={styles.icon}>{isRecording ? '● Recording…' : '🎙'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recording: { backgroundColor: COLORS.danger, borderColor: COLORS.danger },
  icon: { fontSize: 16 },
});
