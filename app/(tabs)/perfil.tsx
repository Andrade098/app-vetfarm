import { Button, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

export default function Perfil() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      
      <Text style={styles.title}>Perfil</Text>
      
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <Link href="/(tabs)" asChild>
        <Text style={styles.title}>Link Home...</Text>
      </Link>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Link href="/(tabs)/two" asChild>
        <Text style={styles.title}>Link Conversas...</Text>
      </Link>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      <Button title="Conversas" onPress={() => router.navigate('/(tabs)/two')}></Button>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
