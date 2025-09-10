import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
return (
  <Tabs
    screenOptions={{
      tabBarActiveTintColor: '#126b1a',
      tabBarInactiveTintColor: '#666',
      headerStyle: {
      backgroundColor: '#126b1a',
},
      headerTintColor: '#fff',
    }}
  >
    {/* REMOVA a tela index das tabs */}
    <Tabs.Screen
      name="explore"
      options={{
        title: 'Explorar',
        tabBarIcon: ({ color, size }) => (
        <Ionicons name="search" size={size} color={color} />
  ),
    }}
    />
  </Tabs>
);
}