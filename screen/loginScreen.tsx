import '../global.css';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [cuil, setCuil] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [loadingFace, setLoadingFace] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [isCuilValid, setIsCuilValid] = useState(false);

  // Validar CUIL
  useEffect(() => {
    const isValid = cuil.trim().length >= 8; // Validación básica
    setIsCuilValid(isValid);
  }, [cuil]);

  // Animación de pulso para el botón de cámara
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

  // --- Login clásico ---
  const handleLogin = async () => {
    if (!cuil || !password) {
      Alert.alert('⚠️ Error', 'Ingresá CUIL y contraseña');
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      Alert.alert('✅ Éxito', 'Login correcto');
      navigation.navigate('Home');
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Error', 'Error en el login');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginFace = async (photoUri: string) => {
    try {
      setLoadingFace(true);

      const formData = new FormData();
      formData.append('image', {
        uri: photoUri,
        name: 'face.jpg',
        type: 'image/jpeg',
      } as any);

      // Añadir CUIL al reconocimiento facial
      if (cuil) {
        formData.append('cuil', cuil.trim());
      }

      const response = await fetch('https://52ve8mm1q0ra.share.zrok.io/recognize', {
        method: 'POST',
        headers: { skip_zrok_interstitial: 'true' },
        body: formData,
      });

      const data = await response.json();
      console.log('Login facial:', data);

      if (response.ok) {
        Alert.alert('✅ Bienvenido!', 'Reconocimiento facial exitoso');
        navigation.navigate('Home');
      } else {
        Alert.alert('❌ Error', data?.message || 'No se reconoció tu rostro');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('⚠️ Error', 'Error de conexión en login facial');
    } finally {
      setLoadingFace(false);
      setShowCamera(false);
    }
  };

  // --- UI de cámara ---
  if (showCamera) {
    // Iniciar animación cuando se muestra la cámara
    startPulseAnimation();

    return (
      <View className="flex-1 bg-black">
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

        {/* Header con instrucciones */}
        <BlurView
          intensity={80}
          tint="dark"
          className="absolute left-5 right-5 top-16 overflow-hidden rounded-2xl border border-white/10 p-5">
          <Text className="text-center text-2xl font-bold text-white">Reconocimiento Facial</Text>
          <Text className="mt-2 text-center text-base text-gray-300">
            Mira a la cámara y asegúrate de tener buena iluminación
          </Text>
        </BlurView>

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

        <View className="absolute bottom-10 w-full items-center">
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              onPress={async () => {
                if (cameraRef.current) {
                  const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
                  if (photo?.uri) {
                    await handleLoginFace(photo.uri);
                  }
                }
              }}
              className="h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white/20">
              <View className="h-14 w-14 rounded-full bg-white" />
            </TouchableOpacity>
          </Animated.View>
          <Text className="mt-4 text-lg text-white">Toca para capturar</Text>
        </View>

        {loadingFace && (
          <View className="absolute inset-0 items-center justify-center bg-black/80">
            <View className="items-center rounded-2xl bg-indigo-600 p-6">
              <ActivityIndicator size="large" color="white" />
              <Text className="mt-4 text-lg font-medium text-white">Verificando rostro...</Text>
              <Text className="mt-2 text-gray-200">Esto puede tomar unos segundos</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  // --- UI de login clásico ---
  return (
    <LinearGradient
      colors={['#6366f1', '#4f46e5', '#4338ca']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6">
        <View className="mx-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">
          <View className="mb-8 items-center">
            <View className="mb-4 rounded-2xl bg-white/10 p-5">
              <Ionicons name="log-in" size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-white">Iniciar Sesión</Text>
            <Text className="mt-2 text-center text-gray-300">
              Ingresá tus credenciales para continuar
            </Text>
          </View>

          {/* CUIL */}
          <View className="mb-6">
            <Text className="mb-3 text-sm font-medium text-gray-300">CUIL</Text>
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
                placeholder="20-12345678-9"
                placeholderTextColor="#9ca3af"
                value={cuil}
                onChangeText={setCuil}
                className="flex-1 text-base text-white"
                keyboardType="numeric"
                onFocus={() => setFocusedInput('cuil')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          {/* Password */}
          <View className="mb-8">
            <Text className="mb-3 text-sm font-medium text-gray-300">Contraseña</Text>
            <View
              className={`flex-row items-center rounded-2xl bg-white/10 p-4 ${
                focusedInput === 'password' ? 'border-2 border-white/30' : ''
              }`}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={focusedInput === 'password' ? '#ffffff' : '#9ca3af'}
                className="mr-3"
              />
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                className="flex-1 text-base text-white"
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botón login */}
          <TouchableOpacity
            onPress={handleLogin}
            className="mb-5 flex-row items-center justify-center rounded-2xl bg-white py-4 shadow-lg shadow-black/30 active:opacity-90"
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#4f46e5" />
            ) : (
              <>
                <Text className="mr-2 text-center text-lg font-bold text-indigo-600">Ingresar</Text>
                <Ionicons name="arrow-forward" size={22} color="#4f46e5" />
              </>
            )}
          </TouchableOpacity>

          {/* Separador */}
          <View className="my-6 flex-row items-center">
            <View className="h-px flex-1 bg-white/20" />
            <Text className="mx-4 text-sm text-gray-300">o</Text>
            <View className="h-px flex-1 bg-white/20" />
          </View>

          {/* Botón login facial */}
          <TouchableOpacity
            onPress={async () => {
              if (!isCuilValid) {
                Alert.alert(
                  '⚠️ Error',
                  'Debes ingresar tu CUIL antes de usar reconocimiento facial'
                );
                return;
              }

              if (!permission?.granted) {
                await requestPermission();
              }
              setShowCamera(true);
            }}
            disabled={!isCuilValid}
            className={`flex-row items-center justify-center rounded-2xl py-4 ${
              isCuilValid
                ? 'bg-indigo-500 shadow-lg shadow-indigo-500/50 active:opacity-90'
                : 'bg-gray-500 opacity-70'
            }`}>
            <Ionicons name="camera" size={22} color="white" />
            <Text className="ml-2 text-center text-lg font-bold text-white">
              Ingresar con rostro
            </Text>
          </TouchableOpacity>

          {/* Botón registro */}
          <TouchableOpacity
            className="mt-8 flex-row justify-center"
            onPress={() => navigation.navigate('Registro')}>
            <Text className="text-gray-300">¿No tenés cuenta?</Text>
            <Text className="ml-1 font-semibold text-white">Registrate</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
