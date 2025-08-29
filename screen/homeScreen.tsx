import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('¡Buenos días! ☀️');
    else if (hour < 19) setGreeting('¡Buenas tardes! 🌤️');
    else setGreeting('¡Buenas noches! 🌙');

    // Actualizar tiempo cada minuto
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Datos mejorados para las tarjetas
  const features = [
    {
      id: 1,
      title: 'Mi Perfil',
      description: 'Gestiona tu información personal',
      icon: 'account-circle',
      iconLib: 'MaterialCommunityIcons',
      gradientColors: ['#667eea', '#764ba2'],
      iconColor: '#667eea',
    },
    {
      id: 2,
      title: 'Notificaciones',
      description: 'Mantente al día con alertas',
      icon: 'bell',
      iconLib: 'Feather',
      gradientColors: ['#f093fb', '#f5576c'],
      iconColor: '#f093fb',
    },
    {
      id: 3,
      title: 'Configuración',
      description: 'Personaliza tu experiencia',
      icon: 'cog',
      iconLib: 'MaterialCommunityIcons',
      gradientColors: ['#4facfe', '#00f2fe'],
      iconColor: '#4facfe',
    },
    {
      id: 4,
      title: 'Centro de Ayuda',
      description: 'Soporte y tutoriales',
      icon: 'help-circle',
      iconLib: 'Feather',
      gradientColors: ['#43e97b', '#38f9d7'],
      iconColor: '#43e97b',
    },
    {
      id: 5,
      title: 'Documentos',
      description: 'Archivos y descargas',
      icon: 'folder-open',
      iconLib: 'MaterialCommunityIcons',
      gradientColors: ['#fa709a', '#fee140'],
      iconColor: '#fa709a',
    },
    {
      id: 6,
      title: 'Análisis',
      description: 'Reportes detallados',
      icon: 'bar-chart',
      iconLib: 'Feather',
      gradientColors: ['#a8edea', '#fed6e3'],
      iconColor: '#a8edea',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Inicio de sesión exitoso',
      time: 'Hace 5 minutos',
      icon: 'login',
      iconLib: 'MaterialCommunityIcons',
      color: '#10b981',
    },
    {
      id: 2,
      action: 'Perfil actualizado',
      time: 'Hace 2 horas',
      icon: 'account-edit',
      iconLib: 'MaterialCommunityIcons',
      color: '#3b82f6',
    },
    {
      id: 3,
      action: 'Contraseña modificada',
      time: 'Ayer',
      icon: 'shield-check',
      iconLib: 'MaterialCommunityIcons',
      color: '#8b5cf6',
    },
    {
      id: 4,
      action: 'Documento descargado',
      time: 'Hace 3 días',
      icon: 'download',
      iconLib: 'Feather',
      color: '#f59e0b',
    },
  ];

  const stats = [
    {
      id: 1,
      value: '12',
      label: 'Sesiones\nesta semana',
      icon: 'calendar-week',
      iconLib: 'MaterialCommunityIcons',
      gradientColors: ['#667eea', '#764ba2'],
      change: '+2',
    },
    {
      id: 2,
      value: '28',
      label: 'Tareas\ncompletadas',
      icon: 'check-circle',
      iconLib: 'Feather',
      gradientColors: ['#f093fb', '#f5576c'],
      change: '+5',
    },
    {
      id: 3,
      value: '7',
      label: 'Logros\nobtenidos',
      icon: 'trophy',
      iconLib: 'Ionicons',
      gradientColors: ['#43e97b', '#38f9d7'],
      change: '+1',
    },
  ];

  const renderIcon = (iconName, iconLib, size = 24, color = 'white') => {
    switch (iconLib) {
      case 'MaterialCommunityIcons':
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      case 'Feather':
        return <Feather name={iconName} size={size} color={color} />;
      default:
        return <Ionicons name={iconName} size={size} color={color} />;
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <View className="flex-1 bg-gray-950">
      {/* Header mejorado */}
      <LinearGradient
        colors={['#1e1b4b', '#312e81', '#3730a3']}
        className="rounded-b-3xl px-6 pb-6 pt-12"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View className="mb-6 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-3xl font-bold text-white">{greeting}</Text>
            <Text className="text-base text-indigo-200">
              {currentTime.toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}{' '}
              • {formatTime(currentTime)}
            </Text>
          </View>
          <TouchableOpacity className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
            <View className="relative">
              <Ionicons name="notifications" size={26} color="white" />
              <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-red-500">
                <Text className="text-xs font-bold text-white">3</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tarjeta de perfil mejorada */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          }}>
          <LinearGradient
            colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
            className="rounded-3xl border border-white/20 p-5"
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <View className="flex-row items-center">
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                className="mr-4 h-20 w-20 items-center justify-center rounded-2xl">
                <MaterialCommunityIcons name="account" size={36} color="white" />
              </LinearGradient>
              <View className="flex-1">
                <Text className="mb-1 text-2xl font-bold text-white">Mauricio Heredia</Text>
                <Text className="mb-2 text-indigo-200">maxcer234@gmail.com</Text>
                <View className="flex-row items-center">
                  <View className="mr-2 h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50"></View>
                  <Text className="text-sm font-medium text-emerald-400">En línea</Text>
                  <View className="ml-4 flex-row items-center">
                    <MaterialCommunityIcons name="star" size={16} color="#fbbf24" />
                    <Text className="ml-1 text-sm font-medium text-yellow-400">Premium</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </LinearGradient>

      <ScrollView
        className="mt-6 flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Accesos rápidos mejorados */}
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">Accesos rápidos</Text>
          <TouchableOpacity>
            <Text className="font-medium text-indigo-400">Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8 flex-row flex-wrap justify-between">
          {features.map((item, index) => (
            <Animated.View
              key={item.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 30 + index * 10],
                    }),
                  },
                ],
              }}
              className="mb-4 w-[48%]">
              <TouchableOpacity className="overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/80 backdrop-blur-sm">
                <LinearGradient
                  colors={['rgba(255,255,255,0.1)', 'transparent']}
                  className="p-5"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <LinearGradient
                    colors={item.gradientColors}
                    className="mb-4 h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    {renderIcon(item.icon, item.iconLib, 26, 'white')}
                  </LinearGradient>
                  <Text className="mb-2 text-lg font-bold text-white">{item.title}</Text>
                  <Text className="text-xs leading-4 text-gray-400">{item.description}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Actividad reciente mejorada */}
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">Actividad reciente</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="history" size={24} color="#6366f1" />
          </TouchableOpacity>
        </View>

        <View className="mb-8 overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/80">
          {recentActivities.map((activity, index) => (
            <View key={activity.id}>
              <View className="flex-row items-center p-5">
                <View
                  className="mr-4 h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${activity.color}20` }}>
                  {renderIcon(activity.icon, activity.iconLib, 22, activity.color)}
                </View>
                <View className="flex-1">
                  <Text className="mb-1 font-semibold text-white">{activity.action}</Text>
                  <Text className="text-xs text-gray-400">{activity.time}</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#6b7280" />
              </View>
              {index < recentActivities.length - 1 && (
                <View className="mx-5 h-px bg-gray-800"></View>
              )}
            </View>
          ))}
        </View>

        {/* Estadísticas mejoradas */}
        <Text className="mb-5 text-2xl font-bold text-white">Tus estadísticas</Text>
        <View className="mb-8 flex-row justify-between">
          {stats.map((stat, index) => (
            <Animated.View
              key={stat.id}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    scale: scaleAnim.interpolate({
                      inputRange: [0.9, 1],
                      outputRange: [0.9, 1],
                    }),
                  },
                ],
              }}
              className="w-[31%]">
              <LinearGradient
                colors={stat.gradientColors}
                className="items-center rounded-3xl p-5 shadow-lg"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
                {renderIcon(stat.icon, stat.iconLib, 28, 'white')}
                <Text className="mb-1 mt-3 text-3xl font-bold text-white">{stat.value}</Text>
                <Text className="text-center text-xs leading-4 text-white/80">{stat.label}</Text>
                <View className="mt-2 rounded-full bg-white/20 px-2 py-1">
                  <Text className="text-xs font-bold text-white">{stat.change}</Text>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Navigation Bar mejorado */}
      <LinearGradient
        colors={['rgba(17, 24, 39, 0.95)', 'rgba(17, 24, 39, 1)']}
        className="border-t border-gray-800">
        <View className="flex-row items-center justify-around py-4">
          <TouchableOpacity className="items-center">
            <LinearGradient colors={['#667eea', '#764ba2']} className="mb-1 rounded-2xl p-2">
              <Ionicons name="home" size={24} color="white" />
            </LinearGradient>
            <Text className="text-xs font-medium text-indigo-400">Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <View className="mb-1 p-2">
              <MaterialCommunityIcons name="chart-line" size={24} color="#9ca3af" />
            </View>
            <Text className="text-xs text-gray-400">Estadísticas</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              className="-mt-6 h-16 w-16 items-center justify-center rounded-3xl shadow-2xl shadow-indigo-500/30">
              <Ionicons name="add" size={32} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <View className="mb-1 p-2">
              <MaterialCommunityIcons name="calendar-month" size={24} color="#9ca3af" />
            </View>
            <Text className="text-xs text-gray-400">Calendario</Text>
          </TouchableOpacity>

          <TouchableOpacity className="items-center">
            <View className="mb-1 p-2">
              <MaterialCommunityIcons name="account" size={24} color="#9ca3af" />
            </View>
            <Text className="text-xs text-gray-400">Perfil</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
