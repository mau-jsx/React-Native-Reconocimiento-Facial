import '../global.css';
import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

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
  const cameraRef = useRef<CameraView | null>(null);

  // --- Login clásico ---
  const handleLogin = async () => {
    if (!cuil || !password) {
      alert('⚠️ Ingresá CUIL y contraseña');
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1200));
      alert('✅ Login correcto');
      navigation.navigate('Home');
    } catch (err) {
      console.error(err);
      alert('❌ Error en login');
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
      const response = await fetch('https://52ve8mm1q0ra.share.zrok.io/recognize', {
        method: 'POST',
        headers: { skip_zrok_interstitial: 'true' },
        body: formData,
      });
      const data = await response.json();
      console.log('Login facial:', data);
      if (response.ok) {
        alert('✅ Bienvenido!');
        navigation.navigate('Home');
      } else {
        alert('❌ No se reconoció tu rostro');
      }
    } catch (err) {
      console.error(err);
      alert('⚠️ Error de red en login facial');
    } finally {
      setLoadingFace(false);
      setShowCamera(false);
    }
  };

  // --- UI de cámara ---
  if (showCamera) {
    return (
      <View className="flex-1 bg-black">
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

        <View className="absolute top-14 w-full items-center">
          <Text className="mb-2 text-xl font-bold text-white">Login Facial</Text>
          <Text className="text-gray-300">Mire a la cámara y toque el botón</Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowCamera(false)}
          className="absolute right-5 top-10 rounded-full bg-black p-2">
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>

        <View className="absolute bottom-14 w-full items-center">
          <TouchableOpacity
            onPress={async () => {
              if (cameraRef.current) {
                const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
                if (photo?.uri) {
                  await handleLoginFace(photo.uri);
                }
              }
            }}
            className="h-16 w-16 items-center justify-center rounded-full bg-white">
            <Ionicons name="camera" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {loadingFace && (
          <View className="absolute bottom-32 w-full items-center">
            <ActivityIndicator size="large" color="white" />
            <Text className="mt-2 text-gray-300">Verificando rostro...</Text>
          </View>
        )}
      </View>
    );
  }

  // --- UI de login clásico ---
  return (
    <View className="flex-1 justify-center bg-gray-900 px-6">
      <View className="mb-8 items-center">
        <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-blue-600">
          <Ionicons name="log-in" size={40} color="white" />
        </View>
        <Text className="mb-2 text-4xl font-bold text-white">Iniciar Sesión</Text>
        <Text className="text-center text-gray-400">Ingresá tus credenciales</Text>
      </View>

      {/* CUIL */}
      <View className="mb-5">
        <Text className="mb-2 ml-2 text-gray-400">CUIL</Text>
        <View className="flex-row items-center rounded-2xl bg-gray-800 px-4 py-3">
          <Ionicons name="id-card-outline" size={20} color="#aaa" />
          <TextInput
            placeholder="20XXXXXXXXXX"
            placeholderTextColor="#aaa"
            value={cuil}
            onChangeText={setCuil}
            className="ml-2 flex-1 text-white"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Password */}
      <View className="mb-6">
        <Text className="mb-2 ml-2 text-gray-400">Contraseña</Text>
        <View className="flex-row items-center rounded-2xl bg-gray-800 px-4 py-3">
          <Ionicons name="lock-closed-outline" size={20} color="#aaa" />
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            className="ml-2 flex-1 text-white"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón login */}
      <TouchableOpacity
        onPress={handleLogin}
        className="mb-4 flex-row items-center justify-center rounded-2xl bg-blue-600 py-4"
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text className="mr-2 text-center text-lg font-semibold text-white">Ingresar</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </>
        )}
      </TouchableOpacity>

      {/* Botón login facial */}
      <TouchableOpacity
        onPress={async () => {
          if (!permission?.granted) {
            await requestPermission();
            return;
          }
          setShowCamera(true);
        }}
        className="flex-row items-center justify-center rounded-2xl bg-purple-600 py-3">
        <Ionicons name="camera" size={20} color="white" />
        <Text className="ml-2 text-center text-lg font-semibold text-white">
          Ingresar con rostro
        </Text>
      </TouchableOpacity>

      {/* Botón registro */}
      <TouchableOpacity
        className="mt-6 flex-row justify-center"
        onPress={() => navigation.navigate('Registro')}>
        <Text className="text-gray-300">¿No tenés cuenta?</Text>
        <Text className="ml-1 font-semibold text-blue-400">Registrate</Text>
      </TouchableOpacity>
    </View>
  );
}
