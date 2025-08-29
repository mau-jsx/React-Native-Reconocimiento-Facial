import { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { RootStackParamList } from 'App';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Registro'>;

export default function FaceRegisterScreen({ navigation }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loadingFace, setLoadingFace] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [name, setName] = useState('');
  const [cuil, setCuil] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Animación de pulso para el botón de cámara
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  async function handleTakePhoto() {
    if (!cameraRef.current) return;
    try {
      if (!cuil || cuil.trim() === '') {
        Alert.alert('⚠️ Error', 'Debes ingresar tu CUIL antes de registrar el rostro');
        return;
      }
      setLoadingFace(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      const formData = new FormData();
      formData.append('cuil', cuil.trim());
      formData.append('name', name.trim());
      formData.append('image', {
        uri: photo.uri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);
      const response = await fetch('https://52ve8mm1q0ra.share.zrok.io/register', {
        method: 'POST',
        headers: { skip_zrok_interstitial: 'true' },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('✅ Éxito', 'Rostro registrado correctamente');
        navigation.replace('Login');
      } else {
        Alert.alert('❌ Error', data?.message || 'No se pudo registrar el rostro');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('⚠️ Error de red', 'No se pudo conectar con el servidor');
    } finally {
      setLoadingFace(false);
      setShowCamera(false);
    }
  }

  if (!permission) return <View />;
  if (!permission.granted && showCamera) {
    return (
      <LinearGradient
        colors={['#6366f1', '#4f46e5', '#4338ca']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View className="flex-1 items-center justify-center px-6">
          <View className="mb-8 rounded-full bg-white/10 p-6">
            <Ionicons name="camera-outline" size={64} color="white" />
          </View>
          <Text className="mt-4 text-center text-2xl font-bold text-white">
            Permiso de cámara necesario
          </Text>
          <Text className="mt-4 px-4 text-center text-base text-gray-200">
            Necesitamos acceso a tu cámara para registrar tu rostro de forma segura
          </Text>
          <TouchableOpacity
            onPress={requestPermission}
            className="mt-8 rounded-2xl bg-white px-8 py-4 shadow-lg shadow-black/30 active:opacity-90">
            <Text className="text-base font-semibold text-indigo-600">Permitir acceso</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  if (!showCamera) {
    return (
      <LinearGradient
        colors={['#6366f1', '#4f46e5', '#4338ca']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1 justify-center px-5">
          <View className="mx-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl">
            <View className="p-8">
              <View className="mb-6 items-center">
                <View className="mb-4 rounded-2xl bg-white/10 p-4">
                  <Ionicons name="person-circle-outline" size={40} color="white" />
                </View>
                <Text className="text-3xl font-bold text-white">Registro Facial</Text>
                <Text className="mt-2 text-center text-gray-300">
                  Completa tus datos para el reconocimiento facial
                </Text>
              </View>

              <View className="mb-6">
                <Text className="mb-3 text-sm font-medium text-gray-300">Nombre completo</Text>
                <View
                  className={`flex-row items-center rounded-2xl bg-white/10 p-4 ${
                    focusedInput === 'name' ? 'border-2 border-white/30' : ''
                  }`}>
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color={focusedInput === 'name' ? '#ffffff' : '#9ca3af'}
                    className="mr-3"
                  />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Ej: Juan Pérez"
                    placeholderTextColor="#9ca3af"
                    className="flex-1 text-base text-white"
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              <View className="mb-8">
                <Text className="mb-3 text-sm font-medium text-gray-300">CUIL (obligatorio)</Text>
                <View
                  className={`flex-row items-center rounded-2xl bg-white/10 p-4 ${
                    focusedInput === 'cuil' ? 'border-2 border-white/30' : ''
                  }`}>
                  <Ionicons
                    name="id-card-outline"
                    size={22}
                    color={focusedInput === 'cuil' ? '#ffffff' : '#9ca3af'}
                    className="mr-3"
                  />
                  <TextInput
                    value={cuil}
                    onChangeText={setCuil}
                    placeholder="Ej: 20-12345678-9"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    className="flex-1 text-base text-white"
                    onFocus={() => setFocusedInput('cuil')}
                    onBlur={() => setFocusedInput(null)}
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  if (!cuil.trim()) {
                    Alert.alert('⚠️ Error', 'El CUIL es obligatorio');
                    return;
                  }
                  setShowCamera(true);
                }}
                className="rounded-2xl bg-white py-5 shadow-lg shadow-black/30 active:opacity-90">
                <Text className="text-center text-lg font-bold text-indigo-600">
                  Continuar al Registro Facial
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  if (showCamera) {
    startPulseAnimation();
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

      {/* Header con instrucciones */}
      <BlurView
        intensity={80}
        tint="dark"
        className="absolute left-5 right-5 top-16 overflow-hidden rounded-2xl border border-white/10 p-5">
        <Text className="text-center text-2xl font-bold text-white">Posiciona tu rostro</Text>
        <Text className="mt-2 text-center text-base text-gray-300">
          Asegúrate de tener buena iluminación y encuadra tu rostro en el círculo
        </Text>
      </BlurView>

      {/* Botón de cerrar */}
      <TouchableOpacity
        onPress={() => setShowCamera(false)}
        className="absolute right-5 top-16 h-12 w-12 items-center justify-center rounded-full bg-black/50">
        <Ionicons name="close" size={28} color="white" />
      </TouchableOpacity>

      {/* Overlay con marco para el rostro */}
      <View className="absolute inset-0 items-center justify-center">
        <View className="h-64 w-64 rounded-full border-2 border-dashed border-white/50" />
        <View className="absolute top-1/2 -mt-40 w-full items-center">
          <Text className="text-lg font-semibold text-white">Alinea tu rostro aquí</Text>
        </View>
      </View>

      {/* Botón para tomar foto */}
      <View className="absolute bottom-10 w-full items-center">
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20">
            <View className="h-14 w-14 rounded-full bg-white" />
          </TouchableOpacity>
        </Animated.View>
        <Text className="mt-4 text-lg text-white">Toca para capturar</Text>
      </View>

      {/* Loading overlay */}
      {loadingFace && (
        <View className="absolute inset-0 items-center justify-center bg-black/80">
          <View className="items-center rounded-2xl bg-indigo-600 p-6">
            <ActivityIndicator size="large" color="white" />
            <Text className="mt-4 text-lg font-medium text-white">Procesando imagen...</Text>
            <Text className="mt-2 text-gray-200">Esto puede tomar unos segundos</Text>
          </View>
        </View>
      )}
    </View>
  );
}
