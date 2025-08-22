import '../global.css';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  // ✅ Hook correcto
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleLogin = () => {
    if (email && password) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigation.navigate('Home');
      }, 1500);
    } else {
      alert('⚠️ Ingresá tus credenciales');
    }
  };

  const handleCameraAccess = async () => {
    if (!permission) return;

    if (!permission.granted) {
      await requestPermission();
      return;
    }

    setShowCamera(true);

    // ⏳ Después de 3 segundos, cerrar cámara y redirigir al Home
    setTimeout(() => {
      setShowCamera(false);
      navigation.navigate('Home');
    }, 3000);
  };

  if (!permission) {
    return <View className="flex-1 bg-gray-900" />;
  }

  // 📸 Vista de cámara con overlays externos
  if (showCamera) {
    return (
      <View className="flex-1 bg-black">
        {/* Cámara */}
        <CameraView style={{ flex: 1 }} facing="front" />

        {/* Overlay */}
        <View className="absolute left-5 right-5 top-14 items-center">
          <Text className="mb-2 text-xl font-bold text-white">Cámara activa</Text>
          <Text className="text-center text-gray-300">
            Mire directamente a la cámara para iniciar sesión
          </Text>
        </View>

        {/* Botón cerrar */}
        <TouchableOpacity
          onPress={() => setShowCamera(false)}
          className="absolute right-5 top-10 rounded-full bg-black p-2">
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center bg-gray-900 px-6">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
        <View className="mb-10 items-center">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-indigo-600">
            <Ionicons name="person" size={32} color="white" />
          </View>
          <Text className="mb-2 text-4xl font-bold text-white">Bienvenido</Text>
          <Text className="text-center text-gray-400">
            Iniciá sesión en tu cuenta para continuar
          </Text>
        </View>

        {/* Email */}
        <View className="mb-6">
          <Text className="mb-2 ml-2 text-gray-400">Correo electrónico</Text>
          <View className="flex-row items-center rounded-2xl bg-gray-800 px-4 py-3">
            <Ionicons name="mail-outline" size={20} color="#aaa" className="mr-2" />
            <TextInput
              placeholder="tu@email.com"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              className="flex-1 text-white"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Password */}
        <View className="mb-8">
          <Text className="mb-2 ml-2 text-gray-400">Contraseña</Text>
          <View className="flex-row items-center rounded-2xl bg-gray-800 px-4 py-3">
            <Ionicons name="lock-closed-outline" size={20} color="#aaa" className="mr-2" />
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="flex-1 text-white"
            />
          </View>
          <TouchableOpacity className="mt-2 self-end">
            <Text className="text-sm text-indigo-400">¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        {/* Botón login */}
        <TouchableOpacity
          onPress={handleLogin}
          className="mb-4 flex-row items-center justify-center rounded-2xl bg-indigo-600 py-4"
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text className="mr-2 text-center text-lg font-semibold text-white">Entrar</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>

        <View className="my-6 flex-row items-center">
          <View className="h-px flex-1 bg-gray-700" />
          <Text className="mx-4 text-gray-500">o</Text>
          <View className="h-px flex-1 bg-gray-700" />
        </View>

        {/* Botón cámara */}
        <TouchableOpacity
          onPress={handleCameraAccess}
          className="mb-6 flex-row items-center justify-center rounded-2xl bg-green-600 py-4">
          <Ionicons name="camera" size={20} color="white" className="mr-2" />
          <Text className="text-center text-lg font-semibold text-white">Usar cámara</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row justify-center"
          onPress={() => navigation.navigate('Registro')}>
          <Text className="text-gray-300">¿No tenés cuenta?</Text>
          <Text className="ml-1 font-semibold text-indigo-400">Registrate</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
