import React, { useState, useEffect } from 'react';
import { ActivityIndicator, SafeAreaView, View, Text, FlatList } from 'react-native';
import api from '../services/api';
import stylesMonitor from '../Styles/stylesMonitor';

export default function Monitor( {navigate} ) {

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [data, setData] = useState([]);

  async function getLeituras(){
    try{
      const response = await api.get(api.baseURL+'/leituras');
      const json = response.data;
      setErro(false);
      setData(json);
    }catch (error) {
      setErro(true)
      console.error(error);
    }finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setInterval(getLeituras, 1000);
  }, []);

  if(!erro){
    return (
      <SafeAreaView 
        style={{
          flex:1,
          paddingVertical: 30,
          backgroundColor: 'white'
        }}>
        {loading ? <ActivityIndicator/> : (
          <FlatList
            style={{width:'100%', paddingHorizontal: 20}}
            data={data}
            keyExtractor={(id, index ) => id + index.toString()}
            renderItem={({ item }) => (
              <View style={stylesMonitor.container}>
                <Text style={stylesMonitor.nome}>
                  {item.nome}
                </Text>
                <Text style={stylesMonitor.alias}>
                  {item.alias}:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    textAlignVertical: 'center',                    
                    fontFamily: 'MontserratBold',
                    color: item.cor.toLowerCase().trim(),
                  }}>
                  {item.leitura}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: 'center',
                    textAlignVertical: 'center',                    
                    fontFamily: 'MontserratBold',
                    color: item.cor.toLowerCase().trim(),
                  }}>
                  {item.grandeza}
                </Text>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    );
  }else{
    return(
      <View style={{flex:1, alignItems: 'center', justifyContent: 'center',  backgroundColor: 'white'}}>
        <Text style={stylesMonitor.erro}>
          Não foi possivel carregador os dados do banco de dados
        </Text>
      </View>
    )
  }
}