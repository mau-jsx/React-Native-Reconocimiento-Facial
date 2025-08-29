import { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  cuil: string;
};

export default function FaceRegisterScreen({ cuil }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loadingFace, setLoadingFace] = useState(false);
  const [showCamera, setShowCamera] = useState(true);

  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity onPress={requestPermission}>
          <Text>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function handleTakePhoto() {
    if (!cameraRef.current) return;

    try {
      if (!cuil || cuil.trim() === '') {
        Alert.alert('⚠️ Error', 'Debes ingresar tu CUIL antes de registrar el rostro');
        return;
      }
      setLoadingFace(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      console.log('📸 Foto tomada:', photo.uri);

      const formData = new FormData();
      formData.append('cuil', cuil.trim());
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
      console.log('✅ Respuesta registro facial:', data);
      if (response.ok) {
        Alert.alert('✅ Éxito', 'Rostro registrado correctamente');
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

  if (showCamera) {
    return (
      <View className="flex-1 bg-black">
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />

        <View className="absolute top-14 w-full items-center">
          <Text className="mb-2 text-xl font-bold text-white">Registrar Rostro</Text>
          <Text className="text-gray-300">Mirá a la cámara y sacá la foto</Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowCamera(false)}
          className="absolute right-5 top-10 rounded-full bg-black p-2">
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>

        <View className="absolute bottom-14 w-full items-center">
          <TouchableOpacity
            onPress={handleTakePhoto}
            className="h-16 w-16 items-center justify-center rounded-full bg-white">
            <Ionicons name="camera" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {loadingFace && (
          <View className="absolute bottom-32 w-full items-center">
            <ActivityIndicator size="large" color="white" />
            <Text className="mt-2 text-gray-300">Registrando rostro...</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-900">
      <Text className="text-white">Volviste del registro facial</Text>
    </View>
  );
}
