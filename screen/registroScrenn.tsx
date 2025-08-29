import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import FaceRegisterScreen from './FaceRegisterScreen';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cuil: '',
  });

  const [loading, setLoading] = useState(false);
  const [showFaceRegister, setShowFaceRegister] = useState(false);

  function handleChange(field: string, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  async function handleRegister() {
    try {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.cuil
      ) {
        Alert.alert('⚠️ Error', 'Todos los campos son obligatorios');
        return;
      }

      setLoading(true);
      console.log('📨 Registrando usuario:', formData);
      const response = await fetch('https://tu-backend.com/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('📨 Respuesta del backend:', data);
      Alert.alert('✅ Éxito', 'Usuario registrado correctamente');
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Error', 'No se pudo registrar el usuario');
    } finally {
      setLoading(false);
    }
  }

  if (showFaceRegister) {
    return <FaceRegisterScreen cuil={formData.cuil} />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-900 px-5">
      <Text className="mb-5 text-2xl font-bold text-white">Registro de Usuario</Text>

      {/* Nombre */}
      <TextInput
        placeholder="Nombre"
        placeholderTextColor="#999"
        value={formData.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
        className="mb-3 w-full rounded-lg bg-white p-3"
      />

      {/* Apellido */}
      <TextInput
        placeholder="Apellido"
        placeholderTextColor="#999"
        value={formData.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
        className="mb-3 w-full rounded-lg bg-white p-3"
      />

      {/* Email */}
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        className="mb-3 w-full rounded-lg bg-white p-3"
      />

      {/* Password */}
      <TextInput
        placeholder="Contraseña"
        placeholderTextColor="#999"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
        className="mb-3 w-full rounded-lg bg-white p-3"
      />

      {/* CUIL */}
      <TextInput
        placeholder="CUIL"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={formData.cuil}
        onChangeText={(text) => handleChange('cuil', text)}
        className="mb-3 w-full rounded-lg bg-white p-3"
      />

      {/* Botón registrar usuario */}
      <TouchableOpacity
        onPress={handleRegister}
        disabled={loading}
        className="mb-4 w-full items-center rounded-lg bg-blue-600 p-3">
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-lg font-bold text-white">Registrar Usuario</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (!formData.cuil.trim()) {
            Alert.alert('⚠️ Error', 'Debes ingresar tu CUIL antes de registrar el rostro');
            return;
          }
          setShowFaceRegister(true);
        }}
        className="w-full items-center rounded-lg bg-green-600 p-3">
        <Text className="text-lg font-bold text-white">Registrar Rostro</Text>
      </TouchableOpacity>
    </View>
  );
}
