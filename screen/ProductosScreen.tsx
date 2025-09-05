import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

interface Producto {
  id: string;
  nombre: string;
  codigo: string;
}

export default function ProductosScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [nombreEdit, setNombreEdit] = useState('');

  // 🚀 Escaneo de códigos
  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowScanner(false);

    if (!data) {
      Alert.alert('❌ Error', 'No se pudo leer el código.');
      return;
    }

    // Evitar duplicados
    if (productos.some((p) => p.codigo === data)) {
      Alert.alert('⚠️ Atención', 'Este producto ya está registrado.');
      return;
    }

    const nuevo: Producto = {
      id: Date.now().toString(),
      nombre: `Producto ${productos.length + 1}`,
      codigo: data,
    };

    setLoading(true);
    setTimeout(() => {
      setProductos([...productos, nuevo]);
      setLoading(false);
      Alert.alert('✅ Éxito', 'Producto agregado correctamente');
    }, 800);
  };

  // ✏️ Modificar producto
  const handleSaveEdit = () => {
    if (!editingProduct) return;
    if (!nombreEdit.trim()) {
      Alert.alert('⚠️ Error', 'El nombre no puede estar vacío.');
      return;
    }

    setProductos((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? { ...p, nombre: nombreEdit } : p))
    );
    setEditingProduct(null);
    setNombreEdit('');
    Alert.alert('✅ Éxito', 'Producto modificado correctamente');
  };

  // 🗑️ Eliminar producto
  const handleDelete = (id: string) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
    Alert.alert('🗑️ Eliminado', 'Producto eliminado correctamente');
  };

  return (
    <View className="flex-1 bg-gray-950 p-5">
      <Text className="mb-5 text-2xl font-bold text-white">Gestión de Productos</Text>

      {loading && (
        <View className="absolute inset-0 items-center justify-center bg-black/50">
          <ActivityIndicator size="large" color="#6366f1" />
          <Text className="mt-2 text-white">Guardando...</Text>
        </View>
      )}

      {/* Botón escanear */}
      <TouchableOpacity
        onPress={async () => {
          if (!permission?.granted) {
            await requestPermission();
          }
          setShowScanner(true);
        }}
        className="mb-5 flex-row items-center justify-center rounded-2xl bg-indigo-600 py-4">
        <Ionicons name="qr-code" size={22} color="white" />
        <Text className="ml-2 text-lg font-bold text-white">Escanear producto</Text>
      </TouchableOpacity>

      {/* Lista de productos */}
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-3 flex-row items-center justify-between rounded-xl bg-white/10 p-4">
            <View>
              <Text className="text-lg font-bold text-white">{item.nombre}</Text>
              <Text className="text-sm text-gray-300">Código: {item.codigo}</Text>
            </View>
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={() => {
                  setEditingProduct(item);
                  setNombreEdit(item.nombre);
                }}>
                <Ionicons name="create" size={22} color="#4ade80" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash" size={22} color="#f87171" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text className="mt-10 text-center text-gray-400">No hay productos cargados</Text>
        }
      />

      {/* 📸 Scanner */}
      {showScanner && (
        <CameraView
          style={{ flex: 1, position: 'absolute', inset: 0 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr', 'ean13', 'ean8'] }}
          onBarcodeScanned={handleBarCodeScanned}
        />
      )}

      {/* ✏️ Modal edición */}
      <Modal visible={!!editingProduct} transparent animationType="slide">
        <View className="flex-1 items-center justify-center bg-black/70">
          <View className="w-11/12 rounded-2xl bg-gray-900 p-6">
            <Text className="mb-4 text-lg font-bold text-white">Editar producto</Text>
            <TextInput
              value={nombreEdit}
              onChangeText={setNombreEdit}
              placeholder="Nuevo nombre"
              placeholderTextColor="#9ca3af"
              className="mb-4 rounded-xl bg-white/10 p-3 text-white"
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setEditingProduct(null)}
                className="rounded-xl bg-gray-700 px-5 py-3">
                <Text className="text-white">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                className="rounded-xl bg-indigo-600 px-5 py-3">
                <Text className="font-bold text-white">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
