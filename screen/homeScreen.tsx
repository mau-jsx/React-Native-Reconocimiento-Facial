import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Animated, Easing } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Animación de entrada
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

    // Saludo según la hora del día
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('¡Buenos días!');
    else if (hour < 19) setGreeting('¡Buenas tardes!');
    else setGreeting('¡Buenas noches!');
  }, []);

  // Datos de ejemplo para las tarjetas
  const features = [
    {
      id: 1,
      title: 'Perfil',
      description: 'Completa tu información personal',
      icon: 'person',
      color: 'bg-blue-500',
      iconColor: 'text-blue-500',
    },
    {
      id: 2,
      title: 'Notificaciones',
      description: 'Revisa tus alertas y mensajes',
      icon: 'notifications',
      color: 'bg-green-500',
      iconColor: 'text-green-500',
    },
    {
      id: 3,
      title: 'Configuración',
      description: 'Personaliza tu experiencia',
      icon: 'settings',
      color: 'bg-purple-500',
      iconColor: 'text-purple-500',
    },
    {
      id: 4,
      title: 'Ayuda',
      description: 'Soporte y preguntas frecuentes',
      icon: 'help-circle',
      color: 'bg-yellow-500',
      iconColor: 'text-yellow-500',
    },
  ];

  const recentActivities = [
    { id: 1, action: 'Inicio de sesión', time: 'Hace 5 minutos', icon: 'log-in' },
    { id: 2, action: 'Actualización de perfil', time: 'Hace 2 horas', icon: 'person' },
    { id: 3, action: 'Cambio de contraseña', time: 'Ayer', icon: 'lock-closed' },
  ];

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="rounded-b-3xl bg-indigo-900 px-6 pb-4 pt-12">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-white">{greeting}</Text>
            <Text className="text-gray-300">¡Es bueno verte de nuevo!</Text>
          </View>
          <TouchableOpacity className="rounded-full bg-indigo-700 p-3">
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <Animated.View
          className="mt-6 rounded-3xl bg-indigo-800 p-5"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}>
          <View className="flex-row items-center">
            <View className="mr-4 h-16 w-16 items-center justify-center rounded-full bg-indigo-600">
              <Ionicons name="person" size={32} color="white" />
            </View>
            <View>
              <Text className="text-xl font-bold text-white">Mauricio Heredia</Text>
              <Text className="text-gray-300">maxcer234@gmail.com</Text>
              <View className="mt-1 flex-row items-center">
                <View className="mr-1 h-3 w-3 rounded-full bg-green-400"></View>
                <Text className="text-sm text-green-400">En línea</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      <ScrollView className="mt-5 flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Características principales */}
        <Text className="mb-4 text-xl font-bold text-white">Accesos rápidos</Text>
        <View className="mb-6 flex-row flex-wrap justify-between">
          {features.map((item) => (
            <TouchableOpacity key={item.id} className={`mb-4 w-[48%] rounded-2xl bg-gray-800 p-4`}>
              <View
                className={`h-12 w-12 rounded-full ${item.color} mb-3 items-center justify-center`}>
                <Ionicons name={item.icon} size={24} color="white" />
              </View>
              <Text className="mb-1 text-lg font-semibold text-white">{item.title}</Text>
              <Text className="text-xs text-gray-400">{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actividad reciente */}
        <Text className="mb-4 text-xl font-bold text-white">Actividad reciente</Text>
        <View className="mb-6 rounded-2xl bg-gray-800 p-4">
          {recentActivities.map((activity, index) => (
            <View
              key={activity.id}
              className={`flex-row items-center py-3 ${index < recentActivities.length - 1 ? 'border-b border-gray-700' : ''}`}>
              <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-indigo-900">
                <Ionicons name={activity.icon} size={20} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-white">{activity.action}</Text>
                <Text className="text-xs text-gray-400">{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Estadísticas */}
        <Text className="mb-4 text-xl font-bold text-white">Tus estadísticas</Text>
        <View className="mb-8 flex-row justify-between">
          <View className="w-[32%] items-center rounded-2xl bg-blue-900 p-4">
            <Text className="text-2xl font-bold text-white">5</Text>
            <Text className="mt-1 text-center text-xs text-gray-300">Sesiones esta semana</Text>
          </View>
          <View className="w-[32%] items-center rounded-2xl bg-green-900 p-4">
            <Text className="text-2xl font-bold text-white">12</Text>
            <Text className="mt-1 text-center text-xs text-gray-300">Tareas completadas</Text>
          </View>
          <View className="w-[32%] items-center rounded-2xl bg-purple-900 p-4">
            <Text className="text-2xl font-bold text-white">3</Text>
            <Text className="mt-1 text-center text-xs text-gray-300">Logros obtenidos</Text>
          </View>
        </View>
      </ScrollView>

      {/* Navigation Bar */}
      <View className="flex-row items-center justify-around border-t border-gray-700 bg-gray-800 py-4">
        <TouchableOpacity className="items-center">
          <Ionicons name="home" size={24} color="#8b5cf6" />
          <Text className="mt-1 text-xs text-purple-400">Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="stats-chart" size={24} color="#9ca3af" />
          <Text className="mt-1 text-xs text-gray-400">Estadísticas</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <View className="-mt-6 h-14 w-14 items-center justify-center rounded-full bg-indigo-600">
            <Ionicons name="add" size={32} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="calendar" size={24} color="#9ca3af" />
          <Text className="mt-1 text-xs text-gray-400">Calendario</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="person" size={24} color="#9ca3af" />
          <Text className="mt-1 text-xs text-gray-400">Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
