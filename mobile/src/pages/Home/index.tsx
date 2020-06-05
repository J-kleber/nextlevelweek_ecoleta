import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, ImageBackground, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IIBGEUFResponse {
  sigla: string;
}

interface IIBGECityResponse {
  nome: string;
}

interface ISelectData {
  label: string;
  value: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<ISelectData[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [cities, setCities] = useState<ISelectData[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');
  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IIBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(response => {
      const ufsSelectItems:ISelectData[] = [];
      response.data.map(uf => ufsSelectItems.push({label: uf.sigla, value: uf.sigla}));
      setUfs(ufsSelectItems);
    })
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }
    axios.get<IIBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {
      const citiesSelectItems:ISelectData[] = [];
      response.data.map(city => citiesSelectItems.push({label: city.nome, value: city.nome}));
      setCities(citiesSelectItems);
    })
  }, [selectedUf]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUf,
      city: selectedCity
    });
  }

  return (
   <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding': undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <RNPickerSelect
              onValueChange={(value) => setSelectedUf(value)}
              placeholder={{label: "Selecione um Estado", value: '0'}}
              items={ufs}
              style={{viewContainer: styles.input}}
          />
          <RNPickerSelect
              onValueChange={(value) => setSelectedCity(value)}
              placeholder={{label: "Selecione uma cidade", value: '0'}}
              items={cities}
              style={{viewContainer: styles.input}}
          />
          <RectButton style={styles.button} onPress={() => handleNavigateToPoints()}>
            <View style={styles.buttonIcon}>
              <Text> 
                <Icon name="arrow-right" color="#fff" size={24}/>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
   </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    marginBottom: 8,
    paddingHorizontal: 24,
    paddingTop: 5,
    fontSize: 16,
    borderRadius: 10,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;