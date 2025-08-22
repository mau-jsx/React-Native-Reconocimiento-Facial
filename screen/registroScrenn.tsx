import '../global.css';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { Ionicons } from '@expo/vector-icons';

type RegistroScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registro'>;

export default function RegistroScreen() {
  const navigation = useNavigation<RegistroScreenNavigationProp>();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegistro = () => {
    if (!nombre || !email || !password || !confirmPassword) {
      alert('⚠️ Por favor, completá todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      alert('⚠️ Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    // Simular proceso de registro
    setTimeout(() => {
      setLoading(false);
      console.log('Registrando:', nombre, email, password);
      alert('✅ ¡Cuenta creada exitosamente!');
      navigation.navigate('Login');
    }, 1500);
  };

  return (
    <View className="flex-1 justify-center bg-gray-900 px-6">
      <View className="mb-8 items-center">
        <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-green-600">
          <Ionicons name="person-add" size={40} color="white" />
        </View>
        <Text className="mb-2 text-4xl font-bold text-white">Crear Cuenta</Text>
        <Text className="text-center text-gray-400">Completá tus datos para comenzar</Text>
      </View>

      <View className="mb-5">
        <Text className="mb-2 ml-2 text-gray-400">Nombre completo</Text>
        <View className="flex-row items-center rounded-2xl bg-gray-800 px-4 py-3">
          <Ionicons name="person-outline" size={20} color="#aaa" className="mr-2" />
          <TextInput
            placeholder="Juan Pérez"
            placeholderTextColor="#aaa"
            value={nombre}
            onChangeText={setNombre}
            className="flex-1 text-white"
            autoCapitalize="words"
          />
        </View>
      </View>

      <View className="mb-5">
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

      <View className="mb-5">
        <Text className="mb-2 ml-2 text-gray-400">Contraseña</Text>
        <View className="flex-row items-center rounded-2xl bg-gray-800 px-4 py-3">
          <Ionicons name="lock-closed-outline" size={20} color="#aaa" className="mr-2" />
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            className="flex-1 text-white"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
        <Text className="ml-2 mt-1 text-xs text-gray-500">Mínimo 8 caracteres</Text>
      </View>

      <View className="mb-6">
        <Text className="mb-2 ml-2 text-gray-400">Confirmar contraseña</Text>
        <View className="flex-row items-center rounded-2xl bg-gray-800 px-4 py-3">
          <Ionicons name="lock-closed-outline" size={20} color="#aaa" className="mr-2" />
          <TextInput
            placeholder="••••••••"
            placeholderTextColor="#aaa"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            className="flex-1 text-white"
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleRegistro}
        className="mb-4 flex-row items-center justify-center rounded-2xl bg-green-600 py-4"
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Text className="mr-2 text-center text-lg font-semibold text-white">Crear cuenta</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </>
        )}
      </TouchableOpacity>

      <View className="my-6 flex-row items-center">
        <View className="h-px flex-1 bg-gray-700" />
        <Text className="mx-4 text-gray-500">o</Text>
        <View className="h-px flex-1 bg-gray-700" />
      </View>

      <TouchableOpacity className="mb-4 flex-row items-center justify-center rounded-2xl bg-blue-600 py-3">
        <Ionicons name="logo-facebook" size={20} color="white" className="mr-2" />
        <Text className="text-center text-lg font-semibold text-white">Continuar con Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity className="flex-row items-center justify-center rounded-2xl bg-gray-800 py-3">
        <Ionicons name="logo-google" size={20} color="white" className="mr-2" />
        <Text className="text-center text-lg font-semibold text-white">Continuar con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="mt-6 flex-row justify-center"
        onPress={() => navigation.navigate('Login')}>
        <Text className="text-gray-300">¿Ya tenés cuenta?</Text>
        <Text className="ml-1 font-semibold text-green-400">Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}
